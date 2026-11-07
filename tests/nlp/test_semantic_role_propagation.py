from app.main import AnalyzeRequest, ContextMessage, analyze

def test_semantic_role_alignment_from_earlier_message():
    # When earlier context has Rahul sending Priya the project report,
    # "Send it to her again" should resolve "it" to the report and "her" to Priya via semantic role memory
    req = AnalyzeRequest(
        message="Send it to her again",
        context=[
            ContextMessage(speaker="System", text="Rahul sent Priya the project report.")
        ]
    )
    result = analyze(req, persist=False)
    
    it_amb = next(a for a in result["ambiguities"] if a["expression"].lower() == "it")
    her_amb = next(a for a in result["ambiguities"] if a["expression"].lower() == "her")
    
    assert it_amb["resolved"] in {"project report", "report"}
    assert her_amb["resolved"] == "Priya"
    assert result["intent"] is not None
    assert "Priya" in result["intent"]

def test_binding_ambiguity_resolves_with_supporting_context():
    # Context specifies Arjun is drafting the report
    req = AnalyzeRequest(
        message="Rahul told Arjun that he should submit the report",
        context=[
            ContextMessage(speaker="Maya", text="Arjun is responsible for the final report submission.")
        ]
    )
    result = analyze(req, persist=False)
    he_amb = next(a for a in result["ambiguities"] if a["expression"].lower() == "he")
    assert he_amb["resolved"] == "Arjun"
    assert result["interpretations"][0]["meaning"] == "Arjun should submit the report."

def test_binding_ambiguity_without_context_offers_both_readings():
    # Without clarifying context, both Rahul and Arjun should be offered
    req = AnalyzeRequest(
        message="Rahul told Arjun that he should submit the report",
        context=[]
    )
    result = analyze(req, persist=False)
    he_amb = next(a for a in result["ambiguities"] if a["expression"].lower() == "he")
    assert he_amb["resolved"] is None
    assert len(result["interpretations"]) == 2
    assert any("Rahul" in x["meaning"] for x in result["interpretations"])
    assert any("Arjun" in x["meaning"] for x in result["interpretations"])
    assert len(result["clarifications"]) >= 1

def test_semantic_graph_and_clarification_details_present():
    req = AnalyzeRequest(
        message="Send it to her",
        context=[]
    )
    result = analyze(req, persist=False)
    assert "semantic_graph" in result
    assert "nodes" in result["semantic_graph"]
    assert "edges" in result["semantic_graph"]
    assert "clarification_details" in result
    assert len(result["clarification_details"]) >= 2
