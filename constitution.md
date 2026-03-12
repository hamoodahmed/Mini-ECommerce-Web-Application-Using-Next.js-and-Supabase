# Project Constitution: Mini eCommerce MVP (Next.js)

## 0. Project Overview

- **Project name**: Mini eCommerce MVP
- **Goal**: Build a minimal but realistic online store using Next.js, covering browsing products, managing a cart, checking out, and basic admin.
- **Target**: Learning full-stack Next.js (frontend, backend, DB, auth, basic admin) with clear structure using 5-phase workflow: Constitution, Specify, Plan, Tasks, Implement.

---

## 1. Constitution (Rules & Principles)

These rules apply to the whole project and must be respected in every decision.

1. **Scope first, polish later**  
   - Only build features defined in this constitution and spec. Anything extra must be explicitly marked as "Nice-to-have".

2. **MVP feature set (must-have)**  
   - Product list (browse products).
   - Product detail page.
   - Shopping cart with quantity management.
   - Checkout flow (address + summary + place order).
   - Simple admin to manage products and view orders.

3. **Stack & architecture (non-negotiable)**  
   - **Framework**: Next.js (App Router) with **TypeScript**.
   - **Styling**: Tailwind CSS (optionally with shadcn/ui).
   - **Data layer**: Prisma ORM with **SQLite** in dev (easy to start).
   - **Auth**: Basic email/password auth via NextAuth OR simple admin-only auth strategy.
   - **Payments**: For MVP use **mock payment** (no real Stripe) – just simulate success/failure.

4. **Single source of truth**  
   - Products, orders, and users are stored in the database via Prisma models. No separate hardcoded product lists except seeding.

5. **Security basics**  
   - Never commit `.env` or secrets.
   - Protect admin routes and APIs.
   - Validate inputs on the server (not only client).

6. **Code quality**  
   - Use TypeScript everywhere.
   - Use ESLint + Prettier (or Next defaults).
   - No TypeScript `any` unless necessary and justified.

7. **UX quality (minimum)**  
   - Fully responsive (mobile, tablet, desktop).
   - Clear loading states, error states, and empty states.
   - Clear feedback for user actions (e.g., "Added to cart").

8. **Testing & verification**  
   - At least basic tests OR manual test checklist for each main feature (browse, cart, checkout, admin CRUD).

9. **Documentation**  
   - `README.md` with: setup steps, environment variables, scripts, and short explanation of MVP scope.

10. **Change discipline**  
   - If the project needs new features beyond this constitution, they must be added by updating this file first.

---

## 2. Specification (WHAT we will build)

### 2.1 User roles

- **Shopper (anonymous/guest)**:
  - Can browse products.
  - Can view product details.
  - Can add/remove/update items in cart.
  - Can checkout (guest checkout, no account required).

- **Admin**:
  - Can log in.
  - Can create, update, delete products.
  - Can view orders and update order status.

### 2.2 Core user flows (user stories)

1. **Browse products**
   - As a shopper, I can see a grid of products with image, name, price, and a link to detail.
   - I can filter by category and search by name (simple search).

2. **View product details**
   - As a shopper, I can see large image, description, price, and stock status.
   - I can add the product to my cart and choose quantity.

3. **Manage cart**
   - As a shopper, I can see my cart, adjust quantities, and remove items.
   - The cart total updates automatically.
   - Cart persists between page refreshes (cookie/localStorage or session).

4. **Checkout**
   - As a shopper, I can fill in my name, email, shipping address, and other required info.
   - I can review my order summary and confirm.
   - I see a confirmation page with an order ID.

5. **Admin product & order management**
   - As an admin, I can log in using a protected admin route.
   - I can create/edit/delete products (name, description, price, image URL, stock, category).
   - I can view orders and update their status (pending, paid, shipped, cancelled).

### 2.3 Data model (Prisma-level specification)

- **User** (for admin, optional for shoppers)
  - `id`, `email`, `passwordHash`, `role` (e.g., "ADMIN").

- **Product**
  - `id`, `name`, `slug`, `description`, `price`, `imageUrl`, `category`, `stock`, `createdAt`, `updatedAt`.

- **Order**
  - `id`, `createdAt`, `updatedAt`, `status` ("PENDING" | "PAID" | "SHIPPED" | "CANCELLED").
  - `customerName`, `customerEmail`, `shippingAddress`.

- **OrderItem**
  - `id`, `orderId`, `productId`, `quantity`, `unitPrice`.

- **Cart (implementation detail)**
  - Stored client-side (cookie/localStorage) or session-based; not persisted as DB table in MVP.

### 2.4 Pages & routes (Next.js App Router)

- Public:
  - `/` – Home (featured products).
  - `/products` – Product grid + search/filter.
  - `/products/[slug]` – Product detail.
  - `/cart` – Cart view.
  - `/checkout` – Checkout form + order summary.
  - `/order/success?orderId=...` – Order confirmation.

