# Design Document

## Admin Dashboard Enhancements

---

## Overview

This design covers a comprehensive enhancement of the existing DKM Machinery admin dashboard. The additions are:

- **Prisma schema extensions**: Customer, MachineInquiry, and Quotation models; Order FK to Customer; Machine `availability_status` enum replacing the boolean toggle.
- **Machine Inquiry system**: public `POST /api/inquiries` endpoint, a standalone `/inquiry` page, an "Ask a Question" button on machine detail pages, and an `/admin/inquiries` management page.
- **Customer Management page**: `/admin/customers` backed by `GET /api/admin/customers`, auto-populated from orders and inquiries.
- **Quotation system**: in-order quotation form, `@react-pdf/renderer` PDF generation (server-side, base64 attachment), Nodemailer delivery, and `POST /api/admin/orders/[id]/quotation`.
- **Analytics Dashboard**: replaces the static `/admin` page with live Recharts charts backed by `GET /api/admin/analytics`.
- **Enhanced Notification Center**: `NotificationBell` component with 30-second polling, dropdown preview of latest 5, and automatic `inventory_alert` notifications on out-of-stock status changes.
- **Admin Sidebar updates**: new nav items for Customers, Inquiries, and Analytics; updated breadcrumb logic.
- **Machine status system**: six-value `availability_status` string field with colour-coded badges replacing the boolean toggle.

All new server components reuse the existing `lib/prisma.ts` singleton and the `verifyAdminSession` pattern from `lib/auth.ts`. All new packages required are `recharts` and `@react-pdf/renderer`.

---

## Architecture

### High-Level Data Flow

```mermaid
graph TD
    subgraph Public
        A[/machines/slug] -->|"Ask a Question"| B[InquiryForm]
        B -->|POST| C[/api/inquiries]
        D[/inquiry] -->|form submit| C
    end

    subgraph Admin API
        C -->|upsert Customer, create MachineInquiry, Notification| DB[(PostgreSQL)]
        E[/api/admin/inquiries] -->|CRUD| DB
        F[/api/admin/customers] -->|read| DB
        G[/api/admin/analytics] -->|aggregations| DB
        H[/api/admin/orders/id/quotation] -->|create Quotation, generate PDF, send email| DB
        I[/api/machines/id PUT] -->|update availability_status + is_available| DB
    end

    subgraph Admin UI
        J[/admin] -->|GET analytics| G
        K[/admin/inquiries] -->|GET/PUT| E
        L[/admin/customers] -->|GET| F
        M[/admin/orders] -->|Create Quotation| H
        N[AdminLayoutClient] -->|NotificationBell polls| O[/api/admin/notifications]
        DB --> O
    end
```

### Request Lifecycle — Quotation Creation

```mermaid
sequenceDiagram./
    participant A as Admin Browser
    participant R as /api/admin/orders/[id]/quotation
    participant DB as PostgreSQL
    participant PDF as @react-pdf/renderer (server)
    participant Mail as Nodemailer (Gmail)

    A->>R: POST { machineCost, shippingCost, … }
    R->>DB: verify admin session
    R->>DB: fetch Order + Customer
    R->>DB: create Quotation (status=draft)
    R->>PDF: renderToBuffer(QuotationDocument)
    PDF-->>R: Buffer (base64)
    R->>Mail: sendMail({ attachments: [{ content: buffer }] })
    alt Mail success
        R->>DB: update Order.status = quotation_sent
        R->>DB: update Quotation.status = sent
        R-->>A: 200 { quotationId, quotationNumber }
    else Mail fails
        R-->>A: 500 { error: "Email delivery failed" }
    end
```

---

## Components and Interfaces

