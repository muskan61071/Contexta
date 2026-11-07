CREATE TABLE rewrites (id TEXT PRIMARY KEY, analysis_id TEXT NOT NULL, original TEXT NOT NULL, suggested TEXT, accepted INTEGER NOT NULL DEFAULT 0, FOREIGN KEY(analysis_id) REFERENCES analyses(id));
