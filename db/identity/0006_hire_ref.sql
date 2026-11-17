-- D-75: a person added from a Recruitment hire keeps the hire's candidate reference (report.hire_v1.candidate_ref),
-- so the "From Recruitment" list shows only hires that are not employees yet and a hire is added once only.
-- Null for a person typed by hand. Set once at the insert; core_app has no UPDATE on employee (D-17).
alter table employee add column hire_ref text check (hire_ref is null or btrim(hire_ref) <> '');
create unique index employee_hire_ref on employee (hire_ref) where hire_ref is not null;
