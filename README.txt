ZeeCrumb — Full-Stack E-Commerce Platform
==========================================

Github repo: https://github.com/ZiadAhmedWeb/ZiadAhmedSoliman-Deci-ecommerce.git

OVERVIEW
--------
ZeeCrumb is a full-stack e-commerce web application supporting customer
and admin roles. Customers can browse products, search/filter/sort,
manage a shopping cart, check out, and leave reviews. Admins can manage
products and categories through a dedicated dashboard.

TECH STACK
----------
Frontend:
- React (Vite)
- React Router
- Axios
- Context API (authentication state)
- Vitest + React Testing Library + MSW (component testing)

Backend:
- Node.js + Express.js
- PostgreSQL + Prisma ORM (primary application data)
- MongoDB Atlas + Mongoose (request logging)
- JWT authentication + bcrypt password hashing
- Multer (image upload)
- Jest + Supertest (unit + integration testing)

DevOps:
- Docker (separate Dockerfiles for frontend/backend)
- Docker Compose (orchestrates frontend, backend, and PostgreSQL)

FEATURES
--------
Authentication & Authorization:
- User registration and login with JWT authentication
- Password hashing with bcrypt
- Role-based access control (customer vs admin)
- Protected routes on both frontend and backend
- User profile page (view account details)

Product Catalog:
- Full product CRUD (admin only: create, edit, delete)
- Product image upload (admin)
- Category management — separate Category model with CRUD (admin)
- Product search by name
- Filter by category
- Sort by price (low/high) or name
- Pagination
- Product detail page with category tag, price, stock, and description

Shopping & Checkout:
- Shopping cart (add, update quantity, remove items)
- Cart persists per logged-in user (stored in database, not local state)
- Checkout flow with delivery address input
- Automatic stock validation and deduction on checkout (prevents
  over-ordering, uses a database transaction so stock and cart updates
  succeed or fail together)

Reviews & Ratings:
- Customers can leave a star rating (1-5) and written comment on any
  product
- One review per user per product (enforced server-side)
- Reviews are persisted in the database and survive page refresh
- Average rating and review count displayed on product detail page
- All reviews for a product displayed with reviewer email and comment

Admin Dashboard:
- Product management (create, edit, delete, upload image)
- Category management (create, delete)
- All admin routes protected by role-based middleware

Home Page:
- Hero banner with call-to-action
- Category quick-link tiles
- Rotating featured product carousel (pulled from real product data)
- About section
- Contact section
- Founder card

Logging & Monitoring:
- Every API request logged to MongoDB Atlas (method, route, status
  code, user ID, timestamp) via Mongoose, independent of the main
  PostgreSQL application data

Design:
- Responsive layout (mobile and desktop)
- Custom color palette and consistent styling across all pages

HOW TO RUN — DOCKER (RECOMMENDED)
----------------------------------
Requirements: Docker Desktop installed and running.

1. Clone the repository.
2. At the project root, create a file named ".env" containing:
     MONGO_URI="your-mongodb-atlas-connection-string"
3. From the project root, run:
     docker-compose up --build
4. Wait for all three containers (postgres, backend, frontend) to start.
   Database migrations run automatically on backend startup, and the
   database is pre-seeded with sample products, categories, and a demo
   admin account via backup.sql (restores automatically on first run).
5. Open http://localhost:5173 in your browser.

HOW TO RUN — LOCAL (WITHOUT DOCKER)
-------------------------------------
Requirements: Node.js, PostgreSQL installed locally.

Backend:
1. cd Backend
2. npm install
3. Create a ".env" file in Backend/ with:
     DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ecommerce_db"
     JWT_SECRET="your-secret-string"
     MONGO_URI="your-mongodb-atlas-connection-string"
     PORT=5000
4. npx prisma migrate dev
5. npm run dev

Frontend:
1. cd Frontend
2. npm install
3. npm run dev
4. Open http://localhost:5173

RUNNING TESTS
-------------
Backend (Jest + Supertest):
   cd Backend
   npm test

Frontend (Vitest + React Testing Library + MSW):
   cd Frontend
   npm test

PROJECT URLS
------------
Frontend:        http://localhost:5173
Backend API:      http://localhost:5000/api
Prisma Studio:    npx prisma studio (run from Backend/)

TEST ACCOUNTS
--------------
Admin:
   Email:    admin@zeecrumb.com
   Password: admin123

Customer:
   Register a new account at /register — any customer account created
   this way can browse products, use the cart, check out, and leave
   reviews.

KNOWN LIMITATIONS / FUTURE IMPROVEMENTS
-----------------------------------------
- JWT is stored in localStorage for simplicity. A production version
  would use httpOnly cookies to reduce XSS exposure.
- Frontend testing uses Vitest (Vite's native test runner) rather than
  Jest, since the project uses Vite; the testing approach and tooling
  (React Testing Library + MSW) match the assignment requirements.
- Checkout is simplified: it validates and deducts stock and clears the
  cart, but does not persist a full order history record.

AUTHOR
------
Zee
