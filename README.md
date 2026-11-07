# Contexta — Communication Intelligence

A context-aware message analysis workspace. It identifies common pronoun and reference ambiguity, ranks candidates using actual conversation evidence, keeps uncertainty visible, reconstructs intent when evidence is sufficient, and stores analyses in a local SQLite history.

The current NLP implementation is a **deterministic fallback pipeline**. It does not call a hosted model and does not pretend to offer general-purpose language-model understanding. It is designed to be inspectable and can be extended with spaCy or a separately configured model later.

## Start the application (Windows)

Install Python 3.10+ and Node.js 18+ once. Then double-click **`START-CONTEXTA.bat`** in this main project folder. It installs any missing project dependencies and starts the analysis service, API, and website together. Keep its window open. When the website address appears, open **http://localhost:5173**. Press **Ctrl+C** in that window to stop the app.

If you prefer the VS Code terminal, open a terminal in this main project folder and run:

```powershell
npm start
```

Do not run only `npm run dev` inside `client`; that starts just the website, so it cannot analyze messages and will show “Services offline.”

### Alternative: Run services in separate terminals

   ```powershell
   cd nlp-engine
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

2. In another terminal start the TypeScript API gateway:

   ```powershell
   cd server
   npm install
   Copy-Item .env.example .env
   npm run dev
   ```

3. In another terminal start the React client:

   ```powershell
   cd client
   npm install
   npm run dev
   ```

4. Open `http://localhost:5173`. The API gateway health check is at `http://localhost:5000/api/health`.

On macOS/Linux, activate the virtual environment with `source .venv/bin/activate`.

## How to use it

1. Open **Demo examples** and choose an example, or enter your own earlier messages under **Conversation context**.
2. Enter the message you want to check.
3. Click **Analyze**.
4. Read the possible unclear words, clarification question, and clearer message suggestion. Review suggestions before using them.

## Features

- Add and remove conversation context, then analyze a current message.
- Analysis runs when you click **Analyze**. This avoids confusing automatic updates and saves each analysis to local history.
- Evidence-weighted pronoun candidate ranking, relevant-context explanations, alternative readings for selected structural/lexical ambiguities, risk reasons, clarification questions, semantic-role hints, and clearer rewrites when references are supported.
- Demo examples, searchable/deletable saved history, and dashboard metrics derived from saved analyses.
- Responsive React + TypeScript + Vite frontend, Express/TypeScript API gateway, FastAPI NLP service, and SQLite persistence. No account or remote AI service is required.

## API

- `POST /api/analyze` — `{ "message": "...", "context": [{"speaker":"Maya","text":"..."}] }` (manual, saved analysis)
- `POST /api/analyze/preview` — same request, debounced analysis that is not saved to history
- `GET /api/history` — up to 500 most recent analyses
- `DELETE /api/history/{id}` — delete one analysis
- `DELETE /api/history` — clear local analysis history
- `GET /api/health` — service status
- `POST /api/context/analyze`, `/api/references/resolve`, `/api/interpretations`, `/api/clarifications`, `/api/rewrite` — focused analysis operations using the same evidence-based pipeline

## NLP tests

From the project root, after installing the backend dependencies, run `python -m pytest`. The tests cover contextual reference resolution, insufficient context, lexical and syntactic ambiguity, semantic roles, confidence, and an end-to-end context workflow.

The SQLite database is created as `nlp-engine/contexta.sqlite3`. It contains only analyses submitted to this local instance. Delete individual items from History or use the clear-history endpoint to remove them. The Node gateway listens on port 5000 and the NLP service remains on port 8000.

## Tests

- NLP and workflow tests: from the project root, install `nlp-engine/requirements.txt`, then run `python -m pytest`.
- Frontend helper tests: from `client/`, run `npm install` then `npm test`.
- API validation tests: from `server/`, run `npm install` then `npm test`.

## Project map

- `client/` — React interface, reusable analysis sections, demo data, API client, types, and responsive styling.
- `nlp-engine/app/` — FastAPI routes, deterministic NLP pipeline, and SQLite persistence.
- `database/schema/` — documented relational equivalent for a future PostgreSQL deployment.
- `docs/` — architecture, NLP pipeline, and API notes.

## Limits

This fallback uses lexical extraction, lightweight semantic-role heuristics, and contextual candidate scoring. It can miss language phenomena, names, informal spelling, nested references, and meanings that require broad world knowledge. Its confidence is an evidence score from these implemented rules, not a calibrated probability. Treat suggestions as decision support and resolve unclear cases with the clarification prompts.
