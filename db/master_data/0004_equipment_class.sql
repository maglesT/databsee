-- D-26 (owner, 2026-11-14): equipment is process equipment or an engineering system (the plant's utility systems: HVAC,
-- water, steam, gases and vacuum, cooling and heating media, power, effluent). A versioned item field (equipmentClass,
-- checked by core); equipment_v1 gets it as an added column (PL-08: columns are added, never removed or renamed).
-- No value reads as 'process'.

create or replace view report.equipment_v1 with (security_barrier) as
select c.id, c.code, c.name, c.version, c.active, c.fields->>'type' as type, c.fields->>'make' as make,
  c.fields->>'model' as model, c.fields->>'serial' as serial,
  (select r.code from item_link_current l join item r on r.id = l.to_item where l.from_item = c.id and l.type = 'located_in' limit 1) as room_code,
  now() as read_at, c.changed_at as data_as_of,
  (case when c.fields->>'cleanHoldHours' ~ '^[0-9]{1,6}$' then (c.fields->>'cleanHoldHours')::int end) as clean_hold_hours, (case when c.fields->>'dirtyHoldHours' ~ '^[0-9]{1,6}$' then (c.fields->>'dirtyHoldHours')::int end) as dirty_hold_hours,
  (case when c.fields->>'pmFrequencyDays' ~ '^[0-9]{1,6}$' then (c.fields->>'pmFrequencyDays')::int end) as pm_frequency_days, (case when c.fields->>'calibrationFrequencyDays' ~ '^[0-9]{1,6}$' then (c.fields->>'calibrationFrequencyDays')::int end) as calibration_frequency_days,
  (case when c.fields->>'requalificationFrequencyMonths' ~ '^[0-9]{1,6}$' then (c.fields->>'requalificationFrequencyMonths')::int end) as requalification_frequency_months
  , coalesce(c.fields->>'equipmentClass', 'process') as equipment_class
from item_current c where c.kind = 'equipment';
