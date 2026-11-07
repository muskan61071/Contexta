from app.main import AnalyzeRequest, ContextMessage, analyze

def test_single_object_candidate_is_resolved_from_context():
    result=analyze(AnalyzeRequest(message="Send it tomorrow",context=[ContextMessage(speaker="Maya",text="The project report is ready.")]),persist=False)
    item=next(x for x in result["ambiguities"] if x["expression"].lower()=="it")
    assert item["resolved"] in {"project report","report"}
    assert result["intent"]

def test_missing_context_prompts_instead_of_guessing():
    result=analyze(AnalyzeRequest(message="Send it to her"),persist=False)
    assert result["intent"] is None
    assert len(result["clarifications"]) >= 2
    assert any(a["resolved"] is None for a in result["ambiguities"])
