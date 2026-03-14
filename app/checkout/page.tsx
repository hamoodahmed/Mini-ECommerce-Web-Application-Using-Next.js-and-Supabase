'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    shippingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      errors.customerName = 'Name is required';
    }

    if (!formData.customerEmail.trim()) {
      errors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      errors.customerEmail = 'Email is invalid';
    }

    if (!formData.shippingAddress.trim()) {
      errors.shippingAddress = 'Shipping address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || cart.items.length === 0) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Combine address fields into a single string
      const fullAddress = `${formData.shippingAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`;

      // Calculate the total on the client side as well
      const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Prepare order data
      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        shippingAddress: fullAddress,
        orderItems: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        total: total,
      };

      // Submit order to backend
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const result = await response.json();

      // Clear cart after successful order
      clearCart();

      // Redirect to success page
      router.push(`/order/success?orderId=${result.id}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Please add items to your cart before checking out</p>
          <a
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase by providing shipping and payment information</p>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout form */}
        <div className="lg:w-2/3">
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="px-8 py-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipping Information</h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        id="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${
                          formErrors.customerName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        } py-3 px-4 focus:border-blue-500 focus:ring-blue-500 text-base shadow-sm transition-colors`}
                        placeholder="John Doe"
                      />
                      {formErrors.customerName && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.customerName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="customerEmail"
                        id="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${
                          formErrors.customerEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        } py-3 px-4 focus:border-blue-500 focus:ring-blue-500 text-base shadow-sm transition-colors`}
                        placeholder="john@example.com"
                      />
                      {formErrors.customerEmail && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.customerEmail}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="shippingAddress"
                        id="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${
                          formErrors.shippingAddress ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        } py-3 px-4 focus:border-blue-500 focus:ring-blue-500 text-base shadow-sm transition-colors`}
                        placeholder="123 Main Street"
                      />
                      {formErrors.shippingAddress && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.shippingAddress}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${
                          formErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        } py-3 px-4 focus:border-blue-500 focus:ring-blue-500 text-base shadow-sm transition-colors`}
                        placeholder="New York"
                      />
                      {formErrors.city && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.city}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        State / Province <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        id="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${
                          formErrors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        } py-3 px-4 focus:border-blue-500 focus:ring-blue-500 text-base shadow-sm transition-colors`}
                        placeholder="NY"
                      />
                      {formErrors.state && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.state}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP / Postal code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${
                          formErrors.zipCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        } py-3 px-4 focus:border-blue-500 focus:ring-blue-500 text-base shadow-sm transition-colors`}
                        placeholder="10001"
                      />
                      {formErrors.zipCode && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.zipCode}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-base transition-colors"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                        <option>Germany</option>
                        <option>France</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Link
                    href="/cart"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    ← Back to Cart
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-4 inline-flex items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg disabled:opacity-50 transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Complete Order'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow-lg rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <ul className="divide-y divide-gray-200 mb-6">
              {cart.items.map((item) => (
                <li key={item.id} className="py-4 flex">
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex-1">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3 className="truncate max-w-[120px]">{item.name}</h3>
                      <p className="ml-2 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <p>Qty: {item.quantity}</p>
                      <p>${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Subtotal ({cart.items.length} items)</p>
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
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-lg font-bold text-gray-900">Order total</p>
                <p className="text-lg font-bold text-gray-900">
                  ${(cartTotal + 5.99 + cartTotal * 0.08).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}