# 🚀 Marketplace Quick Reference

## Component Import Guide

```javascript
// Import individual components
import CartModal from '../../components/marketplace/CartModal';
import ProductCard from '../../components/marketplace/ProductCard';
import ProductDetailsModal from '../../components/marketplace/ProductDetailsModal';
import FilterSidebar from '../../components/marketplace/FilterSidebar';
import SearchBar from '../../components/marketplace/SearchBar';

// Or import all at once
import {
  CartModal,
  ProductCard,
  ProductDetailsModal,
  FilterSidebar
} from '../../components/marketplace';
```

## Component Usage Examples

### 1. CartModal
```jsx
<CartModal
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
  onCartUpdate={fetchCartCount}
/>
```

### 2. ProductCard
```jsx
<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
  onViewDetails={handleViewDetails}
/>
```

### 3. ProductDetailsModal
```jsx
<ProductDetailsModal
  product={selectedProduct}
  isOpen={isDetailsOpen}
  onClose={() => setIsDetailsOpen(false)}
  onAddToCart={handleAddToCart}
/>
```

### 4. FilterSidebar
```jsx
<FilterSidebar
  selectedCategory={selectedCategory}
  onCategoryChange={handleCategoryChange}
  priceRange={priceRange}
  onPriceChange={handlePriceChange}
  onReset={handleResetFilters}
/>
```

### 5. SearchBar
```jsx
<SearchBar
  onSearch={handleSearch}
  placeholder="Search products..."
/>
```

## Service Functions

```javascript
import { marketplaceService } from '../../services/marketplace.service';

// Fetch products with filters
const products = await marketplaceService.getProducts({
  category: 'tree-planting',
  minPrice: 10,
  maxPrice: 100
});

// Get single product
const product = await marketplaceService.getProductById(123);

// Cart operations
const cart = await marketplaceService.getCart();
await marketplaceService.addToCart(productId, 2);
await marketplaceService.updateCartItem(cartItemId, 5);
await marketplaceService.removeFromCart(cartItemId);
await marketplaceService.clearCart();
const count = await marketplaceService.getCartCount();
```

## Common Patterns

### Add to Cart Handler
```javascript
const handleAddToCart = async (productId) => {
  try {
    await marketplaceService.addToCart(productId, 1);
    toast.success('Added to cart successfully!');
    fetchCartCount(); // Update cart counter
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error('Failed to add to cart');
  }
};
```

### Fetch Products with Filters
```javascript
const fetchProducts = async () => {
  setLoading(true);
  try {
    const filters = {
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    };
    const data = await marketplaceService.getProducts(filters);
    setProducts(data);
  } catch (error) {
    toast.error('Failed to load products');
  } finally {
    setLoading(false);
  }
};
```

### Search Filter
```javascript
const filterProductsBySearch = (products) => {
  if (!searchQuery.trim()) return products;
  
  const query = searchQuery.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  );
};
```

### Sort Products
```javascript
const sortProducts = (products) => {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
};
```

## State Management

```javascript
// Essential state for marketplace
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedCategory, setSelectedCategory] = useState('all');
const [priceRange, setPriceRange] = useState([10, 500]);
const [searchQuery, setSearchQuery] = useState('');
const [sortBy, setSortBy] = useState('name');
const [cartCount, setCartCount] = useState(0);
const [currentPage, setCurrentPage] = useState(1);

// Modal states
const [isCartOpen, setIsCartOpen] = useState(false);
const [isDetailsOpen, setIsDetailsOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
```

## Pagination Logic

```javascript
const itemsPerPage = 9;
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(products.length / itemsPerPage);

const paginate = (pageNumber) => setCurrentPage(pageNumber);
```

## Styling Classes Reference

### Buttons
```
Primary:    bg-green-600 hover:bg-green-700 text-white
Secondary:  bg-gray-100 hover:bg-gray-200 text-gray-700
Danger:     bg-red-100 hover:bg-red-200 text-red-700
Disabled:   bg-gray-300 text-gray-500 cursor-not-allowed
```

### Cards
```
Basic:      bg-white rounded-lg shadow
Hover:      hover:shadow-lg transition-shadow
Stats:      bg-gradient-to-r from-green-500 to-green-600
```

### Badges
```
Success:    bg-green-100 text-green-700
Warning:    bg-orange-100 text-orange-700
Error:      bg-red-100 text-red-700
Info:       bg-blue-100 text-blue-700
```

## Category Options

```javascript
const categories = [
  { id: 'all', label: 'All Products', icon: '🌍' },
  { id: 'tree-planting', label: 'Tree Planting', icon: '🌳' },
  { id: 'carbon-credits', label: 'Carbon Credits', icon: '💨' },
  { id: 'donations', label: 'Donations', icon: '💚' },
  { id: 'eco-products', label: 'Eco Products', icon: '♻️' }
];
```

## Product Object Structure

```javascript
{
  id: number,
  name: string,
  description: string,
  price: number,
  carbonOffset: string | null,  // e.g., "-50kg CO2"
  category: string,              // e.g., "tree-planting"
  imageUrl: string,
  stock: number,
  seller: string,
  isActive: boolean,
  createdAt: string,
  updatedAt: string
}
```

## Cart Item Object Structure

```javascript
{
  id: number,
  quantity: number,
  marketplaceItem: {
    // Full product object
  },
  createdAt: string,
  updatedAt: string
}
```

---

**Quick tip:** Always wrap API calls in try-catch and provide user feedback with toast notifications!
