def classify_reference(token:str, is_temporal:bool=False)->str:
    t = token.lower().strip()
    if is_temporal or t in {"then"}:
        return "Contextual / temporal reference ambiguity"
    if t in {"he","she","him","her","they","them"}:
        return "Pronoun / person reference ambiguity"
    if t in {"there","here"}:
        return "Spatial / location reference ambiguity"
    return "Pronoun / object or event reference ambiguity"

