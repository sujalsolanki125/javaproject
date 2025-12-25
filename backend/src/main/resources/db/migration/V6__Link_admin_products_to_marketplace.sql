ALTER TABLE marketplace_items
    ADD COLUMN IF NOT EXISTS admin_catalog_product_id BIGINT NULL;

-- Optional index for faster joins/queries
CREATE INDEX IF NOT EXISTS idx_marketplace_items_admin_catalog_id
    ON marketplace_items (admin_catalog_product_id);
