-- Optional normalized schema for a future multi-conversation deployment.
CREATE TABLE conversations (id TEXT PRIMARY KEY, user_id TEXT, title TEXT NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id));
