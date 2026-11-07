# NLP pipeline (implemented fallback)

1. Validate message and context bounds.
2. Extract simple names, noun phrases, time expressions, and common action words.
3. Detect configured pronouns/references and selected `with`-attachment and `bank` ambiguities.
4. Collect compatible candidate people or objects from current and prior messages.
5. Score context candidates using mention evidence, recency, and content-word overlap.
6. Resolve only when there is one candidate or an evidence lead; otherwise retain uncertainty.
7. Build relevant-context notes, possible readings, a confidence evidence score, risk reasons, clarification prompts, semantic-role hints, and a conservative rewrite.
8. Store the structured response in SQLite.

These are deterministic linguistic heuristics, not dependency parsing, coreference resolution, or a trained semantic model. Scores are not calibrated probabilities. A future advanced model should be added behind a distinct provider interface and identified in each response.
