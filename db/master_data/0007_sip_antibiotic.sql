-- D-69 (owner, 2026-11-17): two optional master data fields, both versioned item fields checked by core.
-- Equipment: sipValidDays, how many days a passed SIP (steam in place) stays valid, from the equipment's qualification
-- (whole days, empty = not applicable), next to the sterile timings of D-38. equipment_v1 gets it as an added last
-- column sip_valid_days (integer, null when not set).
-- Product: antibiotic, the product needs product-changeover cleaning. product_v1 gets it as an added last column
-- antibiotic (boolean, null when not set).
-- PL-08: columns are added at the end, never removed or renamed; the view names stay.

create or replace view report.equipment_v1 with (security_barrier) as
select c.id, c.code, c.name, c.version, c.active, c.fields->>'type' as type, c.fields->>'make' as make,
  c.fields->>'model' as model, c.fields->>'serial' as serial,
  (select r.code from item_link_current l join item r on r.id = l.to_item where l.from_item = c.id and l.type = 'located_in' limit 1) as room_code,
  now() as read_at, c.changed_at as data_as_of,
  (case when c.fields->>'cleanHoldHours' ~ '^[0-9]{1,6}$' then (c.fields->>'cleanHoldHours')::int end) as clean_hold_hours, (case when c.fields->>'dirtyHoldHours' ~ '^[0-9]{1,6}$' then (c.fields->>'dirtyHoldHours')::int end) as dirty_hold_hours,
  (case when c.fields->>'pmFrequencyDays' ~ '^[0-9]{1,6}$' then (c.fields->>'pmFrequencyDays')::int end) as pm_frequency_days, (case when c.fields->>'calibrationFrequencyDays' ~ '^[0-9]{1,6}$' then (c.fields->>'calibrationFrequencyDays')::int end) as calibration_frequency_days,
  (case when c.fields->>'requalificationFrequencyMonths' ~ '^[0-9]{1,6}$' then (c.fields->>'requalificationFrequencyMonths')::int end) as requalification_frequency_months
  , coalesce(c.fields->>'equipmentClass', 'process') as equipment_class
  , (case when c.fields->>'decontaminationValidDays' ~ '^[0-9]{1,6}$' then (c.fields->>'decontaminationValidDays')::int end) as decontamination_valid_days
  , (case when c.fields->>'gloveTestEveryDays' ~ '^[0-9]{1,6}$' then (c.fields->>'gloveTestEveryDays')::int end) as glove_test_every_days
  , (case when c.fields->>'sipValidDays' ~ '^[0-9]{1,6}$' then (c.fields->>'sipValidDays')::int end) as sip_valid_days
from item_current c where c.kind = 'equipment';

create or replace view report.product_v1 with (security_barrier) as
select c.id, c.code, c.name, c.version, c.active, c.fields->>'strength' as strength, c.fields->>'dosageForm' as dosage_form,
  now() as read_at, c.changed_at as data_as_of
  , c.fields->>'kind' as kind
  , (case when jsonb_typeof(c.fields->'antibiotic') = 'boolean' then (c.fields->>'antibiotic')::boolean end) as antibiotic
from item_current c where c.kind = 'product';
