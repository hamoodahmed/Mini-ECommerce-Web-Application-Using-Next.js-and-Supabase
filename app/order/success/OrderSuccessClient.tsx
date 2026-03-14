'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url?: string;
}

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  product: Product;
}

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  order_items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-red-600">{error}</p>
          <a
            href="/"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Order not found</p>
          <a
            href="/"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <svg
            className="h-10 w-10 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-xl text-gray-600">Thank you for your order, <span className="font-semibold">{order.customer_name}</span>!</p>
        <p className="text-gray-500 mt-2">Your order #{order.id} has been successfully placed</p>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-12">
        <div className="px-8 py-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
              <p className="mt-2 text-gray-600">Order # {order.id}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-2">
                {order.status}
              </span>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Order items */}
            <div className="lg:w-1/2">
              <h4 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">Order Items</h4>
              <ul className="divide-y divide-gray-200">
                {order.order_items.map((item) => (
                  <li key={item.id} className="py-6 flex">
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="ml-6 flex-1">
                      <div className="flex justify-between text-lg font-medium text-gray-900">
                        <h3 className="truncate max-w-[140px]">{item.product.name}</h3>
                        <p className="font-bold text-lg">${(item.unit_price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <p>Qty: {item.quantity}</p>
                        <p>${item.unit_price.toFixed(2)} each</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex justify-between text-lg font-medium text-gray-900">
                  <p className="text-gray-600">Subtotal</p>
                  <p>${order.total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 mt-3 pt-3 border-t border-gray-200">
                  <p>Order Total</p>
                  <p>${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Shipping info */}
            <div className="lg:w-1/2">
              <h4 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">Shipping Information</h4>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer Name</p>
                    <p className="text-lg font-medium text-gray-900">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-medium text-gray-900">{order.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shipping Address</p>
                    <p className="text-lg font-medium text-gray-900 whitespace-pre-line">{order.shipping_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Status</p>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-base font-medium bg-green-100 text-green-800">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Estimated Delivery</h4>
                <p className="text-gray-600">
                  Your order will be delivered within <span className="font-semibold">3-5 business days</span>.
                  You will receive tracking information via email once your order ships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a
          href="/"
          className="flex justify-center items-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200"
        >
          Continue Shopping
        </a>
        <a
          href={`/order/${order.id}`}
          className="flex justify-center items-center px-8 py-4 border border-gray-300 text-lg font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors duration-200"
        >
          View Order Details
        </a>
      </div>
    </div>
  );
}

export default function OrderSuccessClient() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">Loading order...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}