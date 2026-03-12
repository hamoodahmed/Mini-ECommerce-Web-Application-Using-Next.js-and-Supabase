'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  // Initialize cart with mock data
  useEffect(() => {
    const mockCart = [
      {
        id: 1,
        productId: 1,
        name: 'Wireless Headphones',
        price: 99.99,
        quantity: 1,
        image: '/placeholder-product.jpg',
        product: {
          id: 1,
          name: 'Wireless Headphones',
          price: 99.99,
          image: '/placeholder-product.jpg',
          description: 'High-quality wireless headphones with noise cancellation',
          category: 'Electronics',
          rating: 4.5
        }
      },
      {
        id: 2,
        productId: 3,
        name: 'Coffee Mug',
        price: 12.99,
        quantity: 2,
        image: '/placeholder-product.jpg',
        product: {
          id: 3,
          name: 'Coffee Mug',
          price: 12.99,
          image: '/placeholder-product.jpg',
          description: 'Ceramic coffee mug with custom design',
          category: 'Home',
          rating: 4.7
        }
      }
    ];

    setCartItems(mockCart);
    setIsCartEmpty(mockCart.length === 0);
  }, []);

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 mr-8">
            MiniShop
          </Link>
          <Link href="/products" className="flex items-center text-gray-700 hover:text-blue-600">
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

        {isCartEmpty ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <Link
              href="/products"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {cartItems.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 last:border-b-0">
                    <div className="p-6 flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mr-6" />

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-gray-600">${item.price}</p>

                        <div className="mt-2 flex items-center">
                          <span className="mr-3">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="mt-2 text-red-500 hover:text-red-700 flex items-center"
                        >
                          <FaTrash className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 text-center block"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}