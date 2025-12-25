-- Migration script for admin backend entities
-- Creates tables for admin product catalog, user profiles, customer orders, and order line items

CREATE TABLE admin_product_catalog (
    catalog_product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_display_name VARCHAR(255) NOT NULL,
    product_detailed_description TEXT,
    product_selling_price DOUBLE NOT NULL,
    product_category_type VARCHAR(100) NOT NULL,
    available_inventory_count INT NOT NULL,
    product_image_path LONGTEXT,
    catalog_status ENUM('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'DRAFT') NOT NULL DEFAULT 'ACTIVE',
    co2_emission_offset VARCHAR(50),
    product_vendor_name VARCHAR(100),
    admin_notes TEXT,
    featured_product_flag BOOLEAN DEFAULT FALSE,
    product_weight_grams DOUBLE,
    sustainability_rating INT,
    catalog_created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    catalog_updated_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE admin_user_profiles (
    admin_user_profile_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_full_display_name VARCHAR(200) NOT NULL,
    user_primary_email_address VARCHAR(255) UNIQUE NOT NULL,
    user_account_role_type ENUM('SUPER_ADMIN', 'ADMIN_USER', 'STANDARD_USER', 'PREMIUM_USER') NOT NULL DEFAULT 'STANDARD_USER',
    user_profile_status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED', 'PENDING_VERIFICATION') NOT NULL DEFAULT 'ACTIVE',
    total_orders_placed_count INT DEFAULT 0,
    lifetime_spending_amount DOUBLE DEFAULT 0.0,
    user_registration_timestamp TIMESTAMP,
    last_activity_timestamp TIMESTAMP,
    user_geographical_location VARCHAR(100),
    user_phone_number VARCHAR(20),
    marketing_emails_consent BOOLEAN DEFAULT TRUE,
    admin_created_account_flag BOOLEAN DEFAULT FALSE,
    account_verification_status ENUM('VERIFIED', 'UNVERIFIED', 'PENDING', 'REJECTED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    user_preferred_language VARCHAR(10) DEFAULT 'en',
    carbon_footprint_goal_status VARCHAR(30) DEFAULT 'NOT_SET',
    notification_preferences TEXT,
    profile_created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_updated_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE admin_customer_orders (
    customer_order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_reference_number VARCHAR(50) UNIQUE NOT NULL,
    customer_profile_id BIGINT NOT NULL,
    order_total_amount DOUBLE NOT NULL,
    order_subtotal_amount DOUBLE,
    tax_amount_charged DOUBLE DEFAULT 0.0,
    shipping_cost_amount DOUBLE DEFAULT 0.0,
    order_processing_status ENUM('PENDING_CONFIRMATION', 'CONFIRMED', 'PROCESSING', 'PACKAGING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED') NOT NULL DEFAULT 'PENDING_CONFIRMATION',
    payment_processing_status ENUM('PAYMENT_PENDING', 'PAYMENT_AUTHORIZED', 'PAYMENT_CAPTURED', 'PAYMENT_FAILED', 'PAYMENT_CANCELLED', 'REFUND_PENDING', 'REFUND_COMPLETED') NOT NULL DEFAULT 'PAYMENT_PENDING',
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city_name VARCHAR(100),
    shipping_state_province VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country_code VARCHAR(10),
    order_tracking_number VARCHAR(100),
    estimated_delivery_date TIMESTAMP,
    order_cancellation_reason TEXT,
    admin_order_notes TEXT,
    order_created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_updated_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    order_completed_timestamp TIMESTAMP,
    FOREIGN KEY (customer_profile_id) REFERENCES admin_user_profiles(admin_user_profile_id)
);

CREATE TABLE admin_order_line_items (
    order_line_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_order_id BIGINT NOT NULL,
    catalog_product_id BIGINT NOT NULL,
    ordered_quantity_count INT NOT NULL,
    unit_selling_price DOUBLE NOT NULL,
    line_item_total_price DOUBLE NOT NULL,
    product_name_snapshot VARCHAR(255) NOT NULL,
    product_description_snapshot TEXT,
    applied_discount_amount DOUBLE DEFAULT 0.0,
    item_fulfillment_status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
    line_item_created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_order_id) REFERENCES admin_customer_orders(customer_order_id),
    FOREIGN KEY (catalog_product_id) REFERENCES admin_product_catalog(catalog_product_id)
);

-- Create indexes for better performance
CREATE INDEX idx_admin_product_status ON admin_product_catalog(catalog_status);
CREATE INDEX idx_admin_product_category ON admin_product_catalog(product_category_type);
CREATE INDEX idx_admin_product_featured ON admin_product_catalog(featured_product_flag);

CREATE INDEX idx_admin_user_email ON admin_user_profiles(user_primary_email_address);
CREATE INDEX idx_admin_user_role ON admin_user_profiles(user_account_role_type);
CREATE INDEX idx_admin_user_status ON admin_user_profiles(user_profile_status);

CREATE INDEX idx_admin_order_status ON admin_customer_orders(order_processing_status);
CREATE INDEX idx_admin_order_payment ON admin_customer_orders(payment_processing_status);
CREATE INDEX idx_admin_order_customer ON admin_customer_orders(customer_profile_id);
CREATE INDEX idx_admin_order_reference ON admin_customer_orders(order_reference_number);

CREATE INDEX idx_admin_line_order ON admin_order_line_items(customer_order_id);
CREATE INDEX idx_admin_line_product ON admin_order_line_items(catalog_product_id);