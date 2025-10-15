'use client'

import { useState } from 'react'
import { Transaction, Category, TransactionType } from '@/lib/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Filter, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TransactionModal } from './TransactionModal'
import { createClient } from '@/lib/supabase/client'

interface TransactionsContentProps {
  transactions: Transaction[]
  categories: Category[]
}

export function TransactionsContent({ transactions: initialTransactions, categories }: TransactionsContentProps) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<TransactionType>('expense')
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const supabase = createClient()

  const handleAddTransaction = (type: TransactionType) => {
    setEditingTransaction(undefined)
    setModalType(type)
    setIsModalOpen(true)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setModalType(transaction.type)
    setIsModalOpen(true)
  }

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (error: unknown) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'))
    }
  }

  const handleTransactionSaved = (savedTransaction: Transaction) => {
    if (editingTransaction) {
      setTransactions(prev =>
        prev.map(t => t.id === savedTransaction.id ? savedTransaction : t)
      )
    } else {
      setTransactions(prev => [savedTransaction, ...prev])
    }
    setIsModalOpen(false)
    setEditingTransaction(undefined)
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false
    if (filterCategory !== 'all' && t.category_id !== filterCategory) return false
    return true
  })

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaksi</h1>
          <p className="text-gray-600 mt-1">Kelola semua transaksi Anda</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleAddTransaction('income')}
            variant="secondary"
            className="flex-1 sm:flex-none"
          >
            <Plus className="w-4 h-4 mr-2" />
            Pemasukan
          </Button>
          <Button
            onClick={() => handleAddTransaction('expense')}
            className="flex-1 sm:flex-none"
          >
            <Plus className="w-4 h-4 mr-2" />
            Pengeluaran
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Total Pemasukan</p>
              <p className="text-2xl font-bold text-green-700">{formatCurrency(totalIncome)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 mb-1">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpense)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">Total Transaksi</p>
              <p className="text-2xl font-bold text-blue-700">{filteredTransactions.length}</p>
            </div>
            <Filter className="w-8 h-8 text-blue-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Tipe
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | TransactionType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="all">Semua Tipe</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Kategori
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.type === 'income' ? 'Pemasukan' : 'Pengeluaran'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <Card>
        {filteredTransactions.length > 0 ? (
          <div className="space-y-2">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {transaction.category?.name || 'Tanpa Kategori'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {transaction.description || formatDate(transaction.date)}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(Number(transaction.amount))}
                  </p>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditTransaction(transaction)}
                      className="p-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Belum ada transaksi</p>
            <p className="text-sm mt-1">Klik tombol di atas untuk menambah transaksi pertama</p>
          </div>
        )}
      </Card>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTransaction(undefined)
        }}
        type={modalType}
        categories={categories}
        transaction={editingTransaction}
        onSuccess={handleTransactionSaved}
      />
    </div>
  )
}
