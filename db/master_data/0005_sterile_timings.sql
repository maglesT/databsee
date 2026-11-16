-- D-38 (owner, 2026-11-16): an isolator's or RABS's validated sterile timings live in master data with the other care
-- parameters (D-24), set from its qualification: decontaminationValidDays (a passed VHP decontamination stays valid this
-- many days) and gloveTestEveryDays (every glove port is tested at least this often). equipment_v1 gets them as added
-- columns at its end (PL-08: columns are added, never removed or renamed). The Logbook reads them for the sterile status.

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
from item_current c where c.kind = 'equipment';
