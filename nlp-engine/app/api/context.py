from fastapi import APIRouter
from ..schemas.message import AnalyzeRequest
from ..pipeline.analyzer import analyze

router = APIRouter()

@router.post('/api/context/analyze')
def contextual_analysis(req: AnalyzeRequest):
    result = analyze(req)
    return {k: result[k] for k in ('context_used', 'ambiguities', 'intent', 'confidence')}
