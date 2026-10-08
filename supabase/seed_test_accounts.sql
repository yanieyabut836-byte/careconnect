-- =============================================================================
-- Seed: create test accounts (run in Supabase Dashboard > SQL Editor)
--
--   Employee : employee@careconnect.test   / Default@123   (EMP-001)
--   Manager  : manager@careconnect.test    / Default@123   (MGR-001)
--
-- Both start with is_activated = false, so the first login is sent to the
-- "Change Password" window to replace the default password.
-- Safe to re-run: existing seed users are skipped.
--
-- Activation emails for EMP-001 go to its personal_email (yanieyabut836@gmail.com).
-- If the employee row already exists, update it instead:
--   update public.employees set personal_email = 'yanieyabut836@gmail.com'
--   where employee_code = 'EMP-001';
-- =============================================================================
create extension if not exists pgcrypto;

do $$
declare
  seed record;
  new_id uuid;
begin
  for seed in
    select * from (values
      ('employee@careconnect.test', 'employee', 'EMP-001', 'Test Employee', 'Staff Nurse',     'Nursing',        'yanieyabut836@gmail.com'),
      ('manager@careconnect.test',  'manager',  'MGR-001', 'Test Manager',  'Head of Nursing', 'Administration', 'manager@careconnect.test')
    ) as t(email, role, code, full_name, position, department, personal_email)
  loop
    if exists (select 1 from auth.users where email = seed.email) then
      continue;
    end if;

    new_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', new_id, 'authenticated', 'authenticated',
      seed.email, crypt('Default@123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('role', seed.role, 'is_activated', false),
      now(), now(),
      '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, provider_id, provider, identity_data,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), new_id, new_id::text, 'email',
      jsonb_build_object('sub', new_id::text, 'email', seed.email, 'email_verified', true),
      now(), now(), now()
    );

    insert into public.employees (
      account_id, employee_code, full_name, position, department,
      personal_email, is_activated
    ) values (
      new_id, seed.code, seed.full_name, seed.position, seed.department,
      seed.personal_email, false
    );
  end loop;
end $$;
