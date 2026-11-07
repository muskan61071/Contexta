"""Fallback role hints; this is not a trained dependency parser."""
from .semantic_analysis import relationship_extract
def shallow_roles(sentence:str):return relationship_extract(sentence)
