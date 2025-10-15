/**
 * Custom hook for authentication operations
 * Provides a clean API for auth-related actions
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ROUTES } from '@/lib/constants'

interface UseAuthOptions {
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export function useAuth(options?: UseAuthOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        options?.onSuccess?.('Berhasil masuk')
        router.push(ROUTES.DASHBOARD)
        router.refresh()
      } catch (err: any) {
        const errorMessage = err.message || 'Gagal masuk'
        setError(errorMessage)
        options?.onError?.(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [supabase, router, options]
  )

  /**
   * Sign up with email and password
   */
  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })

        if (error) throw error

        options?.onSuccess?.('Akun berhasil dibuat')
        return true
      } catch (err: any) {
        const errorMessage = err.message || 'Gagal membuat akun'
        setError(errorMessage)
        options?.onError?.(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [supabase, options]
  )

  /**
   * Sign out
   */
  const signOut = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await supabase.auth.signOut()
      options?.onSuccess?.('Berhasil keluar')
      router.push(ROUTES.LOGIN)
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal keluar'
      setError(errorMessage)
      options?.onError?.(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [supabase, router, options])

  return {
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
  }
}
