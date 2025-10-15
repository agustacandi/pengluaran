/**
 * Transaction Service
 * Handles all transaction-related database operations
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { Transaction, TransactionType } from '@/lib/types'

export class TransactionService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Get all transactions for a user
   */
  async getAll(userId: string): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*, category:categories(*)')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  }

  /**
   * Get transactions for current month
   */
  async getCurrentMonth(userId: string): Promise<Transaction[]> {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data, error } = await this.supabase
      .from('transactions')
      .select('*, category:categories(*)')
      .eq('user_id', userId)
      .gte('date', startOfMonth.toISOString().split('T')[0])
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  }

  /**
   * Get transactions within date range
   */
  async getByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*, category:categories(*)')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  }

  /**
   * Create a new transaction
   */
  async create(
    userId: string,
    data: {
      type: TransactionType
      amount: number
      category_id?: string
      description?: string
      date: string
    }
  ): Promise<Transaction> {
    const { data: transaction, error } = await this.supabase
      .from('transactions')
      .insert({ ...data, user_id: userId })
      .select('*, category:categories(*)')
      .single()

    if (error) throw error
    return transaction
  }

  /**
   * Update an existing transaction
   */
  async update(
    transactionId: string,
    data: {
      type?: TransactionType
      amount?: number
      category_id?: string
      description?: string
      date?: string
    }
  ): Promise<Transaction> {
    const { data: transaction, error } = await this.supabase
      .from('transactions')
      .update(data)
      .eq('id', transactionId)
      .select('*, category:categories(*)')
      .single()

    if (error) throw error
    return transaction
  }

  /**
   * Delete a transaction
   */
  async delete(transactionId: string): Promise<void> {
    const { error } = await this.supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)

    if (error) throw error
  }

  /**
   * Get transaction statistics
   */
  async getStats(transactions: Transaction[]) {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
      incomeCount: transactions.filter(t => t.type === 'income').length,
      expenseCount: transactions.filter(t => t.type === 'expense').length,
    }
  }
}

/**
 * Create a new transaction service instance
 */
export const createTransactionService = (supabase: SupabaseClient) => {
  return new TransactionService(supabase)
}
