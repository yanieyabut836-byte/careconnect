import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/shell/sidebar'
import TopBar from '@/components/shell/topbar'

export default async function ManagerShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) redirect('/login')

  // Enforce manager role
  const role = user.user_metadata?.role as string | undefined
  if (role !== 'manager') redirect('/employee/dashboard')

  const { data: employee } = await supabase
    .from('employees')
    .select('full_name, position')
    .eq('account_id', user.id)
    .single()

  const displayName = employee?.full_name || user.email || 'Manager'

  return (
    <div className="shell">
      <Sidebar role="manager" />
      <div className="main-content">
        <TopBar displayName={displayName} position={employee?.position ?? 'Department Manager'} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  )
}
