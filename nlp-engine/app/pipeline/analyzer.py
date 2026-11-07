from __future__ import annotations
import json, re, uuid
from datetime import datetime, timezone
from typing import Any
from fastapi import HTTPException

from ..schemas.message import AnalyzeRequest
from ..database.connection import connect as db
from ..rules.pronoun_rules import PRONOUNS
from ..rules.semantic_rules import EVENT_TERMS
from ..rules.ambiguity_rules import (
    KIND_UNCLEAR_REFERENCE,
    KIND_MULTIPLE_MEANINGS,
    KIND_GROUPING_AMBIGUITY,
    KIND_MISSING_DETAILS,
    FEMALE_NAMES,
    MALE_NAMES,
    LEXICAL_AMBIGUITIES,
    PP_ATTACHMENT_PATTERN,
    EVENT_DIRECTIVE_PATTERN,
    TIME_DESTINATION_PATTERN,
    SEND_DIRECTIVE_PATTERN,
)
from .linguistic_analysis import words
from .semantic_analysis import build_semantic_graph
from .interpretation_ranking import rank_candidates, decisive_candidate
from .confidence_estimation import confidence_level
from .miscommunication_risk import risk_level
from .intent_reconstruction import replace_reference
from .clarification_generation import question_for
from .preprocessing import normalize
from .entity_recognition import recognize_entities
from .reference_detection import detect_references
from .context_retrieval import overlap_score
from .dependency_analysis import shallow_roles
from .ambiguity_classification import classify_reference
from .interpretation_generation import alternatives_for_attachment


