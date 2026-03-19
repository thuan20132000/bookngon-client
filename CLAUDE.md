# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Next.js)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

No test framework is configured in this project.

## Architecture Overview

This is a **Next.js 15 App Router** customer-facing booking portal (frontend only). It communicates with a separate Django/DRF backend.

- **API base URL**: configured via env — production is `https://prod.bookngon.com`, local dev uses `http://127.0.0.1:8000`
- **Path alias**: `@/` maps to the root directory

### State Management — Zustand

Three Zustand stores in `/store/`:

- **`auth-store.ts`**: Client login state, persisted to localStorage as `"bookngon-auth"`
- **`booking-store.ts`**: Multi-step booking flow state — tracks current step, selected services/staff/date/time, business info. Key action: `initializeBusiness()` fetches business details. Utility methods: `getTotalDuration()`, `getTotalPrice()`, `canProceedToNextStep()`
- **`gift-card-store.ts`**: Gift card state

### API Layer — `/lib/api/`

- **`base.ts`**: Axios instance with JWT injection from localStorage, request/response interceptors, dev logging, and `handleApiError()`. Supports `skipAuth` option for public endpoints.
- **`business-booking.api.ts`**: Appointments, services, time slots, clients
- **`gift-card.api.ts`**: Gift card operations
- **`review.api.ts`**: Review operations

Response shapes: `ApiResponse<T>` (single object) and `PaginatedResponse<T>` (paginated list), defined in `/types/api.ts`.

### Booking Flow

Multi-step wizard using an enum in `/enums/booking.enums.ts`:
`SERVICE_SELECTION → TIME_SLOT_SELECTION → CUSTOMER_INFO → CONFIRMATION`

Components live in `/components/booking/`, orchestrated by `booking-flow.tsx`.

### UI

- **shadcn/ui** (new-york style) with Radix UI primitives — components in `/components/ui/`
- **Tailwind CSS v4** via PostCSS
- **sonner** for toast notifications (configured in root `layout.tsx`)
- Forms: `react-hook-form` + `zod`
- Icons: `lucide-react`

### Images

Remote images are served from AWS S3 (`snapslearning-bk.s3.amazonaws.com`), configured in `next.config.ts`.

### Payments

Stripe integration via `@stripe/stripe-js` and `@stripe/react-stripe-js`. Stripe publishable key comes from env.
