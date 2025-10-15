/**
 * Export utilities
 * Helper functions for exporting data
 */

import { Transaction } from '@/lib/types'
import { format } from 'date-fns'

/**
 * Export transactions to CSV format
 */
export function exportTransactionsToCSV(
  transactions: Transaction[],
  filename?: string
): void {
  const headers = ['Tanggal', 'Tipe', 'Kategori', 'Jumlah', 'Deskripsi']

  const rows = transactions.map(t => [
    t.date,
    t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    t.category?.name || 'Tanpa Kategori',
    t.amount.toString(),
    t.description || '',
  ])

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  downloadCSV(
    csv,
    filename || `laporan-keuangan-${format(new Date(), 'yyyy-MM-dd')}.csv`
  )
}

/**
 * Download CSV file
 */
function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}

/**
 * Export data to JSON format
 */
export function exportToJSON<T>(data: T, filename: string): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}
