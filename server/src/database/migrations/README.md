# Migrations

Analysis history is currently held in SQLite by the NLP service; its table is initialized in `app/database/connection.py`. The Express gateway deliberately does not own a second competing history store.
