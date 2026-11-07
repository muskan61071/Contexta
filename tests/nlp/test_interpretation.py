from app.main import AnalyzeRequest, ContextMessage, analyze
def test_context_supported_interpretation_is_exposed():
    result=analyze(AnalyzeRequest(message='Send it',context=[ContextMessage(text='The report is ready.')]),persist=False)
    assert result['interpretations']
    assert 'report' in result['interpretations'][0]['meaning'].lower()
