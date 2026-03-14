// scripts/setup-supabase-tables.js
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

// For this to work, you need the SERVICE_ROLE_KEY which has admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // This is different from anon key

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables. You need:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY (from Supabase Dashboard > Project Settings > API)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setupDatabase() {
  console.log('Setting up Supabase database...');

  try {
    // Create tables using Supabase's SQL functionality
    console.log('Creating tables...');

    // Create users table
    let { error: userTableError } = await supabase.rpc('create_extension', { extension_name: 'pgcrypto' });
    if (userTableError && userTableError.code !== '42710') {
      console.log('Note: Extension may already exist or needs manual setup');
    }

    // First let's check if tables exist by attempting to query them
    const { error: usersCheck } = await supabase.from('users').select('id').limit(1);
    if (usersCheck && usersCheck.code === '42P01') { // undefined_table
      console.log('Users table does not exist. Creating...');

      // Since we can't create tables directly via the client, we need to do this manually
      // The user should run these SQL commands in the Supabase SQL Editor:
      console.log(`
      Please run this SQL in your Supabase project's SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql):

      -- Create users table
      CREATE TABLE users (
        id BIGSERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'CUSTOMER',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create products table
      CREATE TABLE products (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url TEXT,
        category VARCHAR(100),
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create orders table
      CREATE TABLE orders (
        id BIGSERIAL PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        status VARCHAR(50) DEFAULT 'pending',
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        shipping_address TEXT NOT NULL,
        user_id BIGINT REFERENCES users(id),
        total DECIMAL(10, 2) NOT NULL
      );

      -- Create order_items table
      CREATE TABLE order_items (
        id BIGSERIAL PRIMARY KEY,
        order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
        product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL
      );

      -- Insert a default admin user (password: password123)
      INSERT INTO users (email, password_hash, role)
      VALUES ('admin@example.com', '$2b$10$/P9ltVi9AoefZ2bNtUZMI.ckkjk05dsjgJ5rJPW4YakEacUlYSp1q', 'ADMIN')
      ON CONFLICT (email) DO NOTHING;
      `);
    } else {
      console.log('Users table exists or there was a different error.');

      // Check if the admin user already exists
      const { data: adminUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'admin@example.com')
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') { // No rows returned
          console.log('Admin user does not exist. You need to create it manually.');
          console.log('Run this SQL in your Supabase SQL Editor:');
          console.log(`
          -- Insert a default admin user (password: password123)
          INSERT INTO users (email, password_hash, role)
          VALUES ('admin@example.com', '$2b$10$/P9ltVi9AoefZ2bNtUZMI.ckkjk05dsjgJ5rJPW4YakEacUlYSp1q', 'ADMIN')
          ON CONFLICT (email) DO NOTHING;
          `);
        } else {
          console.error('Error checking for admin user:', fetchError);
        }
      } else {
        console.log('Admin user already exists!');
      }
    }

    console.log('Database setup completed! Check your Supabase dashboard for further instructions.');

  } catch (error) {
    console.error('Error setting up database:', error.message);
  }
}

setupDatabase();