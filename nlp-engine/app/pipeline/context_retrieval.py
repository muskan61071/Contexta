from .linguistic_analysis import words
def overlap_score(message:str,context_message:str)->int:return len(words(message)&words(context_message))
