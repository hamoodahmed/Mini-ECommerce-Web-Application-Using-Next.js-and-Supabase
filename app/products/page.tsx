'use client';

// app/products/page.tsx
import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  stock: number;
  slug: string;
}

interface Category {
  category: string;
}

interface ProductsData {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get initial params
  const initialSearch = typeof searchParams.search === 'string' ? searchParams.search : '';
  const initialCategory = typeof searchParams.category === 'string' ? searchParams.category : '';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);

        const productsRes = await fetch(`/api/products?${params.toString()}`);
        if (!productsRes.ok) throw new Error('Failed to fetch products');
        const productsData: ProductsData = await productsRes.json();
        // Ensure we always store an array to avoid runtime errors
        setProducts(Array.isArray(productsData.products) ? productsData.products : []);

        // Fetch all categories
        const categoriesRes = await fetch('/api/products/categories');
        if (categoriesRes.ok) {
          const categoriesData: Category[] = await categoriesRes.json();
          setCategories(categoriesData.map(cat => cat.category));
        } else {
          // Fallback to a basic set of categories if the endpoint doesn't exist
          setCategories(['Electronics', 'Clothing', 'Home', 'Accessories', 'Sports']);
        }
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newSearch = formData.get('search') as string;
    setSearch(newSearch);

    // Update URL
    const newUrl = new URL(window.location.href);
    if (newSearch) {
      newUrl.searchParams.set('search', newSearch);
    } else {
      newUrl.searchParams.delete('search');
    }
    window.history.replaceState({}, '', newUrl.toString());
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          <p className="mt-2 text-gray-600">Browse our selection of quality items with flat 25% discount on selected products</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                defaultValue={initialSearch}
                className="w-full rounded-lg border border-gray-300 py-2 pl-4 pr-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
              <div className="bg-gray-200 h-48 w-full" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Our Product Collection</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse our selection of quality items with flat 25% discount on selected products
        </p>
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
          25% OFF SELECTED ITEMS
        </div>
      </div>

      {/* Search and category filter */}
      <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search products by name..."
                defaultValue={initialSearch}
                className="w-full rounded-lg border border-gray-300 py-3 pl-5 pr-12 focus:border-blue-500 focus:ring-blue-500 text-base"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium">Filter by:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 px-4 bg-white focus:border-blue-500 focus:ring-blue-500 text-base min-w-[180px]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-700">
            Showing <span className="font-medium">{products.length}</span> products
          </p>
          {initialSearch && (
            <button
              onClick={() => setSearch('')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          )}
        </div>

        {(!products || products.length === 0) ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-xl text-gray-700 mb-2">No products found</p>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('');
              }}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image_url={product.image_url}
                category={product.category}
                slug={product.slug}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}