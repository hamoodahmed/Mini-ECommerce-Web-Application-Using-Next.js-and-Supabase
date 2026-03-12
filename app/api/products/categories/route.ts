// app/api/products/categories/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }

    // Get unique categories
    const categoryNames = Array.from(new Set(data.map(item => item.category)));

    return NextResponse.json(categoryNames);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}