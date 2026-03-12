'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaStar, FaRegStar, FaStarHalfAlt, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Mock product data
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'Wireless Headphones',
        price: 99.99,
        image: '/placeholder-product.jpg',
        description: 'High-quality wireless headphones with noise cancellation. Experience crystal clear audio with our premium sound technology. Features include 30-hour battery life, comfortable over-ear design, and built-in microphone for calls.',
        category: 'Electronics',
        rating: 4.5,
        inStock: true,
        features: [
          'Noise cancellation',
          '30-hour battery life',
          'Built-in microphone',
          'Bluetooth 5.0'
        ]
      },
      {
        id: 2,
        name: 'Cotton T-Shirt',
        price: 24.99,
        image: '/placeholder-product.jpg',
        description: 'Comfortable cotton t-shirt for everyday wear. Made from 100% organic cotton with a relaxed fit. Perfect for casual outings or lounging at home.',
        category: 'Clothing',
        rating: 4.2,
        inStock: true,
        features: [
          '100% organic cotton',
          'Relaxed fit',
          'Machine washable',
          'Multiple colors available'
        ]
      },
      {
        id: 3,
        name: 'Coffee Mug',
        price: 12.99,
        image: '/placeholder-product.jpg',
        description: 'Ceramic coffee mug with custom design. Holds 12 oz of your favorite beverage. Perfect for coffee, tea, or hot chocolate. Dishwasher and microwave safe.',
        category: 'Home',
        rating: 4.7,
        inStock: true,
        features: [
          '12 oz capacity',
          'Dishwasher safe',
          'Microwave safe',
          'Custom design'
        ]
      },
      {
        id: 4,
        name: 'Smart Watch',
        price: 199.99,
        image: '/placeholder-product.jpg',
        description: 'Feature-rich smartwatch with health tracking. Monitor your heart rate, sleep patterns, and daily activity. Compatible with both iOS and Android devices.',
        category: 'Electronics',
        rating: 4.3,
        inStock: false,
        features: [
          'Health tracking',
          'Heart rate monitor',
          'Water resistant',
          'iOS and Android compatible'
        ]
      },
    ];

    const foundProduct = mockProducts.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // If product not found, redirect to products page
      router.push('/products');
    }
  }, [id, router]);

  const handleAddToCart = () => {
    // In a real app, this would dispatch an action to add to cart
    alert(`Added ${quantity} ${product?.name} to cart!`);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  // Render star rating
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-500" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-500" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-500" />
        ))}
        <span className="ml-2 text-gray-600">({rating})</span>
      </div>
    );
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
            Back to Products
          </Link>
        </div>
      </header>

      {/* Product Detail */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2 p-6">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-6">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

              <div className="flex items-center mb-4">
                {renderRating(product.rating)}
                <span className="ml-4 text-gray-600">SKU: {product.id}</span>
              </div>

              <div className="text-3xl font-bold text-blue-600 mb-4">${product.price}</div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Features:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="mr-4">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center ${
                    product.inStock
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaShoppingCart className="mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              {!product.inStock && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                  This product is currently out of stock.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}