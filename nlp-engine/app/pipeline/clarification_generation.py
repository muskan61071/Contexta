def question_for(token: str, kind: str, options: list[str], context_phrase: str = "") -> str:
    t = token.lower().strip()
    
    # Pre-crafted questions passed directly
    if context_phrase and "?" in context_phrase:
        return context_phrase
        
    if t in {"her", "him", "he", "she", "them", "they"}:
        if options and len(options) == 2:
            return f"Does “{token}” refer to {options[0]} or {options[1]}?"
        if options and len(options) > 2:
            opts_str = " or ".join(f"“{o}”" for o in options[:3])
            return f"Does “{token}” refer to {opts_str}?"
        return f"Who does “{token}” refer to?"
        
    if t in {"there", "here"}:
        return f"Where does “{token}” refer to?"
        
    if (t in {"that", "this"} and context_phrase) or t in {"after that", "before that"}:
        phrase = context_phrase or token
        return f"What event or milestone does “{phrase}” refer to?"
        
    if t in {"that", "this"}:
        if options:
            return f"Which event or topic does “{token}” refer to?"
        return f"What does “{token}” refer to?"
        
    if options and len(options) == 2:
        return f"Do you mean {options[0]} or {options[1]}?"
    if options and len(options) <= 3:
        opts_str = " or ".join(f"“{o}”" for o in options)
        return f"Does “{token}” refer to {opts_str}?"
        
    return f"What does “{token}” refer to?"
