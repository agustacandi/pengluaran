export type TransactionType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  type: TransactionType
  icon?: string
  color?: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  category_id?: string
  type: TransactionType
  amount: number
  description?: string
  date: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface Profile {
  id: string
  full_name?: string
  avatar_url?: string
  currency: string
  created_at: string
  updated_at: string
}

export interface TransactionSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  transactionCount: number
}

export interface MonthlyData {
  month: string
  income: number
  expense: number
  balance: number
}

export interface CategorySummary {
  category: string
  amount: number
  count: number
  percentage: number
  color?: string
}
