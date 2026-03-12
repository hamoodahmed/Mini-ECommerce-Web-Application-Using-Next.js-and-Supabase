'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { useRouter } from 'next/navigation';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit}>
            <div className="bg-white shadow sm:rounded-md">
              <div className="px-4 py-6 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Contact Information</h2>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                      Full name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      id="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.customerName ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                    />
                    {formErrors.customerName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.customerName}</p>
                    )}
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      id="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.customerEmail ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                    />
                    {formErrors.customerEmail && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.customerEmail}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-6 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Shipping Address</h2>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="shippingAddress"
                      id="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.shippingAddress ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                    />
                    {formErrors.shippingAddress && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.shippingAddress}</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.city ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                    />
                    {formErrors.city && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.state ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                    />
                    {formErrors.state && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                      ZIP / Postal code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.zipCode ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                    />
                    {formErrors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.zipCode}</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Complete Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow sm:rounded-md">
            <div className="px-4 py-6 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

              <ul className="divide-y divide-gray-200 mt-6">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex py-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 border-2 border-dashed rounded-md overflow-hidden">
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

                    <div className="ml-4 flex-1">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <p>Qty: {item.quantity}</p>
                        <p>${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}