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
   - Default password: `password`

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

### Database Schema

The application expects the following tables in your Supabase database:

**users**
- id (integer, primary key)
- email (text, unique)
- password_hash (text)
- role (text, default: "CUSTOMER")
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())

**products**
- id (integer, primary key)
- name (text)
- slug (text, unique)
- description (text)
- price (double precision)
- image_url (text, optional)
- category (text)
- stock (integer, default: 0)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())

**orders**
- id (integer, primary key)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
- status (text, default: "PENDING")
- customer_name (text)
- customer_email (text)
- shipping_address (text)
- user_id (integer, foreign key to users.id, optional)

**order_items**
- id (integer, primary key)
- order_id (integer, foreign key to orders.id)
- product_id (integer, foreign key to products.id)
- quantity (integer, default: 1)
- unit_price (double precision)
- (unique constraint on [order_id, product_id])

## Manual Test Checklist

### Public Features
- [ ] Browse products page shows all products correctly
- [ ] Product search works as expected
- [ ] Category filter works as expected
- [ ] Product detail pages show all information
- [ ] Add to cart functionality works
- [ ] Cart page shows all items correctly
- [ ] Cart item quantities can be updated
- [ ] Cart items can be removed
- [ ] Cart total calculations are correct
- [ ] Checkout form validates all fields correctly
- [ ] Successful checkout redirects to confirmation page
- [ ] Order confirmation page shows order details

### Admin Features
- [ ] Admin login requires valid credentials
- [ ] Non-admin users are blocked from admin pages
- [ ] Admin dashboard loads correctly
- [ ] Products list page shows all products
- [ ] New product form validates all fields
- [ ] New products can be created
- [ ] Existing products can be edited
- [ ] Orders list page shows all orders
- [ ] Order filter by status works
- [ ] Order details page shows all information
- [ ] Order status can be updated

### General
- [ ] All pages are responsive on mobile, tablet, and desktop
- [ ] Loading states appear during async operations
- [ ] Error messages are displayed appropriately
- [ ] Empty states are handled gracefully
- [ ] All links navigate correctly
- [ ] Application builds successfully with `npm run build`