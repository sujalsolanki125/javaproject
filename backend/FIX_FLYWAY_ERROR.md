# How to Fix the Flyway Migration Error

## Problem
The error message shows: `Schema carboncalc contains a failed migration to version 2!`

This happens when a Flyway migration fails mid-execution and marks the migration as failed in the `flyway_schema_history` table.

## Solution

### Option 1: Use MySQL Workbench or phpMyAdmin (Easiest)

1. Open MySQL Workbench or phpMyAdmin
2. Connect to your database:
   - Host: `localhost`
   - Port: `3307`
   - Username: `root`
   - Password: `@Sujal5412`
   - Database: `carboncalc`

3. Run this SQL query:
```sql
DELETE FROM flyway_schema_history WHERE version = '2' AND success = 0;
```

4. Restart the Spring Boot application

### Option 2: Use MySQL Command Line

If MySQL is in your PATH, run:
```bash
mysql -u root -p@Sujal5412 -P 3307 -h localhost carboncalc
```

Then execute:
```sql
DELETE FROM flyway_schema_history WHERE version = '2' AND success = 0;
exit;
```

### Option 3: Locate and Run MySQL from Installation Directory

1. Find your MySQL installation (usually in `C:\Program Files\MySQL\MySQL Server 8.0\bin\`)
2. Open PowerShell as Administrator
3. Navigate to the MySQL bin directory
4. Run:
```powershell
.\mysql.exe -u root -p@Sujal5412 -P 3307 -h localhost carboncalc -e "DELETE FROM flyway_schema_history WHERE version = '2' AND success = 0;"
```

### Option 4: Use DBeaver, DataGrip, or Another Database Tool

1. Connect to the database with the credentials above
2. Execute the DELETE query
3. Restart the application

## What Was Fixed

I've already fixed the V2 migration file by removing the sample data that required a user to exist (goals and badges). Now it only inserts marketplace items which don't have foreign key dependencies on users.

## After Running the Fix

Once you've deleted the failed migration record, run the Spring Boot application again:
```bash
mvn spring-boot:run
```

The V2 migration will run successfully this time!

## Verification

After the application starts successfully, you can verify the data was inserted:
```sql
SELECT COUNT(*) FROM marketplace_items;
-- Should return 10 items
```
