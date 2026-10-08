import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import EmployeeDashboardClient from '@/app/employee/dashboard/dashboard-client'

export const metadata: Metadata = {
  title: 'Dashboard - CareConnect',
  description: 'Employee Dashboard for CareConnect',
}

export default async function EmployeeDashboardPage() {
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

  const name = employee?.full_name || user?.email?.split('@')[0] || 'Yanie Yabut'

  return (
    <Suspense fallback={<div className="p-8 text-slate-500">Loading dashboard...</div>}>
      <EmployeeDashboardClient
        name={name}
        employeeId={employee?.employee_code || 'ABC-01'}
        department={employee?.department || 'Administration'}
        position={employee?.position || 'Administrator'}
      />
    </Suspense>
  )
}
