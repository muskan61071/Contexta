from pydantic import BaseModel
class Clarification(BaseModel):
    question:str;candidates:list[str]=[]
