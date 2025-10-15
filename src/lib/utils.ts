/**
 * General utility functions
 * Core utilities used throughout the application
 */

import { type ClassValue, clsx } from 'clsx'
import { DEFAULT_CURRENCY } from '@/lib/constants'

/**
 * Combine class names using clsx
 * Useful for conditional styling with Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Format number as currency
 * Defaults to Indonesian Rupiah (IDR)
 */
export function formatCurrency(amount: number, currency: string = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format date to long format (1 Januari 2025)
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Format date to short format (1 Jan)
 */
export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date))
}

/**
 * Format large numbers with K, M, B suffixes
 * Example: 1500 -> 1.5K
 */
export function formatCompactNumber(num: number): string {
  const formatter = new Intl.NumberFormat('id-ID', {
    notation: 'compact',
    compactDisplay: 'short',
  })
  return formatter.format(num)
}

/**
 * Debounce function calls
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Sleep/delay execution
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
