from pydantic import BaseModel,Field

class ContextMessage(BaseModel):
    id:str|None=None
    speaker:str="Context"
    text:str=Field(min_length=1,max_length=5000)

class AnalyzeRequest(BaseModel):
    message:str=Field(min_length=1,max_length=5000)
    context:list[ContextMessage]=Field(default_factory=list,max_length=100)
