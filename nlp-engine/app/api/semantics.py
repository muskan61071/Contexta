from fastapi import APIRouter
from ..schemas.message import AnalyzeRequest
from ..pipeline.analyzer import analyze

router = APIRouter()

@router.post('/api/semantic')
def semantic_analysis(req: AnalyzeRequest):
    return {'relationships': analyze(req, persist=False)['relationships']}
