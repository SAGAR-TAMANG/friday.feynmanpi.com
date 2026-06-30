-- Friday sign-in log. One row per Google user (keyed on the stable `sub`),
-- upserted on every login by app/api/auth/log/route.ts.
CREATE TABLE IF NOT EXISTS users (
  sub            TEXT PRIMARY KEY,          -- Google's stable per-user id (from the verified id_token)
  email          TEXT NOT NULL,
  name           TEXT,
  picture        TEXT,
  email_verified INTEGER NOT NULL DEFAULT 0, -- 0/1
  created_at     INTEGER NOT NULL,           -- epoch ms, first seen
  last_login     INTEGER NOT NULL,           -- epoch ms, most recent login
  login_count    INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users (last_login);
