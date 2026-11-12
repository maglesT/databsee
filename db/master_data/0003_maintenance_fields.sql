-- D-24 (owner, 2026-11-12): maintenance, cleaning and requalification parameters of equipment, instruments and rooms, kept once in
-- master data for every product. They are versioned item fields (item_version.fields, checked by core); the views get
-- them as added columns (PL-08: columns are added to a _v1 view, never removed or renamed). A value that is not a whole
-- number reads as null, so one bad value cannot stop the view.

create or replace view report.equipment_v1 with (security_barrier) as
select c.id, c.code, c.name, c.version, c.active, c.fields->>'type' as type, c.fields->>'make' as make,
  c.fields->>'model' as model, c.fields->>'serial' as serial,
  (select r.code from item_link_current l join item r on r.id = l.to_item where l.from_item = c.id and l.type = 'located_in' limit 1) as room_code,
  now() as read_at, c.changed_at as data_as_of,
  (case when c.fields->>'cleanHoldHours' ~ '^[0-9]{1,6}$' then (c.fields->>'cleanHoldHours')::int end) as clean_hold_hours, (case when c.fields->>'dirtyHoldHours' ~ '^[0-9]{1,6}$' then (c.fields->>'dirtyHoldHours')::int end) as dirty_hold_hours,
  (case when c.fields->>'pmFrequencyDays' ~ '^[0-9]{1,6}$' then (c.fields->>'pmFrequencyDays')::int end) as pm_frequency_days, (case when c.fields->>'calibrationFrequencyDays' ~ '^[0-9]{1,6}$' then (c.fields->>'calibrationFrequencyDays')::int end) as calibration_frequency_days,
  (case when c.fields->>'requalificationFrequencyMonths' ~ '^[0-9]{1,6}$' then (c.fields->>'requalificationFrequencyMonths')::int end) as requalification_frequency_months
from item_current c where c.kind = 'equipment';

create or replace view report.instrument_v1 with (security_barrier) as
select c.id, c.code, c.name, c.version, c.active, c.fields->>'type' as type, c.fields->>'make' as make,
  c.fields->>'model' as model, c.fields->>'serial' as serial, coalesce((c.fields->>'needsCalibration')::boolean, false) as needs_calibration,
  (select r.code from item_link_current l join item r on r.id = l.to_item where l.from_item = c.id and l.type = 'located_in' limit 1) as room_code,
  now() as read_at, c.changed_at as data_as_of,
  (case when c.fields->>'cleanHoldHours' ~ '^[0-9]{1,6}$' then (c.fields->>'cleanHoldHours')::int end) as clean_hold_hours, (case when c.fields->>'dirtyHoldHours' ~ '^[0-9]{1,6}$' then (c.fields->>'dirtyHoldHours')::int end) as dirty_hold_hours,
  (case when c.fields->>'pmFrequencyDays' ~ '^[0-9]{1,6}$' then (c.fields->>'pmFrequencyDays')::int end) as pm_frequency_days, (case when c.fields->>'calibrationFrequencyDays' ~ '^[0-9]{1,6}$' then (c.fields->>'calibrationFrequencyDays')::int end) as calibration_frequency_days,
  (case when c.fields->>'requalificationFrequencyMonths' ~ '^[0-9]{1,6}$' then (c.fields->>'requalificationFrequencyMonths')::int end) as requalification_frequency_months
from item_current c where c.kind = 'instrument';

create or replace view report.room_v1 with (security_barrier) as
select c.id, c.code, c.name, c.version, c.active, c.fields->>'area' as area, c.fields->>'grade' as grade,
  now() as read_at, c.changed_at as data_as_of,
  coalesce(c.fields->>'cleaningBasis', 'operation') as cleaning_basis, (case when c.fields->>'cleaningFrequencyHours' ~ '^[0-9]{1,6}$' then (c.fields->>'cleaningFrequencyHours')::int end) as cleaning_frequency_hours,
  (case when c.fields->>'cleanHoldHours' ~ '^[0-9]{1,6}$' then (c.fields->>'cleanHoldHours')::int end) as clean_hold_hours, (case when c.fields->>'dirtyHoldHours' ~ '^[0-9]{1,6}$' then (c.fields->>'dirtyHoldHours')::int end) as dirty_hold_hours,
  (case when c.fields->>'pmFrequencyDays' ~ '^[0-9]{1,6}$' then (c.fields->>'pmFrequencyDays')::int end) as pm_frequency_days,
  (case when c.fields->>'requalificationFrequencyMonths' ~ '^[0-9]{1,6}$' then (c.fields->>'requalificationFrequencyMonths')::int end) as requalification_frequency_months
from item_current c where c.kind = 'room';
