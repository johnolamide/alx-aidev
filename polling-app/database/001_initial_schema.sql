-- Migration: Initial schema setup for polling app
-- Run this in Supabase SQL Editor to set up the database

-- This is a migration file that can be applied to set up the polling app database
-- It includes all tables, indexes, policies, and functions

\i database/schema.sql

-- Verify the setup by checking if tables exist
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('polls', 'poll_options', 'votes')
ORDER BY tablename;
