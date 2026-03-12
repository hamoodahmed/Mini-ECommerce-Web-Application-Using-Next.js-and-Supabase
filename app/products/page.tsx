'use client';

// app/products/page.tsx
import { useState, useEffect } from 'react';

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
        setProducts(productsData.products);

        // Fetch all categories
        const categoriesRes = await fetch('/api/products/categories');
        if (categoriesRes.ok) {
          const categoriesData: Category[] = await categoriesRes.json();
          setCategories(categoriesData.map(cat => cat.category));
        } else {
          // Fallback to a basic set of categories if the endpoint doesn't exist
          setCategories(['Electronics', 'Clothing', 'Home', 'Accessories']);
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);

    // Update URL
    const newUrl = new URL(window.location.href);
    if (newCategory && newCategory !== 'all') {
      newUrl.searchParams.set('category', newCategory);
    } else {
      newUrl.searchParams.delete('category');
    }
    window.history.replaceState({}, '', newUrl.toString());
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
      </div>

      {/* Search and filter section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              defaultValue={initialSearch}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </form>
        </div>
        <div>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Products grid */}
      <div className="mt-6">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="bg-gray-200 border-2 border-dashed rounded-t-lg w-full h-48 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">No image</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
                    <a
                      href={`/products/${product.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}