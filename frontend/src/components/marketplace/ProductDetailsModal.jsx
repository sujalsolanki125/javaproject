import React from 'react';
import { X, Check, Leaf, Award, Package } from 'lucide-react';

export default function ProductDetailsModal({ product, isOpen, onClose, onSupportAction }) {
  if (!isOpen || !product) return null;

  const categoryLabel = (product.category || '').replace('_', ' ').toUpperCase();
  const impact = product.carbonOffset || 'Impact';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden transform transition-all animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex flex-col lg:flex-row max-h-[90vh]">
          {/* Product Image Section */}
          <div className="lg:w-1/2 relative bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
            <div className="w-full h-full max-h-[400px] lg:max-h-[500px] flex items-center justify-center p-6">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=600&fit=crop'}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=600&fit=crop';
                }}
                className="max-w-full max-h-full object-contain"
              />
              {/* Category Badge Overlay */}
              <div className="absolute top-6 left-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-green-700 text-sm font-semibold rounded-full shadow-lg">
                  <Leaf className="w-4 h-4" />
                  {categoryLabel}
                </span>
              </div>
              {/* Impact Badge */}
              {product.carbonOffset && (
                <div className="absolute top-6 right-6">
                  <div className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg font-bold flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Impact: {impact}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:w-1/2 flex flex-col max-h-[95vh] lg:max-h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
              <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">${product.price?.toFixed(2) || '0.00'}</span>
                <span className="text-green-100 text-sm">Simulated contribution</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Environmental Impact - Featured */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-green-600" />
                  Environmental Impact
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-600 rounded-full p-1 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Carbon Offset: {product.carbonOffset || 'Impact'}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        By purchasing this product, you'll help reduce carbon emissions and support environmental sustainability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Information */}
              {product.seller && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Seller</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 font-medium">{product.seller}</p>
                  </div>
                </div>
              )}

              {/* Availability */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  Availability
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700 font-medium">Available for simulated support (no shipping)</p>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                    <div className="bg-green-100 rounded-full p-1 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Eco-friendly and sustainable</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                    <div className="bg-green-100 rounded-full p-1 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Supports environmental initiatives</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                    <div className="bg-green-100 rounded-full p-1 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Verified carbon offset impact</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Button - Fixed at bottom */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => {
                  onSupportAction(product.marketplaceItemId || product.id);
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Leaf className="w-5 h-5" />
                Support This Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
