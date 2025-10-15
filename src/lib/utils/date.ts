/**
 * Date utilities
 * Helper functions for date manipulation and formatting
 */

import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  parseISO,
} from 'date-fns'
import { id } from 'date-fns/locale'
import { DateRange } from '@/lib/constants'

/**
 * Get start date based on date range
 */
export function getStartDate(range: DateRange): Date {
  const now = new Date()

  switch (range) {
    case '1M':
      return subMonths(now, 1)
    case '3M':
      return subMonths(now, 3)
    case '6M':
      return subMonths(now, 6)
    case '1Y':
      return subMonths(now, 12)
    case 'ALL':
      return new Date(0) // Beginning of time
    default:
      return subMonths(now, 6)
  }
}

/**
 * Get all days in current month
 */
export function getDaysInCurrentMonth(): Date[] {
  const now = new Date()
  const start = startOfMonth(now)
  const end = endOfMonth(now)
  return eachDayOfInterval({ start, end })
}

/**
 * Get all months in date range
 */
export function getMonthsInRange(startDate: Date, endDate: Date): Date[] {
  return eachMonthOfInterval({ start: startDate, end: endDate })
}

/**
 * Format date to Indonesian locale
 */
export function formatDateID(date: Date | string, formatStr: string = 'd MMMM yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: id })
}

/**
 * Format date for API (YYYY-MM-DD)
 */
export function formatDateForAPI(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Get month name in Indonesian
 */
export function getMonthNameID(date: Date): string {
  return format(date, 'MMMM yyyy', { locale: id })
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const today = new Date()
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  )
}

/**
 * Get relative time string (e.g., "2 hari yang lalu")
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Hari ini'
  if (diffInDays === 1) return 'Kemarin'
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu yang lalu`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} bulan yang lalu`
  return `${Math.floor(diffInDays / 365)} tahun yang lalu`
}
