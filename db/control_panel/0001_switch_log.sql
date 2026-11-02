-- Control panel (slice A8, the owner's server only). The customers, licences and links themselves live in the
-- customer config files (Git); this database keeps only the log of every switch made in the panel (D-08, PL-10).
create table switch_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  by_user text not null,
  customer text not null,
  action text not null,                                     -- e.g. "licence hello off"
  change_ref text not null check (btrim(change_ref) <> ''), -- the customer's change reference (CP-02)
  reason text not null check (btrim(reason) <> ''),
  commit_sha text not null                                  -- the config commit; its apply run is the result
);

create function refuse_change() returns trigger language plpgsql set search_path = pg_catalog, pg_temp as $$
begin
  raise exception '% is insert-only', tg_table_name using errcode = 'insufficient_privilege';
end $$;
create trigger switch_log_insert_only before update or delete or truncate on switch_log
  for each statement execute function refuse_change();
revoke update, delete, truncate on switch_log from control_panel_app;
