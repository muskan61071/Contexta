# API documentation

## Analyze

`POST /api/analyze` (through the TypeScript gateway)

```json
{
  "message": "Send it to her after that",
  "context": [
    {"speaker":"Maya","text":"The project report is ready."},
    {"speaker":"Leo","text":"Priya needs the report."}
  ]
}
```

Returns an analysis object with `ambiguities`, `context_used`, `interpretations`, `intent`, `confidence`, `confidence_level`, `risk`, `risk_reasons`, `clarifications`, `relationships`, `rewrite`, `pipeline`, and `created_at`.

`POST /api/analyze/preview` accepts the same body and returns the same shape without saving it to history. The React client calls this after a short typing pause when Live preview is enabled.

## History

- `GET /api/history` returns up to 500 newest saved records.
- `DELETE /api/history/{id}` removes one record.
- `DELETE /api/history` removes all records.
- `POST /api/context/analyze` returns selected context and reference evidence.
- `POST /api/references/resolve` returns resolved/unresolved candidate references.
- `POST /api/interpretations` returns candidate meanings.
- `POST /api/clarifications` returns targeted follow-up questions.
- `POST /api/rewrite` returns the evidence-supported rewrite and any outstanding questions.

## Health

`GET /api/health` reports API, engine, and local database mode.
