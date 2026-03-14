// app/api/test-supabase/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Run a simple query to test the connection
    const { data, error } = await supabase
      .from('products')
      .select('*', { count: 'estimated' })
      .limit(1);

    if (error) {
      console.error('Error testing Supabase connection:', error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const productsCount = data ? data.length : 0;

    return NextResponse.json({
      ok: true,
      productsCount: productsCount
    });
  } catch (error: any) {
    console.error('Unexpected error testing Supabase connection:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}