### New API Routes

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/inquiries` | POST | None | Public inquiry submission |
| `/api/admin/inquiries` | GET | Admin | List all MachineInquiry records |
| `/api/admin/inquiries/[id]` | PUT | Admin | Update inquiry status |
| `/api/admin/customers` | GET | Admin | List all Customer records |
| `/api/admin/analytics` | GET | Admin | Aggregated dashboard data |
| `/api/admin/orders/[id]/quotation` | POST | Admin | Create quotation, generate PDF, email customer |

The existing `/api/machines/[id]` PUT handler is extended to accept `availability_status` and sync `is_available`.

### New Pages

| Path | Type | Description |
|---|---|---|
| `/inquiry` | Public | Standalone inquiry form |
| `/admin/inquiries` | Admin (client) | Inquiry management table |
| `/admin/customers` | Admin (client) | Customer list with search |
| `/admin/analytics` | Admin (client) | Recharts analytics dashboard |

The `/admin` page (`app/admin/page.tsx`) is replaced with the analytics dashboard.

### New Components

| Component | Location | Description |
|---|---|---|
| `NotificationBell` | `components/admin/NotificationBell.tsx` | Bell icon with polling, badge, and dropdown |
| `QuotationPDF` | `components/admin/QuotationPDF.tsx` | `@react-pdf/renderer` document |
| `QuotationForm` | `components/admin/QuotationForm.tsx` | In-drawer quotation creation form |
| `InquiryForm` | `components/inquiry/InquiryForm.tsx` | Reusable inquiry form (public) |
| `AskQuestionButton` | `components/machines/AskQuestionButton.tsx` | Inline CTA on machine detail page |

### Modified Files

| File | Change |
|---|---|
| `prisma/schema.prisma` | Add Customer, MachineInquiry, Quotation models; extend Machine and Order |
| `app/admin/AdminLayoutClient.tsx` | Add nav items; replace static bell with `NotificationBell`; update breadcrumb |
| `app/admin/machines/MachinesClient.tsx` | Replace availability toggle with `availability_status` dropdown + colour-coded badge |
| `app/admin/orders/OrdersClient.tsx` | Add "Create Quotation" button; handle extended status values |
| `app/admin/page.tsx` | Replace static page with analytics dashboard |
| `app/machines/[slug]/page.tsx` | Add `AskQuestionButton` |
| `app/api/machines/[id]/route.ts` | Extend PUT to sync `availability_status` → `is_available` + create inventory_alert |

### `NotificationBell` Interface

```typescript
// components/admin/NotificationBell.tsx
'use client';

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  order_id?: string | null;
};

// Props: none (self-contained, uses fetch internally)
// Polls GET /api/admin/notifications every 30 seconds
// Renders: bell icon + badge + dropdown panel
```

### `QuotationPDF` Interface

```typescript
// components/admin/QuotationPDF.tsx
// @react-pdf/renderer Document component
type QuotationData = {
  quotationNumber: string;
  issueDate: string;
  validUntil: string;
  customer: {
    name: string;
    company?: string;
    email: string;
    phone?: string;
    country?: string;
  };
  machineName: string;
  quantity: number;
  machineCost: number;
  shippingCost: number;
  installationCost: number;
  additionalCharges: number;
  totalCost: number;
  terms?: string;
};

