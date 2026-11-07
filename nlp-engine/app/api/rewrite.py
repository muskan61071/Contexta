from fastapi import APIRouter
from ..schemas.message import AnalyzeRequest
from ..pipeline.analyzer import analyze

router = APIRouter()

@router.post('/api/rewrite')
def rewrite(req: AnalyzeRequest):
    result = analyze(req, persist=False)
    return {k: result[k] for k in ('original', 'rewrite', 'intent', 'clarifications')}
