-- Least privilege (D-17): tables created before D-17 got UPDATE/DELETE for the app by default. hello_app changes no rows
-- here (its writes are inserts), so take that back.
revoke update, delete, truncate on all tables in schema public from hello_app;
