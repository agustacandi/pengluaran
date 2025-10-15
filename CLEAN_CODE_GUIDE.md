# Clean Code Architecture Guide

Panduan arsitektur clean code untuk project Pengluaran. Dokumentasi ini menjelaskan struktur kode, design patterns, dan best practices yang diterapkan.

## 📁 Struktur Folder

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── login/                    # Auth pages
│   ├── signup/
│   └── dashboard/                # Protected pages
│       ├── page.tsx
│       ├── transactions/
│       ├── reports/
│       └── categories/
│
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Toast.tsx            # Notification system
│   │   └── LoadingSkeleton.tsx  # Loading states
│   │
│   ├── charts/                   # Reusable chart components
│   │   ├── BarChartCard.tsx
│   │   ├── LineChartCard.tsx
│   │   └── PieChartCard.tsx
│   │
│   ├── layout/                   # Layout components
│   │   └── DashboardLayout.tsx
│   │
│   └── [feature]/                # Feature-specific components
│       ├── dashboard/
│       ├── transactions/
│       ├── reports/
│       └── categories/
│
└── lib/
    ├── constants/                # Application constants
    │   └── index.ts             # Colors, icons, routes, messages
    │
    ├── validations/              # Form validation schemas
    │   └── index.ts             # Zod schemas
    │
    ├── services/                 # Business logic layer
    │   ├── transactions.service.ts
    │   └── categories.service.ts
    │
    ├── hooks/                    # Custom React hooks
    │   ├── useTransactions.ts
    │   ├── useCategories.ts
    │   └── useAuth.ts
    │
    ├── utils/                    # Utility functions
    │   ├── index.ts             # General utilities
    │   ├── date.ts              # Date helpers
    │   ├── calculations.ts      # Financial calculations
    │   └── export.ts            # Export utilities
    │
    ├── supabase/                 # Supabase integration
    │   ├── client.ts
    │   ├── server.ts
    │   └── middleware.ts
    │
    └── types.ts                  # TypeScript types
```

## 🎯 Design Patterns

### 1. Service Layer Pattern

**Tujuan**: Memisahkan business logic dari UI components.

**Lokasi**: `src/lib/services/`

**Contoh**:
```typescript
// services/transactions.service.ts
export class TransactionService {
  constructor(private supabase: SupabaseClient) {}

  async getAll(userId: string): Promise<Transaction[]> {
    // Business logic here
  }

  async create(userId: string, data: any): Promise<Transaction> {
    // Business logic here
  }
}

// Usage in component
const service = createTransactionService(supabase)
const transactions = await service.getAll(userId)
```

**Benefits**:
- ✅ Reusable business logic
- ✅ Easy to test
- ✅ Centralized database queries
- ✅ Consistent error handling

### 2. Custom Hooks Pattern

**Tujuan**: Encapsulate stateful logic dan side effects.

**Lokasi**: `src/lib/hooks/`

**Contoh**:
```typescript
// hooks/useTransactions.ts
export function useTransactions(options?) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const createTransaction = useCallback(async (data) => {
    // Logic with loading and error handling
  }, [])

  return { isLoading, error, createTransaction }
}

// Usage in component
const { isLoading, createTransaction } = useTransactions({
  onSuccess: (msg) => showToast(msg),
  onError: (err) => showError(err)
})
```

**Benefits**:
- ✅ Cleaner components
- ✅ Reusable logic
- ✅ Built-in loading & error states
- ✅ Consistent callback patterns

### 3. Constants Configuration

**Tujuan**: Centralize magic values dan configuration.

**Lokasi**: `src/lib/constants/index.ts`

**Contoh**:
```typescript
// ❌ Bad - Magic values scattered
<div style={{ color: '#ef4444' }}>
  {amount > 0 && 'Valid'}
</div>

// ✅ Good - Using constants
import { CHART_COLORS, ERROR_MESSAGES } from '@/lib/constants'

<div style={{ color: CHART_COLORS.expense }}>
  {amount > 0 ? 'Valid' : ERROR_MESSAGES.INVALID_AMOUNT}
</div>
```

**Benefits**:
- ✅ Single source of truth
- ✅ Easy to update
- ✅ Type-safe
- ✅ Better maintainability

### 4. Validation Schema Pattern

**Tujuan**: Centralize form validation logic.

**Lokasi**: `src/lib/validations/index.ts`

**Contoh**:
```typescript
// validations/index.ts
export const transactionSchema = z.object({
  amount: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  date: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD),
})

// Usage in component
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(transactionSchema)
})
```

**Benefits**:
- ✅ Reusable validation logic
- ✅ Type-safe forms
- ✅ Consistent error messages
- ✅ Easy to maintain

### 5. Component Composition

**Tujuan**: Build reusable, composable components.

**Example**: Chart Components

```typescript
// ✅ Good - Reusable chart component
<BarChartCard
  title="Pemasukan & Pengeluaran"
  data={chartData}
  xAxisKey="date"
  bars={[
    { dataKey: 'income', name: 'Pemasukan', color: CHART_COLORS.income },
    { dataKey: 'expense', name: 'Pengeluaran', color: CHART_COLORS.expense }
  ]}
/>
```

**Benefits**:
- ✅ DRY (Don't Repeat Yourself)
- ✅ Consistent UI
- ✅ Easy to update globally
- ✅ Testable

## 🛠 Utilities Organization

### Date Utilities (`lib/utils/date.ts`)
```typescript
import { getStartDate, formatDateID, getRelativeTime } from '@/lib/utils/date'

