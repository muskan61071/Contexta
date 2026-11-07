def risk_level(unresolved_count:int,interpretation_count:int,confidence:int)->str:
    if unresolved_count and (unresolved_count>1 or confidence<=45):return "High"
    if unresolved_count or interpretation_count>1 or confidence<45:return "Medium"
    return "Low"
