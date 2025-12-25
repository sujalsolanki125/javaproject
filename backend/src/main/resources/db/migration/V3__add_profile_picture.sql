-- Add profile_picture column to users table if it doesn't exist
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'users' AND column_name = 'profile_picture');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE users ADD COLUMN profile_picture LONGTEXT;', 'SELECT ''Column profile_picture already exists'' AS info;');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
