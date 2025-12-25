import React from 'react';
import WishlistButton from './WishlistButton';

export default function ProductCard({ product, onAddToCart, onViewDetails, showWishlistButton = true }) {
  const typeLabel = (product.category || '').replace('_', ' ').replace('-', ' ');
  const impact = product.carbonOffset || 'Impact';
  const actionId = product.marketplaceItemId || product.id;
  
  // Debug logging
  React.useEffect(() => {
    console.log('ProductCard - Product:', product.id, 'Name:', product.name);
    console.log('ProductCard - Image field:', product.image ? (product.image.substring(0, 50) + '...') : 'NO IMAGE');
  }, [product]);

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop'}
          alt={product.name}
          onError={(e) => {
            console.error('ProductCard - Image load error for product:', product.id, product.name);
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop';
          }}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Wishlist Button */}
        {showWishlistButton && (
          <div className="absolute top-2 right-2">
            <WishlistButton 
              productId={product.id}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 shadow-lg"
            />
          </div>
        )}
        
        {impact && (
          <div className={`absolute ${showWishlistButton ? 'top-12' : 'top-2'} left-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium`}>
            {impact}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
          <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {typeLabel ? typeLabel.toUpperCase() : 'CLIMATE ACTION'}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-600">Estimated impact</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Details
          </button>
          <button
            onClick={() => onAddToCart(actionId)}
            className="flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium bg-green-600 hover:bg-green-700 text-white"
          >
            Support Action
          </button>
        </div>
      </div>
    </div>
  );
}
