import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { TransactionsContent } from '@/components/transactions/TransactionsContent'

export default async function TransactionsPage() {
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
      <TransactionsContent
        transactions={transactions || []}
        categories={categories || []}
      />
    </DashboardLayout>
  )
}
