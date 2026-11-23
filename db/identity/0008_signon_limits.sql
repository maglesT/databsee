-- Failed sign-ons of unknown logins are recorded in a bounded way (a few per hour, one per login per 10 minutes);
-- this index keeps that look-up cheap.
create index credential_event_unknown_login on credential_event (at) where employee_id is null;
