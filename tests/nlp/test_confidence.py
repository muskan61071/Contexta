from app.main import AnalyzeRequest, ContextMessage, analyze

def test_unresolved_reference_does_not_claim_high_confidence():
    result=analyze(AnalyzeRequest(message="Send it"),persist=False)
    assert result["confidence_level"]!="High"
    assert result["risk"] in {"Medium","High"}

def test_evidence_resolved_reference_includes_context_evidence():
    result=analyze(AnalyzeRequest(message="Send it",context=[ContextMessage(speaker="Maya",text="The report is ready.")]),persist=False)
    assert result["context_used"]
