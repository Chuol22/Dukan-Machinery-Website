# Implementation Plan: Admin Dashboard Enhancements

## Overview

This plan implements the admin dashboard enhancements in strict dependency order:
schema and backend first, then new components, then updated admin pages, then
public-facing pages. Each task specifies exact file paths and builds directly on
the previous step. Tests are optional sub-tasks marked with `*`.

---

## Tasks

- [~] 1. Install required packages
  - Run `npm install recharts @react-pdf/renderer` inside `frontend/`
  - Run `npm install --save-dev @types/react-pdf` if types are needed
  - Verify both packages appear in `package.json` dependencies
  - _Requirements: 9.3, 10.4_

- [x] 2. Update Prisma schema
  - [x] 2.1 Add `Customer` model to `prisma/schema.prisma`
    - Fields: `id` (UUID PK), `name`, `company?`, `country?`, `phone?`, `email` (unique), `total_orders` (Int default 0), `last_order_date?`, `status` (default "active"), `created_at`, `updated_at` (updatedAt)
    - Add relations: `orders Order[]` and `inquiries MachineInquiry[]`
    - Add indexes: `@@index([email])`, `@@index([status])`, `@@index([created_at(sort: Desc)])`
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 2.2 Add `MachineInquiry` model to `prisma/schema.prisma`
    - Fields: `id` (UUID PK), `customer_id?` (UUID FK → Customer, SetNull), `machine_id?` (UUID FK → Machine, SetNull), `machine_name`, `customer_name`, `email`, `phone?`, `message`, `status` (default "new"), `created_at`, `updated_at` (updatedAt)
    - Add relation back-references in `Customer` and `Machine` models
    - Add indexes: `@@index([status])`, `@@index([email])`, `@@index([created_at(sort: Desc)])`
    - _Requirements: 2.1, 2.2_

  - [x] 2.3 Add `Quotation` model to `prisma/schema.prisma`
    - Fields: `id` (UUID PK), `order_id` (UUID FK → Order, Cascade), `quotation_number` (unique), `machine_cost`, `shipping_cost` (default 0), `installation_cost` (default 0), `additional_charges` (default 0), `total_cost`, `valid_until`, `terms?`, `status` (default "draft"), `pdf_url?`, `created_at`, `updated_at` (updatedAt)
    - Add indexes: `@@index([order_id])`, `@@index([quotation_number])`
    - _Requirements: 5.1, 5.2_

  - [x] 2.4 Extend `Machine` and `Order` models in `prisma/schema.prisma`
    - Add `availability_status String @default("available")` to `Machine`
    - Add `@@index([availability_status])` to `Machine`
    - Add `customer_id String? @db.Uuid` and `customer Customer? @relation(...)` to `Order`
    - Add `quotations Quotation[]` to `Order`
    - Add `inquiries MachineInquiry[]` to `Machine`
    - _Requirements: 3.1, 3.2, 3.3, 4.1_

- [x] 3. Run Prisma migration and generate client
  - Run `npx prisma migrate dev --name admin-dashboard-enhancements` inside `frontend/`
  - Run `npx prisma generate` to regenerate the Prisma client
  - Confirm no TypeScript errors in `lib/prisma.ts` after generation
  - _Requirements: 1.1–5.2_

- [ ] 4. Implement backend API — public inquiry endpoint
  - [-] 4.1 Create `app/api/inquiries/route.ts` — public POST handler
    - Validate required fields: `customer_name`, `email` (regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), `message` (≥ 10 chars); return HTTP 400 with descriptive error on any violation
    - On valid payload: `prisma.machineInquiry.create` with `status = "new"`
    - Upsert `Customer` by email (create with name/phone/company, or update name/phone/company if exists)
    - Create `Notification` with `type = "new_inquiry"`, `title = "New Machine Inquiry"`, message including customer name and machine name
    - Return HTTP 201 `{ success: true, id }`
    - _Requirements: 6.2, 6.3, 6.4_

  - [ ]* 4.2 Write property tests for inquiry validation (Property 5)
    - **Property 5: Invalid inquiry payloads are always rejected with HTTP 400**
    - Use `fc.record` with missing required fields, invalid emails, and messages < 10 chars
    - **Validates: Requirements 6.3**

  - [ ]* 4.3 Write property tests for customer upsert on inquiry (Property 4)
    - **Property 4: Customer always exists after inquiry submission**
    - For any valid inquiry payload with well-formed email, after POST a Customer with that email must exist
    - **Validates: Requirements 1.5, 6.4**

