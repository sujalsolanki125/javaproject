import React from 'react';

export default function FilterSidebar({ 
  selectedCategory, 
  onCategoryChange, 
  priceRange, 
  onPriceChange,
  onReset 
}) {
  const categories = [
    { id: 'all', label: 'All Actions', icon: '🌍' },
    { id: 'tree_planting', label: 'Tree Planting', icon: '🌳' },
    { id: 'carbon_credit', label: 'Carbon Offsets', icon: '💨' }
  ];

  return (
    <div className="w-64 bg-white rounded-lg shadow p-4 sticky top-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={onReset}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Reset
        </button>
      </div>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-gray-700">Action Type</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {/* Filtering disabled - shows all admin products */}}
              disabled
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed ${
                selectedCategory === category.id
                  ? 'bg-green-100 text-green-700 font-medium'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="font-medium mb-3 text-gray-700">Contribution Range</h3>
        <div className="px-2">
          <input
            type="range"
            min="5"
            max="250"
            step="5"
            value={priceRange[1]}
            onChange={() => {/* Filtering disabled */}}
            disabled
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-not-allowed opacity-50"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-3">
            <span className="font-medium">${priceRange[0]}</span>
            <span className="font-medium">${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-medium text-green-800 mb-1">Make an Impact</h4>
        <p className="text-sm text-green-700">
          Each support action funds tree planting or carbon offsets—no shipping, just climate impact.
        </p>
      </div>
    </div>
  );
}
