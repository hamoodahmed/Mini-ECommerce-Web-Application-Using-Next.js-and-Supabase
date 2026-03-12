// app/api/products/id/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface Context {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Context) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Context) {
  try {
    const productId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Validate required fields
    const { name, description, price, image_url, category, stock, slug } = body;

    if (!name || !description || price === undefined || !category || stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the product
    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update({
        name,
        description,
        price: parseFloat(price),
        image_url: image_url || null,
        category,
        stock: parseInt(stock),
        slug: slug || name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
      })
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Context) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Delete the product
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}