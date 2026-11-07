from fastapi import APIRouter
from ..schemas.message import AnalyzeRequest
from ..pipeline.analyzer import analyze

router = APIRouter()

@router.post('/api/analyze')
def analyze_message(req: AnalyzeRequest):
    return analyze(req)

@router.post('/api/preview')
def preview_analysis(req: AnalyzeRequest):
    return analyze(req, persist=False)
