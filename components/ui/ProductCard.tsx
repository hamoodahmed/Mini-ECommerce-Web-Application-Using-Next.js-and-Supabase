import React from 'react';
import Link from 'next/link';
import { FiShoppingCart, FiEye } from 'react-icons/fi';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  slug: string;
  onAddToCart?: (productId: number) => void;
}

const ProductCard = ({
  id,
  name,
  description,
  price,
  image_url,
  category,
  slug,
  onAddToCart
}: ProductCardProps) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-t-lg w-full h-48 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {category}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">{name}</h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900">${price.toFixed(2)}</p>

          <div className="flex space-x-2">
            <button
              onClick={() => onAddToCart && onAddToCart(id)}
              className="text-blue-600 hover:text-blue-800"
              title="Add to cart"
            >
              <FiShoppingCart className="h-5 w-5" />
            </button>
            <Link
              href={`/products/${slug}`}
              className="text-gray-600 hover:text-gray-900"
              title="View details"
            >
              <FiEye className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;