-- V2__insert_sample_data.sql
-- Insert Sample Marketplace Items

-- Tree Planting Items
INSERT INTO marketplace_items (name, category, price, description, carbon_offset, image_url, stock, seller, is_active) VALUES
('Plant 10 Mangrove Trees', 'tree-planting', 25.00, 
 'Help restore coastal ecosystems and combat climate change by planting mangrove trees in critical habitats.', 
 '-50kg CO2', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400', 100, 'EcoRestoration Inc', TRUE),

('Reforestation Carbon Credits', 'tree-planting', 45.00, 
 'Support large-scale reforestation projects in tropical regions and earn verified carbon credits.', 
 '-100kg CO2', 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400', 200, 'TreesForLife', TRUE),

-- Carbon Credit Items
('1 Tonne CO2 Offset Credit', 'carbon-credits', 15.50, 
 'Verified carbon offset credits from renewable energy projects certified by international standards.', 
 '-1 Tonne CO2', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400', 500, 'Carbon Trust', TRUE),

('Community Solar Project Share', 'carbon-credits', 100.00, 
 'Invest in local renewable energy projects and earn credits on your energy bill while reducing emissions.', 
 '-250kg CO2', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', 30, 'SolarShare Co', TRUE),

-- Eco Products
('Recycled Material Backpack', 'eco-products', 79.99, 
 'Durable backpack made from 100% recycled ocean plastic. Waterproof and stylish.', 
 '-5kg CO2', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 50, 'EcoGear', TRUE),

('Zero-Waste Starter Kit', 'eco-products', 35.00, 
 'Essential items to begin your zero-waste journey: reusable bags, straws, containers, and utensils.', 
 '-1kg CO2', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400', 75, 'ZeroWaste Hub', TRUE),

('Bamboo Cutlery Set', 'eco-products', 12.99, 
 'Sustainable, biodegradable cutlery set perfect for on-the-go meals. Includes fork, knife, spoon, and carrying case.', 
 '-0.5kg CO2', 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=400', 150, 'BambooEssentials', TRUE),

-- Donation Items
('Donation to Rainforest Alliance', 'donations', 50.00, 
 'Support rainforest conservation and sustainable farming practices to protect biodiversity.', 
 NULL, 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400', 999, 'Rainforest Alliance', TRUE),

('Ocean Cleanup Project', 'donations', 30.00, 
 'Contribute to removing plastic waste from our oceans and protecting marine life.', 
 NULL, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', 999, 'Ocean Cleanup', TRUE),

('Wildlife Habitat Restoration', 'donations', 75.00, 
 'Fund the restoration of wildlife habitats affected by deforestation and climate change.', 
 NULL, 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400', 999, 'Wildlife Foundation', TRUE);
