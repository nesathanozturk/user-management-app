# User Management

A full-stack user management system built with Next.js, PostgreSQL, and Docker. Features JWT authentication, paginated user listing with age filtering, single and bulk user creation via Excel upload, and a responsive dashboard UI.

## Tech Stack

| Layer            | Technology                               |
| ---------------- | ---------------------------------------- |
| Framework        | Next.js 16 (App Router, Turbopack)       |
| Language         | TypeScript 5                             |
| Database         | PostgreSQL 16                            |
| ORM              | Prisma 7                                 |
| Authentication   | JWT via `jose` (Edge Runtime compatible) |
| Styling          | Tailwind CSS 4                           |
| Forms            | React Hook Form + Zod 4                  |
| Data Fetching    | TanStack React Query 5                   |
| Icons            | Lucide React                             |
| Excel Parsing    | SheetJS (xlsx)                           |
| Containerization | Docker + Docker Compose                  |

## Features

- **JWT Authentication** — Cookie-based httpOnly tokens, middleware-protected routes
- **User Dashboard** — Paginated table with age range filtering, URL search params sync
- **Single User Creation** — Form with client + server validation
- **Bulk User Import** — Excel file upload (.xlsx/.xls) with row-level validation and atomic transactions
- **User Detail View** — Individual user profile pages
- **Toast Notifications** — Success/error feedback across all operations
- **Responsive Design** — Mobile-friendly with collapsible sidebar
- **Dockerized** — One-command deployment with PostgreSQL

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- Node.js 20+ (for local development only)

### Run with Docker

```bash
# Clone the repository
git clone <repository-url>
cd user-management-app

# Start all services
docker compose up --build -d

# Application will be available at http://localhost:3000
```

The entrypoint script automatically:

1. Waits for PostgreSQL to be ready
2. Runs database migrations
3. Seeds the default admin user
4. Starts the application

### Default Credentials

| Email           | Password | Role  |
| --------------- | -------- | ----- |
| admin@admin.com | admin    | Admin |

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env — set DATABASE_URL to point to your PostgreSQL instance

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Login page (/)
│   ├── layout.tsx                        # Root layout (QueryProvider, ToastProvider)
│   ├── globals.css                       # Global styles
│   ├── dashboard/
│   │   ├── layout.tsx                    # Dashboard layout (Sidebar, responsive)
│   │   ├── page.tsx                      # User list with filters & pagination
│   │   ├── add/
│   │   │   └── page.tsx                  # Single user creation
│   │   ├── addMany/
│   │   │   └── page.tsx                  # Bulk Excel upload
│   │   └── [userId]/
│   │       └── page.tsx                  # User detail view
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts            # POST — authenticate user
│       │   └── logout/route.ts           # POST — clear auth cookie
│       └── users/
│           ├── route.ts                  # GET — list users, POST — create user
│           ├── [userId]/route.ts         # GET — single user detail
│           └── bulk/route.ts             # POST — Excel bulk upload
├── components/
│   ├── ui/
│   │   ├── Button.tsx                    # Button (variants, sizes, loading state)
│   │   ├── Input.tsx                     # Input (label, error, number validation)
│   │   ├── Pagination.tsx                # Page navigation
│   │   ├── Toast.tsx                     # Toast notifications (provider + hook)
│   │   ├── LoadingSpinner.tsx            # Spinner (sm, md, lg)
│   │   └── ErrorMessage.tsx              # Error alert box
│   ├── Sidebar.tsx                       # Navigation sidebar (responsive)
│   ├── LoginForm.tsx                     # Login form
│   ├── UserTable.tsx                     # User data table
│   ├── UserForm.tsx                      # User creation form
│   ├── AgeFilter.tsx                     # Age range filter
│   └── ExcelUpload.tsx                   # Drag & drop Excel upload
├── hooks/
│   ├── useAuth.ts                        # Login mutation hook
│   └── useUsers.ts                       # User CRUD hooks (React Query)
├── lib/
│   ├── auth.ts                           # JWT sign/verify, cookie config
│   ├── prisma.ts                         # Prisma client singleton
│   ├── validations.ts                    # Zod schemas
│   └── utils.ts                          # Utility functions (cn, formatDate)
├── providers/
│   └── QueryProvider.tsx                 # React Query provider
├── types/
│   └── index.ts                          # TypeScript type definitions
└── middleware.ts                          # Auth middleware (Edge Runtime)

