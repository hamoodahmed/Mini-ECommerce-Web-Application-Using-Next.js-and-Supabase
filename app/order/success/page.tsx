'use client';

import { useEffect, useState } from 'react';
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

export default function OrderSuccessPage() {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
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
        <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Order Confirmed!</h1>
        <p className="mt-2 text-lg text-gray-500">Thank you for your order, {order.customer_name}!</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Order Details</h3>
            <p className="text-sm font-medium text-gray-900">Order # {order.id}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{order.created_at}</p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Order items */}
            <div className="md:w-1/2">
              <h4 className="text-md font-medium text-gray-900 mb-4">Order Items</h4>
              <ul className="divide-y divide-gray-200">
                {order.order_items.map((item) => (
                  <li key={item.id} className="py-4 flex">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 border-2 border-dashed rounded-md overflow-hidden">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
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

            {/* Shipping info */}
            <div className="md:w-1/2">
              <h4 className="text-md font-medium text-gray-900 mb-4">Shipping Information</h4>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Name:</span> {order.customer_name}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Email:</span> {order.customer_email}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-medium">Address:</span> {order.shipping_address}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-medium">Status:</span> <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{order.status}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <a
          href="/"
          className="flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 sm:px-8"
        >
          Continue Shopping
        </a>
        <a
          href={`/order/${order.id}`}
          className="flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 sm:px-8"
        >
          View Order Details
        </a>
      </div>
    </div>
  );
}