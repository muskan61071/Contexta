from app.main import AnalyzeRequest, analyze

def test_telescope_attachment_offers_two_readings():
    result=analyze(AnalyzeRequest(message="I saw the man with the telescope"),persist=False)
    assert len(result["interpretations"]) == 2
    assert any(x["type"]=="Syntactic attachment ambiguity" for x in result["ambiguities"])

def test_bank_without_context_keeps_both_senses():
    result=analyze(AnalyzeRequest(message="I went to the bank"),persist=False)
    assert len(result["interpretations"]) == 2
    assert result["clarifications"]
