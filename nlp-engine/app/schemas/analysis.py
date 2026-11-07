from typing import Any
from pydantic import BaseModel
class AnalysisResponse(BaseModel):
    id:str;original:str;confidence:int;confidence_level:str;risk:str
    risk_reasons:list[str];ambiguities:list[dict[str,Any]];context_used:list[dict[str,str]]
    interpretations:list[dict[str,Any]];intent:str|None;rewrite:str|None
    clarifications:list[str];relationships:list[dict[str,str]];explanation:str
    pipeline:list[str];created_at:str
