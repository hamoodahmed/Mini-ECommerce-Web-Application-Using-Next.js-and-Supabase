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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="lg:w-2/3">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item.id}>
                  <div className="py-6 px-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 border-2 border-dashed rounded-md overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm">
                          <div className="flex items-center">
                            <label htmlFor={`quantity-${item.id}`} className="mr-2 text-gray-700">
                              Qty
                            </label>
                            <select
                              id={`quantity-${item.id}`}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                              className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 focus:outline-none focus:ring-blue-500 sm:text-sm"
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
                            className="font-medium text-red-600 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-6 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">${cartTotal.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Shipping estimate</p>
                  <p className="text-sm font-medium text-gray-900">$5.99</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Tax estimate</p>
                  <p className="text-sm font-medium text-gray-900">${(cartTotal * 0.08).toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <p className="text-base font-medium text-gray-900">Order total</p>
                  <p className="text-base font-medium text-gray-900">
                    ${(cartTotal + 5.99 + cartTotal * 0.08).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Checkout
                </Link>
              </div>

              <div className="mt-4 flex justify-center text-sm text-center text-gray-500">
                <p>
                  or{' '}
                  <Link href="/products" className="text-blue-600 font-medium hover:text-blue-500">
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}