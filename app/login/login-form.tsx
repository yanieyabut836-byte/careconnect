'use client'

import { useActionState, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loginAction, type AuthState } from '@/app/actions/auth'

export default function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(loginAction, null)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const searchParams = useSearchParams()
  const isActivated = searchParams.get('activated') === 'true'

  return (
    <form action={action} noValidate className="space-y-7">
      {/* Account Activated Success Banner */}
      {isActivated && !state && (
        <div role="status" className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-emerald-600">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div>
            <p className="font-bold text-emerald-950 text-base">Account Activated Successfully! 🎉</p>
            <p className="text-emerald-800 text-xs mt-0.5 font-medium">Your account has been activated. Please log in with your credentials below to access your dashboard.</p>
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {state?.error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span className="font-medium">{state.error}</span>
        </div>
      )}

      {/* Employee ID Input */}
      <div className="space-y-2">
        <label className="block text-lg font-semibold text-slate-950" htmlFor="email">
          Employee ID / Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#6B7280]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <input
            id="email"
            name="email"
            type="text"
            autoComplete="username"
            className={`w-full pl-13 pr-6 py-[18px] bg-[#E4E6EA] hover:bg-[#DCDFE4] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/15 border-2 ${
              state?.fieldErrors?.email ? 'border-red-500' : 'border-transparent focus:border-[#2563EB]'
            } rounded-full text-base text-[#111827] placeholder-[#8B9099] transition-all disabled:opacity-60 outline-none`}
            placeholder="Enter your Employee ID or email"
            required
            disabled={pending}
          />
        </div>
        {state?.fieldErrors?.email && (
          <p className="text-xs text-red-600 font-medium pl-4">{state.fieldErrors.email}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label className="block text-lg font-semibold text-slate-950" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#6B7280]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className={`w-full pl-13 pr-14 py-[18px] bg-[#E4E6EA] hover:bg-[#DCDFE4] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/15 border-2 ${
              state?.fieldErrors?.password ? 'border-red-500' : 'border-transparent focus:border-[#2563EB]'
            } rounded-full text-base text-[#111827] placeholder-[#8B9099] transition-all disabled:opacity-60 outline-none`}
            placeholder="Enter your new password"
            required
            disabled={pending}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#6B7280] hover:text-[#374151] focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
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
        {state?.fieldErrors?.password && (
          <p className="text-xs text-red-600 font-medium pl-4">{state.fieldErrors.password}</p>
        )}
      </div>

      {/* Options Row */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-1">
        <label className="inline-flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <div className="w-10 h-5.5 bg-[#D1D5DB] peer-focus-visible:ring-4 peer-focus-visible:ring-[#2563EB]/20 rounded-full transition-colors peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563EB]"></div>
          </div>
          <span className="text-base text-slate-800">Remember me</span>
        </label>

        <a href="/forgot-password" className="text-base font-medium text-[#2563EB] hover:text-[#1D4ED8] hover:underline underline-offset-4 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]">
          Forgot Password?
        </a>
      </div>

      {/* Login Button */}
      <button
        id="login-submit"
        type="submit"
        disabled={pending}
        className="w-full py-4 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-medium rounded-full text-xl shadow-lg shadow-[#2563EB]/25 hover:shadow-[#2563EB]/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-3"
      >
        {pending ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Logging in...</span>
          </>
        ) : (
          'Login'
        )}
      </button>

      {/* Footer link */}
      <div className="text-center pt-4 text-base text-slate-800">
        Don’t have an account?{' '}
        <a href="/change-password" className="font-medium text-[#2563EB] hover:text-[#1D4ED8] hover:underline underline-offset-4">
          Activate your account
        </a>
      </div>
    </form>
  )
}
