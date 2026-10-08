'use client'

import { useActionState, useState } from 'react'
import { resetPasswordAction, type ResetPasswordState } from '@/app/actions/auth'

export default function ResetPasswordForm() {
  const [state, action, pending] = useActionState<ResetPasswordState, FormData>(
    resetPasswordAction,
    null
  )
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  if (state?.success) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-base flex items-start gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-emerald-600">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <div>
            <p className="font-semibold text-emerald-900">Password successfully updated</p>
            <p className="text-sm text-emerald-700 mt-1">Your password has been reset. You can now sign in with your new credentials.</p>
          </div>
        </div>
        <a
          href="/login"
          className="w-full py-4 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-full text-lg shadow-sm transition-all flex items-center justify-center text-center"
        >
          Proceed to Login
        </a>
      </div>
    )
  }

  return (
    <form action={action} noValidate className="space-y-6">
      {/* Global Error Banner */}
      {state?.error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span className="font-medium">{state.error}</span>
        </div>
      )}

      {/* New Password Input */}
      <div className="space-y-2">
        <label className="block text-base font-semibold text-[#111827]" htmlFor="newPassword">
          New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#6B7280]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <input
            id="newPassword"
            name="newPassword"
            type={showNew ? 'text' : 'password'}
            autoComplete="new-password"
            className={`w-full pl-13 pr-14 py-4 bg-[#D1D5DB]/60 hover:bg-[#D1D5DB]/80 focus:bg-white border-2 ${
              state?.fieldErrors?.newPassword ? 'border-red-500' : 'border-transparent focus:border-[#2563EB]'
            } rounded-full text-base text-[#111827] placeholder-[#9CA3AF] transition-all outline-none`}
            placeholder="Min. 8 characters"
            required
            disabled={pending}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#6B7280] hover:text-[#374151] focus:outline-none"
            onClick={() => setShowNew((v) => !v)}
            aria-label={showNew ? 'Hide' : 'Show'}
          >
            {showNew ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
        {state?.fieldErrors?.newPassword && (
          <p className="text-xs text-red-600 font-medium pl-4">{state.fieldErrors.newPassword}</p>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <label className="block text-base font-semibold text-[#111827]" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#6B7280]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            className={`w-full pl-13 pr-14 py-4 bg-[#D1D5DB]/60 hover:bg-[#D1D5DB]/80 focus:bg-white border-2 ${
              state?.fieldErrors?.confirmPassword ? 'border-red-500' : 'border-transparent focus:border-[#2563EB]'
            } rounded-full text-base text-[#111827] placeholder-[#9CA3AF] transition-all outline-none`}
            placeholder="Repeat your new password"
            required
            disabled={pending}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#6B7280] hover:text-[#374151] focus:outline-none"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? 'Hide' : 'Show'}
          >
            {showConfirm ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
        {state?.fieldErrors?.confirmPassword && (
          <p className="text-xs text-red-600 font-medium pl-4">{state.fieldErrors.confirmPassword}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        id="reset-password-submit"
        type="submit"
        disabled={pending}
        className="w-full py-4 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-medium rounded-full text-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
      >
        {pending ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Updating password...</span>
          </>
        ) : (
          'Update password'
        )}
      </button>
    </form>
  )
}