def analyze(req: AnalyzeRequest, persist: bool = True) -> dict[str, Any]:
    msg = normalize(req.message)
    context = req.context
    if not msg:
        raise HTTPException(422, "Enter a message to analyze.")

    candidates_people: list[str] = []
    candidates_objects: list[str] = []
    context_roles_list: list[dict[str, Any]] = []

    # Extract entities and semantic roles from conversation context
    for item in context:
        found = recognize_entities(item.text)
        p, o = found['people'], found['objects']
        for x in p:
            if x not in candidates_people:
                candidates_people.append(x)
        for x in o:
            if x not in candidates_objects:
                candidates_objects.append(x)
        roles = shallow_roles(item.text)
        context_roles_list.append({
            "speaker": item.speaker,
            "text": item.text,
            "roles": {r["role"]: r["value"] for r in roles}
        })

    found = recognize_entities(msg)
    people, objects = found['people'], found['objects']
    candidates_people = list(dict.fromkeys(candidates_people + people))
    candidates_objects = list(dict.fromkeys(candidates_objects + objects))

    amb: list[dict[str, Any]] = []
    clarifications: list[str] = []
    clarification_details: list[dict[str, Any]] = []
    relevant: list[dict[str, str]] = []
    supporting: list[str] = []
    handled_pronoun_tokens: set[str] = set()
    interpretations: list[dict[str, Any]] = []

    # =========================================================================
    # 1. UNCLEAR REFERENCES
    # =========================================================================

    # 1A. Intra-sentence antecedent ambiguity
    # Examples:
    # "Maya spoke to Rina after she finished work."
    # "Rahul told Arjun that he should submit the report."
    # "David called Sam because he needed help."
    pronoun_match_in_msg = re.search(r"\b(she|he|they|her|him)\b", msg, re.I)
    if pronoun_match_in_msg and len(people) >= 2:
        token = pronoun_match_in_msg.group(1).lower()
        # Find candidates compatible with the pronoun gender
        compatible_people = []
        if token in {"she", "her"}:
            compatible_people = [p for p in people if p.lower() in FEMALE_NAMES]
            if len(compatible_people) < 2:
                compatible_people = people[:2]
        elif token in {"he", "him"}:
            compatible_people = [p for p in people if p.lower() in MALE_NAMES]
            if len(compatible_people) < 2:
                compatible_people = people[:2]
        else:
            compatible_people = people[:2]

        if len(compatible_people) >= 2:
            p1, p2 = compatible_people[0], compatible_people[1]
            handled_pronoun_tokens.add(token)

            # Check context for evidence linking one of them to the action/state
            action_terms = [
                "finish", "finished", "work", "submit", "submitting", "report",
                "responsible", "draft", "task", "call", "help", "leave", "arrived"
            ]
            pattern_action = r"|".join(action_terms)
            
            p1_matches = []
            p2_matches = []
            for ctx_item in context:
                text = ctx_item.text
                if re.search(rf"\b{re.escape(p1)}\b", text, re.I) and re.search(rf"\b({pattern_action})\b", text, re.I):
                    p1_matches.append(text)
                elif re.search(rf"\b{re.escape(p1)}\b", text, re.I):
                    p1_matches.append(text)

                if re.search(rf"\b{re.escape(p2)}\b", text, re.I) and re.search(rf"\b({pattern_action})\b", text, re.I):
                    p2_matches.append(text)
                elif re.search(rf"\b{re.escape(p2)}\b", text, re.I):
                    p2_matches.append(text)

            resolved_person = None
            evidence_msg = None
            has_enough = False

            p1_strong = [t for t in p1_matches if re.search(rf"\b({pattern_action})\b", t, re.I)]
            p2_strong = [t for t in p2_matches if re.search(rf"\b({pattern_action})\b", t, re.I)]

            if p2_strong and not p1_strong:
                resolved_person = p2
                evidence_msg = p2_strong[0]
                has_enough = True
            elif p1_strong and not p2_strong:
                resolved_person = p1
                evidence_msg = p1_strong[0]
                has_enough = True
            elif p2_matches and not p1_matches:
                resolved_person = p2
                evidence_msg = p2_matches[0]
                has_enough = True
            elif p1_matches and not p2_matches:
                resolved_person = p1
                evidence_msg = p1_matches[0]
                has_enough = True

            clarify_q = f"Does “{token}” refer to {p1} or {p2}?" if not has_enough else None

            # Check if this is the binding structure ("told ... that he should submit...")
            is_told_binding = bool(re.search(r"\btold\b", msg, re.I) and re.search(r"\bthat\s+(he|she)\b", msg, re.I))

            if is_told_binding:
                if has_enough:
                    interpretations = [{
                        "meaning": f"{resolved_person} should submit the report.",
                        "confidence": 76,
                        "support": [evidence_msg] if evidence_msg else [],
                        "conflict": []
                    }]
                else:
                    interpretations = [
                        {"meaning": f"{p1} should submit the report.", "confidence": 50, "support": [], "conflict": []},
                        {"meaning": f"{p2} should submit the report.", "confidence": 50, "support": [], "conflict": []}
                    ]
            else:
                if has_enough:
                    interpretations = [{
                        "meaning": re.sub(rf"\b{re.escape(token)}\b", resolved_person, msg, count=1, flags=re.I),
                        "confidence": 76,
                        "support": [evidence_msg] if evidence_msg else [],
                        "conflict": []
                    }]
                else:
                    interpretations = [
                        {"meaning": re.sub(rf"\b{re.escape(token)}\b", p1, msg, count=1, flags=re.I), "confidence": 50, "support": [], "conflict": []},
                        {"meaning": re.sub(rf"\b{re.escape(token)}\b", p2, msg, count=1, flags=re.I), "confidence": 50, "support": [], "conflict": []}
                    ]

            amb.append({
                "expression": token,
                "kind": KIND_UNCLEAR_REFERENCE,
                "type": "Pronoun antecedent ambiguity",
                "possible_meanings": [p1, p2],
                "evidence_message": evidence_msg,
                "has_enough_evidence": has_enough,
                "clarification_question": clarify_q,
                "suggested_meaning": resolved_person,
                "candidates": [p1, p2],
                "resolved": resolved_person,
                "confidence": 76 if has_enough else 46,
                "reason": (
                    f"Context indicates {resolved_person} is responsible or associated with this action."
                    if has_enough
                    else f"Both {p1} and {p2} are mentioned earlier in the sentence; without more context, “{token}” could refer to either."
                )
            })

    # 1B. Discourse Pronoun and Referential Ambiguity Detection & Resolution
    # Examples: "Send it to her after that", "Tell him to submit it tomorrow"
    pronoun_matches = detect_references(msg)
    for match in pronoun_matches:
        token = str(match['text'])
        if token.lower() in handled_pronoun_tokens:
            continue

        kind = PRONOUNS.get(token.lower(), "reference")
        pool = candidates_people if "person" in kind else candidates_objects

        if token.lower() == "it":
            pool = [x for x in pool if not any(term in x.lower().split() for term in EVENT_TERMS)]
        elif token.lower() == "that" and re.search(r"\b(before|after)\s+that\b", msg, re.I):
            events = [x for x in pool if any(term in x.lower().split() for term in EVENT_TERMS)]
            if events:
                pool = events

        scored = []
        for candidate in pool:
            evidence = []
            for idx, item in enumerate(context):
                if re.search(rf"\b{re.escape(candidate)}\b", item.text, re.I):
                    score = 2 + (idx / max(1, len(context))) * 0.3
                    score += min(0.75, overlap_score(msg, item.text) * 0.75)
                    if token.lower() in {"her", "him", "them", "he", "she", "they"} and candidate in candidates_people:
                        score += 0.2
                    ctx_r = context_roles_list[idx]["roles"] if idx < len(context_roles_list) else {}
                    if token.lower() in {"her", "him", "them"} and (ctx_r.get("Recipient") == candidate or ctx_r.get("Recipient / other") == candidate):
                        score += 0.4
                    if token.lower() == "it" and ctx_r.get("Object") == candidate:
                        score += 0.4
                    evidence.append((score, item))
            if evidence:
                top = max(evidence, key=lambda z: z[0])
                scored.append((top[0], candidate, top[1]))

        scored = rank_candidates(scored)
        resolved = decisive_candidate(scored)
        conf = round(min(94, 48 + scored[0][0] * 12)) if resolved else (42 if scored else 18)

        evidence_msg = None
        has_enough = bool(resolved)
        if resolved:
            for _, _, item in [x for x in scored if x[1] == resolved]:
                evidence_msg = item.text
                if item.text not in [x["text"] for x in relevant]:
                    relevant.append({
                        "text": item.text,
                        "reason": f"Contains candidate reference “{resolved}” resolving “{token}”."
                    })
                supporting.append(item.text)
            clarify_q = None
        else:
            clarify_q = question_for(token, kind, pool)

        possible = pool[:4] if pool else ([f"A person" if "person" in kind else "An item or document"])

        amb.append({
            "expression": token,
            "kind": KIND_UNCLEAR_REFERENCE,
            "type": classify_reference(token),
            "possible_meanings": possible,
            "evidence_message": evidence_msg,
            "has_enough_evidence": has_enough,
            "clarification_question": clarify_q,
            "suggested_meaning": resolved,
            "candidates": pool[:5],
            "resolved": resolved,
            "confidence": conf,
            "reason": (
                f"“{token}” depends on an earlier {kind} reference. Context supports “{resolved}”."
                if resolved
                else f"“{token}” depends on an earlier {kind} reference. Available context does not provide enough evidence to identify what it refers to."
            )
        })

    # =========================================================================
    # 2. WORDS WITH MORE THAN ONE MEANING (Lexical Ambiguity)
    # =========================================================================
    # Example: "We met at the bank." -> financial institution vs riverbank
    for word, lex_entry in LEXICAL_AMBIGUITIES.items():
        if re.search(rf"\b{re.escape(word)}\b", msg, re.I):
            sense_0 = lex_entry["senses"][0]
            sense_1 = lex_entry["senses"][1]

            supp_0 = [
                x.text for x in context
                if any(re.search(rf"\b{re.escape(k)}\b", x.text, re.I) for k in sense_0["keywords"])
            ]
            supp_1 = [
                x.text for x in context
                if any(re.search(rf"\b{re.escape(k)}\b", x.text, re.I) for k in sense_1["keywords"])
            ]

            resolved_sense = None
            evidence_msg = None
            has_enough = False

            if supp_0 and not supp_1:
                resolved_sense = sense_0["label"]
                evidence_msg = supp_0[0]
                has_enough = True
                interpretations = [{
                    "meaning": f"“{word}” means {resolved_sense}.",
                    "confidence": 78,
                    "support": [evidence_msg],
                    "conflict": []
                }]
            elif supp_1 and not supp_0:
                resolved_sense = sense_1["label"]
                evidence_msg = supp_1[0]
                has_enough = True
                interpretations = [{
                    "meaning": f"“{word}” means {resolved_sense}.",
                    "confidence": 78,
                    "support": [evidence_msg],
                    "conflict": []
                }]
            else:
                interpretations = [
                    {"meaning": f"“{word}” means a {sense_0['label']}.", "confidence": 50, "support": [], "conflict": []},
                    {"meaning": f"“{word}” means the {sense_1['label']}.", "confidence": 50, "support": [], "conflict": []}
                ]

            clarify_q = lex_entry["question"] if not has_enough else None

            amb.append({
                "expression": word,
                "kind": KIND_MULTIPLE_MEANINGS,
                "type": "Lexical ambiguity",
                "possible_meanings": [s["meaning"] for s in lex_entry["senses"]],
                "evidence_message": evidence_msg,
                "has_enough_evidence": has_enough,
                "clarification_question": clarify_q,
                "suggested_meaning": resolved_sense,
                "candidates": [s["label"] for s in lex_entry["senses"]],
                "resolved": resolved_sense,
                "confidence": 78 if has_enough else 50,
                "reason": (
                    f"Context mentions related vocabulary, indicating “{word}” refers to {resolved_sense}."
                    if has_enough
                    else f"“{word.capitalize()}” has multiple distinct meanings ({sense_0['label']} vs {sense_1['label']}); surrounding conversation does not indicate which one was intended."
                )
            })

    # =========================================================================
    # 3. SENTENCES THAT CAN BE GROUPED IN DIFFERENT WAYS (Syntactic Attachment)
    # =========================================================================
    # Example: "I saw the teacher with binoculars."
    m_pp = re.search(PP_ATTACHMENT_PATTERN, msg, re.I)
    if m_pp:
        verb = m_pp.group(1)
        object_noun = m_pp.group(2)
        instrument = m_pp.group(3)

        speaker_instrument_cues = [
            rf"\b(i|we|my|our)\b.*?\b({re.escape(instrument)})\b",
            rf"\b(through|using|with)\s+(?:my|the)?\s*{re.escape(instrument)}\b",
            rf"\bbrought\s+(?:my|the)?\s*{re.escape(instrument)}\b"
        ]
        possession_cues = [
            rf"\b{re.escape(object_noun)}\b.*?\b(had|holding|carrying|brought|with)\b.*?\b{re.escape(instrument)}\b",
            rf"\b{re.escape(object_noun)}\b.*?\b(had|holding|carrying)\b"
        ]

        speaker_evidence = [
            x.text for x in context
            if any(re.search(cue, x.text, re.I) for cue in speaker_instrument_cues)
        ]
        possession_evidence = [
            x.text for x in context
            if any(re.search(cue, x.text, re.I) for cue in possession_cues)
        ]

        resolved_struct = None
        evidence_msg = None
        has_enough = False

        if speaker_evidence and not possession_evidence:
            resolved_struct = "instrument used by speaker"
            evidence_msg = speaker_evidence[0]
            has_enough = True
            interpretations = [{
                "meaning": f"Using {instrument}, I {verb} the {object_noun}.",
                "confidence": 76,
                "support": [evidence_msg],
                "conflict": []
            }]
        elif possession_evidence and not speaker_evidence:
            resolved_struct = f"possession by the {object_noun}"
            evidence_msg = possession_evidence[0]
            has_enough = True
            interpretations = [{
                "meaning": f"I {verb} the {object_noun} who had {instrument}.",
                "confidence": 76,
                "support": [evidence_msg],
                "conflict": []
            }]
        else:
            interpretations = alternatives_for_attachment(instrument)

        clarify_q = (
            f"Did you use {instrument} to see the {object_noun}, or did the {object_noun} have {instrument}?"
            if not has_enough else None
        )

        amb.append({
            "expression": f"with the {instrument}" if "with the" in msg.lower() else f"with {instrument}",
            "kind": KIND_GROUPING_AMBIGUITY,
            "type": "Syntactic attachment ambiguity",
            "possible_meanings": [
                f"The speaker used {instrument} to see the {object_noun}",
                f"The {object_noun} had or was holding {instrument}"
            ],
            "evidence_message": evidence_msg,
            "has_enough_evidence": has_enough,
            "clarification_question": clarify_q,
            "suggested_meaning": (
                f"The speaker used {instrument} as an instrument" if resolved_struct == "instrument used by speaker"
                else (f"The {object_noun} had {instrument}" if resolved_struct else None)
            ),
            "candidates": ["instrument used by speaker", f"possession by the {object_noun}"],
            "resolved": resolved_struct,
            "confidence": 76 if has_enough else 50,
            "reason": (
                f"Context indicates {resolved_struct}."
                if has_enough
                else f"The prepositional phrase can attach to the seeing action (instrument) or to the {object_noun} (possession)."
            )
        })

    # =========================================================================
    # 4. MISSING DETAILS
    # =========================================================================

    # 4A. Directive to move/reschedule an event lacking destination time/date
    # Example: "Move the meeting."
    m_evt_dir = re.search(EVENT_DIRECTIVE_PATTERN, msg, re.I)
    if m_evt_dir:
        action_word = m_evt_dir.group(1).lower()
        event_word = m_evt_dir.group(2).lower()
        has_time_in_msg = bool(re.search(TIME_DESTINATION_PATTERN, msg, re.I))

        if not has_time_in_msg:
            found_event = None
            found_time = None
            evidence_msg = None

            for ctx in reversed(context):
                m_t = re.search(r"\b(?:to|at)\s+(tomorrow(?:\s+at\s+\d{1,2}(?:\s*[ap]m)?)?|\d{1,2}(?::\d{2})?\s*[ap]m|thursday|friday|monday|tuesday|wednesday|saturday|sunday)\b", ctx.text, re.I)
                if m_t and not found_time:
                    found_time = m_t.group(0).strip()
                    evidence_msg = ctx.text

                m_m = re.search(r"\b(\d{1,2}\s*[ap]m\s+(?:product\s+sync|review|sync|meeting|team\s+meeting)|product\s+sync|client\s+call|design\s+review|team\s+meeting)\b", ctx.text, re.I)
                if m_m and not found_event:
                    found_event = m_m.group(0).strip()
                    evidence_msg = ctx.text

            has_enough = bool(found_time and (found_event or len(context) > 0))
            resolved_detail = f"{found_event or ('the ' + event_word)} {found_time}" if has_enough else None
            clarify_q = f"Which {event_word} should be moved, and what date or time should it be moved to?" if not has_enough else None

            amb.append({
                "expression": f"{action_word.capitalize()} the {event_word}",
                "kind": KIND_MISSING_DETAILS,
                "type": "Missing event schedule details",
                "possible_meanings": [
                    f"Which specific {event_word} should be moved",
                    f"What date or time to move the {event_word} to"
                ],
                "evidence_message": evidence_msg if has_enough else None,
                "has_enough_evidence": has_enough,
                "clarification_question": clarify_q,
                "suggested_meaning": resolved_detail,
                "candidates": [f"Which {event_word}", "Target date or time"],
                "resolved": resolved_detail,
                "confidence": 75 if has_enough else 35,
                "reason": (
                    f"Context provides the missing meeting ({found_event or event_word}) and target time ({found_time})."
                    if has_enough
                    else f"The message does not specify which {event_word} should be moved or what date/time to move it to."
                )
            })

    # 4B. Directive to send an unspecified item or send to an unspecified recipient
    # Example: "Send it to Jordan."
    m_send_dir = re.search(SEND_DIRECTIVE_PATTERN, msg, re.I)
    if m_send_dir:
        send_verb = m_send_dir.group(1).capitalize()
        item_pron = m_send_dir.group(2).lower()
        person_name = m_send_dir.group(3)

        # Skip if recipient token is actually an object pronoun
        if person_name.lower() not in {"her", "him", "them", "me", "us", "you"}:
            resolved_item = None
            resolved_recipient = None
            evidence_msg = None

            # First check if item_pron was already resolved in this analysis
            for a in amb:
                if a["expression"].lower() == item_pron.lower() and a.get("resolved"):
                    resolved_item = a["resolved"]
                    evidence_msg = a.get("evidence_message")
                    break

            for ctx in reversed(context):
                if not resolved_item:
                    for obj in candidates_objects:
                        if re.search(rf"\b{re.escape(obj)}\b", ctx.text, re.I) and not resolved_item:
                            resolved_item = obj
                            evidence_msg = ctx.text
                m_full_name = re.search(rf"\b({re.escape(person_name)}\s+[A-Z][a-z]+(?:\s+from\s+[A-Za-z]+)?)\b", ctx.text)
                if m_full_name and not resolved_recipient:
                    resolved_recipient = m_full_name.group(1)
                    if not evidence_msg:
                        evidence_msg = ctx.text

            has_enough = bool(resolved_item and resolved_recipient)
            suggested = f"{send_verb} the {resolved_item} to {resolved_recipient}" if has_enough else None
            clarify_q = f"What item should be sent, and which {person_name} should receive it?" if not has_enough else None

            amb.append({
                "expression": f"{send_verb} {item_pron} to {person_name}",
                "kind": KIND_MISSING_DETAILS,
                "type": "Missing deliverable and recipient details",
                "possible_meanings": [
                    f"Which document or item to send (for “{item_pron}”)",
                    f"Which {person_name} (contact, full name, or department) should receive it"
                ],
                "evidence_message": evidence_msg if has_enough else None,
                "has_enough_evidence": has_enough,
                "clarification_question": clarify_q,
                "suggested_meaning": suggested,
                "candidates": ["Item to send", f"Specific contact for {person_name}"],
                "resolved": suggested,
                "confidence": 75 if has_enough else 38,
                "reason": (
                    f"Context specifies {resolved_item} and recipient details for {resolved_recipient}."
                    if has_enough
                    else f"The message does not specify which item to send or which {person_name} should receive it."
                )
            })

    # =========================================================================
    # CONSOLIDATE CLARIFICATIONS & RELEVANT EVIDENCE
    # =========================================================================
    for a in amb:
        if a.get("evidence_message") and a["evidence_message"] not in [x["text"] for x in relevant]:
            relevant.append({
                "text": a["evidence_message"],
                "reason": a["reason"]
            })
        if a.get("clarification_question") and a["clarification_question"] not in clarifications:
            clarifications.append(a["clarification_question"])
            clarification_details.append({
                "id": str(uuid.uuid4()),
                "expression": a["expression"],
                "question": a["clarification_question"],
                "type": a["kind"],
                "options": a.get("possible_meanings", [])[:4]
            })

    # Also capture lexical/referential context overlap
    for item in context:
        overlap = (words(msg) - {"send", "give", "tell", "ask", "it", "her", "him", "that", "this", "them", "to", "after", "before", "saw", "at", "with"}) & words(item.text)
        ref_match = any(a.get("resolved") and re.search(rf"\b{re.escape(str(a['resolved']))}\b", item.text, re.I) for a in amb)
        if (overlap or ref_match) and not any(x["text"] == item.text for x in relevant):
            relevant.append({
                "text": item.text,
                "reason": "Shares a key concept or contextual entity with the message."
            })

    unresolved = [a for a in amb if not a.get("has_enough_evidence", False)]

    # =========================================================================
    # CLEAR REWRITE & INTENT GENERATION
    # =========================================================================
    rewrite: str | None = None
    intent: str | None = None
    replacement_map: list[dict[str, str]] = []

    if amb and not unresolved:
        curr_rewrite = msg
        for a in amb:
            orig_expr = a["expression"]
            res_val = a["resolved"] or a["suggested_meaning"]
            if not res_val:
                continue

            if a["kind"] == KIND_MULTIPLE_MEANINGS:
                entry = LEXICAL_AMBIGUITIES.get(orig_expr.lower())
                if entry:
                    for s in entry["senses"]:
                        if s["label"] == res_val:
                            curr_rewrite = re.sub(rf"\b{re.escape(orig_expr)}\b", s["rewrite"], curr_rewrite, flags=re.I)
                            replacement_map.append({
                                "original": orig_expr,
                                "resolved": s["rewrite"],
                                "reason": a["reason"]
                            })
            elif a["kind"] == KIND_GROUPING_AMBIGUITY:
                m_pp_sub = re.search(PP_ATTACHMENT_PATTERN, msg, re.I)
                if m_pp_sub:
                    if res_val == "instrument used by speaker":
                        curr_rewrite = f"Using {m_pp_sub.group(3)}, I {m_pp_sub.group(1)} the {m_pp_sub.group(2)}."
                    else:
                        curr_rewrite = f"I {m_pp_sub.group(1)} the {m_pp_sub.group(2)} who had {m_pp_sub.group(3)}."
                    replacement_map.append({
                        "original": orig_expr,
                        "resolved": curr_rewrite,
                        "reason": a["reason"]
                    })
            elif a["kind"] == KIND_MISSING_DETAILS:
                if a.get("suggested_meaning"):
                    curr_rewrite = a["suggested_meaning"]
                    replacement_map.append({
                        "original": orig_expr,
                        "resolved": a["suggested_meaning"],
                        "reason": a["reason"]
                    })
            elif a["kind"] == KIND_UNCLEAR_REFERENCE:
                curr_rewrite = replace_reference(curr_rewrite, orig_expr, res_val)
                replacement_map.append({
                    "original": orig_expr,
                    "resolved": res_val,
                    "reason": a["reason"]
                })

        rewrite = curr_rewrite
        if not interpretations:
            interpretations = [{
                "meaning": rewrite,
                "confidence": min((a["confidence"] for a in amb), default=80),
                "support": list(dict.fromkeys(supporting)),
                "conflict": []
            }]
        intent = interpretations[0]["meaning"] if interpretations else rewrite
    elif not amb:
        rewrite = msg
        intent = msg
        interpretations = [{
            "meaning": msg,
            "confidence": 92,
            "support": [],
            "conflict": []
        }]
    else:
        # Context is NOT sufficient to determine writer's intent. Do not guess a rewrite!
        rewrite = None
        intent = None
        if not interpretations:
            interpretations = [{
                "meaning": msg,
                "confidence": 45,
                "support": [],
                "conflict": []
            }]

    # =========================================================================
    # CONFIDENCE & RISK SCORING
    # =========================================================================
    if unresolved:
        conf = min((a["confidence"] for a in amb), default=40)
    elif amb:
        conf = min((a["confidence"] for a in amb), default=80)
    else:
        conf = 92

    level = confidence_level(conf, bool(unresolved))

    risks: list[str] = []
    if unresolved:
        types_unres = {a["kind"] for a in unresolved}
        risks.append(f"{len(unresolved)} unclear element(s) ({', '.join(types_unres)}) lack sufficient contextual evidence.")
    if len(interpretations) > 1 and unresolved:
        risks.append("Multiple competing interpretations exist without decisive conversation evidence.")
    if not context and amb:
        risks.append("No conversation context was provided to disambiguate the message.")
    if not risks:
        risks.append("No high-impact unresolved ambiguity detected in message.")

    risk = risk_level(len(unresolved), len(interpretations), conf)
    risk_score = 82 if risk == "High" else (48 if risk == "Medium" else 15)

    relationships = shallow_roles(msg)
    semantic_graph = build_semantic_graph(msg, relationships)

    explanation = (
        f"Contexta analyzed the message across the four ambiguity categories: unclear references, words with multiple meanings, structural groupings, and missing details. "
        + (
            f"Found {len(amb)} ambiguous element(s). " if amb else "No ambiguity markers detected. "
        )
        + (
            f"All elements were resolved using evidence from {len(relevant)} earlier message(s)."
            if (amb and not unresolved)
            else (
                f"{len(unresolved)} element(s) require clarification because available context does not safely indicate the writer's intent."
                if unresolved else ""
            )
        )
    )

    result = {
        "id": str(uuid.uuid4()),
        "original": msg,
        "confidence": conf,
        "confidence_level": level,
        "risk": risk,
        "risk_score": risk_score,
        "risk_reasons": risks,
        "ambiguities": amb,
        "context_used": relevant[:8],
        "interpretations": interpretations,
        "intent": intent,
        "rewrite": rewrite,
        "replacement_map": replacement_map,
        "clarifications": list(dict.fromkeys(clarifications)),
        "clarification_details": clarification_details,
        "relationships": relationships,
        "semantic_graph": semantic_graph,
        "explanation": explanation,
        "pipeline": [
            "Input normalization",
            "Entity and role extraction",
            "Four-class ambiguity scan (References, Polysemy, Grouping, Missing details)",
            "Context evidence evaluation",
            "Targeted clarification generation",
            "Evidence-supported clear rewrite generation"
        ],
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    if persist:
        con = db()
        con.execute(
            "INSERT INTO analyses(id, created_at, original, payload) VALUES(?,?,?,?)",
            (result["id"], result["created_at"], msg, json.dumps(result))
        )
        con.commit()
        con.close()

    return result
