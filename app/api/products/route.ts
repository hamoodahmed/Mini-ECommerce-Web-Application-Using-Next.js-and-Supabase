// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    let query = supabase.from('products').select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('name', { ascending: true });

    const { data: products, count, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, description, price, image_url, category, stock, slug } = body;

    if (!name || !description || price === undefined || !category || stock === undefined || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the product
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price: parseFloat(price),
        image_url: image_url || null,
        category,
        stock: parseInt(stock),
        slug,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}