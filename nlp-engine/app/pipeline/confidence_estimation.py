def confidence_level(score:int,has_unresolved:bool)->str:
    if score>=75 and not has_unresolved:return "High"
    if score>=45 and not has_unresolved:return "Medium"
    return "Low"
