import type { Metadata } from 'next'
import ActivationLayout from '@/components/activation-layout'
import SetPasswordForm from './set-password-form'

export const metadata: Metadata = {
  title: 'Change Password - CareConnect',
  description: 'Please set a new password for your account.',
}

export default function SetPasswordPage() {
  return (
    <ActivationLayout
      title="Change Password"
      subtitle="Please set a new password for your account."
      illustration="monitor"
      welcomeTitle="For Your Security"
      welcomeText="Please change your default password before continuing to the system."
      contentClassName="max-w-[460px] lg:max-w-[760px]"
    >
      <SetPasswordForm />
    </ActivationLayout>
  )
}
