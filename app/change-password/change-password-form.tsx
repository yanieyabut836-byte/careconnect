'use client'

import { useActionState } from 'react'
import { activateAccountAction, type ActivateAccountState } from '@/app/actions/auth'

const inputBase =
  'w-full px-6 py-[18px] bg-[#E4E6EA] hover:bg-[#DCDFE4] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/15 border-2 rounded-full text-base text-[#111827] placeholder-[#8B9099] transition-all disabled:opacity-60 outline-none'
const inputBorder = (err?: string) =>
  err ? 'border-red-500' : 'border-transparent focus:border-[#2563EB]'
const labelCls = 'block text-lg font-semibold text-slate-950 mb-2'

export default function ChangePasswordForm({ linkInvalid = false }: { linkInvalid?: boolean }) {
  const [state, action, pending] = useActionState<ActivateAccountState, FormData>(
    activateAccountAction,
    null
  )
  const fe = state?.fieldErrors

  return (
    <form action={action} noValidate className="space-y-7">
      {linkInvalid && !state && (
        <div role="alert" className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
          That activation link is invalid or has expired. Enter your details to get a new one.
        </div>
      )}
      {state?.success && (
        <div role="status" className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="font-medium">{state.success}</span>
        </div>
      )}
      {state?.error && (
        <div role="alert" className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="font-medium">{state.error}</span>
        </div>
      )}

      <div>
        <label className={labelCls} htmlFor="employeeId">Employee ID</label>
        <input
          id="employeeId"
          name="employeeId"
          type="text"
          autoComplete="username"
          placeholder="User Id"
          disabled={pending}
          className={`${inputBase} ${inputBorder(fe?.employeeId)}`}
        />
        {fe?.employeeId && <p className="text-xs text-red-600 font-medium pl-4 mt-1.5">{fe.employeeId}</p>}
      </div>

      <div>
        <label className={labelCls} htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          disabled={pending}
          className={`${inputBase} ${inputBorder(fe?.email)}`}
        />
        {fe?.email && <p className="text-xs text-red-600 font-medium pl-4 mt-1.5">{fe.email}</p>}
      </div>

      <button
        id="activate-account-submit"
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
            <span>Sending email...</span>
          </>
        ) : (
          'Activate Account'
        )}
      </button>

      <div className="text-center pt-4 text-base text-slate-800">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-[#2563EB] hover:text-[#1D4ED8] hover:underline underline-offset-4">
          Login now!
        </a>
      </div>
    </form>
  )
}
