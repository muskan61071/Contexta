from pydantic import BaseModel,Field
class ContextMessage(BaseModel):
    id:str|None=None
    speaker:str='Context'
    text:str=Field(min_length=1,max_length=5000)
class ContextRequest(BaseModel):
    messages:list[ContextMessage]=Field(default_factory=list,max_length=100)