- [ ] 5. Implement backend API — admin inquiries
  - [-] 5.1 Create `app/api/admin/inquiries/route.ts` — admin GET all inquiries
    - Verify admin session (return 401 if not authenticated)
    - Return all `MachineInquiry` records ordered by `created_at` descending
    - Include: `id`, `customer_name`, `email`, `phone`, `machine_name`, `message`, `status`, `created_at`
    - _Requirements: 7.1, 7.3_

  - [-] 5.2 Create `app/api/admin/inquiries/[id]/route.ts` — admin PUT update status
    - Verify admin session (return 401 if not authenticated)
    - Accept `{ status }` body; validate value is one of `new | replied | closed`
    - Update `MachineInquiry.status` and return updated record
    - _Requirements: 7.2, 7.3_

  - [ ]* 5.3 Write property tests for inquiry status update (Property 6)
    - **Property 6: Inquiry status update accepts all valid statuses**
    - For any `status ∈ {new, replied, closed}`, PUT should return HTTP 200 and persist the value
    - **Validates: Requirements 7.2**

- [ ] 6. Implement backend API — admin customers
  - [-] 6.1 Create `app/api/admin/customers/route.ts` — admin GET all customers
    - Verify admin session (return 401 if not authenticated)
    - Return all `Customer` records: `id`, `name`, `company`, `country`, `phone`, `email`, `total_orders`, `last_order_date`, `status`, `created_at`
    - Order by `created_at` descending
    - _Requirements: 8.1, 8.2_

- [ ] 7. Implement backend API — analytics
  - [-] 7.1 Create `app/api/admin/analytics/route.ts` — admin GET aggregated analytics
    - Verify admin session (return 401 if not authenticated)
    - Compute `stats`: totalOrders, pendingOrders, acceptedOrders, rejectedOrders, totalMachines, availableMachines, totalCustomers using `prisma.$transaction` or parallel `Promise.all` queries
    - Compute `ordersPerMonth` (last 12 months): group `Order.created_at` by month label, count
    - Compute `topMachines`: top 5 `OrderItem.machine_id` by count, join machine name
    - Compute `orderStatusDistribution`: `groupBy` Order.status
    - Compute `customerGrowth` (last 12 months): group `Customer.created_at` by month, count
    - Compute `machineAvailability`: `groupBy` Machine.availability_status
    - Compute `inquiriesPerMonth` (last 12 months): group `MachineInquiry.created_at` by month, count
    - Return `AnalyticsResponse` shape as defined in design.md
    - _Requirements: 10.1, 10.2_

- [ ] 8. Extend existing API — machines PUT handler
  - [-] 8.1 Update `app/api/machines/[id]/route.ts` PUT handler
    - Accept `availability_status` in the request payload
    - Implement `deriveIsAvailable`: `available | reserved | coming_soon → true`, `out_of_stock | maintenance | discontinued → false`
    - Include both `availability_status` and derived `is_available` in the single `prisma.machine.update()` call
    - After update, if `availability_status === "out_of_stock"`, create a `Notification` with `type = "inventory_alert"`, title "Inventory Alert", message including machine name
    - Return `availability_status` field in the response object
    - _Requirements: 4.2, 4.3, 13.3, 13.4, 11.7, 13.5_

  - [ ]* 8.2 Write property tests for availability status sync (Property 1)
    - **Property 1: is_available is always consistent with availability_status**
    - Use `fc.constantFrom('available', 'reserved', 'out_of_stock', 'maintenance', 'coming_soon', 'discontinued')`
    - For each value, `deriveIsAvailable(status)` must return `true` iff status NOT in `{out_of_stock, maintenance, discontinued}`
    - **Validates: Requirements 4.1, 4.2, 4.3, 13.4**

  - [ ]* 8.3 Write property tests for inventory alert notification (Property 11)
    - **Property 11: Inventory alert is created on out_of_stock status change**
    - For any machine, PUT with `availability_status = "out_of_stock"` must always create a Notification with `type = "inventory_alert"` whose message includes the machine name
    - **Validates: Requirements 11.7, 13.5**

