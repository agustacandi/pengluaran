/**
 * Custom hook for transaction operations
 * Provides a clean API for managing transactions
 */

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createTransactionService } from '@/lib/services/transactions.service'
import { Transaction, TransactionType } from '@/lib/types'

interface UseTransactionsOptions {
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export function useTransactions(options?: UseTransactionsOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const service = createTransactionService(supabase)

  /**
   * Create a new transaction
   */
  const createTransaction = useCallback(
    async (data: {
      type: TransactionType
      amount: number
      category_id?: string
      description?: string
      date: string
    }) => {
      setIsLoading(true)
      setError(null)

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const transaction = await service.create(user.id, data)
        options?.onSuccess?.('Transaksi berhasil ditambahkan')
        return transaction
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Gagal menambahkan transaksi'
        setError(errorMessage)
        options?.onError?.(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [supabase, service, options]
  )

  /**
   * Update an existing transaction
   */
  const updateTransaction = useCallback(
    async (
      transactionId: string,
      data: {
        type?: TransactionType
        amount?: number
        category_id?: string
        description?: string
        date?: string
      }
    ) => {
      setIsLoading(true)
      setError(null)

      try {
        const transaction = await service.update(transactionId, data)
        options?.onSuccess?.('Transaksi berhasil diperbarui')
        return transaction
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Gagal memperbarui transaksi'
        setError(errorMessage)
        options?.onError?.(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [service, options]
  )

  /**
   * Delete a transaction
   */
  const deleteTransaction = useCallback(
    async (transactionId: string) => {
      setIsLoading(true)
      setError(null)

      try {
        await service.delete(transactionId)
        options?.onSuccess?.('Transaksi berhasil dihapus')
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Gagal menghapus transaksi'
        setError(errorMessage)
        options?.onError?.(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [service, options]
  )

  /**
   * Get transaction statistics
   */
  const getStats = useCallback(
    (transactions: Transaction[]) => {
      return service.getStats(transactions)
    },
    [service]
  )

  return {
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getStats,
  }
}
