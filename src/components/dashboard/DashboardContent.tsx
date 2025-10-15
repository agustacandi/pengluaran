'use client'

import { useState } from 'react'
import { Transaction, Category } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency, formatShortDate } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { id } from 'date-fns/locale'

interface DashboardContentProps {
  transactions: Transaction[]
  categories: Category[]
}

export function DashboardContent({ transactions: initialTransactions, categories }: DashboardContentProps) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'income' | 'expense'>('expense')

  // Calculate summary
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
  const balance = totalIncome - totalExpense

  // Prepare chart data - Daily spending for the current month
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const dailyData = daysInMonth.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const dayTransactions = transactions.filter(t => t.date === dayStr)
    const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
    const expense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

    return {
      date: format(day, 'd MMM', { locale: id }),
      Pemasukan: income,
      Pengeluaran: expense,
    }
  })

  // Category breakdown for expenses
  const expenseByCategory = categories
    .filter(c => c.type === 'expense')
    .map(category => {
      const categoryTransactions = transactions.filter(
        t => t.type === 'expense' && t.category_id === category.id
      )
      const total = categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
      return {
        name: category.name,
        value: total,
        color: category.color || '#64748b',
      }
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)

  const handleAddTransaction = (type: 'income' | 'expense') => {
    setModalType(type)
    setIsModalOpen(true)
  }

  const handleTransactionAdded = (newTransaction: Transaction) => {
    setTransactions(prev => [newTransaction, ...prev])
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Ringkasan keuangan bulan ini</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pemasukan</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <ArrowDownRight className="w-6 h-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Saldo</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${balance >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
              <Wallet className={`w-6 h-6 ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Daily Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Pemasukan & Pengeluaran Harian</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="Pemasukan" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Expense by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Pengeluaran per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label={(entry: any) => `${entry.name}: ${((entry.value / totalExpense) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Belum ada pengeluaran bulan ini
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.category?.name || 'Tanpa Kategori'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.description || formatShortDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(Number(transaction.amount))}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Belum ada transaksi bulan ini
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        categories={categories}
        onSuccess={handleTransactionAdded}
      />
    </div>
  )
}
