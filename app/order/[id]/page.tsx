'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        <p className="text-gray-600">Order # {order.id}</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Information</h3>
              <p className="mt-1 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium mt-2 sm:mt-0 ${
              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
              order.status === 'SHIPPED' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {order.status}
            </span>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Order items */}
            <div className="md:w-1/2">
              <h4 className="text-md font-medium text-gray-900 mb-4">Order Items</h4>
              <ul className="divide-y divide-gray-200">
                {order.order_items.map((item) => (
                  <li key={item.id} className="py-4">
                    <div className="flex">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-200 border-2 border-dashed rounded-md overflow-hidden">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
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
                          <p className="ml-4">${(item.unit_price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <p>Qty: {item.quantity}</p>
                          <p>${item.unit_price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${order.total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <p>Shipping</p>
                  <p>$5.99</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <p>Tax</p>
                  <p>${(order.total * 0.08).toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 mt-2 pt-2 border-t border-gray-200">
                  <p>Total</p>
                  <p>${(order.total + 5.99 + (order.total * 0.08)).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Customer and shipping info */}
            <div className="md:w-1/2">
              <div className="grid grid-cols-1 gap-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">Customer Information</h4>
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Name:</span> {order.customer_name}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Email:</span> {order.customer_email}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{order.shipping_address}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">Order Status</h4>
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Current Status:</span> {order.status}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Order Date:</span> {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );
}