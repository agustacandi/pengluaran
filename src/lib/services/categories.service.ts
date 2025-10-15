/**
 * Category Service
 * Handles all category-related database operations
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { Category, TransactionType } from '@/lib/types'

export class CategoryService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Get all categories for a user
   */
  async getAll(userId: string): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name')

    if (error) throw error
    return data || []
  }

  /**
   * Get categories by type
   */
  async getByType(userId: string, type: TransactionType): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('name')

    if (error) throw error
    return data || []
  }

  /**
   * Create a new category
   */
  async create(
    userId: string,
    data: {
      name: string
      type: TransactionType
      icon?: string
      color: string
    }
  ): Promise<Category> {
    const { data: category, error } = await this.supabase
      .from('categories')
      .insert({ ...data, user_id: userId })
      .select()
      .single()

    if (error) throw error
    return category
  }

  /**
   * Update an existing category
   */
  async update(
    categoryId: string,
    data: {
      name?: string
      type?: TransactionType
      icon?: string
      color?: string
    }
  ): Promise<Category> {
    const { data: category, error } = await this.supabase
      .from('categories')
      .update(data)
      .eq('id', categoryId)
      .select()
      .single()

    if (error) throw error
    return category
  }

  /**
   * Delete a category
   */
  async delete(categoryId: string): Promise<void> {
    const { error } = await this.supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) throw error
  }

  /**
   * Get category usage statistics
   */
  async getUsageStats(categories: Category[], transactions: { category_id?: string; amount: number }[]) {
    return categories.map(category => {
      const categoryTransactions = transactions.filter(
        t => t.category_id === category.id
      )
      const total = categoryTransactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0
      )

      return {
        category,
        transactionCount: categoryTransactions.length,
        totalAmount: total,
      }
    })
  }
}

/**
 * Create a new category service instance
 */
export const createCategoryService = (supabase: SupabaseClient) => {
  return new CategoryService(supabase)
}
