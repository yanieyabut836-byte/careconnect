'use client'

import { useTransition } from 'react'
import { logoutAction } from '@/app/actions/auth'

interface TopBarProps {
  displayName: string
  position?: string | null
}

export default function TopBar({ displayName, position }: TopBarProps) {
  const [pending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      await logoutAction()
    })
  }

  // Initials
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-between gap-6 shrink-0 select-none sticky top-0 z-30 shadow-xs">
      {/* Search Input Bar */}
      <div className="flex-1 max-w-xl relative">
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder-slate-400 text-base px-5 py-3 pr-12 rounded-2xl border border-slate-200/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all outline-none"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Right User & Notification Controls */}
      <div className="flex items-center gap-5 shrink-0">
        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all duration-200 group active:scale-95"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white animate-pulse" />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200" />

        {/* User Identity Pill */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 p-1.5 pl-2 pr-4 rounded-2xl hover:border-slate-300 transition-colors">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 shrink-0">
              {initials || 'YY'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-900">{displayName}</p>
            <p className="text-xs text-slate-500 font-medium">{position || 'Employee'}</p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          id="topbar-logout"
          type="button"
          onClick={handleLogout}
          disabled={pending}
          title="Sign out"
          className="p-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl border border-slate-200/80 hover:border-rose-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {pending ? (
            <svg className="animate-spin h-5 w-5 text-rose-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}
