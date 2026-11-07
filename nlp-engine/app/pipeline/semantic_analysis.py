import re
from typing import Any
from .linguistic_analysis import extract_entities
from .tokenization import tokenize
from ..rules.semantic_rules import ACTION_WORDS

def relationship_extract(message: str) -> list[dict[str, str]]:
    out = []
    people, objects = extract_entities(message)
    tokens = tokenize(message)
    
    # Identify action/predicate
    action = next((x.lower() for x in tokens if x.lower() in ACTION_WORDS), None)
    
    # Check for speaker agent if "I" is used
    has_i = bool(re.search(r"\b(i|we)\b", message, re.I))
    
    agent = None
    recipient = None
    if people:
        agent = people[0]
        out.append({"role": "Person / entity", "value": agent})
        if len(people) > 1:
            recipient = people[1]
            out.append({"role": "Recipient / other", "value": recipient})
    elif has_i:
        out.append({"role": "Person / entity", "value": "Speaker (I)"})
    
    # Check for pronouns functioning as recipient
    if not recipient and re.search(r"\b(to\s+(?:her|him|them|Priya|Arjun|Rahul|Maya)|sent\s+(?:her|him|them))\b", message, re.I):
        m = re.search(r"\b(?:to\s+)?(her|him|them)\b", message, re.I)
        if m:
            out.append({"role": "Recipient", "value": m.group(1)})

    if action:
        out.append({"role": "Action", "value": action})
        
    if objects:
        out.append({"role": "Object", "value": objects[0]})
        
    # Check for prepositional phrase / instrument
    inst = re.search(r"\bwith\s+the\s+([a-z-]+)\b", message, re.I)
    if inst:
        out.append({"role": "Instrument / Modifier", "value": f"with the {inst.group(1)}"})
        
    # Check for location
    loc = re.search(r"\b(?:to|at|in|near)\s+the\s+(bank|office|room|lake|station|library|store|park)\b", message, re.I)
    if loc:
        out.append({"role": "Location", "value": f"the {loc.group(1)}"})

    # Check for time
    tm = re.search(r"\b(today|tomorrow|tonight|later|before|after|at\s+\d+(?:\s*[ap]m)?|\d+\s*[ap]m)\b", message, re.I)
    if tm:
        out.append({"role": "Time", "value": tm.group(0)})
        
    return out

def build_semantic_graph(message: str, relationships: list[dict[str, str]]) -> dict[str, Any]:
    nodes = []
    edges = []
    
    role_map = {r["role"]: r["value"] for r in relationships}
    
    action_val = role_map.get("Action", "action")
    action_id = "node_action"
    nodes.append({
        "id": action_id,
        "label": action_val.upper(),
        "role": "Action / Predicate",
        "type": "action"
    })
    
    agent_val = role_map.get("Person / entity")
    if agent_val:
        agent_id = "node_agent"
        nodes.append({
            "id": agent_id,
            "label": agent_val,
            "role": "Agent (Performer)",
            "type": "person"
        })
        edges.append({
            "source": agent_id,
            "target": action_id,
            "label": "executes"
        })
        
    obj_val = role_map.get("Object")
    if obj_val:
        obj_id = "node_object"
        nodes.append({
            "id": obj_id,
            "label": obj_val,
            "role": "Direct Object",
            "type": "object"
        })
        edges.append({
            "source": action_id,
            "target": obj_id,
            "label": "acts upon"
        })
        
    recip_val = role_map.get("Recipient / other") or role_map.get("Recipient")
    if recip_val:
        recip_id = "node_recipient"
        nodes.append({
            "id": recip_id,
            "label": recip_val,
            "role": "Recipient",
            "type": "person"
        })
        edges.append({
            "source": action_id,
            "target": recip_id,
            "label": "delivers to"
        })
        
    time_val = role_map.get("Time")
    if time_val:
        time_id = "node_time"
        nodes.append({
            "id": time_id,
            "label": time_val,
            "role": "Temporal",
            "type": "modifier"
        })
        edges.append({
            "source": action_id,
            "target": time_id,
            "label": "scheduled at"
        })

    inst_val = role_map.get("Instrument / Modifier")
    if inst_val:
        inst_id = "node_inst"
        nodes.append({
            "id": inst_id,
            "label": inst_val,
            "role": "Instrument",
            "type": "modifier"
        })
        edges.append({
            "source": action_id,
            "target": inst_id,
            "label": "using"
        })
        
    loc_val = role_map.get("Location")
    if loc_val:
        loc_id = "node_loc"
        nodes.append({
            "id": loc_id,
            "label": loc_val,
            "role": "Location",
            "type": "modifier"
        })
        edges.append({
            "source": action_id,
            "target": loc_id,
            "label": "at"
        })

    return {"nodes": nodes, "edges": edges}
