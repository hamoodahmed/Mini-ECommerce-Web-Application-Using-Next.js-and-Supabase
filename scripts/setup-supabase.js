// scripts/setup-supabase.js
// Script to initialize Supabase database with required tables and sample data
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // This requires service role key for table creation
);

async function setupDatabase() {
  try {
    console.log('Setting up Supabase database...');

    // Create users table
    const { error: userTableError } = await supabase.rpc('create_extension', { extension_name: 'pgcrypto' });
    if (userTableError && userTableError.code !== '42710') {
      console.log('Note: Extension may already exist or needs manual setup');
    }

    // We'll create the tables manually using SQL
    console.log('Please create the following tables manually in your Supabase dashboard:');
    console.log(`
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'CUSTOMER',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
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

CREATE TABLE IF NOT EXISTS orders (
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

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL
);

-- Insert a default admin user (password: password123)
INSERT INTO users (email, password_hash, role)
SELECT 'admin@example.com',
       '$2b$10$8K1p/a0uS46q5BpIFJcGxeOlCJz7lhOvZ6qAGF2u1Ms5JqQYjL8aK',
       'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');
    `);

    console.log('Database setup instructions completed. Please run the SQL in your Supabase dashboard.');

  } catch (error) {
    console.error('Error setting up database:', error.message);
  }
}

setupDatabase();