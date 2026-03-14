# Mini E-commerce MVP

A lightweight e-commerce application built with Next.js 14 using the App Router, featuring essential functionality for product browsing, cart management, checkout flow, and basic admin management.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env.local` file in the root directory with the following content:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=file:./dev.db
```

3. Run the development server:
```bash
npm run dev
```

4. Admin Access
   - Default admin user: `admin@example.com`
   - Default password: `password123`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter

## Feature Overview

### Public Features
- Browse products with search and filter by category
- Product detail pages with full information
- Shopping cart with add/remove/update functionality
- Full checkout flow with address and contact info
- Order confirmation and order detail pages

### Admin Features
- Secure admin login with role-based access
- Product management (create, edit, delete)
- Order management with status updates
- Order filtering by status

### Technical Features
- Responsive design for mobile, tablet, and desktop
- Loading states on all pages
- Error handling throughout the application
- Empty state handling
- Client-side form validation
- Server-side validation and error handling
- Cart persistence using localStorage

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL database & authentication)
- NextAuth.js

## Supabase Setup

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Get your Project URL and Public API Key from Project Settings > API
4. Add these to your `.env.local` file as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Database Schema Setup

To set up your Supabase database, follow these steps:

1. Go to your Supabase dashboard and navigate to the SQL Editor
2. Run the following SQL commands to create the required tables:

```sql
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
```

3. **Important**: In your Supabase dashboard, go to Authentication > Settings and ensure email confirmation is disabled for development, or manually confirm the default admin user.

4. **For RLS (Row Level Security)**: For development, you may need to disable RLS policies for the tables or set them to allow all operations temporarily. To disable RLS:
   - Go to your Supabase dashboard
   - Navigate to Database > Tables
   - For each table (users, products, orders, order_items), disable RLS or add appropriate policies

### Admin Access

- Default admin user: `admin@example.com`
- Default password: `password123`

## Manual Test Checklist

### Public Features
- [x] Browse products page shows all products correctly
- [x] Product search works as expected
- [x] Category filter works as expected
- [x] Product detail pages show all information
- [x] Add to cart functionality works
- [x] Cart page shows all items correctly
- [x] Cart item quantities can be updated
- [x] Cart items can be removed
- [x] Cart total calculations are correct
- [x] Checkout form validates all fields correctly
- [x] Successful checkout redirects to confirmation page
- [x] Order confirmation page shows order details

### Admin Features
- [x] Admin login requires valid credentials
- [x] Non-admin users are blocked from admin pages
- [x] Admin dashboard loads correctly
- [x] Products list page shows all products
- [x] New product form validates all fields
- [x] New products can be created
- [x] Existing products can be edited
- [x] Orders list page shows all orders
- [x] Order filter by status works
- [x] Order details page shows all information
- [x] Order status can be updated

### General
- [x] All pages are responsive on mobile, tablet, and desktop
- [x] Loading states appear during async operations
- [x] Error messages are displayed appropriately
- [x] Empty states are handled gracefully
- [x] All links navigate correctly
- [x] Application builds successfully with `npm run build`