'use client';

import { useCart } from '@/context/cart-context';
import Link from 'next/link';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartItemCount } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Shopping Cart</h1>
      <p className="text-gray-600 mb-8">Review and manage items in your cart</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="lg:w-2/3">
          {cart.items.length === 0 ? (
            <div className="bg-white shadow-lg rounded-2xl p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet</p>
              <Link
                href="/products"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <li key={item.id} className="py-8 px-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="ml-6 flex-1 flex flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                            <p className="mt-1 text-gray-500">${item.price.toFixed(2)} each</p>
                          </div>
                          <p className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <label htmlFor={`quantity-${item.id}`} className="mr-3 text-gray-700 font-medium">
                              Qty:
                            </label>
                            <select
                              id={`quantity-${item.id}`}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                              className="rounded-lg border border-gray-300 py-2 px-3 text-base focus:border-blue-500 focus:ring-blue-500 min-w-[80px]"
                            >
                              {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center text-red-600 hover:text-red-800 font-medium"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Order summary */}
        {cart.items.length > 0 && (
        <div className="lg:w-1/3">
          <div className="bg-white shadow-lg rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Subtotal ({cartItemCount} items)</p>
                <p className="font-medium text-gray-900">${cartTotal.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Shipping estimate</p>
                <p className="font-medium text-gray-900">$5.99</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Tax estimate</p>
                <p className="font-medium text-gray-900">${(cartTotal * 0.08).toFixed(2)}</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-gray-900">Order total</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${(cartTotal + 5.99 + cartTotal * 0.08).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl shadow-lg py-4 px-6 text-lg font-bold text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                Proceed to Checkout
              </Link>
            </div>

            <div className="text-center text-gray-500 text-sm">
              <p>
                or{' '}
                <Link href="/products" className="text-blue-600 font-medium hover:text-blue-700">
                  Continue Shopping <span aria-hidden="true">&rarr;</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}