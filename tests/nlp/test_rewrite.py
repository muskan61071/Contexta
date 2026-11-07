from app.main import AnalyzeRequest, ContextMessage, analyze
def test_resolved_reference_is_expanded_in_clear_rewrite():
    result=analyze(AnalyzeRequest(message='Send it',context=[ContextMessage(text='The report is ready.')]),persist=False)
    assert result['rewrite'] and 'report' in result['rewrite'].lower()
