-- This script creates a user for connecting to this application's database
-- Database and table initialization are in db_init.py

SET app.db_user = :'db_user';
SET app.db_password = :'db_password';

DO $$
DECLARE
    db_user text = current_setting('app.db_user');
    db_password text = current_setting('app.db_password');
BEGIN
    -- Create user
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename=db_user) THEN
        EXECUTE format('CREATE USER %I WITH PASSWORD %L', db_user, db_password);
        EXECUTE format('ALTER USER %I WITH CREATEDB', db_user);
        RAISE NOTICE 'User % created', db_user;
    ELSE 
        RAISE NOTICE 'User % already exists', db_user;
    END IF;
END $$;