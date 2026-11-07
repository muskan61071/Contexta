CREATE TABLE clarifications (id TEXT PRIMARY KEY, analysis_id TEXT NOT NULL, question TEXT NOT NULL, answered_value TEXT, FOREIGN KEY(analysis_id) REFERENCES analyses(id));
