from app.main import AnalyzeRequest, ContextMessage, analyze
from app.rules.ambiguity_rules import (
    KIND_UNCLEAR_REFERENCE,
    KIND_MULTIPLE_MEANINGS,
    KIND_GROUPING_AMBIGUITY,
    KIND_MISSING_DETAILS
)

# =============================================================================
# 1. UNCLEAR REFERENCES
# =============================================================================

def test_unclear_reference_without_context_asks_clarification():
    """Example: 'Maya spoke to Rina after she finished work.' without context."""
    req = AnalyzeRequest(
        message="Maya spoke to Rina after she finished work.",
        context=[]
    )
    result = analyze(req, persist=False)
    
    amb = next(a for a in result["ambiguities"] if a["expression"].lower() == "she")
    assert amb["kind"] == KIND_UNCLEAR_REFERENCE
    assert "Maya" in amb["possible_meanings"]
    assert "Rina" in amb["possible_meanings"]
    assert amb["has_enough_evidence"] is False
    assert amb["resolved"] is None
    assert amb["clarification_question"] is not None
    assert "Maya or Rina" in amb["clarification_question"]
    # Does not guess intent or create an unbacked rewrite
    assert result["rewrite"] is None
    assert result["intent"] is None
    assert len(result["clarifications"]) >= 1


def test_unclear_reference_with_context_resolves_and_rewrites():
    """Example: 'Maya spoke to Rina after she finished work.' with context supporting Rina."""
    req = AnalyzeRequest(
        message="Maya spoke to Rina after she finished work.",
        context=[
            ContextMessage(speaker="Maya", text="Rina finished work at 5 PM.")
        ]
    )
    result = analyze(req, persist=False)
    
    amb = next(a for a in result["ambiguities"] if a["expression"].lower() == "she")
    assert amb["kind"] == KIND_UNCLEAR_REFERENCE
    assert amb["resolved"] == "Rina"
    assert amb["has_enough_evidence"] is True
    assert amb["evidence_message"] == "Rina finished work at 5 PM."
    assert result["rewrite"] is not None
    assert "after Rina finished work" in result["rewrite"]


# =============================================================================
# 2. WORDS WITH MORE THAN ONE MEANING
# =============================================================================

def test_multiple_meanings_without_context_asks_clarification():
    """Example: 'We met at the bank.' without context."""
    req = AnalyzeRequest(
        message="We met at the bank.",
        context=[]
    )
    result = analyze(req, persist=False)
    
    amb = next(a for a in result["ambiguities"] if a["expression"].lower() == "bank")
    assert amb["kind"] == KIND_MULTIPLE_MEANINGS
    assert len(amb["possible_meanings"]) == 2
    assert amb["has_enough_evidence"] is False
    assert amb["resolved"] is None
    assert "financial" in amb["clarification_question"].lower()
    assert "river" in amb["clarification_question"].lower()
    assert result["rewrite"] is None


def test_multiple_meanings_with_financial_context():
    """Example: 'We met at the bank.' with financial context."""
    req = AnalyzeRequest(
        message="We met at the bank.",
        context=[
            ContextMessage(speaker="Maya", text="I need to deposit a cheque before work today.")
        ]
    )
    result = analyze(req, persist=False)
    
    amb = next(a for a in result["ambiguities"] if a["expression"].lower() == "bank")
    assert amb["kind"] == KIND_MULTIPLE_MEANINGS
    assert amb["resolved"] == "financial institution"
    assert amb["has_enough_evidence"] is True
    assert "deposit a cheque" in amb["evidence_message"]
    assert result["rewrite"] is not None
    assert "financial institution" in result["rewrite"].lower()


def test_multiple_meanings_with_river_context():
    """Example: 'We met at the bank.' with river/nature context."""
    req = AnalyzeRequest(
        message="We met at the bank.",
        context=[
            ContextMessage(speaker="Leo", text="We brought our fishing rods and walked by the river.")
        ]
    )
    result = analyze(req, persist=False)
    
    amb = next(a for a in result["ambiguities"] if a["expression"].lower() == "bank")
    assert amb["resolved"] == "land beside a river"
    assert amb["has_enough_evidence"] is True
    assert result["rewrite"] is not None
    assert "riverbank" in result["rewrite"].lower()


# =============================================================================
# 3. SENTENCES THAT CAN BE GROUPED IN DIFFERENT WAYS
# =============================================================================

def test_structural_grouping_without_context_asks_clarification():
    """Example: 'I saw the teacher with binoculars.' without context."""
    req = AnalyzeRequest(
        message="I saw the teacher with binoculars.",
        context=[]
    )
    result = analyze(req, persist=False)
    
    amb = next(a for a in result["ambiguities"] if "binoculars" in a["expression"].lower())
    assert amb["kind"] == KIND_GROUPING_AMBIGUITY
    assert amb["has_enough_evidence"] is False
    assert amb["resolved"] is None
    assert "Did you use binoculars" in amb["clarification_question"]
    assert result["rewrite"] is None


