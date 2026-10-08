'use client'

import { useActionState, useState } from 'react'
import { changePasswordAction, type ChangePasswordState } from '@/app/actions/auth'

const inputBase =
  'w-full px-6 py-[18px] pr-14 bg-[#E4E6EA] hover:bg-[#DCDFE4] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/15 border-2 rounded-full text-base text-[#111827] placeholder-[#8B9099] transition-all disabled:opacity-60 outline-none'
const inputBorder = (err?: string) =>
  err ? 'border-red-500' : 'border-transparent focus:border-[#2563EB]'
const labelCls = 'block text-lg font-semibold text-slate-950 mb-2'

const requirements = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One specialized character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

function EyeToggle({ shown, onClick }: { shown: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={shown ? 'Hide password' : 'Show password'}
      className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#6B7280] hover:text-[#374151] focus:outline-none"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {shown ? (
          <>
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </>
        ) : (
          <>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </>
        )}
      </svg>
    </button>
  )
}

function PasswordField({
  id,
  label,
  placeholder,
  autoComplete,
  error,
  disabled,
  value,
  onChange,
}: {
  id: string
  label: string
  placeholder: string
  autoComplete: string
  error?: string
  disabled: boolean
  value?: string
  onChange?: (v: string) => void
}) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className={labelCls} htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          {...(onChange
            ? { value, onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value) }
            : {})}
          className={`${inputBase} ${inputBorder(error)}`}
        />
        <EyeToggle shown={show} onClick={() => setShow((v) => !v)} />
      </div>
      {error && <p className="text-xs text-red-600 font-medium pl-4 mt-1.5">{error}</p>}
    </div>
  )
}

export default function SetPasswordForm() {
  const [state, action, pending] = useActionState<ChangePasswordState, FormData>(
    changePasswordAction,
    null
  )
  const [newPassword, setNewPassword] = useState('')
  const fe = state?.fieldErrors

  return (
    <form action={action} noValidate className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-10">
      <div className="flex-1 min-w-0 space-y-7 lg:max-w-[400px]">
        {state?.error && (
          <div role="alert" className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="font-medium">{state.error}</span>
          </div>
        )}

        <PasswordField
          id="currentPassword"
          label="Current Password (Optional if activating)"
          placeholder="Enter current password if assigned"
          autoComplete="current-password"
          error={fe?.currentPassword}
          disabled={pending}
        />
        <PasswordField
          id="newPassword"
          label="New Password"
          placeholder="Enter new password"
          autoComplete="new-password"
          error={fe?.newPassword}
          disabled={pending}
          value={newPassword}
          onChange={setNewPassword}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm New Password"
          placeholder="Confirm new password"
          autoComplete="new-password"
          error={fe?.confirmPassword}
          disabled={pending}
        />

        <button
          id="save-password-submit"
          type="submit"
          disabled={pending}
          className="w-full py-4 px-6 mt-3 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-medium rounded-full text-xl shadow-lg shadow-[#2563EB]/25 hover:shadow-[#2563EB]/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {pending ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            'Save Password'
          )}
        </button>
      </div>

      {/* Password requirements */}
      <aside aria-label="Password requirements" className="lg:pt-[3.25rem] lg:w-[250px] shrink-0">
        <h2 className="text-base font-semibold text-slate-950 mb-3">Password Requirements</h2>
        <ul className="space-y-2.5">
          {requirements.map((r) => {
            const ok = r.test(newPassword)
            return (
              <li key={r.label} className={`flex items-center gap-2.5 text-[15px] transition-colors ${ok ? 'text-slate-950' : 'text-slate-500'}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <circle cx="12" cy="12" r="10" stroke={ok ? '#00C853' : '#9CA3AF'} strokeWidth="1.8" fill={ok ? '#00C853' : 'none'} />
                  <path d="M7.5 12.5l3 3 6-6.5" stroke={ok ? '#fff' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {r.label}
              </li>
            )
          })}
        </ul>
      </aside>
    </form>
  )
}
