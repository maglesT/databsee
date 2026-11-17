-- D-64 (owner, 2026-11-17): a product is a bulk product (made in TrueBatch Tablets, e.g. tablets 500 mg) or a pack (a
-- finished pack, made in TrueBatch Tablets Packing, e.g. blister 10 x 10), so the TrueBatch designers offer only the
-- right ones. A versioned item field (kind, checked by core); product_v1 gets it as an added column at its end (PL-08:
-- columns are added, never removed or renamed). Not set reads as null.

create or replace view report.product_v1 with (security_barrier) as
select c.id, c.code, c.name, c.version, c.active, c.fields->>'strength' as strength, c.fields->>'dosageForm' as dosage_form,
  now() as read_at, c.changed_at as data_as_of
  , c.fields->>'kind' as kind
from item_current c where c.kind = 'product';
