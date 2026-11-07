-- Authentication is not enabled in the local single-user build. Reserved for a future multi-user deployment.
CREATE TABLE users (id TEXT PRIMARY KEY, display_name TEXT NOT NULL, created_at TEXT NOT NULL);
