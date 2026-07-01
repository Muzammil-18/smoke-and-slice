# SMOKE & SLICE - Premium Restaurant Ordering Website

Smoke & Slice is a production-style, fully responsive full-stack restaurant ordering web application. It features slow-smoked BBQ branding with an elegant, modern dark UI styling, seamless guest checkouts, custom analytics dashboards, and an administration control panel.

---

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, Chart.js, React-ChartJS-2
- **Backend**: Node.js, Express.js, JWT, Bcrypt.js
- **Database & ORM**: PostgreSQL, Prisma ORM

---

## Folder Structure

```text
Smoke & Slice/
├── backend/
│   ├── config/
│   │   └── db.js               # Prisma client sharing module
│   ├── controllers/
│   │   ├── adminController.js  # Sales analytics & dashboard stats
│   │   ├── authController.js   # JWT register, login & profile
│   │   ├── menuController.js   # Category & MenuItem CRUD
│   │   └── orderController.js  # Guest & user order processors
│   ├── middleware/
│   │   └── authMiddleware.js   # Route protection & admin verification
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema models
│   │   └── seed.js             # Initial database seeder script
│   ├── routes/
│   │   └── apiRouter.js        # Combined master router
│   ├── .env                    # Environment settings
│   ├── server.js               # App entrypoint
│   └── package.json            # Node backend packages configuration
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AdminLayout.jsx # Collapsible admin sidebar layout
    │   │   ├── AnalyticsCharts.jsx # Responsive Chart.js configurations
    │   │   ├── FoodCard.jsx    # Dish card with hover effects
    │   │   └── Layout.jsx      # Navigation drawer & footer layout
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminCategories.jsx # Category CRUD dashboard
    │   │   │   ├── AdminCustomers.jsx  # Searchable customer ledger
    │   │   │   ├── AdminDashboard.jsx   # Key stats & sales graphs
    │   │   │   ├── AdminMenu.jsx       # MenuItem CRUD dashboard
    │   │   │   └── AdminOrders.jsx     # Accept/Deliver prep controls
    │   │   ├── About.jsx       # Brand narrative & chefs details
    │   │   ├── Cart.jsx        # Table/card checkout preview
    │   │   ├── Checkout.jsx    # Guest / user invoice details form
    │   │   ├── Contact.jsx     # Responsive messages form
    │   │   ├── Home.jsx        # Premium landing page
    │   │   ├── Login.jsx       # Customer session credentials
    │   │   ├── Menu.jsx        # Searchable food grid
    │   │   ├── MyOrders.jsx    # Collapsible customer orders log
    │   │   ├── OrderSuccess.jsx# Thank you & invoice tracker page
    │   │   ├── Profile.jsx     # Delivery parameters editor
    │   │   └── Register.jsx    # Client signup credentials
    │   ├── App.jsx             # React routing & central state
    │   ├── index.css           # Global custom scrollbars & glass styling
    │   └── main.jsx            # React root mount
    ├── index.html              # Main HTML skeleton
    ├── tailwind.config.js      # Custom theme colors (Light Red / Black)
    └── package.json            # Vite frontend dependencies
```

---

## Installation & Setup Instructions

### 1. PostgreSQL Database Configuration
1. Open your PostgreSQL console or pgAdmin.
2. Create a new database named `smoke_slice`:
   ```sql
   CREATE DATABASE smoke_slice;
   ```
3. Open the backend configuration file `backend/.env`. Update the `DATABASE_URL` with your local PostgreSQL credentials:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/smoke_slice?schema=public"
   ```

### 2. Synchronize & Generate Database Models
Navigate to the `backend/` directory in your terminal and run the following command to synchronize the database schema and generate local Prisma Client bindings:
```bash
# Generate the Prisma Client
node "./node_modules/prisma/build/index.js" generate

# Sync the schema to your PostgreSQL database
node "./node_modules/prisma/build/index.js" db push
```

### 3. Seed Starter Food Categories & Admin Account
Insert default food categories, realistic Unsplash food images, and register the default Admin and Customer profiles:
```bash
npm run prisma:seed
```

---

## Run Commands

### 1. Launch the Backend Server
Start the Express API server (runs on `http://localhost:5000`):
```bash
cd backend
npm run dev
```

### 2. Launch the React Frontend
Start the Vite development server (runs on `http://localhost:5173`):
```bash
cd frontend
npm run dev
```
*Vite automatically forwards all `/api/*` network requests to `http://localhost:5000/api/*` using the proxy.*

---

## Pre-Registered Logins

Use these default credentials after seeding to test the application flows:

### Administration Portal Access
- **Url**: `http://localhost:5173/admin`
- **Email**: `admin@smokeslice.com`
- **Password**: `admin123`

### Standard Registered Customer
- **Email**: `john@example.com`
- **Password**: `user123`

---

## Responsiveness & Testing Layouts

This website is designed mobile-first and works fluidly across:
- **Mobile (320px and above)**: Custom sliding hamburger menu, grid elements stack vertically, and the admin panel sidebar collapses into a drawer button.
- **Tablets (768px)**: Optimized card layouts and double-column admin lists.
- **Desktop/Laptop (1024px and above)**: Full-width sticky navigation bars, responsive sales charts, and double column layouts for forms and carts.
