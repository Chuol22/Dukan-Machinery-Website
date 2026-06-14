# DKM — Developer Setup Guide

Quick reference for running the project locally. For complete product documentation, see [PRODUCT_DOCUMENTATION.md](../PRODUCT_DOCUMENTATION.md).

## Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) recommended)
- Gmail account with App Password for email notifications

## Installation

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` with your database URL, email credentials, admin passwords, and Cloudinary keys.

## Database setup

```bash
npx prisma generate
npx prisma db push
```

## Run locally

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## Default admin credentials (development)

| Role          | Email                        | Password env var                        |
| ------------- | ---------------------------- | --------------------------------------- |
| Super Admin   | `admin@dukanmachinery.com`   | `ADMIN_PASSWORD` (default: `admin`)     |
| Sales Officer | `officer@dukanmachinery.com` | `OFFICER_PASSWORD` (default: `officer`) |

## Verify the order flow

1. Submit an order from `/order`
2. Open `/admin/orders` — order should appear as **Pending**
3. Accept or reject — customer receives email, status updates in dashboard

## Environment variables

See `.env.example` for the full list. Required variables:

- `DATABASE_URL`
- `ADMIN_PASSWORD`
- `OFFICER_PASSWORD`
- `EMAIL_USER`
- `EMAIL_PASS`

## Production build

```bash
npm run build
npm run start
```
