import api from './api';

const marketplaceService = {
  /**
   * Get all products or filter by category and price
   * Fetches from marketplace_items table (synced from admin catalog)
   */
  getProducts: async (filters = {}) => {
    // Fetch active admin items directly without filtering
    const response = await api.get('/api/catalog/products');
    let products = response.data || [];

    // Apply price filters if provided
    if (filters.minPrice) {
      products = products.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      products = products.filter(p => p.price <= filters.maxPrice);
    }

    return products;
  },

  /**
   * Get product by ID
   * Fetches from marketplace_items table
   */
  getProductById: async (id) => {
    const response = await api.get(`/api/catalog/products/${id}`);
    return response.data;
  },

  /**
   * Get cart items
   */
  getCart: async () => {
    const response = await api.get('/api/cart');
    const data = response.data || {};
    const items = Array.isArray(data.items) ? data.items : [];
    // Map DTO to UI shape expected by CartModal (marketplaceItem nested)
    return items.map(dto => ({
      id: dto.id,
      quantity: dto.quantity,
      totalPrice: dto.totalPrice,
      marketplaceItem: {
        id: dto.marketplaceItemId,
        name: dto.itemName,
        description: dto.itemDescription,
        price: dto.itemPrice,
        carbonOffset: dto.carbonOffset,
        image: dto.image || dto.imageUrl,
      },
    }));
  },

  /**
   * Add item to cart
   */
  addToCart: async (marketplaceItemId, quantity = 1) => {
    const response = await api.post('/api/cart/items', null, {
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
    const response = await api.put(`/api/cart/items/${cartItemId}`, null, {
      params: { quantity }
    });
    return response.data;
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (cartItemId) => {
    await api.delete(`/api/cart/items/${cartItemId}`);
  },

  /**
   * Clear entire cart
   */
  clearCart: async () => {
    await api.delete('/api/cart');
  },

  /**
   * Get cart count
   */
  getCartCount: async () => {
    const response = await api.get('/api/cart/count');
    return response.data.count;
  },

  /**
   * Create transaction (place order)
   */
  createTransaction: async (itemId, quantity) => {
    const response = await api.post('/api/transactions', {
      itemId,
      quantity
    });
    return response.data;
  },

  /**
   * Get user's order history
   */
  getOrders: async () => {
    const response = await api.get('/api/transactions');
    return response.data;
  },

  /**
   * Get order by ID
   */
  getOrderById: async (id) => {
    const response = await api.get(`/api/transactions/${id}`);
    return response.data;
  }
};

export { marketplaceService };
export default marketplaceService;
