-- Timed lockout: five failures lock the account for a while (POLICY.lockoutMinutes), then it opens by itself.
-- An administrator can also unlock at once (core.people.manage), which is an audited event.
alter table credential_event drop constraint credential_event_kind_check;
alter table credential_event add constraint credential_event_kind_check
  check (kind in ('signon_ok', 'signon_failed', 'locked', 'reset', 'changed', 'unlocked'));
