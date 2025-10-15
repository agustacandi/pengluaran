/**
 * Toast notification component
 * Provides user feedback for actions
 */

'use client'

import { useEffect } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-bottom-5',
        styles[type]
      )}
    >
      {icons[type]}
      <p className="font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-70 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

/**
 * Toast container hook
 */
import { useState, useCallback } from 'react'

export interface ToastConfig {
  message: string
  type?: ToastType
  duration?: number
}

export function useToast() {
  const [toast, setToast] = useState<ToastConfig | null>(null)

  const showToast = useCallback((config: ToastConfig) => {
    setToast(config)
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  const showSuccess = useCallback(
    (message: string) => {
      showToast({ message, type: 'success' })
    },
    [showToast]
  )

  const showError = useCallback(
    (message: string) => {
      showToast({ message, type: 'error' })
    },
    [showToast]
  )

  const showInfo = useCallback(
    (message: string) => {
      showToast({ message, type: 'info' })
    },
    [showToast]
  )

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showInfo,
  }
}
