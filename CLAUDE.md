# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Pengluaran" is a full-stack financial management web application for tracking personal income and expenses. Built with Next.js 15.5.5, React 19, TypeScript, Tailwind CSS v4, and Supabase backend. Features include authentication, transaction management, interactive charts, reports, and category management.

## Development Commands

### Package Manager
This project uses **pnpm** (not npm/yarn). All commands should use pnpm.

### Development Server
```bash
pnpm dev
```
Starts Next.js dev server with Turbopack at http://localhost:3000.

### Build & Deploy
```bash
pnpm build   # Production build
pnpm start   # Start production server
pnpm lint    # Run ESLint
```

## Architecture

### Application Structure

**Frontend (Next.js App Router):**
- `src/app/page.tsx` - Landing page with features showcase
- `src/app/login/` - Login page
- `src/app/signup/` - Registration page
- `src/app/dashboard/` - Main dashboard (protected)
- `src/app/dashboard/transactions/` - Transaction management
- `src/app/dashboard/reports/` - Financial reports with charts
- `src/app/dashboard/categories/` - Category management
- `src/app/auth/callback/` - OAuth callback handler

**Components:**
- `src/components/ui/` - Reusable UI components (Button, Card, Modal, Input)
- `src/components/layout/` - Layout components (DashboardLayout)
- `src/components/dashboard/` - Dashboard-specific components
- `src/components/transactions/` - Transaction components (TransactionModal, etc)
- `src/components/reports/` - Report visualization components
- `src/components/categories/` - Category management components

**Backend Integration:**
- `src/lib/supabase/client.ts` - Browser Supabase client
- `src/lib/supabase/server.ts` - Server-side Supabase client
- `src/lib/supabase/middleware.ts` - Auth middleware
- `src/middleware.ts` - Next.js middleware for protected routes

**Utilities:**
- `src/lib/types.ts` - TypeScript types/interfaces
- `src/lib/utils.ts` - Helper functions (currency formatting, date formatting, cn utility)

### Database Schema (Supabase PostgreSQL)

**Tables:**
- `transactions` - Income/expense records with category, amount, date, description
- `categories` - User-defined categories with name, type, icon, color
- `profiles` - Extended user data (full_name, avatar_url, currency preference)

**Features:**
- Row Level Security (RLS) - Users can only access their own data
- Automatic profile creation on signup
- Default categories auto-generated for new users
- Triggers for updated_at timestamps

See `supabase-schema.sql` for complete schema.

### Authentication Flow

1. User signs up via `/signup` → Supabase Auth creates user
2. Trigger creates profile and default categories automatically
3. Middleware checks auth on all routes except `/login`, `/signup`, `/auth/*`
4. Unauthenticated users redirected to `/login`
5. After login/signup → redirect to `/dashboard`

### State Management

- Server Components for initial data fetching
- Client Components with React hooks for interactivity
- Supabase real-time subscriptions NOT used (simple fetch/mutate pattern)
- Forms managed with React Hook Form + Zod validation

## Key Technologies

**Core:**
- Next.js 15.5.5 (App Router, Server Components, Turbopack)
- React 19.1.0
- TypeScript 5 (strict mode)

**Backend:**
- Supabase (PostgreSQL + Auth + RLS)
- @supabase/ssr for SSR-safe auth

**UI/Styling:**
- Tailwind CSS v4
- Lucide React (icons)
- Recharts (charts/graphs)

**Forms & Validation:**
- React Hook Form
- Zod schemas
- @hookform/resolvers

**Utilities:**
- date-fns (date manipulation, Indonesian locale)
- clsx (className utilities)

## Development Patterns

### Data Fetching
- Use Server Components for initial data: `await createClient()` from `@/lib/supabase/server`
- Client Components for mutations: `createClient()` from `@/lib/supabase/client`
- Pass data from Server to Client Components via props

### Component Pattern
```typescript
// Server Component (page.tsx)
export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.from('table').select()
  return <ClientComponent data={data} />
}

// Client Component
'use client'
export function ClientComponent({ data }) {
  // Interactive logic here
}
```

### Form Handling
All forms use React Hook Form + Zod:
```typescript
const schema = z.object({ ... })
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
})
```

### Supabase Queries
- Always filter by `user_id` for RLS compliance
- Use `.select('*, category:categories(*)')` for joins
- Order by date descending for transactions

## Common Tasks

### Adding a New Feature
1. Create database table/columns in Supabase (update `supabase-schema.sql`)
2. Add TypeScript types to `src/lib/types.ts`
3. Create Server Component page in `src/app/`
4. Create Client Component for interactivity in `src/components/`
5. Add navigation link to `DashboardLayout.tsx` if needed

### Debugging Auth Issues
- Check middleware is running: `src/middleware.ts`
- Verify `.env.local` has correct Supabase credentials
- Check Supabase dashboard > Authentication > Users
- Clear cookies and retry

### Database Migrations
Run SQL in Supabase SQL Editor, then update `supabase-schema.sql` in repo.

## Important Notes

- **Use pnpm**: This project requires pnpm package manager
- **Environment Setup**: Must configure `.env.local` with Supabase credentials (see `SETUP.md`)
- **Indonesian Language**: UI text is in Indonesian (Bahasa Indonesia)
- **Currency**: Default currency is IDR (Indonesian Rupiah)
- **Auth Required**: All `/dashboard/*` routes require authentication
- **No Testing**: Testing framework not yet configured

## File Naming Conventions

- Pages: `page.tsx` (Next.js App Router convention)
- Client Components: `ComponentName.tsx` with `'use client'` directive
- Server Components: No directive needed (default)
- Types: PascalCase interfaces in `types.ts`
- Utilities: camelCase functions in `utils.ts`
