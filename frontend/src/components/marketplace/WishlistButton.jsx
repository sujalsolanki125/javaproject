import React, { useState, useEffect } from 'react';
import { marketplaceService } from '../../services/marketplace.service';
import { toast } from 'react-hot-toast';

export default function WishlistButton({ productId, className = "" }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWishlistStatus();
  }, [productId]);

  const checkWishlistStatus = () => {
    // For now, using localStorage. In a real app, this would be stored in backend
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(wishlist.includes(productId));
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setLoading(true);
    
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (isWishlisted) {
        // Remove from wishlist
        const updatedWishlist = wishlist.filter(id => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        const updatedWishlist = [...wishlist, productId];
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${className} ${
        isWishlisted 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <span className="material-symbols-outlined">
        {isWishlisted ? 'favorite' : 'favorite_border'}
      </span>
    </button>
  );
}