'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendActivationEmail } from '@/lib/email/brevo'

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export type AuthState = {
  error?: string
  fieldErrors?: { email?: string; password?: string }
} | null

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const inputEmailOrId = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  // Basic validation
  const fieldErrors: NonNullable<AuthState>['fieldErrors'] = {}
  if (!inputEmailOrId) fieldErrors.email = 'Employee ID or Email is required.'
  if (!password) fieldErrors.password = 'Password is required.'
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  let emailToAuth = inputEmailOrId

  // If input is an Employee ID (e.g. EMP-001) without @, resolve to account email
  if (!emailToAuth.includes('@')) {
    try {
      const admin = createAdminClient()
      const { data: emp } = await admin
        .from('employees')
        .select('account_id')
        .ilike('employee_code', emailToAuth.replace(/[\\%_]/g, (c) => `\\${c}`))
        .maybeSingle()

      if (emp?.account_id) {
        const { data: authUser } = await admin.auth.admin.getUserById(emp.account_id)
        if (authUser?.user?.email) {
          emailToAuth = authUser.user.email
        }
      }
    } catch (err) {
      console.error('[loginAction] Employee ID lookup failed:', err)
    }
  }

  const supabase = await createClient()

  let { data, error } = await supabase.auth.signInWithPassword({
    email: emailToAuth,
    password,
  })

  // If default password CareConnect123! was used on unactivated account, set it if needed
  if (error && password === 'CareConnect123!') {
    try {
      const admin = createAdminClient()
      const { data: emp } = await admin
        .from('employees')
        .select('account_id, is_activated')
        .or(`personal_email.eq.${emailToAuth},employee_code.ilike.${inputEmailOrId}`)
        .maybeSingle()

      if (emp?.account_id && emp.is_activated === false) {
        await admin.auth.admin.updateUserById(emp.account_id, {
          password: 'CareConnect123!',
          user_metadata: { is_activated: false },
        })

        const retry = await supabase.auth.signInWithPassword({
          email: emailToAuth,
          password: 'CareConnect123!',
        })
        if (!retry.error) {
          data = retry.data
          error = null
        }
      }
    } catch (err) {
      console.error('[loginAction] Default password provision error:', err)
    }
  }

  if (error) {
    return { error: error.message }
  }

  const role = data.user?.user_metadata?.role as string | undefined
  let isActivated = data.user?.user_metadata?.is_activated as boolean | undefined

  // Also verify database status in employees table
  if (data.user?.id) {
    const { data: empRecord } = await supabase
      .from('employees')
      .select('is_activated')
      .eq('account_id', data.user.id)
      .maybeSingle()

    if (empRecord && typeof empRecord.is_activated === 'boolean') {
      isActivated = empRecord.is_activated
    }
  }

  // Logging in with default password CareConnect123! OR unactivated account -> force change default password
  if (password === 'CareConnect123!' || isActivated !== true) {
    try {
      const admin = createAdminClient()
      if (data.user?.id) {
        await admin.auth.admin.updateUserById(data.user.id, {
          user_metadata: { ...data.user.user_metadata, is_activated: false },
        })
        await admin
          .from('employees')
          .update({ is_activated: false })
          .eq('account_id', data.user.id)
      }
    } catch (e) {
      console.error('[loginAction] Reset activation state failed:', e)
    }

    revalidatePath('/', 'layout')
    redirect('/set-password')
  }

  revalidatePath('/', 'layout')
  redirect(role === 'manager' ? '/manager/dashboard' : '/employee/dashboard')
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------
export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

// ---------------------------------------------------------------------------
// Activate Account — step 1: verify Employee ID + email
// ---------------------------------------------------------------------------


export type ActivateAccountState = {
  error?: string
  success?: string
  fieldErrors?: { employeeId?: string; email?: string }
} | null

