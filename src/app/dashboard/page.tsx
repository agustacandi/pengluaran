import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch transactions for the current month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .eq('user_id', user.id)
    .gte('date', startOfMonth.toISOString().split('T')[0])
    .order('date', { ascending: false })

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  return (
    <DashboardLayout>
      <DashboardContent
        transactions={transactions || []}
        categories={categories || []}
      />
    </DashboardLayout>
  )
}
