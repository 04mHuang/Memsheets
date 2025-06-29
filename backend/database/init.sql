-- Database initialization script for Memsheets
-- This script creates the database, user, and basic tables

SET app.db_user = :'db_user';
SET app.db_password = :'db_password';
SET app.db_name = :'db_name';

DO $$
DECLARE
    db_user text = current_setting('app.db_user');
    db_password text = current_setting('app.db_password');
    db_name text = current_setting('app.db_name');
BEGIN
    -- Create user
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename=db_user) THEN
        EXECUTE format('CREATE USER %I WITH PASSWORD %L', db_user, db_password);
        RAISE NOTICE 'User % created', db_user;
    ELSE 
        RAISE NOTICE 'User % already exists', db_user;
    END IF;
    -- Stop script if database already exists
    IF EXISTS (SELECT FROM pg_catalog.pg_database WHERE datname=db_name) THEN
        RAISE NOTICE 'Database % already exists', db_name;
        RAISE EXCEPTION 'If attempting to reinitialize database % owned by %, drop the database first.', db_name, db_user;
    END IF;
END $$;

CREATE DATABASE :db_name WITH OWNER :db_user;
\c :db_name;

-- Create tables for Memsheets
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    color TEXT DEFAULT '#F5EDE3',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sheets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    nickname TEXT,
    pronouns TEXT,
    birthday DATE,
    likes TEXT,
    dislikes TEXT,
    allergies TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sheet_groups (
    sheet_id INTEGER REFERENCES sheets(id) ON DELETE CASCADE,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    PRIMARY KEY (sheet_id, group_id)
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    sheet_id INTEGER REFERENCES sheets(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    annual_reminder BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sheets_user_id ON sheets(user_id);
CREATE INDEX IF NOT EXISTS idx_sheets_created_at ON sheets(created_at);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_events_sheet_id ON events(sheet_id);

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE :db_name TO :db_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO memsheets_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO memsheets_user;