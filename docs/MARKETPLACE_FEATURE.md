# Marketplace Feature Documentation

## Overview
The Marketplace feature allows users to browse and purchase eco-friendly products, carbon offset credits, and support environmental projects through donations.

## Features Implemented

### Frontend (React)
- **Product Browsing**: Grid view of available marketplace items
- **Category Filtering**: Filter by All Products, Tree Planting, Carbon Credits, Donations
- **Price Range Filter**: Slider to filter products by price ($10-$500)
- **Shopping Cart**: Add items to cart with quantity management
- **Cart Counter**: Real-time display of items in cart
- **Pagination**: Navigate through multiple pages of products
- **Stock Display**: Shows stock availability and low stock warnings
- **Responsive Design**: Works on desktop, tablet, and mobile

### Backend (Spring Boot)
- **MarketplaceItem Entity**: Database model for products
  - Fields: id, name, description, price, carbonOffset, category, imageUrl, stock, seller, isActive
  - Timestamps: createdAt, updatedAt
  
- **CartItem Entity**: Shopping cart items
  - Relationships: Many-to-One with User and MarketplaceItem
  - Auto-calculated total price
  
- **MarketplaceService**: Business logic
  - Get all active items
  - Filter by category and/or price range
  - CRUD operations (Create, Read, Update, Delete)
  - Stock management
  
- **CartService**: Shopping cart management
  - Add to cart (with duplicate checking)
  - Update quantity
  - Remove items
  - Clear cart
  - Get cart count and total
  
- **REST API Endpoints**:
  - `GET /api/marketplace/products` - Get all products (with optional filters)
  - `GET /api/marketplace/products/{id}` - Get product by ID
  - `POST /api/marketplace/products` - Create product (Admin)
  - `PUT /api/marketplace/products/{id}` - Update product (Admin)
  - `DELETE /api/marketplace/products/{id}` - Delete product (Admin)
  - `GET /api/cart` - Get user's cart
  - `POST /api/cart/items` - Add item to cart
  - `PUT /api/cart/items/{id}` - Update cart item quantity
  - `DELETE /api/cart/items/{id}` - Remove item from cart
  - `DELETE /api/cart` - Clear entire cart
  - `GET /api/cart/count` - Get cart item count

## Database Schema

### marketplace_items Table
```sql
CREATE TABLE marketplace_items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255) NOT NULL,
    price DECIMAL NOT NULL,
    carbon_offset VARCHAR(255),
    image_url VARCHAR(500),
    stock INTEGER NOT NULL,
    seller VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### cart_items Table
```sql
CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    marketplace_item_id BIGINT NOT NULL REFERENCES marketplace_items(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Sample Data
The system includes 10 pre-populated marketplace items:
1. Plant 10 Mangrove Trees - $25.00 (-50kg CO2)
2. 1 Tonne CO2 Offset Credit - $15.50 (-1 Tonne CO2)
3. Donation to Rainforest Alliance - $50.00
4. Recycled Material Backpack - $79.99 (-5kg CO2)
5. Community Solar Project Share - $100.00 (-250kg CO2)
6. Zero-Waste Starter Kit - $35.00 (-1kg CO2)
7. Ocean Cleanup Project - $30.00
8. Reforestation Carbon Credits - $45.00 (-100kg CO2)
9. Bamboo Cutlery Set - $12.99 (-0.5kg CO2)
10. Wildlife Habitat Restoration - $75.00

## API Usage Examples

### Get All Products
```bash
curl http://localhost:8080/api/marketplace/products
```

### Filter by Category
```bash
curl "http://localhost:8080/api/marketplace/products?category=tree-planting"
```

### Filter by Price Range
```bash
curl "http://localhost:8080/api/marketplace/products?minPrice=10&maxPrice=50"
```

### Add to Cart
```bash
curl -X POST "http://localhost:8080/api/cart/items?marketplaceItemId=1&quantity=2" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Cart
```bash
curl http://localhost:8080/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Frontend Usage

### Import the Service
```javascript
import MarketplaceService from '../../services/marketplace.service';
```

### Fetch Products
```javascript
const products = await MarketplaceService.getProducts({
  category: 'tree-planting',
  minPrice: 10,
  maxPrice: 100
});
```

### Add to Cart
```javascript
await MarketplaceService.addToCart(productId, quantity);
```

## Security
- All cart operations require authentication
- JWT token must be included in Authorization header
- Admin endpoints (create, update, delete products) require ROLE_ADMIN
- Rate limiting applies to all API endpoints

## Future Enhancements
- [ ] Checkout and payment processing (Stripe integration)
- [ ] Order history and tracking
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications for orders
- [ ] Admin dashboard for product management
- [ ] Inventory management alerts
- [ ] Discount codes and promotions
- [ ] Carbon impact tracking from purchases

## Testing
To test the marketplace feature:

1. **Start the backend**: `cd backend && mvn spring-boot:run`
2. **Start the frontend**: `cd frontend && npm run dev`
3. **Login** to your account
4. **Navigate** to Marketplace from the sidebar
5. **Browse** products using category and price filters
6. **Add items** to cart
7. **View cart** count in the header

## Files Created/Modified

### Backend
- ✅ `entity/MarketplaceItem.java` - Updated with carbonOffset and isActive fields
- ✅ `entity/CartItem.java` - Created
- ✅ `dto/MarketplaceItemDTO.java` - Created
- ✅ `dto/CartItemDTO.java` - Created
- ✅ `repository/MarketplaceItemRepository.java` - Updated with filter methods
- ✅ `repository/CartItemRepository.java` - Created
- ✅ `service/MarketplaceService.java` - Created
- ✅ `service/CartService.java` - Created
- ✅ `controller/MarketplaceController.java` - Created
- ✅ `controller/CartController.java` - Created
- ✅ `db/migration/V2__add_marketplace_items.sql` - Created

### Frontend
- ✅ `pages/Marketplace/Marketplace.jsx` - Created
- ✅ `services/marketplace.service.js` - Created
- ✅ `routes/AppRoutes.jsx` - Already configured
- ✅ `components/layout/Sidebar.jsx` - Already has Marketplace link

## Status
✅ **Fully Implemented and Ready for Testing**
