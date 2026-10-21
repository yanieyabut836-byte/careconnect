'use client'

import { useActionState, useState, useRef, useEffect } from 'react'
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

function EyeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function SetPasswordForm({ defaultUsername = '' }: { defaultUsername?: string }) {
  const [state, action, pending] = useActionState<ChangePasswordState, FormData>(
    changePasswordAction,
    null
  )

  const [newPassword, setNewPassword] = useState('')
  const newPasswordRef = useRef<HTMLInputElement>(null)

  // Toggle visibility states for each password field
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Poll / check input value periodically to detect browser autofill
  useEffect(() => {
    const syncValue = () => {
      if (newPasswordRef.current) {
        const val = newPasswordRef.current.value
        if (val !== newPassword) {
          setNewPassword(val)
        }
      }
    }
    syncValue()
    const timer = setInterval(syncValue, 250)
    return () => clearInterval(timer)
  }, [newPassword])

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

        {/* Assigned Default Username Pill */}
        {defaultUsername && (
          <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200/90 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Default Username Assigned</p>
              <p className="text-sm font-extrabold text-slate-800 font-mono mt-0.5">{defaultUsername}</p>
            </div>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-[11px] font-bold">
              Must be replaced
            </span>
          </div>
        )}

        {/* 1. New Personal Username */}
        <div>
          <label className={labelCls} htmlFor="newUsername">New Personal Username</label>
          <input
            id="newUsername"
            name="newUsername"
            type="text"
            autoComplete="username"
            placeholder="e.g. yanieyabut"
            disabled={pending}
            className={`${inputBase.replace('pr-14', 'pr-6')} ${inputBorder(fe?.username)}`}
          />
          <p className="text-xs text-slate-500 font-medium pl-4 mt-1.5">
            Choose your permanent username. You will use this to sign in to CareConnect.
          </p>
          {fe?.username && <p className="text-xs text-red-600 font-medium pl-4 mt-1.5">{fe.username}</p>}
        </div>

        {/* 2. Current / Default Password */}
        <div>
          <label className={labelCls} htmlFor="currentPassword">Current / Default Password (Optional)</label>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="e.g. CareConnect123!"
              disabled={pending}
              className={`${inputBase} ${inputBorder(fe?.currentPassword)}`}
            />
            <button
              type="button"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
              className="absolute right-0 top-0 bottom-0 w-14 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors z-20 cursor-pointer"
            >
              {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {fe?.currentPassword && <p className="text-xs text-red-600 font-medium pl-4 mt-1.5">{fe.currentPassword}</p>}
        </div>

        {/* 3. New Password */}
        <div>
          <label className={labelCls} htmlFor="newPassword">New Password</label>
          <div className="relative">
            <input
              ref={newPasswordRef}
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Enter new password"
              disabled={pending}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onInput={(e) => setNewPassword((e.target as HTMLInputElement).value)}
              className={`${inputBase} ${inputBorder(fe?.newPassword)}`}
            />
            <button
              type="button"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowNewPassword((prev) => !prev)}
              aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
              className="absolute right-0 top-0 bottom-0 w-14 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors z-20 cursor-pointer"
            >
              {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {fe?.newPassword && <p className="text-xs text-red-600 font-medium pl-4 mt-1.5">{fe.newPassword}</p>}
        </div>

        {/* 4. Confirm New Password */}
        <div>
          <label className={labelCls} htmlFor="confirmPassword">Confirm New Password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Confirm new password"
              disabled={pending}
              className={`${inputBase} ${inputBorder(fe?.confirmPassword)}`}
            />
            <button
              type="button"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              className="absolute right-0 top-0 bottom-0 w-14 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors z-20 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {fe?.confirmPassword && <p className="text-xs text-red-600 font-medium pl-4 mt-1.5">{fe.confirmPassword}</p>}
        </div>

        <button
          id="save-password-submit"
          type="submit"
          disabled={pending}
          className="w-full py-4 px-6 mt-3 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-medium rounded-full text-xl shadow-lg shadow-[#2563EB]/25 hover:shadow-[#2563EB]/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {pending ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Saving credentials...</span>
            </>
          ) : (
            'Save Credentials & Continue'
          )}
        </button>

        <div className="text-center pt-2">
          <a
            href="/login"
            className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            ← Back to Login
          </a>
        </div>
      </div>

      {/* Password Requirements Checklist (Lights up green when met) */}
      <aside aria-label="Password requirements" className="lg:pt-[3.25rem] lg:w-[260px] shrink-0">
        <h2 className="text-base font-bold text-slate-900 mb-3.5">Password Requirements</h2>
        <ul className="space-y-3">
          {requirements.map((r) => {
            const ok = r.test(newPassword)
            return (
              <li
                key={r.label}
                className={`flex items-center gap-3 text-sm transition-all duration-200 ${
                  ok ? 'text-emerald-700 font-bold' : 'text-slate-400 font-medium'
                }`}
              >
                <div
                  className={`w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                    ok
                      ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/30 ring-2 ring-emerald-500/20'
                      : 'border-2 border-slate-300 text-transparent bg-white'
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>{r.label}</span>
              </li>
            )
          })}
        </ul>
      </aside>
    </form>
  )
}
