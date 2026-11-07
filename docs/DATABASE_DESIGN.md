# Database design

The runnable local deployment uses one SQLite `analyses` table with a JSON payload so analyses remain structured and can evolve without losing information. History reads are capped at 500 rows; deletion is supported per analysis and for all history. The SQL files under `database/schema/` show a normalized relational design for future multi-user deployment. User and conversation tables are not used by the current local single-user build; authentication is not enabled.
