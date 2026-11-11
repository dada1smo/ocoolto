CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  drawn_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE TABLE participants (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES groups(id),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  target_id TEXT,
  UNIQUE (group_id, email)
);

CREATE TABLE login_tokens (
  hash TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  group_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);

CREATE TABLE sessions (
  hash TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE email_log (
  email TEXT NOT NULL,
  sent_at INTEGER NOT NULL
);
CREATE INDEX email_log_sent_at ON email_log (sent_at);
CREATE INDEX email_log_email_sent_at ON email_log (email, sent_at);
