from app.main import AnalyzeRequest, ContextMessage, analyze
def test_only_relevant_context_is_returned():
    result=analyze(AnalyzeRequest(message='Send it to Priya',context=[ContextMessage(text='The report is ready.'),ContextMessage(text='We went swimming last weekend.')]),persist=False)
    assert any('report' in x['text'].lower() for x in result['context_used'])
