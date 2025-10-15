import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ReportsContent } from '@/components/reports/ReportsContent'

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  return (
    <DashboardLayout>
      <ReportsContent
        transactions={transactions || []}
        categories={categories || []}
      />
    </DashboardLayout>
  )
}
