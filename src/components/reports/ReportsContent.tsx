'use client'

import { useState } from 'react'
import { Transaction, Category } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns'
import { id } from 'date-fns/locale'

interface ReportsContentProps {
  transactions: Transaction[]
  categories: Category[]
}

export function ReportsContent({ transactions, categories }: ReportsContentProps) {
  const [dateRange, setDateRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('6M')

  // Filter transactions by date range
  const getFilteredTransactions = () => {
    const now = new Date()
    let startDate: Date

    switch (dateRange) {
      case '1M':
        startDate = subMonths(now, 1)
        break
      case '3M':
        startDate = subMonths(now, 3)
        break
      case '6M':
        startDate = subMonths(now, 6)
        break
      case '1Y':
        startDate = subMonths(now, 12)
        break
      case 'ALL':
        return transactions
      default:
        startDate = subMonths(now, 6)
    }

    return transactions.filter(t => new Date(t.date) >= startDate)
  }

  const filteredTransactions = getFilteredTransactions()

  // Calculate summary
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
  const balance = totalIncome - totalExpense
  const avgIncome = totalIncome / (filteredTransactions.filter(t => t.type === 'income').length || 1)
  const avgExpense = totalExpense / (filteredTransactions.filter(t => t.type === 'expense').length || 1)

  // Monthly trend data
  const now = new Date()
  const startDate = dateRange === 'ALL' ?
    new Date(Math.min(...transactions.map(t => new Date(t.date).getTime()))) :
    subMonths(now, dateRange === '1M' ? 1 : dateRange === '3M' ? 3 : dateRange === '6M' ? 6 : 12)

  const months = eachMonthOfInterval({ start: startDate, end: now })

  const monthlyData = months.map(month => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    const monthTransactions = filteredTransactions.filter(t => {
      const tDate = new Date(t.date)
      return tDate >= monthStart && tDate <= monthEnd
    })

    const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
    const expense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

    return {
      month: format(month, 'MMM yyyy', { locale: id }),
      Pemasukan: income,
      Pengeluaran: expense,
      Saldo: income - expense,
    }
  })

  // Category breakdown
  const expenseByCategory = categories
    .filter(c => c.type === 'expense')
    .map(category => {
      const categoryTransactions = filteredTransactions.filter(
        t => t.type === 'expense' && t.category_id === category.id
      )
      const total = categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
      const percentage = totalExpense > 0 ? (total / totalExpense) * 100 : 0
      return {
        name: category.name,
        value: total,
        count: categoryTransactions.length,
        percentage,
        color: category.color || '#64748b',
      }
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)

  const incomeByCategory = categories
    .filter(c => c.type === 'income')
    .map(category => {
      const categoryTransactions = filteredTransactions.filter(
        t => t.type === 'income' && t.category_id === category.id
      )
      const total = categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
      const percentage = totalIncome > 0 ? (total / totalIncome) * 100 : 0
      return {
        name: category.name,
        value: total,
        count: categoryTransactions.length,
        percentage,
        color: category.color || '#64748b',
      }
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)

  const handleExport = () => {
    // Create CSV content
    const headers = ['Tanggal', 'Tipe', 'Kategori', 'Jumlah', 'Deskripsi']
    const rows = filteredTransactions.map(t => [
      t.date,
      t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      t.category?.name || 'Tanpa Kategori',
      t.amount,
      t.description || '',
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `laporan-keuangan-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>
          <p className="text-gray-600 mt-1">Analisis keuangan Anda</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card>
        <div className="flex gap-2 flex-wrap">
          {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setDateRange(range)}
            >
              {range === 'ALL' ? 'Semua' : range}
            </Button>
          ))}
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent>
            <p className="text-sm text-green-700 mb-1">Total Pemasukan</p>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(totalIncome)}</p>
            <p className="text-xs text-green-600 mt-1">Rata-rata: {formatCurrency(avgIncome)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <CardContent>
            <p className="text-sm text-red-700 mb-1">Total Pengeluaran</p>
            <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpense)}</p>
            <p className="text-xs text-red-600 mt-1">Rata-rata: {formatCurrency(avgExpense)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent>
            <p className="text-sm text-blue-700 mb-1">Saldo Bersih</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              {formatCurrency(balance)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {balance >= 0 ? 'Surplus' : 'Defisit'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent>
            <p className="text-sm text-purple-700 mb-1">Total Transaksi</p>
            <p className="text-2xl font-bold text-purple-700">{filteredTransactions.length}</p>
            <p className="text-xs text-purple-600 mt-1">
              {filteredTransactions.filter(t => t.type === 'income').length} pemasukan,{' '}
              {filteredTransactions.filter(t => t.type === 'expense').length} pengeluaran
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="Pemasukan" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Pengeluaran" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Saldo" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Pengeluaran per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseByCategory.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.percentage.toFixed(0)}%`}
                    >
                      {expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {expenseByCategory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.value)}</p>
                        <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                Belum ada data pengeluaran
              </div>
            )}
          </CardContent>
        </Card>

        {/* Income by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Pemasukan per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            {incomeByCategory.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={incomeByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.percentage.toFixed(0)}%`}
                    >
                      {incomeByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {incomeByCategory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.value)}</p>
                        <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                Belum ada data pemasukan
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
