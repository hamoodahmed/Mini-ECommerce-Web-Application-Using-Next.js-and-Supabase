// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*,
          products (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract and validate the incoming data
    const { customerName, customerEmail, shippingAddress, orderItems, userId, total } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !shippingAddress || !orderItems || orderItems.length === 0 || total === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate order items
    for (const item of orderItems) {
      if (!item.productId || !item.quantity || !item.unitPrice) {
        return NextResponse.json(
          { error: 'Each order item must have productId, quantity, and unitPrice' },
          { status: 400 }
        );
      }
    }

    // Check if user exists if userId is provided
    let user_id = null;
    if (userId) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (userError) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      user_id = user.id;
    }

    // Create the order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        shipping_address: shippingAddress,
        user_id: user_id,
        status: 'PENDING',
        total: total
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: orderError.message || 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItemsToInsert = orderItems.map((item: any) => ({
      order_id: newOrder.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice
    }));

    if (orderItemsToInsert.length > 0) {
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Rollback: delete the order since items creation failed
        await supabase.from('orders').delete().eq('id', newOrder.id);

        return NextResponse.json(
          { error: itemsError.message || 'Failed to create order items' },
          { status: 500 }
        );
      }
    }

    // Return the created order with items
    const { data: orderWithItems, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*,
          products (*)
        )
      `)
      .eq('id', newOrder.id)
      .single();

    if (fetchError) {
      console.error('Error fetching created order:', fetchError);
      return NextResponse.json(
        { error: 'Created order but failed to fetch it' },
        { status: 500 }
      );
    }

    return NextResponse.json(orderWithItems);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}