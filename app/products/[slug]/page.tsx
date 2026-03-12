import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/cart-context';
import { useEffect, useState } from 'react';

// Server component to fetch product data
async function getProduct(slug: string) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !product) {
    return null;
  }

  return product;
}

// Client component for the product detail
function ProductDetailClient({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image_url
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image gallery */}
        <div className="flex flex-col-reverse">
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">No image</span>
              )}
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Category: {product.category}</span>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-500">In stock: {product.stock}</span>
            </div>
          </div>

          <form className="mt-10">
            {/* Quantity selector */}
            <div className="mt-4">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
                Quantity
              </label>
              <select
                id="quantity"
                name="quantity"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {[...Array(Math.min(10, product.stock))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex space-x-4">
              <Button
                type="button"
                variant="primary"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? 'Add to cart' : 'Out of stock'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}