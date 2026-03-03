-- Trial accounts for self-service onboarding
CREATE TABLE IF NOT EXISTS trial_accounts (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email              TEXT UNIQUE NOT NULL,
    name               TEXT NOT NULL,
    company            TEXT,
    access_code        TEXT UNIQUE NOT NULL,
    credits_remaining  INTEGER DEFAULT 5,
    credits_used       INTEGER DEFAULT 0,
    is_active          BOOLEAN DEFAULT TRUE,
    created_at         TIMESTAMPTZ DEFAULT NOW(),
    last_login_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_trial_access_code ON trial_accounts (access_code);
CREATE INDEX IF NOT EXISTS idx_trial_email ON trial_accounts (email);
