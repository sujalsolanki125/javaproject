import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { marketplaceService } from '../../services/marketplace.service';
import { toast } from 'react-hot-toast';
import ProductCard from '../../components/marketplace/ProductCard';
import ProductDetailsModal from '../../components/marketplace/ProductDetailsModal';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchWishlistItems();
    
    // Listen for wishlist changes
    const handleStorageChange = () => {
      fetchWishlistItems();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchWishlistItems = async () => {
    setLoading(true);
    try {
      const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (wishlistIds.length === 0) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      // Fetch all products and filter by wishlist IDs
      const allProducts = await marketplaceService.getProducts();
      const wishlistProducts = allProducts.filter(product => 
        wishlistIds.includes(product.id)
      );
      
      setWishlistItems(wishlistProducts);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await marketplaceService.addToCart(productId, 1);
      toast.success('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleRemoveFromWishlist = (productId) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updatedWishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    fetchWishlistItems();
    toast.success('Removed from wishlist');
  };

  const clearWishlist = () => {
    localStorage.removeItem('wishlist');
    setWishlistItems([]);
    toast.success('Wishlist cleared');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <DashboardHeader title="My Wishlist" />
        
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
              </p>
            </div>
            
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading wishlist...</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-gray-400">favorite_border</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-4">Save products you love to buy them later</p>
              <a
                href="/marketplace"
                className="inline-flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <span className="material-symbols-outlined mr-2">shopping_cart</span>
                Browse Marketplace
              </a>
            </div>
          ) : (
            <>
              {/* Wishlist Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {wishlistItems.map((product) => (
                  <div key={product.id} className="relative">
                    {/* Remove from wishlist button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="absolute top-3 right-3 z-10 bg-white text-red-500 hover:text-red-600 p-2 rounded-full shadow-lg transition-colors"
                      title="Remove from wishlist"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                    
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewDetails={handleViewDetails}
                      showWishlistButton={false} // Don't show wishlist button since we have remove button
                    />
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      // Add all wishlist items to cart
                      wishlistItems.forEach(product => {
                        handleAddToCart(product.id);
                      });
                    }}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                    Add All to Cart
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/marketplace'}
                    className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    Continue Shopping
                  </button>
                  
                  <button
                    onClick={() => {
                      const productNames = wishlistItems.map(p => p.name).join(', ');
                      const shareText = `Check out these eco-friendly products I'm interested in: ${productNames}`;
                      if (navigator.share) {
                        navigator.share({
                          title: 'My CarbonCalc Wishlist',
                          text: shareText,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
                        toast.success('Wishlist link copied to clipboard!');
                      }
                    }}
                    className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="material-symbols-outlined">share</span>
                    Share Wishlist
                  </button>
                </div>
              </div>

              {/* Wishlist Stats */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ${wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-green-700">Total Value</div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {wishlistItems.filter(item => item.carbonOffset).length}
                  </div>
                  <div className="text-sm text-blue-700">Carbon Offset Items</div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(wishlistItems.map(item => item.category)).size}
                  </div>
                  <div className="text-sm text-purple-700">Categories</div>
                </div>
              </div>
            </>
          )}

          {/* Product Details Modal */}
          <ProductDetailsModal
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            product={selectedProduct}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}