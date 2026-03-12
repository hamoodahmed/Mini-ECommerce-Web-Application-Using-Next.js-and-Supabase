'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    stock: '0',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }

    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      errors.stock = 'Stock must be a non-negative number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        // Generate a slug from the name
        slug: formData.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const result = await response.json();
      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Product</h1>

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

        <form onSubmit={handleSubmit} className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Product Information</h2>
            <p className="mt-1 text-sm text-gray-500">Use a permanent product name and slug.</p>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`py-2 px-3 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md`}
                />
                {formErrors.name && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className={`py-2 px-3 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border ${
                    formErrors.description ? 'border-red-300' : 'border-gray-300'
                  } rounded-md`}
                />
                {formErrors.description && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price ($)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="price"
                  id="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className={`py-2 px-3 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border ${
                    formErrors.price ? 'border-red-300' : 'border-gray-300'
                  } rounded-md`}
                />
                {formErrors.price && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.price}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`py-2 px-3 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border ${
                    formErrors.category ? 'border-red-300' : 'border-gray-300'
                  } rounded-md`}
                />
                {formErrors.category && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.category}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock Quantity
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className={`py-2 px-3 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border ${
                    formErrors.stock ? 'border-red-300' : 'border-gray-300'
                  } rounded-md`}
                />
                {formErrors.stock && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.stock}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="imageUrl"
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className={`py-2 px-3 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border border-gray-300 rounded-md`}
                />
                <p className="mt-2 text-sm text-gray-500">Leave blank if no image available</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}