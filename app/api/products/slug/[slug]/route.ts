// app/api/products/slug/[slug]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface Context {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: Context) {
  try {
    const { slug } = params;

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}