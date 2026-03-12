// app/api/orders/user/userId/[userId]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface Context {
  params: {
    userId: string;
  };
}

export async function GET(request: Request, { params }: Context) {
  try {
    const userId = parseInt(params.userId);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Fetch orders for the user with their items and related products
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*,
          products (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user orders' },
        { status: 500 }
      );
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user orders' },
      { status: 500 }
    );
  }
}