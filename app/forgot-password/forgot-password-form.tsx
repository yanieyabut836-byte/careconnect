'use client'

import { useActionState } from 'react'
import { forgotPasswordAction, type ForgotPasswordState } from '@/app/actions/auth'

export default function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<ForgotPasswordState, FormData>(
    forgotPasswordAction,
    null
  )

  if (state?.success) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-base flex items-start gap-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-emerald-600">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <div>
          <p className="font-semibold text-emerald-900">Check your inbox</p>
          <p className="text-sm text-emerald-700 mt-1">We&apos;ve sent a password reset link to your email address.</p>
        </div>
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

      {/* Email Input */}
      <div className="space-y-2">
        <label className="block text-base font-semibold text-[#111827]" htmlFor="email">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#6B7280]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`w-full pl-13 pr-6 py-4 bg-[#D1D5DB]/60 hover:bg-[#D1D5DB]/80 focus:bg-white border-2 ${
              state?.fieldErrors?.email ? 'border-red-500' : 'border-transparent focus:border-[#2563EB]'
            } rounded-full text-base text-[#111827] placeholder-[#9CA3AF] transition-all outline-none`}
            placeholder="Enter your registered email"
            required
            disabled={pending}
          />
        </div>
        {state?.fieldErrors?.email && (
          <p className="text-xs text-red-600 font-medium pl-4">{state.fieldErrors.email}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        id="forgot-password-submit"
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
            <span>Sending link...</span>
          </>
        ) : (
          'Send reset link'
        )}
      </button>
    </form>
  )
}
