from pydantic import BaseModel
class Interpretation(BaseModel):
    meaning:str;confidence:int;support:list[str]=[];conflict:list[str]=[]
