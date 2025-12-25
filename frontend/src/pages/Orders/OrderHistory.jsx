import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { marketplaceService } from '../../services/marketplace.service';
import { toast } from 'react-hot-toast';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersData = await marketplaceService.getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <DashboardHeader title="Order History" />
        
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Orders</h1>
            <p className="text-gray-600">Track and manage your eco-friendly purchases</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-gray-400">receipt_long</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Start shopping for eco-friendly products</p>
              <a
                href="/marketplace"
                className="inline-flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <span className="material-symbols-outlined mr-2">shopping_cart</span>
                Browse Marketplace
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Order #{order.id}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                          >
                            {order.status || 'Pending'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">attach_money</span>
                            ${order.totalAmount?.toFixed(2)}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">shopping_bag</span>
                            {order.quantity} item{order.quantity !== 1 ? 's' : ''}
                          </div>
                        </div>

                        {/* Order Item Preview */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-400">eco</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {order.marketplaceItem?.name || 'Eco Product'}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {order.quantity} × ${order.marketplaceItem?.price?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button className="ml-4 text-gray-400 hover:text-gray-600">
                        <span
                          className={`material-symbols-outlined transition-transform ${
                            selectedOrder?.id === order.id ? 'rotate-180' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {selectedOrder?.id === order.id && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Product Details */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Product Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Product:</span>
                                <span className="font-medium">{order.marketplaceItem?.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Category:</span>
                                <span className="capitalize">{order.marketplaceItem?.category}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Price per item:</span>
                                <span>${order.marketplaceItem?.price?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Quantity:</span>
                                <span>{order.quantity}</span>
                              </div>
                              {order.marketplaceItem?.carbonOffset && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Carbon Offset:</span>
                                  <span className="text-green-600 font-medium">
                                    {order.marketplaceItem.carbonOffset}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span>${order.totalAmount?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Shipping:</span>
                                <span className="text-green-600">Free</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                                <span>Total:</span>
                                <span>${order.totalAmount?.toFixed(2)}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 space-y-2">
                              <button className="w-full text-left text-sm text-green-600 hover:text-green-700 font-medium">
                                Track Order
                              </button>
                              <button className="w-full text-left text-sm text-gray-600 hover:text-gray-700 font-medium">
                                Download Invoice
                              </button>
                              {(order.status === 'pending' || !order.status) && (
                                <button className="w-full text-left text-sm text-red-600 hover:text-red-700 font-medium">
                                  Cancel Order
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Environmental Impact */}
                        {order.marketplaceItem?.carbonOffset && (
                          <div className="mt-6 p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="material-symbols-outlined text-green-600">eco</span>
                              <h4 className="font-semibold text-green-800">Environmental Impact</h4>
                            </div>
                            <p className="text-sm text-green-700">
                              This purchase helps offset <strong>{order.marketplaceItem.carbonOffset}</strong> of carbon emissions. 
                              Thank you for choosing eco-friendly products!
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}