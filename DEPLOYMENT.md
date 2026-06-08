# DKM — Deployment Guide

For complete product and architecture documentation, see [PRODUCT_DOCUMENTATION.md](../PRODUCT_DOCUMENTATION.md).

## Recommended platform: Vercel

### Prerequisites

- Vercel account
- Neon PostgreSQL database
- Gmail account with App Password
- Cloudinary account (for admin image uploads)

### Steps

1. Push code to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add environment variables (see below)
5. Deploy

### Environment variables (production)

```
DATABASE_URL=postgresql://...?sslmode=require
ADMIN_PASSWORD=<strong-password>
OFFICER_PASSWORD=<strong-password>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_SECURE=true
NOTIFICATION_EMAIL=admin@yourcompany.com
ADMIN_EMAILS=admin@yourcompany.com,officer@yourcompany.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Build settings

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Install Command | `npm install` |

Add to `package.json` scripts if not present:

```json
"postinstall": "prisma generate"
```

## Database setup

1. Create a Neon project at [neon.tech](https://neon.tech)
2. Copy the connection string → `DATABASE_URL`
3. After first deploy, run against production DB:

```bash
cd frontend
npx prisma db push
```

## Security checklist

- [ ] Change `ADMIN_PASSWORD` and `OFFICER_PASSWORD` from defaults
- [ ] Use production `DATABASE_URL` with SSL
- [ ] Deploy `public/images/` assets
- [ ] Configure custom domain with SSL
- [ ] Enable Neon automated backups
- [ ] Test full order flow after deploy

## Post-deployment verification

1. Submit a test order from the public site
2. Log in to `/admin/orders`
3. Accept the test order
4. Confirm customer and admin emails are delivered
5. Check `/admin/notifications` for the alert

## Alternative platforms

| Platform | Configuration |
|----------|---------------|
| Netlify | Base directory: `frontend` |
| Railway | Node.js + PostgreSQL addon |
| Docker | See Dockerfile example below |
| VPS | `npm run build && npm run start` behind nginx |

### Docker (optional)

```dockerfile
FROM node:18-alpine AS base
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails on Prisma | Ensure `DATABASE_URL` is set in build environment; add `postinstall: prisma generate` |
| Emails not sending | Verify Gmail App Password; check `EMAIL_USER` and `EMAIL_PASS` |
| Admin login fails | Confirm `ADMIN_PASSWORD` / `OFFICER_PASSWORD` are set in hosting env |
| Images broken | Ensure `public/images/` directory is deployed |
| Admin orders empty | Run `npx prisma db push`; verify `DATABASE_URL` points to correct database |
