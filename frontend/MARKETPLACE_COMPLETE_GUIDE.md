# Marketplace Feature - Complete Documentation

## Overview
The Marketplace is a comprehensive e-commerce section where users can browse, search, and purchase eco-friendly products, carbon offset credits, and support environmental projects through donations.

## 🎯 Features

### 1. **Product Browsing**
- Grid layout with responsive design (1/2/3 columns based on screen size)
- Product cards with images, descriptions, pricing, and carbon offset information
- Pagination support (9 items per page)
- Real-time stock availability display

### 2. **Advanced Filtering**
- **Category Filter**: 
  - All Products
  - Tree Planting 🌳
  - Carbon Credits 💨
  - Donations 💚
  - Eco Products ♻️
- **Price Range Filter**: $10 - $500 with slider control
- **Search Functionality**: Search by name, description, category, or seller
- **Sort Options**:
  - Name (A-Z)
  - Price (Low to High)
  - Price (High to Low)
  - Carbon Offset (High to Low)

### 3. **Shopping Cart**
- Add products to cart with quantity management
- Real-time cart counter badge
- Update quantities (+/- buttons)
- Remove individual items
- Clear entire cart
- Calculate total price and carbon offset
- Cart persistence across sessions

### 4. **Product Details**
- Full product information modal
- High-quality product images
- Detailed descriptions
- Environmental impact information
- Stock availability status
- Seller information
- Key features and benefits

### 5. **Stats Dashboard**
- Total products available
- Current cart items count
- Active filters indicator
- Visual feedback with gradient cards

## 📁 Component Structure

```
frontend/src/
├── pages/
│   └── Marketplace/
│       └── Marketplace.jsx          # Main marketplace page
├── components/
│   └── marketplace/
│       ├── CartModal.jsx            # Shopping cart modal
│       ├── ProductCard.jsx          # Individual product card
│       ├── ProductDetailsModal.jsx  # Product details modal
│       ├── FilterSidebar.jsx        # Filters sidebar
│       ├── SearchBar.jsx            # Search component
│       └── index.js                 # Component exports
└── services/
    └── marketplace.service.js       # API service layer
```

## 🔧 Components Details

### **Marketplace.jsx** (Main Page)
The main container that orchestrates all marketplace functionality.

**State Management:**
- `products`: Array of all products
- `selectedCategory`: Currently selected category filter
- `priceRange`: Price filter range [min, max]
- `searchQuery`: Current search string
- `sortBy`: Current sort option
- `cartCount`: Number of items in cart
- `currentPage`: Current pagination page
- `isCartOpen`: Cart modal visibility
- `isDetailsOpen`: Product details modal visibility
- `selectedProduct`: Currently viewed product

**Key Functions:**
- `fetchProducts()`: Load products from API with filters
- `fetchCartCount()`: Get current cart item count
- `handleAddToCart()`: Add product to cart
- `filterProductsBySearch()`: Filter products by search query
- `sortProducts()`: Sort products by selected criteria
- `handleResetFilters()`: Reset all filters to default

### **CartModal.jsx**
Full-featured shopping cart modal with CRUD operations.

**Features:**
- Display all cart items with images and details
- Update item quantities
- Remove items from cart
- Clear entire cart
- Calculate totals (price and carbon offset)
- Responsive design

**Props:**
- `isOpen`: Boolean to control modal visibility
- `onClose`: Callback when modal closes
- `onCartUpdate`: Callback to refresh cart count

### **ProductCard.jsx**
Individual product display card with hover effects.

**Features:**
- Product image with hover zoom effect
- Category badge
- Low stock indicator
- Carbon offset badge
- Stock availability
- Add to cart and view details buttons

**Props:**
- `product`: Product object with all details
- `onAddToCart`: Callback when adding to cart
- `onViewDetails`: Callback to view full details

### **ProductDetailsModal.jsx**
Detailed product information modal.

**Features:**
- Large product image
- Full description
- Environmental impact section
- Seller information
- Stock status with warnings
- Key features list
- Add to cart functionality

**Props:**
- `product`: Selected product object
- `isOpen`: Boolean to control modal visibility
- `onClose`: Callback when modal closes
- `onAddToCart`: Callback when adding to cart

### **FilterSidebar.jsx**
Comprehensive filtering sidebar.

**Features:**
- Category selection with icons
- Price range slider
- Reset filters button
- Info box with environmental message
- Sticky positioning

**Props:**
- `selectedCategory`: Currently selected category
- `onCategoryChange`: Callback for category change
- `priceRange`: Current price range
- `onPriceChange`: Callback for price change
- `onReset`: Callback to reset all filters

### **SearchBar.jsx**
Search input with clear functionality.

**Features:**
- Real-time search
- Search icon
- Clear button (appears when typing)
- Placeholder customization

**Props:**
- `onSearch`: Callback with search query
- `placeholder`: Custom placeholder text

## 🔌 API Integration

