import type { Metadata } from 'next'
import ActivationLayout from '@/components/activation-layout'
import SetPasswordForm from './set-password-form'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata: Metadata = {
  title: 'Set Your Credentials - CareConnect',
  description: 'Please set your new username and password for your account.',
}

export default async function SetPasswordPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let defaultUsername = ''
  if (user?.id) {
    try {
      const admin = createAdminClient()
      const { data: emp } = await admin
        .from('employees')
        .select('employee_code')
        .eq('account_id', user.id)
        .maybeSingle()

      defaultUsername = emp?.employee_code || (user.user_metadata?.username as string) || ''
    } catch (e) {
      console.error('Failed to get default username:', e)
    }
  }

  return (
    <ActivationLayout
      title="Set Credentials"
      subtitle="Please set your new username and password to complete activation."
      illustration="monitor"
      welcomeTitle="Welcome to CareConnect"
      welcomeText="Replace the default credentials sent to your email with your personalized username and password."
      contentClassName="max-w-[460px] lg:max-w-[760px]"
    >
      <SetPasswordForm defaultUsername={defaultUsername} />
    </ActivationLayout>
  )
}