- [ ] 9. Extend existing API — order accept/reject customer upsert
  - [-] 9.1 Update `app/api/admin/orders/[id]/accept/route.ts` — add customer upsert
    - After the existing `prisma.order.update` call, call `prisma.customer.upsert` with `where: { email: order.customer_email }`, create with name/email/phone/total_orders=1/last_order_date, update with `total_orders: { increment: 1 }` and `last_order_date: new Date()`
    - Then update `Order.customer_id` to link the upserted customer record
    - _Requirements: 1.4, 3.1_

  - [-] 9.2 Update `app/api/admin/orders/[id]/reject/route.ts` — add customer upsert
    - Same customer upsert pattern as 9.1 (customer contact still recorded even on rejection)
    - Update `Order.customer_id` to link the upserted customer record
    - _Requirements: 1.4, 3.1_

  - [ ]* 9.3 Write property tests for customer upsert on order (Property 3)
    - **Property 3: Customer always exists after order creation/acceptance**
    - For any valid order with a customer email, after accept/reject a Customer record with that email must exist and `total_orders ≥ 1`
    - **Validates: Requirements 1.4**

- [ ] 10. Create quotation API endpoint
  - [-] 10.1 Create `app/api/admin/orders/[id]/quotation/route.ts` — POST create quotation
    - Verify admin session (return 401 if not authenticated)
    - Read and validate body: `machineCost`, `shippingCost`, `installationCost`, `additionalCharges` (all numeric), `validUntil` (date string), `terms?`
    - Compute `totalCost = machineCost + shippingCost + installationCost + additionalCharges`
    - Generate quotation number via `generateQuotationNumber()` (format `QT-{year}-{NNNN}` by counting existing quotations for current year and incrementing)
    - Create `Quotation` record with `status = "draft"` in Prisma
    - Import `QuotationDocument` from `components/admin/QuotationPDF` and call `renderToBuffer()` server-side to generate PDF bytes
    - Send email via Nodemailer with PDF attached as `application/pdf` base64 buffer; use existing `EMAIL_USER`/`EMAIL_PASS` env vars
    - On email success: update `Order.status = "quotation_sent"` and `Quotation.status = "sent"` in a single `prisma.$transaction`
    - On email failure: catch error, return HTTP 500 `{ error: "Email delivery failed: <reason>" }` — do NOT update Order or Quotation status
    - Return HTTP 200 `{ quotationId, quotationNumber }` on success
    - _Requirements: 9.1, 9.2, 9.3, 9.5, 9.6, 9.7, 9.8_

  - [ ]* 10.2 Write property tests for quotation total calculation (Property 2)
    - **Property 2: Quotation total is always the sum of its parts**
    - Use `fc.float({ min: 0, max: 1_000_000 })` for each cost field
    - `machineCost + shippingCost + installationCost + additionalCharges` must exactly equal `totalCost`
    - **Validates: Requirements 9.2**

  - [ ]* 10.3 Write property tests for quotation number format (Property 8)
    - **Property 8: Quotation number always matches format QT-{YEAR}-{NNNN}**
    - Generated quotation numbers must match regex `/^QT-\d{4}-\d{4}$/`
    - **Validates: Requirements 9.3**

  - [ ]* 10.4 Write property tests for email failure preventing status updates (Property 9)
    - **Property 9: Email failure prevents Order and Quotation status updates**
    - When Nodemailer transport is mocked to throw, `Order.status` must remain unchanged and no `Quotation.status = "sent"` should exist
    - **Validates: Requirements 9.7**

