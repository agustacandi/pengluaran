'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { TextArea } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { Category, Transaction, TransactionType } from '@/lib/types'

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.string().min(1, 'Jumlah harus diisi'),
  category_id: z.string().optional(),
  description: z.string().optional(),
  date: z.string().min(1, 'Tanggal harus diisi'),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  type: TransactionType
  categories: Category[]
  transaction?: Transaction
  onSuccess: (transaction: Transaction) => void
}

export function TransactionModal({
  isOpen,
  onClose,
  type,
  categories,
  transaction,
  onSuccess,
}: TransactionModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type,
      amount: transaction?.amount.toString() || '',
      category_id: transaction?.category_id || '',
      description: transaction?.description || '',
      date: transaction?.date || new Date().toISOString().split('T')[0],
    },
  })

  const filteredCategories = categories.filter(c => c.type === type)

  const onSubmit = async (data: TransactionFormData) => {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const transactionData = {
        ...data,
        amount: parseFloat(data.amount),
        user_id: user.id,
      }

      let result

      if (transaction) {
        // Update existing transaction
        const { data: updated, error } = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', transaction.id)
          .select('*, category:categories(*)')
          .single()

        if (error) throw error
        result = updated
      } else {
        // Create new transaction
        const { data: created, error } = await supabase
          .from('transactions')
          .insert(transactionData)
          .select('*, category:categories(*)')
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
      title={transaction ? 'Edit Transaksi' : `Tambah ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <input type="hidden" {...register('type')} value={type} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jumlah <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0"
            {...register('amount')}
            error={errors.amount?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            {...register('category_id')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            <option value="">Pilih Kategori</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            {...register('date')}
            error={errors.date?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi
          </label>
          <TextArea
            {...register('description')}
            placeholder="Tambahkan catatan (opsional)"
            rows={3}
          />
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
            {transaction ? 'Simpan' : 'Tambah'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
