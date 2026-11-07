import re
from ..rules.pronoun_rules import REFERENCE_PATTERN
def detect_references(text:str)->list[dict[str,object]]:
    return [{'text':m.group(0),'start':m.start(),'end':m.end()} for m in re.finditer(REFERENCE_PATTERN,text,re.I)]