- [~] 11. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Create `NotificationBell` component
  - [-] 12.1 Create `components/admin/NotificationBell.tsx` — client component
    - `'use client'` directive
    - Fetch `GET /api/admin/notifications` on mount and every 30 seconds using `setInterval`; store `notifications: Notification[]` in state
    - Compute `unreadCount = notifications.filter(n => !n.read).length`
    - Render: a bell `<button>` with `<Bell className="w-5 h-5" />` icon
    - When `unreadCount > 0`, render a badge `<span>` over the bell with text `unreadCount <= 9 ? String(unreadCount) : "9+"`
    - When `unreadCount === 0`, do NOT render any badge element
    - On button click, toggle a dropdown `<div>` showing the latest 5 notifications (by `created_at` desc)
    - Each notification row: title, message truncated to 80 chars, relative timestamp, and a link to the relevant admin page (orders link if `order_id` present, else `/admin/notifications`)
    - Include a "View all notifications" link to `/admin/notifications` at dropdown footer
    - On notification click: call `PUT /api/admin/notifications` with `{ notificationId: n.id }` to mark as read, then navigate
    - _Requirements: 11.2, 11.3, 11.4, 11.5, 11.6_

  - [ ]* 12.2 Write property tests for notification badge count (Property 10)
    - **Property 10: Notification badge count is accurate and capped at "9+"**
    - For any `n ∈ [0..100]`: badge text = `String(n)` when `n ≤ 9`, `"9+"` when `n > 9`, no badge element when `n = 0`
    - Use `fc.integer({ min: 0, max: 100 })`
    - **Validates: Requirements 11.3**

- [ ] 13. Create `QuotationPDF` component (server-side only)
  - [-] 13.1 Create `components/admin/QuotationPDF.tsx` — `@react-pdf/renderer` Document
    - Export `QuotationDocument({ data: QuotationData })` as default
    - Render a `<Document>` with one `<Page>` using `@react-pdf/renderer` primitives (`View`, `Text`, `Image`, `StyleSheet`)
    - Include all required sections: company logo/name/contact, quotation number, issue date, valid until date, customer name/company/contact, machine name and quantity, cost breakdown table (machine cost, shipping, installation, additional charges, total row), terms and conditions, warranty information section, authorized signature section, company stamp/seal section, thank-you message
    - Use `StyleSheet.create` for all styles (no external CSS)
    - This component is ONLY imported server-side; never used in browser bundles
    - _Requirements: 9.4_

- [ ] 14. Create `QuotationForm` component
  - [-] 14.1 Create `components/admin/QuotationForm.tsx` — client component
    - `'use client'` directive; accept props: `orderId: string`, `customerName: string`, `machineName: string`, `onSuccess: (quotationNumber: string) => void`, `onClose: () => void`
    - State fields: `machineCost`, `shippingCost`, `installationCost`, `additionalCharges` (all number, default 0), `validUntil` (string), `terms` (string)
    - Auto-calculate `totalCost` as the live sum of all four cost fields using `useMemo`
    - On submit: `POST /api/admin/orders/[orderId]/quotation` with all fields; show loading state; call `onSuccess(quotationNumber)` on HTTP 200; show inline error message on failure
    - _Requirements: 9.2, 9.3_

- [ ] 15. Create `InquiryForm` component
  - [-] 15.1 Create `components/inquiry/InquiryForm.tsx` — client component
    - `'use client'` directive; accept optional props: `machineName?: string`, `machineId?: string`
    - State fields: `customerName`, `email`, `phone`, `machineName` (pre-filled from prop), `message`
    - On submit: `POST /api/inquiries`; show loading state during submission
    - On success: display inline confirmation message without navigating away (requirement 6.6)
    - On error: show inline error message from API response
    - _Requirements: 6.6_

