from .intent_reconstruction import replace_reference
def clear_message(message:str,resolved:list[dict])->str|None:
    if not resolved:return None
    result=message
    for item in resolved:
        if item.get('resolved'):result=replace_reference(result,item['expression'],item['resolved'])
    return result
