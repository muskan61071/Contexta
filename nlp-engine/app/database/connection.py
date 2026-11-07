import os,sqlite3
from pathlib import Path
DB_PATH=Path(os.getenv('CONTEXTA_DB_PATH',str(Path(__file__).resolve().parents[2]/'contexta.sqlite3')))
def connect()->sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True,exist_ok=True)
    connection=sqlite3.connect(DB_PATH);connection.row_factory=sqlite3.Row
    connection.execute('CREATE TABLE IF NOT EXISTS analyses (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, original TEXT NOT NULL, payload TEXT NOT NULL)')
    return connection
