import re
def replace_reference(message:str,reference:str,candidate:str)->str:
    value=candidate.strip()
    if value and value[0].islower() and not value.lower().startswith(("the ","a ","an ")):value='the '+value
    return re.sub(rf"\b{re.escape(reference)}\b",lambda _match:value,message,count=1,flags=re.I)
