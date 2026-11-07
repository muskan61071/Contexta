from fastapi import APIRouter
from ..schemas.message import AnalyzeRequest
from ..pipeline.analyzer import analyze

router = APIRouter()

@router.post('/api/clarifications')
def clarifications(req: AnalyzeRequest):
    return analyze(req, persist=False)['clarifications']
