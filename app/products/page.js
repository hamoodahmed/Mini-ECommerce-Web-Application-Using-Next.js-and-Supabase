import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaFilter } from 'react-icons/fa';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('name');

  // Mock product data
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'Wireless Headphones',
        price: 99.99,
        image: '/placeholder-product.jpg',
        description: 'High-quality wireless headphones with noise cancellation',
        category: 'Electronics',
        rating: 4.5
      },
      {
        id: 2,
        name: 'Cotton T-Shirt',
        price: 24.99,
        image: '/placeholder-product.jpg',
        description: 'Comfortable cotton t-shirt for everyday wear',
        category: 'Clothing',
        rating: 4.2
      },
      {
        id: 3,
        name: 'Coffee Mug',
        price: 12.99,
        image: '/placeholder-product.jpg',
        description: 'Ceramic coffee mug with custom design',
        category: 'Home',
        rating: 4.7
      },
      {
        id: 4,
        name: 'Smart Watch',
        price: 199.99,
        image: '/placeholder-product.jpg',
        description: 'Feature-rich smartwatch with health tracking',
        category: 'Electronics',
        rating: 4.3
      },
      {
        id: 5,
        name: 'Leather Wallet',
        price: 49.99,
        image: '/placeholder-product.jpg',
        description: 'Genuine leather wallet with multiple card slots',
        category: 'Accessories',
        rating: 4.6
      },
      {
        id: 6,
        name: 'Water Bottle',
        price: 19.99,
        image: '/placeholder-product.jpg',
        description: 'Insulated stainless steel water bottle',
        category: 'Home',
        rating: 4.4
      },
    ];
    setProducts(mockProducts);
  }, []);

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

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
          <Link href="/cart" className="text-gray-700 hover:text-blue-600">
            Cart (0)
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Our Products</h1>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <FaFilter className="mr-2 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <span className="text-yellow-500 flex items-center">
                    {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}