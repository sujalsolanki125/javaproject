import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { marketplaceService } from '../../services/marketplace.service';
import { toast } from 'react-hot-toast';
// Cart and checkout flows removed for simulated contributions
import ProductCard from '../../components/marketplace/ProductCard';
import ProductDetailsModal from '../../components/marketplace/ProductDetailsModal';
import SearchBar from '../../components/marketplace/SearchBar';

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([5, 250]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // Removed cart state for simulation-only contributions
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 9;

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Fetch all products without any filters - show exactly what admin has listed
      const data = await marketplaceService.getProducts({});
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Cart count removed

  const handleSupportAction = async (marketplaceItemId) => {
    try {
      if (!marketplaceItemId) {
        toast.error('This action is not available');
        return;
      }
      await marketplaceService.createTransaction(marketplaceItemId, 1);
      toast.success('Contribution recorded (simulated).');
    } catch (error) {
      console.error('Error recording contribution:', error);
      toast.error('Failed to record contribution');
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchProducts();
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([10, value]);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setPriceRange([10, 500]);
    setSortBy('name');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // No filtering - display all products from admin catalog
  const filterProductsBySearch = (products) => {
    return products;
  };

  // Sort products
  const sortProducts = (products) => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'offset':
        return sorted.sort((a, b) => {
          const matchA = a.carbonOffset ? a.carbonOffset.match(/[\d.]+/) : null;
          const matchB = b.carbonOffset ? b.carbonOffset.match(/[\d.]+/) : null;
          const offsetA = matchA ? parseFloat(matchA[0]) : 0;
          const offsetB = matchB ? parseFloat(matchB[0]) : 0;
          return offsetB - offsetA;
        });
      default:
        return sorted;
    }
  };

  // Pagination
  const filteredProducts = filterProductsBySearch(products);
  const sortedProducts = sortProducts(filteredProducts);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <DashboardHeader title="Eco Marketplace" />
        
        <div className="p-6">
          {/* Header with stats and simulation note */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Climate Action Marketplace</h1>
              <p className="text-gray-600 mt-1">Support tree planting and carbon offset actions after understanding your footprint</p>
              <div className="mt-3 text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded px-3 py-2 max-w-xl">
                Prices shown are simulated contribution values for educational impact. No real payments, billing, or invoices.
              </div>
            </div>
            {/* Cart removed */}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Available Actions</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            {/* Cart stats removed */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Active Filters</p>
                  <p className="text-2xl font-bold">
                    {(selectedCategory !== 'all' ? 1 : 0) + (priceRange[1] !== 500 ? 1 : 0) + (searchQuery ? 1 : 0)}
                  </p>
                </div>
                <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} placeholder="Search actions by name, description, or type..." />
          </div>

          <div>
            {/* Products Grid */}
            <div className="w-full">
              {/* Sort and Results Info */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedProducts.length)} of {sortedProducts.length} products
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price (Low to High)</option>
                    <option value="price-high">Price (High to Low)</option>
                    <option value="offset">Estimated CO2e Impact (High to Low)</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-500 text-lg mb-2">No actions found</p>
                  <p className="text-gray-400 mb-4">Try adjusting your filters</p>
                  <button
                    onClick={handleResetFilters}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {currentItems.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleSupportAction}
                        onViewDetails={handleViewDetails}
                      />
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

      {/* Modals */}
      {/* Cart modal removed for simulation-only contributions */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onSupportAction={handleSupportAction}
      />
    </div>
  );
}

