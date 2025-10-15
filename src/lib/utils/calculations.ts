/**
 * Calculation utilities
 * Helper functions for financial calculations and statistics
 */

import { Transaction, Category } from '@/lib/types'

/**
 * Calculate total by transaction type
 */
export function calculateTotalByType(
  transactions: Transaction[],
  type: 'income' | 'expense'
): number {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + Number(t.amount), 0)
}

/**
 * Calculate balance
 */
export function calculateBalance(transactions: Transaction[]): number {
  const income = calculateTotalByType(transactions, 'income')
  const expense = calculateTotalByType(transactions, 'expense')
  return income - expense
}

/**
 * Calculate average transaction amount
 */
export function calculateAverage(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0
  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0)
  return total / transactions.length
}

/**
 * Group transactions by date
 */
export function groupByDate(
  transactions: Transaction[]
): Record<string, Transaction[]> {
  return transactions.reduce((acc, transaction) => {
    const date = transaction.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(transaction)
    return acc
  }, {} as Record<string, Transaction[]>)
}

/**
 * Group transactions by category
 */
export function groupByCategory(
  transactions: Transaction[]
): Record<string, Transaction[]> {
  return transactions.reduce((acc, transaction) => {
    const categoryId = transaction.category_id || 'uncategorized'
    if (!acc[categoryId]) {
      acc[categoryId] = []
    }
    acc[categoryId].push(transaction)
    return acc
  }, {} as Record<string, Transaction[]>)
}

/**
 * Calculate category breakdown
 */
export function calculateCategoryBreakdown(
  transactions: Transaction[],
  categories: Category[],
  type: 'income' | 'expense'
) {
  const filteredTransactions = transactions.filter(t => t.type === type)
  const totalAmount = calculateTotalByType(transactions, type)

  return categories
    .filter(c => c.type === type)
    .map(category => {
      const categoryTransactions = filteredTransactions.filter(
        t => t.category_id === category.id
      )
      const amount = categoryTransactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0
      )
      const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0

      return {
        category,
        amount,
        count: categoryTransactions.length,
        percentage,
      }
    })
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)
}

/**
 * Calculate monthly trends
 */
export function calculateMonthlyTrends(
  transactions: Transaction[],
  months: Date[]
) {
  return months.map(month => {
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1)
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0)

    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date)
      return tDate >= monthStart && tDate <= monthEnd
    })

    const income = calculateTotalByType(monthTransactions, 'income')
    const expense = calculateTotalByType(monthTransactions, 'expense')

    return {
      month,
      income,
      expense,
      balance: income - expense,
      transactionCount: monthTransactions.length,
    }
  })
}

/**
 * Calculate savings rate (income - expense) / income * 100
 */
export function calculateSavingsRate(transactions: Transaction[]): number {
  const income = calculateTotalByType(transactions, 'income')
  if (income === 0) return 0

  const expense = calculateTotalByType(transactions, 'expense')
  return ((income - expense) / income) * 100
}

/**
 * Get top spending categories
 */
export function getTopSpendingCategories(
  transactions: Transaction[],
  categories: Category[],
  limit: number = 5
) {
  const breakdown = calculateCategoryBreakdown(transactions, categories, 'expense')
  return breakdown.slice(0, limit)
}

/**
 * Calculate daily average spending
 */
export function calculateDailyAverage(
  transactions: Transaction[],
  days: number
): number {
  const expense = calculateTotalByType(transactions, 'expense')
  return expense / days
}
