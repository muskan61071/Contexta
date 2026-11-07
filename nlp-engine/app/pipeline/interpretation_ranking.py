def rank_candidates(scored:list[tuple[float,str,object]])->list[tuple[float,str,object]]:return sorted(scored,key=lambda row:row[0],reverse=True)
def decisive_candidate(scored:list[tuple[float,str,object]])->str|None:
    if not scored:return None
    if len(scored)==1 or scored[0][0]-scored[1][0]>=.35:return scored[0][1]
    return None
