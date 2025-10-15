/**
 * Custom hook for category operations
 * Provides a clean API for managing categories
 */

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createCategoryService } from '@/lib/services/categories.service'
import { Category, TransactionType } from '@/lib/types'

interface UseCategoriesOptions {
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export function useCategories(options?: UseCategoriesOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const service = createCategoryService(supabase)

  /**
   * Create a new category
   */
  const createCategory = useCallback(
    async (data: {
      name: string
      type: TransactionType
      icon?: string
      color: string
    }) => {
      setIsLoading(true)
      setError(null)

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const category = await service.create(user.id, data)
        options?.onSuccess?.('Kategori berhasil ditambahkan')
        return category
      } catch (err: any) {
        const errorMessage = err.message || 'Gagal menambahkan kategori'
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
   * Update an existing category
   */
  const updateCategory = useCallback(
    async (
      categoryId: string,
      data: {
        name?: string
        type?: TransactionType
        icon?: string
        color?: string
      }
    ) => {
      setIsLoading(true)
      setError(null)

      try {
        const category = await service.update(categoryId, data)
        options?.onSuccess?.('Kategori berhasil diperbarui')
        return category
      } catch (err: any) {
        const errorMessage = err.message || 'Gagal memperbarui kategori'
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
   * Delete a category
   */
  const deleteCategory = useCallback(
    async (categoryId: string) => {
      setIsLoading(true)
      setError(null)

      try {
        await service.delete(categoryId)
        options?.onSuccess?.('Kategori berhasil dihapus')
      } catch (err: any) {
        const errorMessage = err.message || 'Gagal menghapus kategori'
        setError(errorMessage)
        options?.onError?.(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [service, options]
  )

  return {
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
