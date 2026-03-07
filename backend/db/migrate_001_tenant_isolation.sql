-- Migration: Add tenant isolation to cases
-- Run this on existing databases before deploying the tenant isolation update

-- Add tenant_id column (nullable for backward compatibility with existing cases)
ALTER TABLE cases ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES trial_accounts(id);

-- Index for fast tenant-scoped queries
CREATE INDEX IF NOT EXISTS idx_cases_tenant_id ON cases (tenant_id);

-- Existing cases without tenant_id remain accessible to admin users only
