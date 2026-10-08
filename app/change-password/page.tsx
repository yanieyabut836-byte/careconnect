import type { Metadata } from 'next'
import ActivationLayout from '@/components/activation-layout'
import ChangePasswordForm from './change-password-form'

export const metadata: Metadata = {
  title: 'Activate Your Account - CareConnect',
  description: 'Activate your CareConnect account to get started.',
}

export default async function ChangePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ link?: string }>
}) {
  const { link } = await searchParams
  return (
    <ActivationLayout
      title="Activate Your Account"
      subtitle="Please enter the details below to activate your account."
    >
      <ChangePasswordForm linkInvalid={link === 'invalid'} />
    </ActivationLayout>
  )
}
