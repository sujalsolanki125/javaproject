-- Run this in MySQL Command Line or Workbench

-- Create database
CREATE DATABASE carboncalc;

-- Create user
CREATE USER 'carboncalc'@'localhost' IDENTIFIED BY 'carboncalc123';

-- Grant privileges
GRANT ALL PRIVILEGES ON carboncalc.* TO 'carboncalc'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;

-- Switch to database
USE carboncalc;

-- Show tables (should be empty initially)
SHOW TABLES;
