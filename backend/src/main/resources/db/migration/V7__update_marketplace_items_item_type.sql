-- Ensure marketplace_items has an item_type column to classify climate actions
ALTER TABLE marketplace_items
    ADD COLUMN IF NOT EXISTS item_type ENUM('tree_planting','carbon_credit','eco_product','donation') NULL AFTER name;

-- Backfill item_type based on existing category values
UPDATE marketplace_items
SET item_type = CASE
    WHEN category IN ('tree-planting', 'Tree Planting') THEN 'tree_planting'
    WHEN category IN ('carbon-credits', 'Carbon Credits') THEN 'carbon_credit'
    WHEN category IN ('donations', 'Donation') THEN 'donation'
    ELSE 'eco_product'
END
WHERE item_type IS NULL;

-- Make item_type required going forward
ALTER TABLE marketplace_items
    MODIFY COLUMN item_type ENUM('tree_planting','carbon_credit','eco_product','donation') NOT NULL;