// export default function QuotationDocument({ data }: { data: QuotationData }): JSX.Element
// Used server-side via renderToBuffer() — NOT imported in browser bundles
```

### Analytics API Response Shape

```typescript
type AnalyticsResponse = {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    acceptedOrders: number;
    rejectedOrders: number;
    totalMachines: number;
    availableMachines: number;
    totalCustomers: number;
  };
  ordersPerMonth: Array<{ month: string; count: number }>;       // last 12 months
  topMachines: Array<{ name: string; orderCount: number }>;       // top 5
  orderStatusDistribution: Array<{ status: string; count: number }>;
  customerGrowth: Array<{ month: string; count: number }>;        // last 12 months
  machineAvailability: Array<{ status: string; count: number }>;
  inquiriesPerMonth: Array<{ month: string; count: number }>;     // last 12 months
};
```

---

## Data Models

### Updated Prisma Schema — New Models

#### Customer

```prisma
model Customer {
  id              String           @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name            String
  company         String?
  country         String?
  phone           String?
  email           String           @unique
  total_orders    Int              @default(0)
  last_order_date DateTime?        @db.Timestamptz(6)
  status          String           @default("active")
  created_at      DateTime         @default(now()) @db.Timestamptz(6)
  updated_at      DateTime         @default(now()) @updatedAt @db.Timestamptz(6)
  orders          Order[]
  inquiries       MachineInquiry[]

  @@index([email])
  @@index([status])
  @@index([created_at(sort: Desc)])
}
```

#### MachineInquiry

```prisma
model MachineInquiry {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  customer_id   String?   @db.Uuid
  machine_id    String?   @db.Uuid
  machine_name  String
  customer_name String
  email         String
  phone         String?
  message       String
  status        String    @default("new")   // new | replied | closed
  created_at    DateTime  @default(now()) @db.Timestamptz(6)
  updated_at    DateTime  @default(now()) @updatedAt @db.Timestamptz(6)
  customer      Customer? @relation(fields: [customer_id], references: [id], onDelete: SetNull)
  machine       Machine?  @relation(fields: [machine_id], references: [id], onDelete: SetNull)

  @@index([status])
  @@index([email])
  @@index([created_at(sort: Desc)])
}
```

#### Quotation

```prisma
model Quotation {
  id                  String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  order_id            String   @db.Uuid
  quotation_number    String   @unique
  machine_cost        Float
  shipping_cost       Float    @default(0)
  installation_cost   Float    @default(0)
  additional_charges  Float    @default(0)
  total_cost          Float
  valid_until         DateTime @db.Timestamptz(6)
  terms               String?
  status              String   @default("draft")  // draft | sent | negotiating | approved | rejected
  pdf_url             String?
  created_at          DateTime @default(now()) @db.Timestamptz(6)
  updated_at          DateTime @default(now()) @updatedAt @db.Timestamptz(6)
  order               Order    @relation(fields: [order_id], references: [id], onDelete: Cascade)

  @@index([order_id])
  @@index([quotation_number])
}
```

### Extended Models

**Machine** — new field:
```prisma
availability_status  String  @default("available")
// valid values: available | reserved | out_of_stock | maintenance | coming_soon | discontinued
```

**Order** — new fields:
```prisma
customer_id   String?    @db.Uuid
customer      Customer?  @relation(fields: [customer_id], references: [id], onDelete: SetNull)
quotations    Quotation[]
```

### Availability Status Sync Rule

The `is_available` boolean is derived from `availability_status`:

| `availability_status` | `is_available` |
|---|---|
| `available` | `true` |
| `reserved` | `true` |
| `coming_soon` | `true` |
| `out_of_stock` | `false` |
| `maintenance` | `false` |
| `discontinued` | `false` |

This mapping is enforced in a single `prisma.machine.update()` call in the API handler:

```typescript
const AVAILABLE_STATUSES = new Set(['available', 'reserved', 'coming_soon']);

