import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define TypeScript interfaces matching the Supabase tables
export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  created_at: string;
  updated_at: string;
  status: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  user_id?: number;
  total: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

// Helper functions to interact with Supabase
export const db = {
  // User operations
  user: {
    async findUnique({ where }: { where: { email?: string; id?: number } }) {
      let query = supabase.from('users').select('*');

      if (where.email) {
        query = query.eq('email', where.email);
      }
      if (where.id) {
        query = query.eq('id', where.id);
      }

      const { data, error } = await query.single();

      if (error) throw new Error(error.message);
      return data as User | null;
    },
  },

  // Product operations
  product: {
    async findMany({
      where = {},
      take,
      orderBy,
      skip
    }: {
      where?: { name?: { contains?: string; mode?: string }; category?: { equals?: string } };
      take?: number;
      orderBy?: { createdAt?: 'asc' | 'desc'; name?: 'asc' | 'desc' };
      skip?: number;
    } = {}) {
      let query = supabase.from('products').select('*');

      // Apply search filter
      if (where.name?.contains) {
        query = query.ilike('name', `%${where.name.contains}%`);
      }

      // Apply category filter
      if (where.category?.equals && where.category.equals !== 'all') {
        query = query.eq('category', where.category.equals);
      }

      // Apply ordering
      if (orderBy) {
        const orderKey = Object.keys(orderBy)[0] as string;
        const orderDirection = orderBy[orderKey as keyof typeof orderBy];
        query = query.order(orderKey, { ascending: orderDirection === 'asc' });
      }

      // Apply pagination
      if (skip) {
        query = query.range(skip, skip + (take || 12) - 1);
      } else if (take) {
        query = query.limit(take);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);
      return data as Product[];
    },

    async findUnique({ where }: { where: { id?: number; slug?: string } }) {
      let query = supabase.from('products').select('*');

      if (where.id) {
        query = query.eq('id', where.id);
      }
      if (where.slug) {
        query = query.eq('slug', where.slug);
      }

      const { data, error } = await query.single();

      if (error) throw new Error(error.message);
      return data as Product | null;
    },

    async count({ where = {} }: { where?: { name?: { contains?: string }; category?: { equals?: string } } } = {}) {
      let query = supabase.from('products').select('*', { count: 'exact', head: true });

      if (where.name?.contains) {
        query = query.ilike('name', `%${where.name.contains}%`);
      }
      if (where.category?.equals && where.category.equals !== 'all') {
        query = query.eq('category', where.category.equals);
      }

      const { count, error } = await query;

      if (error) throw new Error(error.message);
      return count || 0;
    }
  },

  // Order operations
  order: {
    async create({
      data
    }: {
      data: {
        customer_name: string;
        customer_email: string;
        shipping_address: string;
        order_items: Array<{ product_id: number; quantity: number; unit_price: number }>;
        user_id?: number;
        total: number;
      };
    }) {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          shipping_address: data.shipping_address,
          user_id: data.user_id,
          total: data.total
        })
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);

      // Create order items
      const orderItems = data.order_items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      }));

      if (orderItems.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw new Error(itemsError.message);
      }

      return order as Order;
    },

    async findMany({ where = {} }: { where?: { user_id?: number } } = {}) {
      let query = supabase.from('orders').select('*');

      if (where.user_id) {
        query = query.eq('user_id', where.user_id);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);
      return data as Order[];
    },

    async findUnique({ where }: { where: { id: number; user_id?: number } }) {
      let query = supabase.from('orders').select('*');

      query = query.eq('id', where.id);

      if (where.user_id) {
        query = query.eq('user_id', where.user_id);
      }

      const { data, error } = await query.single();

      if (error) throw new Error(error.message);
      return data as Order | null;
    }
  }
};

export default db;