### Marketplace Service (`marketplace.service.js`)

```javascript
// Get all products with optional filters
getProducts({ category, minPrice, maxPrice })

// Get single product by ID
getProductById(id)

// Cart operations
getCart()
addToCart(marketplaceItemId, quantity)
updateCartItem(cartItemId, quantity)
removeFromCart(cartItemId)
clearCart()
getCartCount()
```

### API Endpoints

```
GET    /api/marketplace/products          # Get all products (with filters)
GET    /api/marketplace/products/{id}     # Get product by ID
POST   /api/marketplace/products          # Create product (Admin)
PUT    /api/marketplace/products/{id}     # Update product (Admin)
DELETE /api/marketplace/products/{id}     # Delete product (Admin)

GET    /api/cart                          # Get user's cart
POST   /api/cart/items                    # Add item to cart
PUT    /api/cart/items/{id}               # Update cart item quantity
DELETE /api/cart/items/{id}               # Remove item from cart
DELETE /api/cart                          # Clear entire cart
GET    /api/cart/count                    # Get cart count
```

## 🎨 Styling & Design

### Color Scheme
- **Primary**: Green (#059669) - Eco-friendly theme
- **Success**: Green shades for positive actions
- **Warning**: Orange for low stock alerts
- **Error**: Red for out of stock
- **Info**: Blue for informational elements

### Gradients
- Green gradient: Product stats
- Blue gradient: Cart stats
- Purple gradient: Filter stats

### Interactive Elements
- Hover effects on cards (shadow increase, image zoom)
- Smooth transitions (300ms)
- Loading spinners
- Toast notifications
- Modal animations

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 1 column grid
- **Tablet** (md): 2 columns grid
- **Desktop** (lg): 3 columns grid

### Mobile Optimizations
- Stack layout for modal content
- Condensed filter sidebar
- Simplified product cards
- Touch-friendly buttons

## 🚀 Usage Example

```jsx
import Marketplace from './pages/Marketplace/Marketplace';

function App() {
  return <Marketplace />;
}
```

## 🔄 User Flow

1. **Browse Products**
   - User lands on marketplace page
   - Views product grid with 9 items per page
   - Sees stats cards at the top

2. **Filter & Search**
   - Selects category from sidebar
   - Adjusts price range slider
   - Types search query
   - Selects sort option
   - Products update in real-time

3. **View Details**
   - Clicks "Details" button on product card
   - Modal opens with full product information
   - Reviews environmental impact
   - Checks stock availability

4. **Add to Cart**
   - Clicks "Add to Cart" button
   - Toast notification confirms action
   - Cart counter updates
   - Can add from card or details modal

5. **Manage Cart**
   - Clicks "View Cart" button
   - Cart modal opens
   - Adjusts quantities with +/- buttons
   - Removes unwanted items
   - Reviews total price and carbon offset

6. **Checkout**
   - Clicks "Checkout" button
   - Proceeds to payment (future implementation)

## 🎯 Key Highlights

### Performance
- Lazy loading of products
- Optimized re-renders with proper state management
- Efficient filtering and sorting algorithms
- Pagination to limit DOM elements

### User Experience
- Instant feedback with toast notifications
- Loading states for async operations
- Empty states for no results
- Error handling with user-friendly messages
- Keyboard navigation support

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard accessible modals
- Screen reader friendly
- High contrast text and buttons

### Environmental Impact
- Visible carbon offset information
- Total carbon offset calculation in cart
- Educational info boxes
- Green color scheme reinforces eco-theme

## 🔐 Security Considerations

- API calls use authenticated endpoints
- User-specific cart data
- Input validation on search and filters
- SQL injection prevention in backend
- XSS protection with React's built-in escaping

## 🐛 Error Handling

- Try-catch blocks around all API calls
- User-friendly error messages via toast
- Fallback UI for loading failures
- Network error detection
- Graceful degradation

## 📈 Future Enhancements

- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Related products suggestions
- [ ] Recently viewed products
- [ ] Social sharing
- [ ] Advanced filtering (ratings, reviews)
- [ ] Product comparison
- [ ] Checkout process
- [ ] Order history
- [ ] Payment integration
- [ ] Email notifications
- [ ] Product recommendations AI
- [ ] Multi-language support
- [ ] Currency conversion

## 🧪 Testing Recommendations

- Unit tests for filtering logic
- Integration tests for API calls
- E2E tests for user flows
- Accessibility testing
- Performance testing
- Cross-browser compatibility
- Mobile device testing

## 📚 Dependencies

- React (UI framework)
- React Hot Toast (notifications)
- Axios (API calls via api.js)
- Tailwind CSS (styling)

## 🎓 Learning Resources

- React Hooks documentation
- Tailwind CSS utilities
- REST API best practices
- E-commerce UX patterns
- Accessibility guidelines (WCAG 2.1)

---

**Built with ❤️ for a sustainable future** 🌍
