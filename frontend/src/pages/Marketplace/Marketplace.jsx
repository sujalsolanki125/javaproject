import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { marketplaceService } from '../../services/marketplace.service';
import { toast } from 'react-hot-toast';

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([10, 500]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const itemsPerPage = 6;

  // Fetch products
  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, [selectedCategory, priceRange]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const filters = {
        category: selectedCategory,
        minPrice: priceRange[0],
        maxPrice: priceRange[1]
      };
      const data = await marketplaceService.getProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const count = await marketplaceService.getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await marketplaceService.addToCart(productId, 1);
      toast.success('Added to cart successfully!');
      fetchCartCount();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([10, value]);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <DashboardHeader title="Eco Marketplace" />
        
        <div className="p-6">
          {/* Header with Cart Button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Eco Marketplace</h1>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Checkout ({cartCount})
            </button>
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <div className="w-64 bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Products' },
                    { id: 'tree-planting', label: 'Tree Planting' },
                    { id: 'carbon-credits', label: 'Carbon Credits' },
                    { id: 'donations', label: 'Donations' }
                  ].map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-green-100 text-green-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {currentItems.map((product) => (
                      <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                        <img
                          src={product.imageUrl || 'https://via.placeholder.com/400x300?text=Product+Image'}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            {product.carbonOffset && (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                                {product.carbonOffset}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-green-600">
                              ${product.price.toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleAddToCart(product.id)}
                              disabled={product.stock === 0}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                product.stock === 0
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                          </div>
                          {product.stock > 0 && product.stock < 10 && (
                            <p className="text-xs text-red-600 mt-2">
                              Only {product.stock} left in stock!
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => paginate(index + 1)}
                          className={`px-4 py-2 rounded-lg shadow ${
                            currentPage === index + 1
                              ? 'bg-green-600 text-white'
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

