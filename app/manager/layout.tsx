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
    .maybeSingle()

  const displayName = employee?.full_name || 'Yanie Yabut'

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#F1F5F9] font-sans antialiased text-slate-900">
      {/* Fixed Sidebar */}
      <Sidebar role="manager" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <TopBar displayName={displayName} position={employee?.position ?? 'Department Manager'} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
