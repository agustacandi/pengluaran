'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { Category, TransactionType } from '@/lib/types'

const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori harus diisi'),
  type: z.enum(['income', 'expense']),
  icon: z.string().optional(),
  color: z.string().min(1, 'Warna harus dipilih'),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: Category
  onSuccess: (category: Category) => void
}

const commonIcons = [
  'Wallet', 'Briefcase', 'TrendingUp', 'DollarSign', 'CreditCard',
  'Utensils', 'Car', 'ShoppingBag', 'Receipt', 'Gamepad',
  'Heart', 'Home', 'Plane', 'Book', 'Gift', 'Coffee',
  'Smartphone', 'Laptop', 'ShoppingCart', 'MoreHorizontal'
]

const commonColors = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#64748b'
]

export function CategoryModal({ isOpen, onClose, category, onSuccess }: CategoryModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      type: category?.type || 'expense',
      icon: category?.icon || 'Tag',
      color: category?.color || '#ef4444',
    },
  })

  const selectedIcon = watch('icon')
  const selectedColor = watch('color')
  const selectedType = watch('type')

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const categoryData = {
        ...data,
        user_id: user.id,
      }

      let result

      if (category) {
        // Update existing category
        const { data: updated, error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', category.id)
          .select()
          .single()

        if (error) throw error
        result = updated
      } else {
        // Create new category
        const { data: created, error } = await supabase
          .from('categories')
          .insert(categoryData)
          .select()
          .single()

        if (error) throw error
        result = created
      }

      onSuccess(result)
      reset()
      onClose()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={category ? 'Edit Kategori' : 'Tambah Kategori'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Kategori <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="Contoh: Makanan, Gaji, dll"
            {...register('name')}
            error={errors.name?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipe <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue('type', 'income')}
              className={`p-4 rounded-lg border-2 transition ${
                selectedType === 'income'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-gray-900">Pemasukan</p>
              <p className="text-xs text-gray-600 mt-1">Uang masuk</p>
            </button>
            <button
              type="button"
              onClick={() => setValue('type', 'expense')}
              className={`p-4 rounded-lg border-2 transition ${
                selectedType === 'expense'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-gray-900">Pengeluaran</p>
              <p className="text-xs text-gray-600 mt-1">Uang keluar</p>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon
          </label>
          <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
            {commonIcons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setValue('icon', icon)}
                className={`p-3 rounded-lg border-2 transition flex items-center justify-center ${
                  selectedIcon === icon
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{icon}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Warna <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {commonColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue('color', color)}
                className={`w-full aspect-square rounded-lg border-4 transition ${
                  selectedColor === color
                    ? 'border-gray-900 scale-110'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input type="hidden" {...register('color')} />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            type="submit"
            isLoading={loading}
            className="flex-1"
          >
            {category ? 'Simpan' : 'Tambah'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
