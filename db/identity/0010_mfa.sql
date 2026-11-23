-- Two-step sign-in (TOTP authenticator app), optional per person; a site can require it (MFA_REQUIRED).
-- Current state only: every enrolment, removal and reset is also an insert-only credential_event.
create table mfa_factor (
  employee_id uuid primary key references employee,
  secret text not null,                       -- base32 TOTP secret
  confirmed_at timestamptz,                   -- null while the person is still enrolling
  last_step bigint not null default 0,        -- the last 30-second step used: a code works once
  created_at timestamptz not null default now()
);
create table mfa_recovery_code (
  id bigint generated always as identity primary key,
  employee_id uuid not null references employee,
  code_hash text not null,                    -- SHA-256 of the code; the codes are shown once
  used_at timestamptz
);
create index mfa_recovery_code_employee on mfa_recovery_code (employee_id);
grant update, delete on mfa_factor, mfa_recovery_code to core_app;

alter table credential_event drop constraint credential_event_kind_check;
alter table credential_event add constraint credential_event_kind_check
  check (kind in ('signon_ok', 'signon_failed', 'locked', 'reset', 'changed', 'unlocked', 'mfa_enrolled', 'mfa_removed', 'mfa_reset'));
