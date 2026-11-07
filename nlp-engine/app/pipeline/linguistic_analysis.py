import re
from ..rules.semantic_rules import ACTION_WORDS
from ..rules.reference_rules import TRAILING_NON_NOUNS

def words(text: str) -> set[str]:
    return {x.lower() for x in re.findall(r"[A-Za-z][A-Za-z'-]*", text) if len(x) > 2}

def extract_entities(text: str) -> tuple[list[str], list[str]]:
    people: list[str] = []
    objects: list[str] = []
    
    # Capitalized potential personal names (exclude sentence-initial action verbs)
    excluded_names = {
        "i", "the", "we", "they", "send", "tell", "ask", "move", "check",
        "look", "see", "please", "update", "forward", "share", "review",
        "here", "there", "what", "where", "when", "how", "this", "that"
    }
    for match in re.finditer(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b", text):
        name = match.group(1)
        if name.lower() not in excluded_names and name not in people:
            people.append(name)
            
    # Determiner + noun phrases
    for match in re.finditer(r"\b(?:the|a|an|my|your|our|their)\s+([a-z]+(?:\s+[a-z]+){0,2})\b", text, re.I):
        phrase = re.sub(TRAILING_NON_NOUNS, "", match.group(1).strip().lower())
        if phrase and phrase.split()[0] not in ACTION_WORDS and phrase not in {"team", "work"} and phrase not in objects:
            objects.append(phrase)
            
    # Known key discourse nouns
    known_nouns = (
        "project report", "report", "assignment", "presentation", "file", "document",
        "meeting", "review", "cheque", "check", "telescope", "binoculars", "river",
        "bank", "budget spreadsheet", "budget report", "prototype mockups", "prototype",
        "contract", "proposal", "draft"
    )
    for noun in known_nouns:
        if re.search(rf"\b{re.escape(noun)}\b", text, re.I) and noun not in objects:
            objects.append(noun)
            
    # Prefer canonical longer noun phrases, avoiding duplicate nested mentions.
    objects = [noun for noun in objects if not any(noun != other and noun in other and len(other.split()) > len(noun.split()) for other in objects)]
    return people, objects
