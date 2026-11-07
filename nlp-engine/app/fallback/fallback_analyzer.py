def analyze_fallback(request, persist: bool = True):
    from ..pipeline.analyzer import analyze
    return analyze(request, persist=persist)
