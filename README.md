# DKM - Industrial Machinery Platform

Next.js application for machinery sales, customer orders, and admin operations.

## Tech stack

| Layer     | Technology                                  |
| --------- | ------------------------------------------- |
| Framework | Next.js 16.2.2, React 19, TypeScript        |
| Styling   | Tailwind CSS 4 (`app/globals.css`)          |
| Database  | PostgreSQL (Neon) + Prisma 5                |
| Images    | Cloudinary (admin uploads)                  |
| Email     | Nodemailer (Gmail SMTP)                     |
| Auth      | Cookie-based admin sessions (`lib/auth.ts`) |

## Features

- **Public site** — machine catalog, product pages, order submission, chatbot, multi-language (Google Translate)
- **Admin dashboard** — order review (accept/reject), machine CRUD, notifications, image upload
- **API** — REST routes under `app/api/`

## Project structure

```
frontend/
├── app/
│   ├── admin/           # Dashboard, orders, machines, notifications, login
│   ├── api/             # Backend API routes
│   │   ├── admin/       # Protected admin endpoints
│   │   ├── machines/    # Machine CRUD
│   │   ├── send-order/  # Customer order submission
│   │   └── upload/      # Cloudinary image upload
│   ├── machines/        # Public catalog pages
│   ├── order/           # Order form
│   └── globals.css      # Global styles and theme tokens
├── components/
│   ├── home/            # Homepage sections
│   ├── machines/        # Catalog components
│   ├── order/           # Order forms
│   ├── chatbot/         # AI chatbot UI
│   ├── layout/          # Header, footer, wrappers
│   └── ui/              # Shared Button component
├── config/              # Site config (social links)
├── contexts/            # Theme and chatbot state
├── data/                # Static machine catalog data
├── lib/
│   ├── auth.ts          # Admin session verification (shared by all admin APIs)
│   ├── prisma.ts        # Database client
│   └── cloudinary.ts    # Image upload helpers
├── prisma/              # Schema and seed
├── public/              # Static files (robots.txt, manifest)
├── types/               # TypeScript types
└── utils/               # Chatbot AI logic
```

## Getting started

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin access

| Route                  | Purpose                  |
| ---------------------- | ------------------------ |
| `/admin`               | Dashboard                |
| `/admin/orders`        | Review and manage orders |
| `/admin/machines`      | Machine inventory        |
| `/admin/notifications` | Order alerts             |

Default credentials (change in production via `.env`):

- Admin: `admin` / value of `ADMIN_PASSWORD`
- Officer: `officer` / value of `OFFICER_PASSWORD`

## API routes

| Endpoint                        | Method     | Auth   | Purpose                    |
| ------------------------------- | ---------- | ------ | -------------------------- |
| `/api/send-order`               | POST       | Public | Submit customer order      |
| `/api/machines`                 | GET        | Public | List machines              |
| `/api/machines`                 | POST       | Admin  | Create machine             |
| `/api/machines/[id]`            | PUT/DELETE | Admin  | Update/delete machine      |
| `/api/admin/orders`             | GET        | Admin  | List orders                |
| `/api/admin/orders/[id]/accept` | POST       | Admin  | Accept order               |
| `/api/admin/orders/[id]/reject` | POST       | Admin  | Reject order               |
| `/api/admin/notifications`      | GET/PUT    | Admin  | Notifications              |
| `/api/upload`                   | POST       | Admin  | Upload image to Cloudinary |

## Architecture notes

### Machine data (important)

- **Public catalog** reads from `data/machinesData.ts` (static TypeScript file).
- **Admin panel** reads/writes machines via Prisma (`/api/machines`).
- Admin changes do **not** automatically appear on the public site. To unify, migrate public pages to fetch from the API or sync the static file from the database.

### Static assets

Brand and product images are referenced as `/images/...` under `public/images/`. Ensure this folder is included in deployment.

### Authentication

All admin API routes import `verifyAdminSession()` from `lib/auth.ts`. The admin UI checks session client-side in `AdminLayoutClient.tsx`.

## Database

Main models: `Category`, `Machine`, `Profile`, `Order`, `OrderItem`, `Notification`, `Address`.

```bash
npx prisma studio    # Visual database browser
npx prisma db push   # Apply schema changes
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## Documentation

| Document                                                   | Purpose                               |
| ---------------------------------------------------------- | ------------------------------------- |
| [../PRODUCT_DOCUMENTATION.md](../PRODUCT_DOCUMENTATION.md) | **Complete product handover for CTO** |
| [SETUP.md](./SETUP.md)                                     | Local developer setup                 |
| [DEPLOYMENT.md](./DEPLOYMENT.md)                           | Production deployment                 |
