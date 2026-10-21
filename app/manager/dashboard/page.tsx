import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ManagerDashboardClient from './dashboard-client'

export const metadata: Metadata = {
  title: 'Manager Dashboard - CareConnect',
  description: 'Department Manager Dashboard for CareConnect',
}

export default async function ManagerDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let employee = null
  if (user) {
    const { data } = await supabase
      .from('employees')
      .select('employee_code, full_name, position, department, is_activated')
      .eq('account_id', user.id)
      .maybeSingle()
    employee = data
  }

  const managerName = employee?.full_name || 'Yanie Yabut'
  const department = employee?.department || 'Administration'

  return (
    <Suspense fallback={<div className="p-8 text-slate-500">Loading manager dashboard...</div>}>
      <ManagerDashboardClient managerName={managerName} department={department} />
    </Suspense>
  )
}
