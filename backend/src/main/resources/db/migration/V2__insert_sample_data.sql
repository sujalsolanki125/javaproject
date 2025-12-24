-- V2__insert_sample_data.sql
-- Insert Sample Marketplace Items

-- Tree Planting Items
INSERT INTO marketplace_items (item_name, name, item_type, category, price, description, carbon_offset, image_url, stock, seller, is_active) VALUES
('Plant 10 Mangrove Trees', 'Plant 10 Mangrove Trees', 'tree_planting', 'tree-planting', 25.00, 
 'Help restore coastal ecosystems and combat climate change by planting mangrove trees in critical habitats.', 
 '-50kg CO2', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400', 100, 'EcoRestoration Inc', TRUE),

('Reforestation Carbon Credits', 'Reforestation Carbon Credits', 'tree_planting', 'tree-planting', 45.00, 
 'Support large-scale reforestation projects in tropical regions and earn verified carbon credits.', 
 '-100kg CO2', 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400', 200, 'TreesForLife', TRUE),

-- Carbon Credit Items
('1 Tonne CO2 Offset Credit', '1 Tonne CO2 Offset Credit', 'carbon_credit', 'carbon-credits', 15.50, 
 'Verified carbon offset credits from renewable energy projects certified by international standards.', 
 '-1 Tonne CO2', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400', 500, 'Carbon Trust', TRUE),

('Community Solar Project Share', 'Community Solar Project Share', 'carbon_credit', 'carbon-credits', 100.00, 
 'Invest in local renewable energy projects and earn credits on your energy bill while reducing emissions.', 
 '-250kg CO2', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', 30, 'SolarShare Co', TRUE),

-- Eco Products
('Recycled Material Backpack', 'Recycled Material Backpack', 'eco_product', 'eco-product', 79.99, 
 'Durable backpack made from 100% recycled ocean plastic. Waterproof and stylish.', 
 '-5kg CO2', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 50, 'EcoGear', TRUE),

('Zero-Waste Starter Kit', 'Zero-Waste Starter Kit', 'eco_product', 'eco-product', 35.00, 
 'Essential items to begin your zero-waste journey: reusable bags, straws, containers, and utensils.', 
 '-1kg CO2', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400', 75, 'ZeroWaste Hub', TRUE),

('Bamboo Cutlery Set', 'Bamboo Cutlery Set', 'eco_product', 'eco-product', 12.99, 
 'Sustainable, biodegradable cutlery set perfect for on-the-go meals. Includes fork, knife, spoon, and carrying case.', 
 '-0.5kg CO2', 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=400', 150, 'BambooEssentials', TRUE),

-- Donation Items
('Rainforest Alliance Donation', 'Donation to Rainforest Alliance', 'donation', 'donations', 50.00, 
 'Support rainforest conservation and sustainable farming practices to protect biodiversity.', 
 'Donation', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400', 999, 'Rainforest Alliance', TRUE),

('Ocean Cleanup Project', 'Ocean Cleanup Project', 'donation', 'donations', 30.00, 
 'Contribute to removing plastic waste from our oceans and protecting marine life.', 
 'Donation', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', 999, 'Ocean Cleanup', TRUE),

('Wildlife Habitat Restoration', 'Wildlife Habitat Restoration', 'donation', 'donations', 75.00, 
 'Fund the restoration of wildlife habitats affected by deforestation and climate change.', 
 'Donation', 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400', 999, 'Wildlife Foundation', TRUE);

-- Insert Sample Goals for reference
INSERT INTO goals (user_id, goal_title, target_emission, current_emission, status, description, deadline) VALUES
(1, 'Reduce Monthly Emissions by 20%', 50.00, 0.00, 'active', 'Aim to reduce carbon footprint from 60kg to 50kg per month', DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY)),
(1, 'Plant 100 Trees This Year', 100.00, 0.00, 'active', 'Contribute to reforestation efforts', DATE_ADD(CURRENT_DATE, INTERVAL 365 DAY)),
(1, 'Go Carbon Neutral for Transportation', 30.00, 0.00, 'active', 'Offset all transportation emissions', DATE_ADD(CURRENT_DATE, INTERVAL 90 DAY));

-- Insert Sample Badges
INSERT INTO badges (user_id, badge_name, description, badge_icon) VALUES
(1, 'First Steps', 'Completed your first carbon footprint survey', '🌱'),
(1, 'Eco Warrior', 'Logged 7 consecutive days of carbon tracking', '⚡'),
(1, 'Tree Planter', 'Purchased your first tree planting credit', '🌳');
