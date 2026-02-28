-- Trutina PostgreSQL Schema

-- Enums
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE case_status AS ENUM ('pending', 'processing', 'complete', 'failed', 'flagged_for_review');
CREATE TYPE doc_type AS ENUM ('payslip', 'bank_statement', 'employment_letter', 'tax_return', 'id_document', 'other');
CREATE TYPE flag_category AS ENUM (
    'pdf_forensics', 'ai_content', 'cross_reference',
    'consistency', 'broker_risk', 'identity'
);

-- Broker profiles (created before cases to allow FK)
CREATE TABLE broker_profiles (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_name      TEXT NOT NULL,
    broker_abn       TEXT UNIQUE,
    broker_license   TEXT,
    submission_count INTEGER DEFAULT 0,
    fraud_flag_count INTEGER DEFAULT 0,
    risk_score       SMALLINT DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
    network_flags    JSONB DEFAULT '{}',
    first_seen_at    TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Loan application cases
CREATE TABLE cases (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference          TEXT UNIQUE NOT NULL,
    applicant_name     TEXT,
    applicant_dob      DATE,
    loan_amount        NUMERIC(15, 2),
    property_address   TEXT,
    broker_id          UUID REFERENCES broker_profiles (id),
    status             case_status DEFAULT 'pending',
    risk_score         SMALLINT CHECK (risk_score BETWEEN 0 AND 100),
    risk_level         risk_level,
    recommended_action TEXT,
    summary            TEXT,
    submitted_at       TIMESTAMPTZ DEFAULT NOW(),
    analysed_at        TIMESTAMPTZ,
    created_at         TIMESTAMPTZ DEFAULT NOW(),
    metadata           JSONB DEFAULT '{}'
);

-- Documents within a case
CREATE TABLE case_documents (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id      UUID NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
    doc_type     doc_type NOT NULL DEFAULT 'other',
    filename     TEXT NOT NULL,
    file_path    TEXT NOT NULL,
    file_size    INTEGER,
    mime_type    TEXT,
    page_count   INTEGER,
    ocr_text     TEXT,
    pdf_metadata JSONB DEFAULT '{}',
    status       TEXT DEFAULT 'pending',
    uploaded_at  TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- Fraud flags
CREATE TABLE fraud_flags (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id     UUID NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
    document_id UUID REFERENCES case_documents (id) ON DELETE CASCADE,
    category    flag_category NOT NULL,
    code        TEXT NOT NULL,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    severity    risk_level NOT NULL,
    weight      SMALLINT NOT NULL DEFAULT 5 CHECK (weight BETWEEN 1 AND 10),
    evidence    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trail
CREATE TABLE audit_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id     UUID REFERENCES cases (id),
    event_type  TEXT NOT NULL,
    actor       TEXT DEFAULT 'system',
    detail      JSONB DEFAULT '{}',
    occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cases_status ON cases (status);
CREATE INDEX idx_cases_risk_level ON cases (risk_level);
CREATE INDEX idx_cases_broker_id ON cases (broker_id);
CREATE INDEX idx_cases_submitted_at ON cases (submitted_at DESC);
CREATE INDEX idx_flags_case_id ON fraud_flags (case_id);
CREATE INDEX idx_flags_category ON fraud_flags (category);
CREATE INDEX idx_flags_severity ON fraud_flags (severity);
CREATE INDEX idx_docs_case_id ON case_documents (case_id);
CREATE INDEX idx_audit_case_id ON audit_events (case_id);
CREATE INDEX idx_audit_occurred_at ON audit_events (occurred_at DESC);
CREATE INDEX idx_broker_abn ON broker_profiles (broker_abn);

-- Reference counter function
CREATE OR REPLACE FUNCTION generate_case_reference()
    RETURNS TEXT AS
$$
DECLARE
    seq_val INTEGER;
BEGIN
    SELECT COUNT(*) + 1 INTO seq_val FROM cases;
    RETURN 'LL-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq_val::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;