- [ ] 16. Create `AskQuestionButton` component
  - [-] 16.1 Create `components/machines/AskQuestionButton.tsx` — client component
    - `'use client'` directive; accept props: `machineName: string`, `machineId?: string`
    - Render a button "Ask a Question" that, when clicked, toggles an inline expanded `<InquiryForm>` with `machineName` and `machineId` pre-filled
    - Import and render `InquiryForm` from `components/inquiry/InquiryForm.tsx`
    - _Requirements: 6.1_

- [ ] 17. Update `AdminLayoutClient` — nav items, NotificationBell, breadcrumbs
  - [~] 17.1 Update `app/admin/AdminLayoutClient.tsx`
    - Add imports: `Users`, `MessageSquare`, `BarChart2` from `lucide-react`; `NotificationBell` from `@/components/admin/NotificationBell`
    - Add three new `NavItem` entries to the `navItems` array:
      - `{ label: 'Analytics', href: '/admin/analytics', icon: BarChart2, section: 'dashboard' }`
      - `{ label: 'Customers', href: '/admin/customers', icon: Users, section: 'orders' }`
      - `{ label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare, section: 'orders' }`
    - In the nav JSX, render Analytics `<NavLink>` under the "Overview" section; render Customers and Inquiries `<NavLink>` under the "Sales & Orders" section
    - Extend the `isActive` function to handle `/admin/customers`, `/admin/inquiries`, `/admin/analytics`
    - In the desktop header, replace the static `<Link href="/admin/notifications">` bell `<Bell>` with `<NotificationBell />`
    - Extend the breadcrumb title logic: add cases for `pathname.startsWith('/admin/customers') → "Customers"`, `pathname.startsWith('/admin/inquiries') → "Inquiries"`, `pathname === '/admin/analytics' → "Analytics"`
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 11.2_

  - [ ]* 17.2 Write property tests for breadcrumb title correctness (Property 12)
    - **Property 12: Breadcrumb title is correct for all new admin pages**
    - For any pathname matching `/admin/customers*`, `/admin/inquiries*`, or `/admin/analytics`, header title must be "Customers", "Inquiries", or "Analytics" respectively
    - **Validates: Requirements 12.4**

- [ ] 18. Update `MachinesClient` — availability_status dropdown and badges
  - [~] 18.1 Update `app/admin/machines/MachinesClient.tsx`
    - Extend the `Machine` type to include `availability_status?: string`
    - Add a `AVAILABILITY_OPTIONS` constant array with all six status values: `available | reserved | out_of_stock | maintenance | coming_soon | discontinued`
    - Add a `getStatusBadge(status: string)` helper that returns Tailwind class strings: green for `available`, blue for `reserved`, red for `out_of_stock`, amber for `maintenance`, purple for `coming_soon`, gray for `discontinued`
    - In the machine table Status column: replace the existing boolean badge with a `<span>` using `getStatusBadge(machine.availability_status ?? 'available')` and display the status label
    - In the Actions column: replace the `toggleAvailability` button with a `<select>` dropdown containing the six options; `onChange` calls a new `handleStatusChange(machine, newStatus)` function
    - Implement `handleStatusChange(machine, newStatus)`: apply optimistic update to `rows` state, then call `PUT /api/machines/${machine.id}` with `{ ...machine, availability_status: newStatus }`; revert on error
    - _Requirements: 13.1, 13.2, 13.3_

  - [ ]* 18.2 Write property tests for machine status badge colours (Property 13)
    - **Property 13: Machine status badge uses correct colour class for each status**
    - For any `availability_status ∈ {available, reserved, out_of_stock, maintenance, coming_soon, discontinued}`, `getStatusBadge(status)` must include the expected Tailwind colour prefix
    - **Validates: Requirements 13.2**

