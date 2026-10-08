-- ============================================================
-- CareConnect Phase 1 Migration
-- Run this in the Supabase SQL Editor for project: psuurxqsflqyftvtihdy
-- ============================================================

-- -------------------------------------------------------
-- employees table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.employees (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id       UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_code    TEXT UNIQUE,
  full_name        TEXT NOT NULL DEFAULT '',
  position         TEXT,
  department       TEXT,
  government_ids   JSONB NOT NULL DEFAULT '{}',
  emergency_contact JSONB NOT NULL DEFAULT '{}',
  personal_email   TEXT,
  contact_phone    TEXT,
  address          TEXT,
  date_hired       DATE,
  is_activated     BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS employees_account_id_idx ON public.employees(account_id);

-- -------------------------------------------------------
-- updated_at trigger
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS employees_updated_at ON public.employees;
CREATE TRIGGER employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -------------------------------------------------------
-- RLS
-- -------------------------------------------------------
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid duplicates on re-run
DROP POLICY IF EXISTS "employee_read_own"   ON public.employees;
DROP POLICY IF EXISTS "employee_update_own" ON public.employees;
DROP POLICY IF EXISTS "manager_read_all"    ON public.employees;
DROP POLICY IF EXISTS "manager_update_all"  ON public.employees;

-- Employees: read their own row
CREATE POLICY "employee_read_own" ON public.employees
  FOR SELECT USING (account_id = auth.uid());

-- Employees: update their own row (column restriction enforced at app layer)
CREATE POLICY "employee_update_own" ON public.employees
  FOR UPDATE USING (account_id = auth.uid());

-- Managers: read all rows
CREATE POLICY "manager_read_all" ON public.employees
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'manager'
  );

-- Managers: update all (for future phases — task assignment, etc.)
CREATE POLICY "manager_update_all" ON public.employees
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'manager'
  );

-- -------------------------------------------------------
-- Helper: set role in user_metadata on signup (optional trigger)
-- Use Supabase Dashboard > Auth > Hooks or set via service_role client
-- when creating a manager account.
-- -------------------------------------------------------
