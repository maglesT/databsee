-- D-125 (owner rule, 2026-11-20: one owner per job, the others read it): master data owns a product's approved shelf
-- life. Two optional, versioned product item fields checked by core: shelfLifeMonths (whole months, 1 to 120) and
-- expiryRule ('month before' = month of manufacture + shelf life - 1; 'same month' = month of manufacture + shelf life,
-- the same choices as TrueBatch packing). The shelf life belongs to the row it is entered on (a bulk product or a pack).
-- product_v1 gets them as added last columns shelf_life_months (integer) and expiry_rule (text), null when not set.
-- PL-08: columns are added at the end, never removed or renamed; the view name stays.

create or replace view report.product_v1 with (security_barrier) as
select c.id, c.code, c.name, c.version, c.active, c.fields->>'strength' as strength, c.fields->>'dosageForm' as dosage_form,
  now() as read_at, c.changed_at as data_as_of
  , c.fields->>'kind' as kind
  , (case when jsonb_typeof(c.fields->'antibiotic') = 'boolean' then (c.fields->>'antibiotic')::boolean end) as antibiotic
  , (case when c.fields->>'shelfLifeMonths' ~ '^[0-9]{1,3}$' then (c.fields->>'shelfLifeMonths')::int end) as shelf_life_months
  , (case when c.fields->>'expiryRule' in ('month before', 'same month') then c.fields->>'expiryRule' end) as expiry_rule
from item_current c where c.kind = 'product';
