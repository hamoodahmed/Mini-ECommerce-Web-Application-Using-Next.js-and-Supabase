# Getting Started with the E-commerce Application

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Supabase account** - [Sign up here](https://supabase.com)

## Setup Instructions

### Step 1: Update Environment Variables

Update your `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

To get these values:
1. Go to your [Supabase dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Project Settings > API
4. Copy the "Project URL" and "anon key"

### Step 2: Set Up Supabase Database (CRITICAL - This is why login doesn't work!)

1. Go to your Supabase dashboard
2. Navigate to the **SQL Editor** tab
3. Copy and paste the **entire** SQL block below into the editor and click "RUN"

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

-- Insert 25+ sample products with real images
INSERT INTO products (name, slug, description, price, image_url, category, stock) VALUES
('Wireless Headphones', 'wireless-headphones', 'High-quality wireless headphones with noise cancellation. Experience crystal clear audio with our premium sound technology.', 99.99, 'https://picsum.photos/seed/headphones/600/400', 'Electronics', 50),
('Cotton T-Shirt', 'cotton-tshirt', 'Comfortable cotton t-shirt for everyday wear. Made from 100% organic cotton with a relaxed fit.', 24.99, 'https://picsum.photos/seed/tshirt/600/400', 'Clothing', 100),
('Coffee Mug', 'coffee-mug', 'Ceramic coffee mug with custom design. Holds 12 oz of your favorite beverage.', 12.99, 'https://picsum.photos/seed/mug/600/400', 'Home', 75),
('Smart Watch', 'smart-watch', 'Feature-rich smartwatch with health tracking. Monitor your heart rate, sleep patterns, and daily activity.', 199.99, 'https://picsum.photos/seed/watch/600/400', 'Electronics', 25),
('Leather Wallet', 'leather-wallet', 'Genuine leather wallet with multiple card slots. Perfect for everyday use.', 49.99, 'https://picsum.photos/seed/wallet/600/400', 'Accessories', 40),
('Water Bottle', 'water-bottle', 'Insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours.', 19.99, 'https://picsum.photos/seed/bottle/600/400', 'Home', 60),
('Bluetooth Speaker', 'bluetooth-speaker', 'Portable Bluetooth speaker with 360-degree sound. Perfect for outdoor adventures.', 79.99, 'https://picsum.photos/seed/speaker/600/400', 'Electronics', 35),
('Running Shoes', 'running-shoes', 'Lightweight running shoes with extra cushioning. Ideal for daily workouts and marathons.', 89.99, 'https://picsum.photos/seed/shoes/600/400', 'Sports', 45),
('Yoga Mat', 'yoga-mat', 'Non-slip yoga mat with carrying strap. Eco-friendly materials for your practice.', 34.99, 'https://picsum.photos/seed/yogamat/600/400', 'Sports', 80),
('Desk Lamp', 'desk-lamp', 'Adjustable LED desk lamp with multiple brightness settings. Eye-friendly lighting for work.', 45.99, 'https://picsum.photos/seed/lamp/600/400', 'Home', 60),
('Backpack', 'backpack', 'Durable backpack with laptop compartment. Multiple pockets for organization.', 59.99, 'https://picsum.photos/seed/backpack/600/400', 'Accessories', 70),
('Sunglasses', 'sunglasses', 'UV protection sunglasses with polarized lenses. Stylish and functional.', 39.99, 'https://picsum.photos/seed/sunglasses/600/400', 'Accessories', 90),
('Desk Chair', 'desk-chair', 'Ergonomic office chair with lumbar support. Adjustable height for comfort.', 149.99, 'https://picsum.photos/seed/chair/600/400', 'Home', 20),
('Coffee Maker', 'coffee-maker', 'Programmable coffee maker with thermal carafe. Brews up to 12 cups.', 79.99, 'https://picsum.photos/seed/coffeemaker/600/400', 'Home', 30),
('Gaming Mouse', 'gaming-mouse', 'Wireless gaming mouse with programmable buttons. High precision tracking.', 69.99, 'https://picsum.photos/seed/mouse/600/400', 'Electronics', 40),
('Dumbbell Set', 'dumbbell-set', 'Adjustable dumbbell set up to 25 lbs. Perfect for home workouts.', 129.99, 'https://picsum.photos/seed/dumbbells/600/400', 'Sports', 25),
('Hiking Boots', 'hiking-boots', 'Waterproof hiking boots with ankle support. Ideal for trails and outdoor adventures.', 119.99, 'https://picsum.photos/seed/boots/600/400', 'Sports', 35),
('Notebook', 'notebook', 'Lined notebook with hard cover. Perfect for taking notes or journaling.', 14.99, 'https://picsum.photos/seed/notebook/600/400', 'Office', 100),
('Bluetooth Earbuds', 'bluetooth-earbuds', 'True wireless earbuds with noise cancellation. 24-hour battery life.', 129.99, 'https://picsum.photos/seed/earbuds/600/400', 'Electronics', 45),
('Sneakers', 'sneakers', 'Comfortable sneakers for everyday wear. Breathable mesh upper with cushioned sole.', 64.99, 'https://picsum.photos/seed/sneakers/600/400', 'Clothing', 85),
('Wristwatch', 'wristwatch', 'Classic wristwatch with leather strap. Water resistant and precise timekeeping.', 89.99, 'https://picsum.photos/seed/wristwatch/600/400', 'Accessories', 55),
('Coffee Grinder', 'coffee-grinder', 'Electric coffee grinder with conical burrs. Grind beans to your preferred consistency.', 54.99, 'https://picsum.photos/seed/grinder/600/400', 'Home', 40),
('Yoga Block', 'yoga-block', 'Cork yoga block for deeper stretches. Helps maintain proper alignment.', 12.99, 'https://picsum.photos/seed/yogablock/600/400', 'Sports', 120),
('Desk Organizer', 'desk-organizer', 'Wooden desk organizer with compartments. Keep your workspace clean and organized.', 29.99, 'https://picsum.photos/seed/organizer/600/400', 'Office', 70),
('Cycling Helmet', 'cycling-helmet', 'Lightweight cycling helmet with adjustable fit. Safety meets comfort.', 49.99, 'https://picsum.photos/seed/helmet/600/400', 'Sports', 60),
('Reading Lamp', 'reading-lamp', 'Adjustable reading lamp with warm light. Perfect for bedtime reading.', 34.99, 'https://picsum.photos/seed/readinglamp/600/400', 'Home', 50)
ON CONFLICT (slug) DO NOTHING;
```

### Step 3: Disable Row Level Security (RLS) for Development

This is crucial for the app to work:
1. In your Supabase dashboard, go to **Database > Tables**
2. For each table (users, products, orders, order_items):
   - Click on the table name
   - Go to the "Permissions" tab
   - Switch "Row Level Security" to **DISABLED**

### Step 4: Install Dependencies and Run

```bash
npm install
npm run dev
```

The application will run on http://localhost:3000 (or next available port)

### Step 5: Access Admin Panel

Go to http://localhost:3000/admin/login
- Email: `admin@example.com`
- Password: `password123`

## Troubleshooting

### Login still doesn't work?
- Verify all tables were created in your Supabase database
- Ensure RLS is disabled for all tables
- Confirm the admin user was inserted (check the "users" table)

### UI doesn't look styled?
- The UI is styled with Tailwind CSS and should appear properly once the app loads
- Check browser console for any CSS loading errors

### Ports in use?
- If port 3000-3002 are busy, the app will auto-try the next available port
- Check the console output for the actual port being used

## Notes

- For production, you should set up proper RLS policies instead of disabling them
- The UI/UX Pro Max skill provides design guidelines and is referenced in the skill file but doesn't run automatically - it's a design reference
- All UI components are already styled with Tailwind CSS following modern design principles