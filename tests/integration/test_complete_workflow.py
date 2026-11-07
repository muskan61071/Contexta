from app.main import AnalyzeRequest, ContextMessage, analyze

def test_context_to_clarity_workflow():
    result=analyze(AnalyzeRequest(message="Send it to her after that",context=[
        ContextMessage(speaker="Maya",text="The project report is ready."),
        ContextMessage(speaker="Leo",text="Priya needs the report."),
        ContextMessage(speaker="Maya",text="The meeting is scheduled for 3 PM.")]),persist=False)
    assert result["original"]=="Send it to her after that"
    assert result["ambiguities"]
    assert result["pipeline"]
    assert result["risk_reasons"]
