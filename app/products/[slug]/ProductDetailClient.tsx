'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/cart-context';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string | null;
  category: string;
  stock: number;
  slug: string;
};

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    await addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image_url ?? undefined,
    });
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="p-4 border-b mb-6">
        <nav className="text-sm">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a href="/" className="text-blue-600 hover:text-blue-800">Home</a>
              <svg className="w-4 h-4 mx-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </li>
            <li className="flex items-center">
              <a href="/products" className="text-blue-600 hover:text-blue-800">Products</a>
              <svg className="w-4 h-4 mx-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </li>
            <li className="flex items-center text-gray-500">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image gallery */}
        <div className="flex flex-col-reverse">
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-96 object-contain bg-white p-4"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-500 text-lg">No image available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-0">
          <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">{product.category}</div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-2">{product.name}</h1>

          <div className="mt-4 flex items-center">
            <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
            <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {product.stock > 10 ? 'In Stock' : `${product.stock} left`}
            </span>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700">
              <p>{product.description}</p>
            </div>
          </div>

          <form className="mt-10">
            {/* Quantity selector */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-900 mb-1">
                Quantity
              </label>
              <select
                id="quantity"
                name="quantity"
                className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {Array.from({ length: Math.min(10, product.stock) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                loading={loading}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </form>

          <div className="mt-10 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
            <ul className="mt-2 space-y-1">
              <li className="flex justify-between border-b pb-1">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{product.category}</span>
              </li>
              <li className="flex justify-between border-b pb-1">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">${product.price.toFixed(2)}</span>
              </li>
              <li className="flex justify-between border-b pb-1">
                <span className="text-gray-600">Availability:</span>
                <span className="font-medium">{product.stock > 10 ? 'In Stock' : `${product.stock} left`}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

