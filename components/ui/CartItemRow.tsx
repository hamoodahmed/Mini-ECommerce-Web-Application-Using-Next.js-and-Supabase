import React from 'react';
import { FiX } from 'react-icons/fi';

interface CartItemRowProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

const CartItemRow = ({
  id,
  name,
  price,
  quantity,
  image,
  onRemove,
  onUpdateQuantity
}: CartItemRowProps) => {
  return (
    <li className="py-6 px-4 sm:px-6">
      <div className="flex items-center">
        <div className="flex-shrink-0 w-24 h-24 bg-gray-200 border-2 border-dashed rounded-md overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        <div className="ml-4 flex-1 flex flex-col">
          <div>
            <div className="flex justify-between text-base font-medium text-gray-900">
              <h3>{name}</h3>
              <p className="ml-4">${(price * quantity).toFixed(2)}</p>
            </div>
            <p className="mt-1 text-sm text-gray-500">${price.toFixed(2)} each</p>
          </div>
          <div className="flex-1 flex items-end justify-between text-sm">
            <div className="flex items-center">
              <label htmlFor={`quantity-${id}`} className="mr-2 text-gray-700">
                Qty
              </label>
              <select
                id={`quantity-${id}`}
                value={quantity}
                onChange={(e) => onUpdateQuantity(id, parseInt(e.target.value))}
                className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => onRemove(id)}
              className="font-medium text-red-600 hover:text-red-500"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItemRow;