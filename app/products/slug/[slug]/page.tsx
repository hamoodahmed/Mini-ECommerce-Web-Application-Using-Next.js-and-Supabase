'use client';

// app/products/[slug]/page.tsx
import { db } from '@/lib/db';
import { useCart } from '@/context/cart-context';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  stock: number;
  slug: string;
}

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = params;
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            // Handle 404 in client component if needed
            notFound();
          }
          throw new Error('Failed to fetch product');
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

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
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Product not found</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const quantitySelect = document.getElementById('quantity') as HTMLSelectElement;
    const quantity = parseInt(quantitySelect.value);

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.imageUrl,
    });

    alert(`Added ${quantity} of ${product.name} to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="md:flex">
          {/* Product image */}
          <div className="md:w-1/2">
            <div className="bg-gray-200 border-2 border-dashed w-full h-96 flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-500">No image available</span>
              )}
            </div>
          </div>

          {/* Product details */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-2 flex items-center">
              <p className="text-2xl font-medium text-gray-900">${product.price.toFixed(2)}</p>
              <p className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
              </p>
            </div>

            <div className="mt-4">
              <h2 className="text-sm font-medium text-gray-900">Category</h2>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>

            <div className="mt-4">
              <h2 className="text-sm font-medium text-gray-900">Description</h2>
              <p className="mt-1 text-sm text-gray-600">{product.description}</p>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-900 mr-2">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  name="quantity"
                  className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                >
                  {[...Array(Math.min(10, product.stock || 0)).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3 px-6 rounded-md text-white font-medium ${
                  product.stock <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}