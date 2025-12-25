import { useState, useEffect } from 'react';
import { marketplaceService } from '../../services/marketplace.service';
import api from '../../services/api';
import ProductModal from '../../components/admin/ProductModal';
import { toast } from 'react-hot-toast';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch actions from marketplace API and normalize to action fields
      const fetchedProducts = await marketplaceService.getProducts();

      const formattedProducts = (fetchedProducts || []).map(product => ({
        id: product.id,
        name: product.name || 'Climate Action',
        description: product.description || 'Environmental contribution',
        price: product.price || 0,
        itemType: product.itemType || product.category || 'tree_planting',
        carbonOffset: product.carbonOffset || product.estimatedOffset || '',
        image: product.image || product.imageUrl || '/api/placeholder/300/200',
        status: product.status || 'active',
        createdAt: product.createdAt || new Date().toISOString().split('T')[0]
      }));
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/admin/products/${productId}`);
        setProducts(products.filter(p => p.id !== productId));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Failed to delete product:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Failed to delete product';
        toast.error(errorMsg);
      }
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      const newStatusEnum = currentStatus === 'active' ? 'INACTIVE' : 'ACTIVE';
      await api.patch(`/api/admin/products/${productId}/status`, null, { params: { status: newStatusEnum } });
      // Refresh list
      const refreshed = await marketplaceService.getProducts();
      setProducts((refreshed || []).map(product => ({
        id: product.id,
        name: product.name || 'Climate Action',
        description: product.description || 'Environmental contribution',
        price: product.price || 0,
        itemType: product.itemType || product.category || 'tree_planting',
        carbonOffset: product.carbonOffset || product.estimatedOffset || '',
        image: product.image || product.imageUrl || '/api/placeholder/300/200',
        status: product.status || 'active',
        createdAt: product.createdAt || new Date().toISOString().split('T')[0]
      })));
    } catch (error) {
      console.error('Failed to update product status:', error);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (selectedProduct) {
        // Map to AdminProductCatalog payload and update
        const payload = {
          productDisplayName: productData.name,
          productDetailedDescription: productData.description,
          productSellingPrice: Number(productData.price) || 0,
          productCategoryType: productData.itemType,
          availableInventoryCount: 1,
          productImagePath: productData.image,
          co2EmissionOffset: productData.carbonOffset,
          catalogStatus: (productData.status || 'active').toUpperCase(),
        };
        await api.put(`/api/admin/products/${selectedProduct.id}`, payload);
        const refreshed = await marketplaceService.getProducts();
        setProducts((refreshed || []).map(product => ({
          id: product.id,
          name: product.name || 'Climate Action',
          description: product.description || 'Environmental contribution',
          price: product.price || 0,
          itemType: product.itemType || product.category || 'tree_planting',
          carbonOffset: product.carbonOffset || product.estimatedOffset || '',
          image: product.image || product.imageUrl || '/api/placeholder/300/200',
          status: product.status || 'active',
          createdAt: product.createdAt || new Date().toISOString().split('T')[0]
        })));
      } else {
        // Map to AdminProductCatalog payload and create
        const payload = {
          productDisplayName: productData.name,
          productDetailedDescription: productData.description,
          productSellingPrice: Number(productData.price) || 0,
          productCategoryType: productData.itemType,
          availableInventoryCount: 1,
          productImagePath: productData.image,
          co2EmissionOffset: productData.carbonOffset,
          catalogStatus: (productData.status || 'active').toUpperCase(),
        };
        await api.post('/api/admin/products', payload);
        const refreshed = await marketplaceService.getProducts();
        setProducts((refreshed || []).map(product => ({
          id: product.id,
          name: product.name || 'Climate Action',
          description: product.description || 'Environmental contribution',
          price: product.price || 0,
          itemType: product.itemType || product.category || 'tree_planting',
          carbonOffset: product.carbonOffset || product.estimatedOffset || '',
          image: product.image || product.imageUrl || '/api/placeholder/300/200',
          status: product.status || 'active',
          createdAt: product.createdAt || new Date().toISOString().split('T')[0]
        })));
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || product.itemType === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'offset': {
          const aMatch = a.carbonOffset ? a.carbonOffset.match(/[\d.]+/) : null;
          const bMatch = b.carbonOffset ? b.carbonOffset.match(/[\d.]+/) : null;
          const aVal = aMatch ? parseFloat(aMatch[0]) : 0;
          const bVal = bMatch ? parseFloat(bMatch[0]) : 0;
          return bVal - aVal;
        }
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
  const actionTypes = [...new Set(products.map(p => p.itemType))];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Action Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage climate actions (tree planting, carbon credits)</p>
          </div>
          <button
            onClick={handleCreateProduct}
            className="mt-4 sm:mt-0 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center"
          >
            <span className="material-symbols-outlined mr-2">add</span>
            Add Action
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Action Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              {actionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="offset">Estimated CO2e Impact</option>
              <option value="date">Date Created</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={product.image || 'https://via.placeholder.com/300x200?text=Climate+Action'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {product.name}
                </h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  product.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                }`}>
                  {product.status}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-primary">${product.price}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.carbonOffset || 'Impact N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs font-medium rounded">
                  {product.itemType}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleStatus(product.id, product.status)}
                    className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    title={product.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {product.status === 'active' ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-1 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">eco</span>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No actions found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}