function deriveIsAvailable(availabilityStatus: string): boolean {
  return AVAILABLE_STATUSES.has(availabilityStatus);
}
```

### Quotation Number Generation

Format: `QT-{YYYY}-{NNNN}` (e.g. `QT-2025-0042`).

Generated server-side by counting existing quotations in the current year and incrementing:

```typescript
async function generateQuotationNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.quotation.count({
    where: { quotation_number: { startsWith: `QT-${year}-` } },
  });
  return `QT-${year}-${String(count + 1).padStart(4, '0')}`;
}
```

### Customer Upsert Pattern

Used both in `POST /api/inquiries` and in order creation/acceptance flows:

```typescript
async function upsertCustomerFromOrder(order: Order) {
  await prisma.customer.upsert({
    where: { email: order.customer_email },
    create: {
      name: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone ?? undefined,
      total_orders: 1,
      last_order_date: new Date(),
    },
    update: {
      total_orders: { increment: 1 },
      last_order_date: new Date(),
    },
  });
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Property-based testing (PBT) is appropriate for this feature because several core behaviors are universal functions over input spaces: the `availability_status` → `is_available` sync, the cost total auto-calculation, the quotation number format, the badge colour rendering, and the notification side-effect logic. These are pure or near-pure functions where input variation reveals edge cases.

PBT is **not** used for schema definitions, external service calls (email, Cloudinary), or pure UI rendering tests — those use example-based or integration tests instead.

The selected PBT library is **fast-check** (TypeScript-native, works with Jest/Vitest, no extra setup).

---

### Property 1: Availability status sync — is_available is always consistent

*For any* `availability_status` value in the valid set `{available, reserved, out_of_stock, maintenance, coming_soon, discontinued}`, calling the machine update API should result in `is_available` being `true` if and only if the status is NOT in `{out_of_stock, maintenance, discontinued}`.

**Validates: Requirements 4.1, 4.2, 4.3, 13.4**

---

### Property 2: Quotation total is always the sum of its parts

*For any* combination of `machineCost`, `shippingCost`, `installationCost`, and `additionalCharges` (all non-negative floats), the computed `totalCost` must equal their exact sum.

**Validates: Requirements 9.2**

---

### Property 3: Customer upsert on order — customer always exists after order creation

*For any* valid order with a customer email, after the order is processed (created or accepted), a `Customer` record with that exact email should exist in the database and `total_orders` should be ≥ 1.

**Validates: Requirements 1.4**

---

### Property 4: Customer upsert on inquiry — customer always exists after inquiry submission

*For any* valid inquiry payload with a well-formed email address, after `POST /api/inquiries` returns 201, a `Customer` record with that email must exist.

**Validates: Requirements 1.5, 6.4**

---

### Property 5: Invalid inquiry payloads are always rejected with HTTP 400

*For any* inquiry payload that is missing at least one required field (`customer_name`, `email`, or `message`) OR contains an email that does not match the RFC 5322 pattern OR has a `message` shorter than 10 characters, `POST /api/inquiries` must return HTTP 400.

**Validates: Requirements 6.3**

---

### Property 6: Inquiry status update accepts all valid statuses

*For any* existing `MachineInquiry` record and any status value in `{new, replied, closed}`, calling `PUT /api/admin/inquiries/[id]` with that status should succeed (HTTP 200) and the record's `status` field should equal the new value.

**Validates: Requirements 7.2**

---

### Property 7: Customer search filter is sound — only matching records are returned

*For any* list of customers and *for any* non-empty search query string, the client-side filtered list should contain only customers where at least one of `name`, `email`, or `company` contains the query string (case-insensitive).

**Validates: Requirements 8.5**

---

### Property 8: Quotation number always matches the format QT-{YEAR}-{NNNN}

*For any* quotation created via `POST /api/admin/orders/[id]/quotation`, the `quotation_number` field must match the regular expression `/^QT-\d{4}-\d{4}$/`.

**Validates: Requirements 9.3**

---

### Property 9: Email failure prevents status updates

*For any* quotation creation request where the Nodemailer transport is mocked to throw, the `Order.status` must remain unchanged and no `Quotation.status` of `"sent"` should exist.

**Validates: Requirements 9.7**

---

### Property 10: Notification badge count is accurate and capped at "9+"

*For any* unread notification count `n`, the displayed badge text should be `String(n)` when `n ≤ 9`, and `"9+"` when `n > 9`. When `n = 0`, no badge element should be rendered.

**Validates: Requirements 11.3**

---

### Property 11: Inventory alert notification is created on out_of_stock status change

*For any* machine, calling `PUT /api/machines/[id]` with `availability_status = "out_of_stock"` must always result in a new `Notification` record with `type = "inventory_alert"` whose `message` includes the machine's name.

**Validates: Requirements 11.7, 13.5**

---

### Property 12: Breadcrumb title is correct for all new admin pages

*For any* pathname matching `/admin/customers*`, `/admin/inquiries*`, or `/admin/analytics`, the displayed header breadcrumb text must be `"Customers"`, `"Inquiries"`, or `"Analytics"` respectively.

**Validates: Requirements 12.4**

---

### Property 13: Machine status badge uses the correct colour class for each status

*For any* `availability_status` value in the valid set, the rendered badge component must apply the correct Tailwind colour class: green for `available`, blue for `reserved`, red for `out_of_stock`, amber for `maintenance`, purple for `coming_soon`, and gray for `discontinued`.

**Validates: Requirements 13.2**

---

## Error Handling

### API Error Responses

All admin API routes follow the same guard pattern:

```typescript
const session = await verifyAdminSession();
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

Standard error shape:
```typescript
{ error: string }  // 400, 401, 404, 500
```

### Inquiry Validation

`POST /api/inquiries` validates:
- `customer_name`: required, non-empty string
- `email`: required, valid RFC 5322 pattern (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- `message`: required, minimum 10 characters

Returns HTTP 400 with `{ error: "…descriptive message…" }` on any violation.

### Quotation Email Failure

The `POST /api/admin/orders/[id]/quotation` handler uses a try/catch around the Nodemailer `sendMail` call. If it throws:
- HTTP 500 is returned with `{ error: "Email delivery failed: <reason>" }`
- The `Order.status` and `Quotation.status` database writes are deferred until after successful send, so they are never applied on failure.

Implementation note: The Prisma `order.update` and `quotation.update` calls are placed **after** `transporter.sendMail()` resolves. If `sendMail` throws, the catch block returns 500 before reaching the update calls. No transaction is needed because the PDF generation and record creation happen before email, but status promotion (`quotation_sent`, `sent`) only happens post-send.

### Client-Side Error States

Each new admin page (`/admin/inquiries`, `/admin/customers`, `/admin/analytics`) renders:
- A skeleton loading state while the API call is in flight
- An inline error banner (not a redirect) if the API returns any error status, so the table/page structure is always visible per the requirements

---

## Testing Strategy

### Unit Tests (Example-Based)

Focus areas:
- `generateQuotationNumber()` — verify format with `QT-{year}-{NNNN}` pattern
- `deriveIsAvailable(status)` — verify each of the 6 status values returns the correct boolean
- `InquiryForm` validation — submit with empty fields, invalid email, short message
- `QuotationForm` total auto-calculation — verify sum with a few concrete examples
- `NotificationBell` — renders badge when count > 0, hides badge when count = 0
- Admin API routes — verify 401 is returned for each route without auth credentials

### Property-Based Tests (fast-check)

Each of the 13 properties above is implemented as a single fast-check property with **at least 100 iterations**.

Tag format used in test files:
```
// Feature: admin-dashboard-enhancements, Property N: <property text>
```

Key generators:
- `fc.constantFrom('available', 'reserved', 'out_of_stock', 'maintenance', 'coming_soon', 'discontinued')` — for availability_status
- `fc.float({ min: 0, max: 1_000_000 })` — for cost fields
- `fc.emailAddress()` — for customer emails
- `fc.string({ minLength: 10 })` — for inquiry messages
- `fc.integer({ min: 0, max: 100 })` — for notification counts

### Integration Tests

- `POST /api/inquiries` → verify MachineInquiry + Customer + Notification created in test DB
- `POST /api/admin/orders/[id]/quotation` → verify Quotation record created with mocked Nodemailer
- `GET /api/admin/analytics` → verify response shape against TypeScript type
- `PUT /api/machines/[id]` with `out_of_stock` → verify `inventory_alert` Notification created

### PDF Snapshot Test

`QuotationDocument` rendered via `renderToBuffer()` with fixture data — verify the output is a valid PDF buffer (starts with `%PDF-`). Section presence is verified by parsing the rendered string content for key section headings.

### Recharts Charts

Chart component rendering uses `@testing-library/react` with a mock for `ResizeObserver`. Each chart is verified to render the expected `recharts` component tree via snapshot or element query — no deep assertion on SVG paths.