- [ ] 19. Update `OrdersClient` — extended statuses and quotation button
  - [~] 19.1 Update `app/admin/orders/OrdersClient.tsx`
    - Extend `OrderRow` type to include `quotations?: Array<{ status: string }>` field
    - Update `normalizeStatus` to handle `quotation_sent` and `completed` status values (pass them through as-is instead of mapping to "pending")
    - Update the status filter `<select>` to include options for `quotation_sent` and `completed`
    - Update the status badge rendering to include styles for `quotation_sent` (blue) and `completed` (teal/green)
    - Add a "Create Quotation" button in the order detail drawer (slide-over panel) that:
      - Is only shown when no quotation with `status ∈ {sent, approved, negotiating}` exists on the order
      - On click, mounts `<QuotationForm>` inside the drawer with `orderId`, `customerName`, `machineName` props
      - On `onSuccess`: show a toast "Quotation sent successfully", reload orders
    - Import `QuotationForm` from `@/components/admin/QuotationForm`
    - Update `GET /api/admin/orders` call shape to include `quotations` in the returned data (handled server-side in the next task step — just consume it here)
    - _Requirements: 9.1, 3.2_

  - [-] 19.2 Update `app/api/admin/orders/route.ts` — include quotations in response
    - Add `quotations: true` to the `include` clause of `prisma.order.findMany`
    - Include `quotations` array (with `status` field) in the mapped response object per order
    - _Requirements: 9.1_

- [~] 20. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 21. Create admin inquiries page
  - [~] 21.1 Create `app/admin/inquiries/page.tsx` — server page wrapper
    - Minimal server component that renders `<InquiriesClient />`
    - _Requirements: 7.4_

  - [~] 21.2 Create `app/admin/inquiries/InquiriesClient.tsx` — client component
    - `'use client'` directive
    - On mount, fetch `GET /api/admin/inquiries`; store `inquiries` in state
    - Show skeleton rows while loading; show inline error banner (not redirect) on any API error (including 401)
    - Render a table with columns: Customer Name, Email, Phone, Machine, Message (truncated to ~80 chars), Status, Date, Actions
    - Status column: render a `<select>` dropdown for each row with options `new | replied | closed`
    - `onChange` on the dropdown: call `PUT /api/admin/inquiries/${id}` with new status; show toast confirming action (even if value matches current status per requirement 7.5)
    - Apply a colour-coded badge next to each status label: `new` (amber), `replied` (green), `closed` (gray)
    - _Requirements: 7.4, 7.5_

- [ ] 22. Create admin customers page
  - [~] 22.1 Create `app/admin/customers/page.tsx` — server page wrapper
    - Minimal server component that renders `<CustomersClient />`
    - _Requirements: 8.3_

  - [~] 22.2 Create `app/admin/customers/CustomersClient.tsx` — client component
    - `'use client'` directive
    - On mount, fetch `GET /api/admin/customers`; store `customers` in state
    - Show skeleton rows while loading; show inline error banner (not redirect) on any API error including 401 (render table structure in both cases per requirement 8.3)
    - Render a sortable table with columns: Name, Company, Country, Phone, Email, Total Orders, Last Order Date, Status
    - Status column: badge — `active` (green), `inactive` (gray)
    - Add a search `<input>` above the table that filters the customer list client-side by name, email, or company (case-insensitive substring match)
    - Click on column headers to toggle ascending/descending sort
    - _Requirements: 8.3, 8.4, 8.5_

  - [ ]* 22.3 Write property tests for customer search filter soundness (Property 7)
    - **Property 7: Customer search filter is sound — only matching records are returned**
    - For any list of customers and any non-empty query string, the filtered list contains only customers where name, email, or company contains the query (case-insensitive)
    - **Validates: Requirements 8.5**

