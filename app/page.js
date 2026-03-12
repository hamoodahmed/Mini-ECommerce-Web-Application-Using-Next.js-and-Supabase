'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock product data
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'Wireless Headphones',
        price: 99.99,
        image: '/placeholder-product.jpg',
        description: 'High-quality wireless headphones with noise cancellation',
        category: 'Electronics'
      },
      {
        id: 2,
        name: 'Cotton T-Shirt',
        price: 24.99,
        image: '/placeholder-product.jpg',
        description: 'Comfortable cotton t-shirt for everyday wear',
        category: 'Clothing'
      },
      {
        id: 3,
        name: 'Coffee Mug',
        price: 12.99,
        image: '/placeholder-product.jpg',
        description: 'Ceramic coffee mug with custom design',
        category: 'Home'
      },
      {
        id: 4,
        name: 'Smart Watch',
        price: 199.99,
        image: '/placeholder-product.jpg',
        description: 'Feature-rich smartwatch with health tracking',
        category: 'Electronics'
      },
    ];
    setProducts(mockProducts);
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MiniShop
          </Link>

          <div className="flex-1 mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <FaShoppingCart />
              <span>Cart</span>
            </Link>
            <Link href="/account" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <FaUser />
              <span>Account</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to MiniShop</h1>
          <p className="text-xl mb-8">Discover amazing products at great prices</p>
          <Link
            href="/products"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">${product.price}</span>
                  <Link
                    href={`/products/${product.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 MiniShop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}