-- V4__carbon_interface_api_fields.sql
-- Add fields to support Carbon Interface API data

-- Add Carbon Interface API specific fields to carbon_logs (if they don't exist)
-- Check and add carbon_interface_estimate_id column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'carbon_logs' AND column_name = 'carbon_interface_estimate_id');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE carbon_logs ADD COLUMN carbon_interface_estimate_id VARCHAR(255);', 'SELECT ''Column carbon_interface_estimate_id already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add api_source column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'carbon_logs' AND column_name = 'api_source');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE carbon_logs ADD COLUMN api_source VARCHAR(50) DEFAULT ''static_calculation'';', 'SELECT ''Column api_source already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add vehicle_model_id column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'carbon_logs' AND column_name = 'vehicle_model_id');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE carbon_logs ADD COLUMN vehicle_model_id VARCHAR(255);', 'SELECT ''Column vehicle_model_id already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add vehicle_make column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'carbon_logs' AND column_name = 'vehicle_make');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE carbon_logs ADD COLUMN vehicle_make VARCHAR(100);', 'SELECT ''Column vehicle_make already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add vehicle_model column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'carbon_logs' AND column_name = 'vehicle_model');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE carbon_logs ADD COLUMN vehicle_model VARCHAR(100);', 'SELECT ''Column vehicle_model already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add vehicle_year column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'carbon_logs' AND column_name = 'vehicle_year');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE carbon_logs ADD COLUMN vehicle_year INT;', 'SELECT ''Column vehicle_year already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add flight_legs column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'carbon_logs' AND column_name = 'flight_legs');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE carbon_logs ADD COLUMN flight_legs JSON;', 'SELECT ''Column flight_legs already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add electricity_unit column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'carbon_logs' AND column_name = 'electricity_unit');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE carbon_logs ADD COLUMN electricity_unit VARCHAR(10);', 'SELECT ''Column electricity_unit already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add country_code column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'carbon_logs' AND column_name = 'country_code');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE carbon_logs ADD COLUMN country_code VARCHAR(5);', 'SELECT ''Column country_code already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add state_code column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'carbon_logs' AND column_name = 'state_code');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE carbon_logs ADD COLUMN state_code VARCHAR(5);', 'SELECT ''Column state_code already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add api_calculated_at column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'carbon_logs' AND column_name = 'api_calculated_at');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE carbon_logs ADD COLUMN api_calculated_at TIMESTAMP NULL;', 'SELECT ''Column api_calculated_at already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add indexes (if they don't exist)
SET @exist := (SELECT count(*) FROM information_schema.STATISTICS 
WHERE table_schema = 'carboncalc' AND table_name = 'carbon_logs' AND index_name = 'idx_carbon_interface_id');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE carbon_logs ADD INDEX idx_carbon_interface_id (carbon_interface_estimate_id);', 'SELECT ''Index idx_carbon_interface_id already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exist := (SELECT count(*) FROM information_schema.STATISTICS 
WHERE table_schema = 'carboncalc' AND table_name = 'carbon_logs' AND index_name = 'idx_api_source');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE carbon_logs ADD INDEX idx_api_source (api_source);', 'SELECT ''Index idx_api_source already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add vehicle information to surveys for better tracking (if columns don't exist)
-- Check and add transportation column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'surveys' AND column_name = 'transportation');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE surveys ADD COLUMN transportation TEXT;', 'SELECT ''Column transportation already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add housing column  
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'surveys' AND column_name = 'housing');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE surveys ADD COLUMN housing TEXT;', 'SELECT ''Column housing already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add diet column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'surveys' AND column_name = 'diet');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE surveys ADD COLUMN diet TEXT;', 'SELECT ''Column diet already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add consumption column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'surveys' AND column_name = 'consumption');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE surveys ADD COLUMN consumption TEXT;', 'SELECT ''Column consumption already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add total_footprint column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'surveys' AND column_name = 'total_footprint');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE surveys ADD COLUMN total_footprint DECIMAL(10, 2);', 'SELECT ''Column total_footprint already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add vehicle_details column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'surveys' AND column_name = 'vehicle_details');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE surveys ADD COLUMN vehicle_details JSON;', 'SELECT ''Column vehicle_details already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Check and add location_details column
SET @exist := (SELECT count(*) FROM information_schema.COLUMNS 
WHERE table_schema = 'carboncalc' AND table_name = 'surveys' AND column_name = 'location_details');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE surveys ADD COLUMN location_details JSON;', 'SELECT ''Column location_details already exists'' AS info;');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Create vehicle_cache table for Carbon Interface API data
CREATE TABLE IF NOT EXISTS vehicle_cache (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    make_id VARCHAR(255) NOT NULL,
    make_name VARCHAR(100) NOT NULL,
    model_id VARCHAR(255) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_vehicle_model (model_id),
    INDEX idx_make_model (make_id, model_id),
    INDEX idx_make_name (make_name),
    INDEX idx_model_year (model_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create api_usage_log table to track API calls
CREATE TABLE IF NOT EXISTS api_usage_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    request_data JSON,
    response_data JSON,
    status_code INT,
    execution_time_ms INT,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_endpoint (endpoint),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;