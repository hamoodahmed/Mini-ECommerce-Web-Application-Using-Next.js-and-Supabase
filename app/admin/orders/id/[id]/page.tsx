'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: Product;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  orderItems: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            // Handle 404 in component
          }
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const updateOrderStatus = async (newStatus: string) => {
    setUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order status');
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!order) {
    return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Order not found</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600">Order #{order.id}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'PAID' ? 'bg-green-100 text-green-800' :
              order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {order.status}
            </span>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="divide-y divide-gray-200">
                  {order.orderItems.map((item) => (
                    <li key={item.id} className="py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 border-2 border-dashed rounded-md overflow-hidden">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex-1">
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.product.name}</h3>
                            <p className="ml-4">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <p>Qty: {item.quantity}</p>
                            <p>${item.unitPrice.toFixed(2)} each</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${order.total.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                    <p>Order Total</p>
                    <p>${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer and Order Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Information</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1 text-sm text-gray-900">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-sm text-gray-900">{order.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Shipping Address</p>
                    <p className="mt-1 text-sm text-gray-900">{order.shippingAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order Date</p>
                    <p className="mt-1 text-sm text-gray-900">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Update Status</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <p>Current Status: <span className="font-medium text-gray-900">{order.status}</span></p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateOrderStatus('PENDING')}
                      disabled={updating || order.status === 'PENDING'}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        order.status === 'PENDING'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => updateOrderStatus('PAID')}
                      disabled={updating || order.status === 'PAID'}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        order.status === 'PAID'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      Paid
                    </button>
                    <button
                      onClick={() => updateOrderStatus('SHIPPED')}
                      disabled={updating || order.status === 'SHIPPED'}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        order.status === 'SHIPPED'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      Shipped
                    </button>
                    <button
                      onClick={() => updateOrderStatus('CANCELLED')}
                      disabled={updating || order.status === 'CANCELLED'}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        order.status === 'CANCELLED'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}