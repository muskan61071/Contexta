import re
def tokenize(text:str)->list[str]:return re.findall(r"[A-Za-z]+(?:['-][A-Za-z]+)*|\d+(?::\d+)?",text)
