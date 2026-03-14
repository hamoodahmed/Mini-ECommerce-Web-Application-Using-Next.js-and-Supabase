// app/page.tsx
import { supabase } from '@/lib/supabase';

export default async function HomePage() {
  // Fetch some products to display on the home page
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) {
    console.error('Error fetching products:', error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-red-600">Failed to load products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to MiniShop</h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover amazing products at great prices
        </p>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-xl font-bold">Our store – quality items, flat 25% discount on selected products</h2>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <a
            href="/products"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            View all products
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product: any) => (
            <div key={product.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gray-100 w-full h-48 flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-2">
                  {product.category}
                </span>
                <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <p className="mt-2 text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
                <div className="mt-4">
                  <a
                    href={`/products/${product.slug}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center inline-block transition-colors duration-200"
                  >
                    View Product
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Our Store</h2>
          <p className="text-gray-600 mb-4">
            Our store offers quality items with a flat 25% discount on selected products.
            Browse our range of electronics, clothing, home goods, and more.
          </p>
          <p className="text-gray-600">
            We pride ourselves on providing excellent customer service and fast shipping on all orders.
          </p>
        </div>
      </div>
    </div>
  );
}