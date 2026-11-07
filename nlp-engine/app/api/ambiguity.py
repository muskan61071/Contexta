from fastapi import APIRouter
from ..schemas.message import AnalyzeRequest
from ..pipeline.analyzer import analyze

router = APIRouter()

@router.post('/api/references/resolve')
def resolve_references(req: AnalyzeRequest):
    result = analyze(req, persist=False)
    return {k: result[k] for k in ('ambiguities', 'context_used', 'clarifications')}
