# Niramoy Backend

Niramoy Backend is a TypeScript and Express based REST API for an online medicine marketplace. It supports customer, seller, and admin workflows including authentication, seller onboarding, medicine management, cart and order processing, reviews, and role-specific dashboard statistics.

## Highlights

- Email and password authentication with Better Auth
- Google OAuth login flow
- OTP-based email verification and password reset
- Role-based access control for `CUSTOMER`, `SELLER`, and `ADMIN`
- Seller profile creation with automatic role upgrade
- Category and manufacturer management
- Seller-managed medicine catalog with Cloudinary uploads
- Cart management and order placement
- Review and rating system
- Role-aware dashboard statistics
- Prisma ORM with PostgreSQL

## Tech Stack

- Runtime: Node.js
- Language: TypeScript
- Framework: Express 5
- Authentication: Better Auth, JWT, cookie-based sessions
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- File Upload: Multer, Cloudinary
- Email: Nodemailer, EJS templates
- Build Tool: tsup

## Core Features

### Authentication and Identity

- Register and login users
- Refresh tokens using cookies
- Change password for authenticated users
- Verify email with OTP
- Reset password with OTP
- Login with Google OAuth
- Better Auth internal routes mounted at `/api/auth`
- Custom project auth routes mounted at `/api/v1/auth`

### Role-Based Workflows

- Customers can browse medicines, manage cart, place orders, and review delivered items
- Customers can become sellers through `POST /seller/create-profile`
- Sellers can create, update, list, and soft-delete their medicines
- Admins can manage user status and maintain category and manufacturer data

### Commerce Flow

- Public medicine browsing
- Customer cart with subtotal recalculation
- Stock-aware order placement
- Seller order status progression
- Order cancellation for eligible customer orders
- Review system tied to delivered order items only

## Project Structure

```text
Niramoy-Backend/
├── prisma/
│   ├── migrations/
│   ├── schema/
│   │   ├── auth.prisma
│   │   ├── cart.prisma
│   │   ├── category.prisma
│   │   ├── enums.prisma
│   │   ├── manufacturer.prisma
│   │   ├── medicine.prisma
│   │   ├── order.prisma
│   │   ├── orderItem.prisma
│   │   ├── review.prisma
│   │   ├── seller.prisma
│   │   ├── sellerOrder.prisma
│   │   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── config/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── module/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── category/
│   │   │   ├── manufacturer/
│   │   │   ├── medincine/
│   │   │   ├── order/
│   │   │   ├── review/
│   │   │   ├── seller/
│   │   │   └── stats/
│   │   ├── routes/
│   │   ├── shared/
│   │   ├── templates/
│   │   └── utils/
│   ├── generated/
│   ├── app.ts
│   └── server.ts
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── tsup.config.ts
```

Note: the module folder is named `medincine` in the repository, while the public API path is `/medicine`.

## API Base Paths

- Root health route: `/`
- Better Auth routes: `/api/auth/*`
- App routes: `/api/v1/*`

## API Modules Summary

- `/api/v1/auth`
  Registration, login, profile, password flows, email verification, and Google OAuth helpers.
- `/api/v1/seller`
  Customer to seller conversion.
- `/api/v1/category`
  Category CRUD, admin-managed.
- `/api/v1/manufacturer`
  Manufacturer CRUD, admin-managed.
- `/api/v1/medicine`
  Public medicine browsing plus seller medicine management.
- `/api/v1/cart`
  Customer cart operations.
- `/api/v1/order`
  Customer ordering, seller status updates, and order detail or listing views for customer, seller, and admin.
- `/api/v1/review`
  Delivered-order review workflow.
- `/api/v1/admin`
  User listing and status management.
- `/api/v1/stats`
  Role-specific dashboard data.

## Authentication Notes

This project uses cookie-based authentication for protected routes.

Protected endpoints expect:

- `accessToken`
- `refreshToken` for token refresh flow
- `better-auth.session_token`

Important behavior:

- Middleware checks the Better Auth session cookie and the JWT access token
- Seller creation changes the user role from `CUSTOMER` to `SELLER`
- After seller profile creation, client cookies and stored tokens must be refreshed before calling seller-only routes

## Environment Variables

The application validates required environment variables on startup. A full `.env` is needed even for many local operations because config loading is eager.

Create a `.env` file with at least:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME

BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d
BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN=1d
BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE=1d

EMAIL_SENDER_SMTP_USER=your_smtp_user
EMAIL_SENDER_SMTP_PASS=your_smtp_password
EMAIL_SENDER_SMTP_HOST=smtp.example.com
EMAIL_SENDER_SMTP_PORT=465
EMAIL_SENDER_SMTP_FROM=no-reply@example.com

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

FRONTEND_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123
```

## Prerequisites

Before running locally, make sure you have:

- Node.js 18 or newer
- npm
- PostgreSQL database
- Cloudinary account for file upload features
- SMTP credentials for OTP and email templates
- Google OAuth credentials for Google login testing

## Local Setup

### 1. Clone and install dependencies

```bash
git clone <your-repository-url>
cd Niramoy-Backend
npm install
```

### 2. Configure environment variables

Create a `.env` file using the required variables listed above.

### 3. Generate Prisma client

```bash
npm run generate
```

### 4. Apply database migrations

```bash
npm run migrate
```

If you want to sync schema directly without creating a migration:

```bash
npm run push
```

### 5. Start the development server

```bash
npm run dev
```

The server starts on:

```text
http://localhost:5000
```

### 6. Build for production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev`
  Start the server in watch mode using `tsx`.
- `npm run build`
  Bundle the app with `tsup`.
- `npm start`
  Run the compiled server from `dist/server.js`.
- `npm run lint`
  Run ESLint against `src`.
- `npm run generate`
  Generate Prisma client.
- `npm run migrate`
  Run Prisma development migrations.
- `npm run push`
  Push Prisma schema to the database.
- `npm run pull`
  Pull database schema into Prisma.
- `npm run studio`
  Open Prisma Studio.

## Response Conventions

Successful API responses follow a common structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Errors are returned through a centralized global error handler:

```json
{
  "success": false,
  "message": "Error message",
  "errorSources": [
    {
      "path": "fieldName",
      "message": "Details"
    }
  ]
}
```

## File Upload Behavior

File upload endpoints use Cloudinary through Multer storage.

- Upload field name: `file`
- Multipart JSON payload field name: `data`
- Upload endpoints:
  - `PATCH /api/v1/auth/update-me`
  - `POST /api/v1/medicine`
  - `PATCH /api/v1/medicine/:id`


## Suggested Workflow For New Developers

1. Set up PostgreSQL and create the database.
2. Add all required environment variables.
3. Run `npm install`.
4. Run `npm run generate`.
5. Run `npm run migrate`.
6. Start the server with `npm run dev`.
7. Import the Postman collection for manual API testing if needed.

## License

This project is currently published with the `ISC` license as declared in `package.json`.
