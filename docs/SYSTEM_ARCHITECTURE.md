# System architecture

```text
React / TypeScript / Vite (client)
             │ JSON over HTTP
             ▼
Express / TypeScript API gateway (server/)
             │ validated requests, timeout-bounded proxy
             ▼
FastAPI NLP fallback and analysis API (nlp-engine/)
             │ parameterized SQL + structured JSON
             ▼
SQLite local history (nlp-engine/contexta.sqlite3)
```

The gateway validates the payload with Zod and rate limits requests. The NLP service independently validates input with Pydantic, caps context at 100 messages and text at 5,000 characters per message, returns structured analysis data, and persists it with parameterized SQL. No authentication is configured because this is a local single-workspace prototype; do not expose it to an untrusted network without adding authentication and access controls.
