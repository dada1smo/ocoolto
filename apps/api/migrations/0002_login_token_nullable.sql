-- name/group_id become nullable: a token without group_id only logs in (used by "find my groups").
-- SQLite can't drop NOT NULL, so the table is rebuilt.
CREATE TABLE login_tokens_new (
  hash TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  group_id TEXT,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);
INSERT INTO login_tokens_new SELECT hash, email, name, group_id, expires_at, used_at FROM login_tokens;
DROP TABLE login_tokens;
ALTER TABLE login_tokens_new RENAME TO login_tokens;