- [ ] 23. Create admin analytics page
  - [~] 23.1 Create `app/admin/analytics/page.tsx` — minimal server wrapper
    - Renders `<AnalyticsDashboard />` client component
    - _Requirements: 10.3_

  - [~] 23.2 Create `app/admin/analytics/AnalyticsDashboard.tsx` — client component
    - `'use client'` directive; import from `recharts`: `BarChart`, `Bar`, `LineChart`, `Line`, `PieChart`, `Pie`, `Cell`, `AreaChart`, `Area`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`
    - On mount, fetch `GET /api/admin/analytics`; store `data: AnalyticsResponse | null` in state
    - While loading, render skeleton placeholder `<div>` elements for each stats card and chart (animated pulse)
    - After data loads, render:
      1. Stats cards row: Total Orders, Pending Orders, Accepted Orders, Rejected Orders, Total Machines, Available Machines, Total Customers
      2. `<BarChart>` + `<ResponsiveContainer>` — orders per month (last 12 months)
      3. Horizontal `<BarChart>` — top 5 most-requested machines
      4. `<PieChart>` — order status distribution
      5. `<LineChart>` — customer growth by month (last 12 months)
      6. `<PieChart>` — machine availability distribution
      7. `<AreaChart>` — inquiry trends per month (last 12 months)
    - All charts use `ResponsiveContainer width="100%" height={300}` for fluid layout
    - _Requirements: 10.3, 10.4, 10.5, 10.6_

- [ ] 24. Replace `/admin` page with analytics dashboard
  - [~] 24.1 Update `app/admin/page.tsx` — replace static page with analytics dashboard
    - Convert to a `'use client'` component (or keep as server page and render `<AnalyticsDashboard />` inline)
    - Import and render the analytics dashboard: stats cards backed by live `GET /api/admin/analytics` data
    - Retain the "Add Machine" and quick-action buttons from the current page in a top banner section
    - Show skeleton loading states for all stats cards and charts while data is fetching
    - Inline error banner (no redirect) if analytics API fails
    - _Requirements: 10.3, 10.4, 10.5, 10.6_

- [ ] 25. Add `AskQuestionButton` to machine detail page
  - [~] 25.1 Update `app/machines/[slug]/page.tsx` — add AskQuestionButton to CTA section
    - Import `AskQuestionButton` from `@/components/machines/AskQuestionButton`
    - In the CTA section (`"Ready to get started?"`), add `<AskQuestionButton machineName={machine.name} machineId={machine.id} />` alongside the existing Order Now / Contact Engineer buttons
    - _Requirements: 6.1_

- [ ] 26. Create public inquiry page
  - [~] 26.1 Create `app/inquiry/page.tsx` — public standalone inquiry page
    - Import `InquiryForm` from `@/components/inquiry/InquiryForm`
    - Read optional `?machine=<name>` query param from `useSearchParams()` and pass as `machineName` prop to `InquiryForm` when present
    - Render a full-page layout with a heading ("Ask About a Machine") and the `<InquiryForm />` centered on the page
    - Match the public site's layout (use existing `<Header>` / `<Footer>` or page layout conventions)
    - _Requirements: 6.5, 6.6_

- [~] 27. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Tasks 2–3 (schema + migration) must complete before any API tasks (4–10) are started
- Backend APIs (4–10) must be complete before component tasks (12–16) that consume them
- Admin page updates (17–24) depend on both API routes and new components
- Public pages (25–26) depend on the `AskQuestionButton` and `InquiryForm` components
- Property tests use `fast-check`; run with `npx vitest --run` or `npx jest`
- The `QuotationPDF` component (task 13) must never be imported in browser bundles — only used server-side via dynamic import or direct server route import
- `deriveIsAvailable` logic should be extracted to `lib/availability.ts` for reuse and easier property testing
- `generateQuotationNumber` should be extracted to `lib/quotation.ts` for easy isolated testing

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1", "2.2", "2.3", "2.4"] },
    { "id": 1, "tasks": ["3"] },
    { "id": 2, "tasks": ["4.1", "5.1", "5.2", "6.1", "7.1", "8.1", "9.1", "9.2", "10.1"] },
    { "id": 3, "tasks": ["4.2", "4.3", "5.3", "8.2", "8.3", "9.3", "10.2", "10.3", "10.4", "12.1", "13.1", "14.1", "15.1", "16.1", "19.2"] },
    { "id": 4, "tasks": ["12.2", "17.1", "18.1", "19.1"] },
    { "id": 5, "tasks": ["17.2", "18.2", "21.1", "22.1", "23.1"] },
    { "id": 6, "tasks": ["21.2", "22.2", "23.2", "24.1"] },
    { "id": 7, "tasks": ["22.3", "25.1", "26.1"] }
  ]
}
```