- Admin:
  - `/admin/login` – Admin login page.
  - `/admin/products` – Product list & management.
  - `/admin/products/new` – Create product.
  - `/admin/products/[id]/edit` – Edit product.
  - `/admin/orders` – Orders list.
  - `/admin/orders/[id]` – Order detail & status update.

- API routes (or server actions) for:
  - Product CRUD.
  - Listing products (with filters).
  - Creating orders from cart data.
  - Admin auth (if done via credentials).

### 2.5 Non-goals (out of scope for MVP)

- Real payment integration (Stripe, PayPal).
- User accounts for shoppers (no saved addresses / order history per logged-in user).
- Inventory management beyond simple stock count.
- Complex discount/coupons, multi-currency, multi-language.

---

## 3. Plan (HOW we will build it – milestones)

**Milestone M1: Project setup & base UI**
- Initialize Next.js (App Router, TypeScript).
- Configure Tailwind CSS.
- Set up Prisma + SQLite, basic models.
- Create layout, navbar, footer, base theme.

**Milestone M2: Products browsing & details**
- Seed demo products in DB.
- Implement `/products` list page with pagination and basic search/filter.
- Implement `/products/[slug]` detail page.

**Milestone M3: Cart & checkout**
- Implement cart state (Zustand or context, with persistence).
- Implement `/cart` page (view, update, remove).
- Implement `/checkout` page (form + validation).
- Implement order creation (API or server action) and `/order/success`.

**Milestone M4: Admin**
- Implement simple admin login (NextAuth or basic credentials).
- Implement admin product CRUD pages.
- Implement admin order list and detail pages.

**Milestone M5: Polish, tests, and docs**
- Implement loading/error/empty states.
- Add minimal tests or manual test checklist.
- Polish UI responsiveness.
- Update `README.md` and ensure `constitution.md` is accurate.

---

## 4. Tasks (DETAILED checklist)

### M1 – Setup & base

1. Create Next.js App Router project with TypeScript.
2. Add Tailwind CSS and basic design system (colors, typography).
3. Configure Prisma with SQLite database.
4. Define Prisma schema for `Product`, `Order`, `OrderItem`, `User` and run migrations.
5. Implement seed script for demo products.
6. Create app-wide layout with header (logo + nav) and footer.
7. Add basic `README.md` and ensure `constitution.md` is in repo.

### M2 – Products

8. Implement `/products` route that fetches from DB using Prisma.
9. Add pagination / simple “Load more” or basic page size.
10. Add search by product name and filter by category.
11. Implement `/products/[slug]` page with full product details.
12. Add “Add to cart” button from product detail and list.

### M3 – Cart & checkout

13. Implement cart store (Zustand or context) with add/remove/update quantity.
14. Persist cart in `localStorage` or cookie.
15. Create `/cart` page showing line items, totals, empty state.
16. Implement `/checkout` form with fields (name, email, shipping address).
17. Validate form on client and server.
18. Implement order creation (API or server action) converting cart → Order + OrderItems in DB.
19. Redirect to `/order/success?orderId=...` on success, showing order summary and clear message.

### M4 – Admin

20. Implement `/admin/login` with a hardcoded admin user from DB (email/password) using a simple auth strategy (NextAuth or custom).
21. Protect all `/admin/*` routes so only logged-in admin can access.
22. Implement `/admin/products` list with links to create/edit.
23. Implement `/admin/products/new` page (product creation form).
24. Implement `/admin/products/[id]/edit` page (edit product form).
25. Implement `/admin/orders` list page.
26. Implement `/admin/orders/[id]` page to view items and update status.

### M5 – Polish & docs

27. Add loading states (skeletons or spinners) for product, cart, and admin pages.
28. Add error boundaries / display API errors nicely.
29. Ensure mobile-first responsiveness for all main pages.
30. Write a manual test checklist (scenarios for browsing, cart, checkout, admin).
31. Update `README.md` with setup instructions, scripts, and feature list.
32. Do a full end-to-end manual run to verify all flows.

---

## 5. Implement (Execution rules)

When implementing, always:

1. **Follow the Constitution and Specification**  
   - Do not add new features that are not described here unless you update this file first.

2. **Implement milestone by milestone**  
   - Finish all tasks for M1, then M2, etc.
   - For each task, ensure code compiles and pages work before moving on.

3. **Keep code organized**  
   - Group features logically under `app/` routes.
   - Keep shared components (buttons, inputs, layout pieces) in a `components/` folder.
   - Keep DB access in a clear, reusable place (e.g., `lib/db.ts` + Prisma client).

4. **Validate & test**  
   - After each milestone, run through core user flows.
   - Fix any blocking bugs before moving to the next milestone.

5. **Document as you go**  
   - Update `README.md` when adding new scripts or environment variables.
   - If any decision deviates from this document, explain briefly in `README.md` or here.

This `constitution.md` is the single source of truth for the project.