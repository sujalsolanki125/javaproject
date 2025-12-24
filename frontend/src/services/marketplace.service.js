import api from './api';

const MarketplaceService = {
  /**
   * Get all products or filter by category and price
   */
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters.minPrice) {
      params.append('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
      params.append('maxPrice', filters.maxPrice);
    }

    const response = await api.get(`/marketplace/products?${params.toString()}`);
    return response.data;
  },

  /**
   * Get product by ID
   */
  getProductById: async (id) => {
    const response = await api.get(`/marketplace/products/${id}`);
    return response.data;
  },

  /**
   * Get cart items
   */
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  /**
   * Add item to cart
   */
  addToCart: async (marketplaceItemId, quantity = 1) => {
    const response = await api.post('/cart/items', null, {
      params: {
        marketplaceItemId,
        quantity
      }
    });
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  updateCartItem: async (cartItemId, quantity) => {
    const response = await api.put(`/cart/items/${cartItemId}`, null, {
      params: { quantity }
    });
    return response.data;
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (cartItemId) => {
    await api.delete(`/cart/items/${cartItemId}`);
  },

  /**
   * Clear entire cart
   */
  clearCart: async () => {
    await api.delete('/cart');
  },

  /**
   * Get cart count
   */
  getCartCount: async () => {
    const response = await api.get('/cart/count');
    return response.data.count;
  }
};

export default MarketplaceService;
