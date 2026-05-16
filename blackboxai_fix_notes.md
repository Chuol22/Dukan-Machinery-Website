# BlackboxAI performance fixes (progress)

## Completed
- Added route loading skeletons (no existing `loading.tsx` files were found initially):
  - `frontend/app/process/loading.tsx`
  - `frontend/app/machines/loading.tsx`
  - `frontend/app/machines/[slug]/loading.tsx`
  - `frontend/app/order/loading.tsx`
  - `frontend/app/insights/loading.tsx`
  - `frontend/app/testimonials/loading.tsx`
- Fixed a TSX/JSX syntax error introduced during the initial creation of `frontend/app/machines/[slug]/loading.tsx`.

## Remaining (next)
- Replace internal anchor(s) like `<a href="/terms">` with `next/link`.
- Split heavy tabbed machine detail into server shell + client tabs to reduce hydration.
- Add any missing `loading.tsx` for other routes if needed.

