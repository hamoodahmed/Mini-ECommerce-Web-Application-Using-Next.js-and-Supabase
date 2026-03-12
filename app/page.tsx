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
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to MiniShop</h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover amazing products at great prices
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product: any) => (
            <div key={product.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <p className="mt-2 text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
                <div className="mt-4">
                  <a
                    href={`/products/${product.slug}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center inline-block"
                  >
                    View Product
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}