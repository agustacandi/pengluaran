/**
 * Application-wide constants
 * Centralized configuration for colors, icons, and other magic values
 */

// Category Icons
export const CATEGORY_ICONS = [
  'Wallet',
  'Briefcase',
  'TrendingUp',
  'DollarSign',
  'CreditCard',
  'Utensils',
  'Car',
  'ShoppingBag',
  'Receipt',
  'Gamepad',
  'Heart',
  'Home',
  'Plane',
  'Book',
  'Gift',
  'Coffee',
  'Smartphone',
  'Laptop',
  'ShoppingCart',
  'MoreHorizontal',
  'Pizza',
  'GraduationCap',
  'Music',
  'Film',
  'Dumbbell',
  'Stethoscope',
  'Hammer',
  'Zap',
  'Tag',
] as const

export type CategoryIcon = typeof CATEGORY_ICONS[number]

// Category Colors
export const CATEGORY_COLORS = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f43f5e', // rose
  '#64748b', // slate
  '#06b6d4', // cyan
  '#84cc16', // lime
] as const

export type CategoryColor = typeof CATEGORY_COLORS[number]

// Date Range Options
export const DATE_RANGES = ['1M', '3M', '6M', '1Y', 'ALL'] as const
export type DateRange = typeof DATE_RANGES[number]

export const DATE_RANGE_LABELS: Record<DateRange, string> = {
  '1M': '1 Bulan',
  '3M': '3 Bulan',
  '6M': '6 Bulan',
  '1Y': '1 Tahun',
  'ALL': 'Semua',
}

// Transaction Types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const

// Chart Colors
export const CHART_COLORS = {
  income: '#10b981',
  expense: '#ef4444',
  balance: '#3b82f6',
} as const

// Currency
export const DEFAULT_CURRENCY = 'IDR'

// App Configuration
export const APP_CONFIG = {
  name: 'Pengluaran',
  description: 'Aplikasi Manajemen Keuangan Pribadi',
  defaultLocale: 'id',
  maxTransactionsPerPage: 50,
  maxCategoriesPerUser: 50,
} as const

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/dashboard/transactions',
  REPORTS: '/dashboard/reports',
  CATEGORIES: '/dashboard/categories',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  AUTH_FAILED: 'Autentikasi gagal. Silakan login kembali.',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Periksa koneksi internet Anda.',
  UNKNOWN_ERROR: 'Terjadi kesalahan. Silakan coba lagi.',
  REQUIRED_FIELD: 'Field ini wajib diisi',
  INVALID_EMAIL: 'Email tidak valid',
  PASSWORD_TOO_SHORT: 'Password minimal 6 karakter',
  INVALID_AMOUNT: 'Jumlah harus lebih dari 0',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  TRANSACTION_ADDED: 'Transaksi berhasil ditambahkan',
  TRANSACTION_UPDATED: 'Transaksi berhasil diperbarui',
  TRANSACTION_DELETED: 'Transaksi berhasil dihapus',
  CATEGORY_ADDED: 'Kategori berhasil ditambahkan',
  CATEGORY_UPDATED: 'Kategori berhasil diperbarui',
  CATEGORY_DELETED: 'Kategori berhasil dihapus',
  EXPORT_SUCCESS: 'Data berhasil diekspor',
} as const
