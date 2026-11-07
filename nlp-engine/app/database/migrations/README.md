# Database migrations

The current SQLite prototype creates the history table idempotently when connecting. For a multi-user deployment, migrate the normalized SQL design under `database/schema/` and replace this initializer with versioned migrations.