def test_structural_grouping_with_speaker_instrument_context():
    """Example: 'I saw the teacher with binoculars.' with speaker context."""
    req = AnalyzeRequest(
        message="I saw the teacher with binoculars.",
        context=[
            ContextMessage(speaker="Me", text="I brought my binoculars to the observation deck.")
        ]
    )
    result = analyze(req, persist=False)
    
    amb = next(a for a in result["ambiguities"] if "binoculars" in a["expression"].lower())
    assert amb["has_enough_evidence"] is True
    assert amb["resolved"] == "instrument used by speaker"
    assert result["rewrite"] is not None
    assert "Using binoculars" in result["rewrite"]


def test_structural_grouping_with_object_possession_context():
    """Example: 'I saw the teacher with binoculars.' with teacher possession context."""
    req = AnalyzeRequest(
        message="I saw the teacher with binoculars.",
        context=[
            ContextMessage(speaker="Alex", text="The teacher was carrying binoculars during the field trip.")
        ]
    )
    result = analyze(req, persist=False)
    
    amb = next(a for a in result["ambiguities"] if "binoculars" in a["expression"].lower())
    assert amb["has_enough_evidence"] is True
    assert "possession" in amb["resolved"]
    assert result["rewrite"] is not None
    assert "who had binoculars" in result["rewrite"]


# =============================================================================
# 4. MISSING DETAILS
# =============================================================================

def test_missing_details_move_meeting_without_context():
    """Example: 'Move the meeting.' without context."""
    req = AnalyzeRequest(
        message="Move the meeting.",
        context=[]
    )
    result = analyze(req, persist=False)
    
    amb = next(a for a in result["ambiguities"] if a["kind"] == KIND_MISSING_DETAILS)
    assert amb["expression"] == "Move the meeting"
    assert amb["has_enough_evidence"] is False
    assert amb["resolved"] is None
    assert "Which meeting should be moved" in amb["clarification_question"]
    assert result["rewrite"] is None


def test_missing_details_move_meeting_with_context():
    """Example: 'Move the meeting.' with context specifying meeting and target time."""
    req = AnalyzeRequest(
        message="Move the meeting.",
        context=[
            ContextMessage(speaker="Maya", text="Our 3 PM product sync needs to be shifted to tomorrow at 10 AM.")
        ]
    )
    result = analyze(req, persist=False)
    
    amb = next(a for a in result["ambiguities"] if a["kind"] == KIND_MISSING_DETAILS)
    assert amb["has_enough_evidence"] is True
    assert amb["resolved"] is not None
    assert "tomorrow at 10 AM" in amb["resolved"]
    assert result["rewrite"] is not None


def test_missing_details_send_it_to_jordan_without_context():
    """Example: 'Send it to Jordan.' without context."""
    req = AnalyzeRequest(
        message="Send it to Jordan.",
        context=[]
    )
    result = analyze(req, persist=False)
    
    # Flags both unclear reference 'it' and missing recipient details 'Jordan'
    assert any(a["kind"] == KIND_UNCLEAR_REFERENCE and a["expression"].lower() == "it" for a in result["ambiguities"])
    missing_amb = next(a for a in result["ambiguities"] if a["kind"] == KIND_MISSING_DETAILS)
    assert "Jordan" in missing_amb["expression"]
    assert missing_amb["has_enough_evidence"] is False
    assert result["rewrite"] is None
    assert len(result["clarifications"]) >= 1


def test_missing_details_send_it_to_jordan_with_context():
    """Example: 'Send it to Jordan.' with context specifying document and Jordan Miller."""
    req = AnalyzeRequest(
        message="Send it to Jordan.",
        context=[
            ContextMessage(speaker="Maya", text="The budget spreadsheet is ready."),
            ContextMessage(speaker="Alex", text="Jordan Miller from Accounting will review it.")
        ]
    )
    result = analyze(req, persist=False)
    
    it_amb = next(a for a in result["ambiguities"] if a["expression"].lower() == "it")
    assert it_amb["resolved"] == "budget spreadsheet"
    
    missing_amb = next(a for a in result["ambiguities"] if a["kind"] == KIND_MISSING_DETAILS)
    assert missing_amb["has_enough_evidence"] is True
    assert "Jordan Miller" in missing_amb["resolved"]
    assert result["rewrite"] is not None
    assert "budget spreadsheet" in result["rewrite"]
    assert "Jordan Miller" in result["rewrite"]