// Get start date based on range
const startDate = getStartDate('6M')

// Format to Indonesian
const formatted = formatDateID(new Date(), 'd MMMM yyyy')

// Get relative time
const relative = getRelativeTime(transaction.date) // "2 hari yang lalu"
```

### Calculation Utilities (`lib/utils/calculations.ts`)
```typescript
import {
  calculateTotalByType,
  calculateBalance,
  calculateCategoryBreakdown,
  getTopSpendingCategories
} from '@/lib/utils/calculations'

const income = calculateTotalByType(transactions, 'income')
const balance = calculateBalance(transactions)
const breakdown = calculateCategoryBreakdown(transactions, categories, 'expense')
```

### Export Utilities (`lib/utils/export.ts`)
```typescript
import { exportTransactionsToCSV, exportToJSON } from '@/lib/utils/export'

// Export to CSV
exportTransactionsToCSV(transactions, 'my-report.csv')

// Export to JSON
exportToJSON(data, 'data.json')
```

## 🎨 UI Components Best Practices

### 1. Loading States
```typescript
import { DashboardSkeleton, TransactionSkeleton } from '@/components/ui/LoadingSkeleton'

{isLoading ? <DashboardSkeleton /> : <DashboardContent />}
```

### 2. Toast Notifications
```typescript
import { useToast } from '@/components/ui/Toast'

const { showSuccess, showError, toast, hideToast } = useToast()

// Show notifications
showSuccess('Transaksi berhasil ditambahkan')
showError('Gagal menyimpan data')

// Render toast
{toast && <Toast {...toast} onClose={hideToast} />}
```

### 3. Consistent Error Handling
```typescript
const { createTransaction, isLoading, error } = useTransactions({
  onSuccess: (msg) => showSuccess(msg),
  onError: (err) => showError(err)
})

try {
  await createTransaction(data)
} catch (error) {
  // Error already handled by hook
}
```

## 📝 Code Style Guidelines

### 1. File Naming
- **Components**: PascalCase (`TransactionModal.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useTransactions.ts`)
- **Services**: camelCase with '.service' suffix (`transactions.service.ts`)
- **Utils**: camelCase (`date.ts`, `calculations.ts`)
- **Constants**: camelCase (`index.ts`)

### 2. Import Organization
```typescript
// 1. External imports
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// 2. Internal imports - aliases
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { ROUTES, ERROR_MESSAGES } from '@/lib/constants'

// 3. Types
import type { Transaction } from '@/lib/types'
```

### 3. Function Documentation
```typescript
/**
 * Create a new transaction
 *
 * @param userId - The user's ID
 * @param data - Transaction data
 * @returns Created transaction
 * @throws Error if creation fails
 */
async create(userId: string, data: TransactionData): Promise<Transaction> {
  // Implementation
}
```

### 4. Type Safety
```typescript
// ✅ Good - Explicit types
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

// ✅ Good - Type inference
const [count, setCount] = useState(0) // inferred as number

// ❌ Bad - Using 'any'
const handleClick = (data: any) => { ... }
```

## 🧪 Testing Strategy

### Unit Tests
```typescript
// services/transactions.service.test.ts
describe('TransactionService', () => {
  it('should calculate total correctly', () => {
    const service = new TransactionService(mockSupabase)
    const total = service.calculateTotal(mockTransactions)
    expect(total).toBe(1000)
  })
})
```

### Integration Tests
Test hooks with React Testing Library:
```typescript
// hooks/useTransactions.test.ts
test('creates transaction successfully', async () => {
  const { result } = renderHook(() => useTransactions())
  await act(async () => {
    await result.current.createTransaction(mockData)
  })
  expect(result.current.error).toBeNull()
})
```

## 🚀 Performance Optimization

### 1. Memoization
```typescript
// Use useMemo for expensive calculations
const stats = useMemo(
  () => calculateStats(transactions),
  [transactions]
)

// Use useCallback for stable function references
const handleCreate = useCallback(async (data) => {
  await createTransaction(data)
}, [createTransaction])
```

### 2. Code Splitting
```typescript
// Lazy load heavy components
const ReportsPage = dynamic(() => import('@/app/dashboard/reports/page'), {
  loading: () => <DashboardSkeleton />
})
```

### 3. Minimize Re-renders
```typescript
// ✅ Good - Separate state
const [transactions, setTransactions] = useState([])
const [filter, setFilter] = useState('')

// ❌ Bad - Combined state causing unnecessary re-renders
const [state, setState] = useState({ transactions: [], filter: '' })
```

## 📚 Further Improvements

### Recommended Next Steps:
1. ✅ Add unit tests with Jest
2. ✅ Add E2E tests with Playwright
3. ✅ Implement caching strategy (React Query)
4. ✅ Add error boundary components
5. ✅ Implement optimistic updates
6. ✅ Add analytics tracking
7. ✅ Implement PWA features
8. ✅ Add internationalization (i18n)

## 💡 Tips for Development

1. **Always use constants** instead of magic values
2. **Extract repeated logic** into custom hooks or utilities
3. **Keep components small** (< 200 lines ideally)
4. **Write descriptive names** for variables and functions
5. **Add JSDoc comments** for public APIs
6. **Use TypeScript strictly** - avoid 'any'
7. **Test edge cases** especially for financial calculations
8. **Handle loading and error states** consistently
9. **Keep business logic** out of components
10. **Follow the established patterns** in the codebase

---

Dengan mengikuti panduan ini, codebase akan tetap maintainable, scalable, dan mudah dipahami oleh developer lain. 🎉
