-- MED-05: failures count in a 15-minute window and a lock lifts after 15 minutes (core/server/app.ts checkPassword),
-- and the site security contact can unlock at once from the lockout email: a single-use link, kept only as a hash.
alter table credential_event drop constraint credential_event_kind_check;
alter table credential_event add constraint credential_event_kind_check
  check (kind in ('signon_ok', 'signon_failed', 'locked', 'reset', 'changed', 'unlocked'));
create index credential_event_employee_at on credential_event (employee_id, at);
alter table alert add column unlock_token_hash text unique;
