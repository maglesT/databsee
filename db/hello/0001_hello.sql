-- The hello reference product (slice A5; never installed at a customer). It proves the add-a-product recipe:
-- its own database, master data read live, signed records that keep what they relied on, a published view.

-- PL-07: a signed note keeps the master-data ID plus the values it relied on, as they were at signing,
-- and the signer's printed name, date and meaning (11.50).
create table note (
  id bigint generated always as identity primary key,
  text text not null check (btrim(text) <> ''),
  equipment_id uuid not null,               -- master_data item id
  equipment_code text not null,             -- as at signing
  equipment_name text not null,             -- as at signing
  equipment_version int not null,           -- as at signing
  signed_by uuid not null,                  -- identity employee id (the re-authenticated sub)
  signer_name text not null,
  signed_at timestamptz not null default now(),
  meaning text not null default 'authored'
);

create function refuse_change() returns trigger language plpgsql set search_path = pg_catalog, pg_temp as $$
begin
  raise exception '% is insert-only', tg_table_name using errcode = 'insufficient_privilege';
end $$;
create trigger note_insert_only before update or delete or truncate on note for each statement execute function refuse_change();
revoke update, delete, truncate on note from hello_app;

-- Published view (PL-08): read by linked products and outside systems.
create view report.note_v1 with (security_barrier) as
select id, text, equipment_code, equipment_name, signer_name, signed_at, meaning, now() as read_at, signed_at as data_as_of from note;
revoke all on report.note_v1 from public;
