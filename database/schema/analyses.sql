-- Relational equivalent of the local SQLite store for a future PostgreSQL deployment.
CREATE TABLE analyses (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  original TEXT NOT NULL,
  payload JSONB NOT NULL
);
CREATE INDEX analyses_created_at_idx ON analyses (created_at DESC);
