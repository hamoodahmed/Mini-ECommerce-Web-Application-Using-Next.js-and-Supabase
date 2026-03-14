import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

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

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}