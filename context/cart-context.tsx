'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

type CartItem = {
  id: number; // This is a client-side ID, not the product ID
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: { id: number; productId: number; name: string; price: number; quantity: number; image?: string } }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'INITIALIZE_CART'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item =>
        item.productId === action.payload.productId
      );

      if (existingItem) {
        // If item already exists, update quantity
        return {
          items: state.items.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        // Add new item to cart
        return {
          items: [
            ...state.items,
            {
              id: action.payload.id,
              productId: action.payload.productId,
              name: action.payload.name,
              price: action.payload.price,
              quantity: action.payload.quantity,
              image: action.payload.image,
            },
          ],
        };
      }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(item => item.id !== action.payload.id),
      };
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { items: [] };
    case 'INITIALIZE_CART':
      return { items: action.payload };
    default:
      return state;
  }
};

type CartContextType = {
  cart: CartState;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'INITIALIZE_CART', payload: parsedCart });
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart.items));
  }, [cart.items]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    // Generate a client-side ID based on the product ID to ensure uniqueness per product
    const id = Date.now() + Math.random();
    dispatch({
      type: 'ADD_ITEM',
      payload: { ...item, id: id as number },
    });
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('cart');
  };

  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItemCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};