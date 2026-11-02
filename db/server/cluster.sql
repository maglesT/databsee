-- Server-level part of init.sh for one database: its owner role, its app login, the database itself, and who may
-- connect. Nobody but the database's own app may connect until a link grants it (PL-08); PUBLIC also loses
-- TEMPORARY, so a reader cannot create functions of its own (Logbook 0013 pattern).
select format('create role %I nologin', :'owner') where not exists (select from pg_roles where rolname = :'owner') \gexec
select format('create role %I nologin', :'app') where not exists (select from pg_roles where rolname = :'app') \gexec
select format('create database %I owner %I', :'db', :'owner') where not exists (select from pg_database where datname = :'db') \gexec
select format('revoke all on database %I from public', :'db') \gexec
select format('grant connect, temporary on database %I to %I', :'db', :'app') \gexec