prisma/
├── schema.prisma                         # Database schema
├── seed.ts                               # Admin user seed script
└── migrations/                           # Database migrations

docker/
└── entrypoint.sh                         # Container startup script
```

## API Reference

### Authentication

#### Login

```
POST /api/auth/login
```

| Field    | Type   | Required | Description         |
| -------- | ------ | -------- | ------------------- |
| email    | string | Yes      | Valid email address |
| password | string | Yes      | User password       |

**Response (200)**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@admin.com",
    "role": "admin"
  }
}
```

Sets an httpOnly cookie named `token` with a JWT (24h expiry).

#### Logout

```
POST /api/auth/logout
```

Clears the authentication cookie.

---

### Users

All user endpoints require authentication (valid JWT cookie).

#### List Users

```
GET /api/users?page=1&limit=10&minAge=20&maxAge=30
```

| Parameter | Type    | Default | Description              |
| --------- | ------- | ------- | ------------------------ |
| page      | integer | 1       | Page number              |
| limit     | integer | 10      | Items per page (max 100) |
| minAge    | integer | —       | Minimum age filter       |
| maxAge    | integer | —       | Maximum age filter       |

**Response (200)**

```json
{
  "users": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "age": 25,
      "role": "user",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### Create User

```
POST /api/users
Content-Type: application/json
```

| Field     | Type    | Required | Validation          |
| --------- | ------- | -------- | ------------------- |
| firstName | string  | Yes      | Min 2 characters    |
| lastName  | string  | Yes      | Min 2 characters    |
| email     | string  | Yes      | Valid email, unique |
| age       | integer | Yes      | 1–150               |
| password  | string  | Yes      | Min 6 characters    |

**Response (201)**

```json
{
  "success": true,
  "user": { ... }
}
```

#### Get User

```
GET /api/users/:userId
```

Returns a single user by UUID. Password is never included in any response.

#### Bulk Upload

```
POST /api/users/bulk
Content-Type: multipart/form-data
```

Upload an Excel file (.xlsx or .xls, max 5MB) with the following columns:

| name | surname | email            | age | password |
| ---- | ------- | ---------------- | --- | -------- |
| John | Doe     | john@example.com | 25  | pass123  |
| Jane | Smith   | jane@example.com | 30  | pass456  |

**Validation**:

- Each row is validated against the schema
- Duplicate emails are checked within the file and against the database
- If **any** row fails validation, **no users are created** (atomic transaction)

**Success Response (201)**

```json
{
  "success": true,
  "message": "Successfully created 2 users",
  "count": 2
}
```

**Error Response (400)**

```json
{
  "success": false,
  "message": "Validation failed for 2 rows",
  "errors": [
    { "row": 2, "field": "email", "message": "Invalid email format" },
    { "row": 3, "field": "age", "message": "Age must be a positive integer" }
  ]
}
```

## Database

### Schema

```prisma
model User {
  id        String   @id @default(uuid())
  firstName String
  lastName  String
  email     String   @unique
  age       Int
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

### Seed Data

The seed script creates a default admin user:

| Field    | Value                 |
| -------- | --------------------- |
| Email    | admin@admin.com       |
| Password | admin (bcrypt hashed) |
| Role     | admin                 |

## Docker

### Commands

```bash
# Start all services
docker compose up -d

# Rebuild and start
docker compose up --build -d

# View logs
docker compose logs -f app

# Stop services
docker compose down

# Stop and remove volumes (resets database)
docker compose down -v
```

## Environment Variables

| Variable              | Description                       | Default                                                       |
| --------------------- | --------------------------------- | ------------------------------------------------------------- |
| `DATABASE_URL`        | PostgreSQL connection string      | `postgresql://postgres:postgres@db:5432/userdb?schema=public` |
| `JWT_SECRET`          | Secret key for signing JWT tokens | — (required)                                                  |
| `NEXT_PUBLIC_API_URL` | Public API base URL               | `http://localhost:3000`                                       |
