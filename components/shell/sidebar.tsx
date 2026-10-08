'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function AttendanceIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function TasksIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

function AnnouncementsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function LeaveIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function EmployeesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType
  badge?: string
}

const employeeLinks: NavItem[] = [
  { href: '/employee/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { href: '/employee/profile', label: 'Profile', icon: ProfileIcon },
  { href: '/employee/attendance', label: 'Attendance', icon: AttendanceIcon },
  { href: '/employee/tasks', label: 'Tasks', icon: TasksIcon, badge: '3' },
  { href: '/employee/announcements', label: 'Announcements', icon: AnnouncementsIcon, badge: 'New' },
  { href: '/employee/leave', label: 'Leave', icon: LeaveIcon },
]

const managerLinks: NavItem[] = [
  { href: '/manager/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { href: '/manager/employees', label: 'Manage Employees', icon: EmployeesIcon },
  { href: '/manager/tasks', label: 'Tasks', icon: TasksIcon },
  { href: '/manager/leave-requests', label: 'Leave Requests', icon: LeaveIcon },
  { href: '/manager/announcements', label: 'Announcements', icon: AnnouncementsIcon },
  { href: '/manager/profile', label: 'Profile', icon: ProfileIcon },
]

export default function Sidebar({ role }: { role: 'employee' | 'manager' }) {
  const pathname = usePathname()
  const links = role === 'manager' ? managerLinks : employeeLinks

  return (
    <aside className="w-64 lg:w-72 bg-[#091535] text-slate-200 shrink-0 flex flex-col h-screen overflow-y-auto select-none border-r border-slate-800/80 shadow-2xl relative z-20">
      {/* Brand Header */}
      <div className="p-6 pb-8 flex items-center gap-3.5 border-b border-slate-800/60">
        <div className="relative">
          <img
            src="/image/careconnect-logo.svg"
            alt="CareConnect Logo"
            className="w-11 h-auto shrink-0 select-none drop-shadow-[0_0_12px_rgba(0,164,130,0.3)]"
          />
        </div>
        <div className="leading-tight">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
            CareConnect
          </h1>
          <p className="text-[11px] text-teal-400/90 font-medium tracking-wide">
            Your Health, Our priority
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-2" aria-label="Main Navigation">
        <p className="px-3 text-[11px] font-semibold text-slate-400/70 tracking-wider uppercase mb-3">
          Menu Navigation
        </p>
        {links.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl font-medium text-base transition-all duration-200 ${
                active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-white/20 translate-x-1'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white hover:translate-x-1'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <div className="flex items-center gap-3.5">
                <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <Icon />
                </span>
                <span>{label}</span>
              </div>
              {badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                  active
                    ? 'bg-white/20 text-white'
                    : badge === 'New'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Role Footer Card */}
      <div className="p-4 m-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-300 font-medium capitalize">
            {role === 'manager' ? 'Department Manager' : 'Employee Portal'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md font-mono">
          v1.0
        </span>
      </div>
    </aside>
  )
}
