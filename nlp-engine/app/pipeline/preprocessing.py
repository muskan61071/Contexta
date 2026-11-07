import re
def normalize(text:str)->str:return re.sub(r"\s+"," ",text).strip()
def sentence_segments(text:str)->list[str]:return [x.strip() for x in re.split(r"(?<=[.!?])\s+",normalize(text)) if x.strip()]
