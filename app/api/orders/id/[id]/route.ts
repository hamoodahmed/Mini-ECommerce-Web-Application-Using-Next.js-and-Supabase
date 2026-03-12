// app/api/orders/id/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface Context {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Context) {
  try {
    const orderId = parseInt(params.id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Fetch the order with its items and related products
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*,
          products (*)
        )
      `)
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Context) {
  try {
    const orderId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Validate required fields
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Valid statuses: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Update the order status
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: updateError.message || 'Failed to update order' },
        { status: 500 }
      );
    }

    // Return the updated order with its items and related products
    const { data: orderWithItems, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*,
          products (*)
        )
      `)
      .eq('id', orderId)
      .single();

    if (fetchError) {
      console.error('Error fetching updated order:', fetchError);
      return NextResponse.json(
        { error: 'Updated order but failed to fetch it' },
        { status: 500 }
      );
    }

    return NextResponse.json(orderWithItems);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}