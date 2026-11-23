-- Passwords: no re-use of the last 5 (insert-only history of hashes) and temporary passwords that expire.
create table password_history (
  id bigint generated always as identity primary key,
  employee_id uuid not null references employee,
  password_hash text not null,
  at timestamptz not null default now()
);
create index password_history_employee on password_history (employee_id, id desc);
create trigger password_history_insert_only before update or delete or truncate on password_history for each statement execute function refuse_change();
revoke update, delete, truncate on password_history from core_app;
-- The passwords people have now start their history (temporary ones are not a choice, so they are left out).
insert into password_history (employee_id, password_hash) select employee_id, password_hash from credential where not must_change;

-- A temporary password (new person, reset) stops working after 72 hours; null = no expiry (also for ones given before this).
alter table credential add column temp_expires_at timestamptz;
