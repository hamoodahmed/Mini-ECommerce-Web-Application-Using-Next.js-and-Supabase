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
    <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative overflow-hidden">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="bg-gray-100 w-full h-56 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm">No Image</p>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
          {category}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onAddToCart && onAddToCart(id)}
            className="bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            title="Add to cart"
          >
            <FiShoppingCart className="h-5 w-5" />
          </button>
          <Link
            href={`/products/${slug}`}
            className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            title="View details"
          >
            <FiEye className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{name}</h3>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-12">{description}</p>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-gray-900">${price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;