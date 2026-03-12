// app/api/products/route.js
import { NextResponse } from 'next/server';

// Mock product data
const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    image: '/placeholder-product.jpg',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'Electronics',
    rating: 4.5,
    inStock: true
  },
  {
    id: 2,
    name: 'Cotton T-Shirt',
    price: 24.99,
    image: '/placeholder-product.jpg',
    description: 'Comfortable cotton t-shirt for everyday wear',
    category: 'Clothing',
    rating: 4.2,
    inStock: true
  },
  {
    id: 3,
    name: 'Coffee Mug',
    price: 12.99,
    image: '/placeholder-product.jpg',
    description: 'Ceramic coffee mug with custom design',
    category: 'Home',
    rating: 4.7,
    inStock: true
  },
  {
    id: 4,
    name: 'Smart Watch',
    price: 199.99,
    image: '/placeholder-product.jpg',
    description: 'Feature-rich smartwatch with health tracking',
    category: 'Electronics',
    rating: 4.3,
    inStock: false
  },
  {
    id: 5,
    name: 'Leather Wallet',
    price: 49.99,
    image: '/placeholder-product.jpg',
    description: 'Genuine leather wallet with multiple card slots',
    category: 'Accessories',
    rating: 4.6,
    inStock: true
  },
  {
    id: 6,
    name: 'Water Bottle',
    price: 19.99,
    image: '/placeholder-product.jpg',
    description: 'Insulated stainless steel water bottle',
    category: 'Home',
    rating: 4.4,
    inStock: true
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let filteredProducts = products;

  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  return NextResponse.json(filteredProducts);
}

export async function POST(request) {
  const newProduct = await request.json();

  // In a real application, you would save this to a database
  // For this MVP, we'll just return the new product with an ID
  const productWithId = {
    ...newProduct,
    id: Math.max(...products.map(p => p.id)) + 1
  };

  return NextResponse.json(productWithId, { status: 201 });
}