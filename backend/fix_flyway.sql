-- Fix Flyway Failed Migration
-- Run this script to repair the failed migration

-- Delete the failed migration record from Flyway history
DELETE FROM flyway_schema_history WHERE version = '2' AND success = 0;

-- Verify
SELECT * FROM flyway_schema_history;
