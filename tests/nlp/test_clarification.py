from app.main import AnalyzeRequest, analyze
def test_exact_missing_references_generate_questions():
    result=analyze(AnalyzeRequest(message='Give it to them'),persist=False)
    assert any('it' in question for question in result['clarifications'])
    assert any('them' in question for question in result['clarifications'])
