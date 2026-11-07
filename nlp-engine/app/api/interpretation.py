from fastapi import APIRouter
from ..schemas.message import AnalyzeRequest
from ..pipeline.analyzer import analyze

router = APIRouter()

@router.post('/api/interpretations')
def interpretations(req: AnalyzeRequest):
    return analyze(req, persist=False)['interpretations']
