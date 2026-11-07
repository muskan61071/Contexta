from .linguistic_analysis import extract_entities
def recognize_entities(text:str)->dict[str,list[str]]:
    people,objects=extract_entities(text)
    return {'people':people,'objects':objects}