export async function activateAccountAction(
  _prevState: ActivateAccountState,
  formData: FormData
): Promise<ActivateAccountState> {
  const employeeId = ((formData.get('employeeId') as string) ?? '').trim()
  const email = ((formData.get('email') as string) ?? '').trim().toLowerCase()

  const fieldErrors: NonNullable<ActivateAccountState>['fieldErrors'] = {}
  if (!employeeId) fieldErrors.employeeId = 'Employee ID is required.'
  if (!email) {
    fieldErrors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'Enter a valid email address.'
  }
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  // Same response whether or not the details match, so IDs/emails can't be probed.
  const genericSuccess: ActivateAccountState = {
    success:
      'Activation link sent successfully! Please check your email inbox (and spam folder) to complete your account activation.',
  }

  // Fail loudly (instead of pretending success) if server keys aren't configured
  const isMissing = (v?: string) => !v || v.startsWith('PASTE_') || v.includes('example.com')
  const missing = [
    ['SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY],
    ['BREVO_API_KEY', process.env.BREVO_API_KEY],
    ['BREVO_SENDER_EMAIL', process.env.BREVO_SENDER_EMAIL],
  ]
    .filter(([, v]) => isMissing(v as string | undefined))
    .map(([k]) => k)
  if (missing.length > 0) {
    console.error(`[activate] Missing/placeholder env vars in .env.local: ${missing.join(', ')}`)
    return { error: 'Email service is not configured yet. Please contact your administrator.' }
  }

  try {
    const admin = createAdminClient()

    const { data: employee, error: employeeError } = await admin
      .from('employees')
      .select('account_id, employee_code, full_name, personal_email, is_activated')
      .ilike('employee_code', employeeId.replace(/[\\%_]/g, (c) => `\\${c}`))
      .maybeSingle()

    if (employeeError) {
      console.error('[activate] employees lookup failed:', employeeError.message)
      return { error: `Database error: ${employeeError.message}` }
    }
    if (!employee?.account_id) {
      console.warn(`[activate] No employee found with employee_code "${employeeId}"`)
      return genericSuccess
    }
    // Note: Allow sending activation magic link even if requested again

    const { data: authData } = await admin.auth.admin.getUserById(employee.account_id)
    const authUser = authData?.user
    if (!authUser?.email) {
      console.warn('[activate] Linked auth user has no email')
      return genericSuccess
    }

    const knownEmails = [authUser.email, employee.personal_email]
      .filter(Boolean)
      .map((e) => (e as string).toLowerCase())
    if (!knownEmails.includes(email)) {
      console.warn(
        `[activate] Email "${email}" does not match records for ${employee.employee_code} (personal_email: ${employee.personal_email ?? 'null'})`
      )
      return genericSuccess
    }

    // Set default temporary password
    await admin.auth.admin.updateUserById(employee.account_id, {
      password: 'CareConnect123!',
      user_metadata: { ...authUser.user_metadata, is_activated: false },
    })

    // Generate activation link and send email
    const { data: link, error: linkError } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: authUser.email,
    })
    const tokenHash = link?.properties?.hashed_token
    if (linkError || !tokenHash) {
      console.error('generateLink failed:', linkError?.message)
      return { error: 'Could not create the activation link. Please try again.' }
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
    const activationUrl = `${siteUrl}/auth/confirm?token_hash=${encodeURIComponent(
      tokenHash
    )}&type=magiclink`

    await sendActivationEmail({
      to: email,
      name: employee.full_name || undefined,
      activationUrl,
    })
  } catch (err) {
    console.error('activateAccountAction failed:', err)
    return { error: 'We could not send the activation email. Please try again later.' }
  }

  return genericSuccess
}

// ---------------------------------------------------------------------------
// Change Password (forced on first login, replaces the default password)
// ---------------------------------------------------------------------------
export type ChangePasswordState = {
  error?: string
  fieldErrors?: {
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }
  success?: boolean
} | null

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const currentPassword = (formData.get('currentPassword') as string) ?? ''
  const newPassword = (formData.get('newPassword') as string) ?? ''
  const confirmPassword = (formData.get('confirmPassword') as string) ?? ''

  const supabase = await createClient()

  const {
    data: { user: current },
  } = await supabase.auth.getUser()
  if (!current || !current.email) {
    return { error: 'Your session has expired. Please request a new activation link.' }
  }

  const isActivated = current.user_metadata?.is_activated as boolean | undefined

  const fieldErrors: NonNullable<ChangePasswordState>['fieldErrors'] = {}

  // Only require current password if account was already activated
  if (isActivated === true && !currentPassword) {
    fieldErrors.currentPassword = 'Current password is required.'
  }

  if (
    newPassword.length < 8 ||
    !/[A-Z]/.test(newPassword) ||
    !/[a-z]/.test(newPassword) ||
    !/[0-9]/.test(newPassword) ||
    !/[^A-Za-z0-9]/.test(newPassword)
  ) {
    fieldErrors.newPassword = 'Password does not meet all the requirements.'
  } else if (currentPassword && newPassword === currentPassword) {
    fieldErrors.newPassword = 'New password must be different from the current one.'
  }

  if (newPassword !== confirmPassword) {
    fieldErrors.confirmPassword = 'Passwords do not match.'
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  // Verify current password only if account was already activated and user provided it
  if (isActivated === true && currentPassword) {
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: current.email,
      password: currentPassword,
    })
    if (verifyError) {
      return { fieldErrors: { currentPassword: 'Current password is incorrect.' } }
    }
  }

  const { error: pwError } = await supabase.auth.updateUser({
    password: newPassword,
    data: { is_activated: true },
  })

  if (pwError) {
    return { error: pwError.message }
  }

  // Mark employee record as activated using admin client
  try {
    const admin = createAdminClient()
    await admin
      .from('employees')
      .update({ is_activated: true })
      .eq('account_id', current.id)
  } catch (err) {
    console.error('Failed to update employee is_activated in db:', err)
  }

  const role = current.user_metadata?.role as string | undefined
  revalidatePath('/', 'layout')
  redirect(role === 'manager' ? '/manager/dashboard?activated=true' : '/employee/dashboard?activated=true')
}


// ---------------------------------------------------------------------------
// Forgot Password
// ---------------------------------------------------------------------------
export type ForgotPasswordState = {
  error?: string
  fieldErrors?: { email?: string }
  success?: boolean
} | null

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = (formData.get('email') as string)?.trim()

  if (!email) return { fieldErrors: { email: 'Email is required.' } }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// ---------------------------------------------------------------------------
// Reset Password (after clicking email link)
// ---------------------------------------------------------------------------
export type ResetPasswordState = {
  error?: string
  fieldErrors?: { newPassword?: string; confirmPassword?: string }
  success?: boolean
} | null

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  const fieldErrors: NonNullable<ResetPasswordState>['fieldErrors'] = {}
  if (!newPassword || newPassword.length < 8) {
    fieldErrors.newPassword = 'Password must be at least 8 characters.'
  }
  if (newPassword !== confirmPassword) {
    fieldErrors.confirmPassword = 'Passwords do not match.'
  }
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) return { error: error.message }

  return { success: true }
}

