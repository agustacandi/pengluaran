/**
 * Validation schemas using Zod
 * Centralized validation logic for forms
 */

import { z } from 'zod'
import { ERROR_MESSAGES } from '@/lib/constants'

// Transaction validation schema
export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      ERROR_MESSAGES.INVALID_AMOUNT
    ),
  category_id: z.string().optional(),
  description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
  date: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD),
})

export type TransactionFormData = z.infer<typeof transactionSchema>

// Category validation schema
export const categorySchema = z.object({
  name: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(100, 'Nama kategori maksimal 100 karakter'),
  type: z.enum(['income', 'expense']),
  icon: z.string().optional(),
  color: z.string().min(1, 'Warna harus dipilih'),
})

export type CategoryFormData = z.infer<typeof categorySchema>

// Auth validation schemas
export const loginSchema = z.object({
  email: z.email(ERROR_MESSAGES.INVALID_EMAIL)
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  password: z.string()
    .min(6, ERROR_MESSAGES.PASSWORD_TOO_SHORT),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  fullName: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(255, 'Nama maksimal 255 karakter'),
  email: z.email(ERROR_MESSAGES.INVALID_EMAIL)
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  password: z.string()
    .min(6, ERROR_MESSAGES.PASSWORD_TOO_SHORT),
})

export type SignupFormData = z.infer<typeof signupSchema>
