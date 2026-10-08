'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface DashboardClientProps {
  name: string
  employeeId: string
  department: string
  position: string
}

export default function EmployeeDashboardClient({
  name,
  employeeId,
  department,
  position,
}: DashboardClientProps) {
  const searchParams = useSearchParams()
  const isActivated = searchParams.get('activated') === 'true'

  // Interactive tasks state matching mockup content
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Update records', completed: true },
    { id: 2, text: 'Submit daily report', completed: true },
    { id: 3, text: 'Staff meeting at 2:00 PM', completed: true },
  ])

  const [currentMonth] = useState('July 2026')

  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  // User initials
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('') || 'YY'

  return (
    <div className="max-w-[1650px] mx-auto space-y-6 pb-6 select-none">
      {/* Account Activated Success Banner */}
      {isActivated && (
        <div role="status" className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3 shadow-xs">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-emerald-600">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div>
            <p className="font-bold text-emerald-950 text-base">Account Activated Successfully! 🎉</p>
            <p className="text-emerald-800 text-xs mt-0.5 font-medium">Your password has been saved and your account is fully active. Welcome to CareConnect!</p>
          </div>
        </div>
      )}

      {/* 1. Hero Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome, {name}!
        </h1>
        <p className="text-sm lg:text-base text-slate-500 mt-1 font-medium">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* 2. Top Section: 6 Stat Cards (Left 8 Cols) + Mini Calendar Widget (Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 8 Columns: 3x2 Grid of Stat Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1: Patients */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Patients</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">24</p>
              <p className="text-[11px] text-slate-400 font-medium">Total Patients</p>
            </div>
          </div>

          {/* Card 2: Appointments */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Appointments</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">12</p>
              <p className="text-[11px] text-slate-400 font-medium">Total appointments</p>
            </div>
          </div>

          {/* Card 3: Announcements */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Announcements</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">1</p>
              <p className="text-[11px] text-slate-400 font-medium">Total Announcement</p>
            </div>
          </div>

          {/* Card 4: Leave Status */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Leave Status</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">3 days</p>
              <p className="text-[11px] text-slate-400 font-medium">Leave balance</p>
            </div>
          </div>

          {/* Card 5: Upcoming Leave */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Upcoming Leave</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">Dec 24-26</p>
              <p className="text-[11px] text-emerald-600 font-bold">Approved</p>
            </div>
          </div>

          {/* Card 6: Pending Leave */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Pending Leave</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">1</p>
              <p className="text-[11px] text-amber-600 font-bold">For approval</p>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Mini Calendar Widget */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-3">
            <button type="button" className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700">&lt;</button>
            <span>{currentMonth}</span>
            <button type="button" className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700">&gt;</button>
          </div>
          <div className="grid grid-cols-7 text-[9px] font-bold text-slate-400 text-center mb-2">
            <span>SAN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>
          <div className="grid grid-cols-7 text-xs text-center gap-y-2 font-medium text-slate-700">
            <span className="text-slate-300">28</span><span className="text-slate-300">29</span><span className="text-slate-300">30</span>
            <span>1</span><span>2</span><span>3</span><span>4</span>
            <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>
            <span>12</span><span>13</span><span>14</span><span>15</span>
            <span className="bg-blue-600 text-white rounded-full font-bold flex items-center justify-center w-6 h-6 mx-auto shadow-sm shadow-blue-500/30">16</span>
            <span>17</span><span>18</span>
            <span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span>
            <span>26</span><span>27</span><span>28</span><span>29</span><span>30</span><span>31</span><span className="text-slate-300">1</span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid (Left 8 Cols / Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Row 1: Upcoming Appointments + Recent Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Upcoming Appointments Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">Upcoming Appointments</h3>
                  <a href="#view-all" className="text-xs font-bold text-blue-600 hover:underline">View All</a>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-extrabold text-blue-600">9:00 AM</span>
                    <span className="font-semibold text-slate-900 flex-1 px-3">Franz Fernando</span>
                    <span className="text-slate-400 font-medium text-[11px]">General Check up</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-extrabold text-blue-600">10:00 AM</span>
                    <span className="font-semibold text-slate-900 flex-1 px-3">Elizehr Manlapat</span>
                    <span className="text-slate-400 font-medium text-[11px]">General Check up</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-extrabold text-blue-600">11:00 AM</span>
                    <span className="font-semibold text-slate-900 flex-1 px-3">Red Reyes</span>
                    <span className="text-slate-400 font-medium text-[11px]">General Check up</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
                  <a href="#view-all" className="text-xs font-bold text-blue-600 hover:underline">View All</a>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800">New appointment booked</span>
                    <span className="text-[11px] text-slate-400">Today, 8:40 AM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800">Leave request approved</span>
                    <span className="text-[11px] text-slate-400">Today, 10:40 AM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800">Task assigned</span>
                    <span className="text-[11px] text-slate-400">Yesterday, 8:40 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Attendance Summary + Today's Task */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Attendance Summary Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">Attendance Summary</h3>
                  <a href="#view-all" className="text-xs font-bold text-blue-600 hover:underline">View All</a>
                </div>
                <div className="flex items-center justify-between text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-4">
                  <div>
                    <p className="text-slate-400 font-medium">Time In</p>
                    <p className="font-extrabold text-blue-600 text-sm mt-0.5">8:03 AM</p>
                  </div>
                  <div className="h-7 w-px bg-slate-200" />
                  <div>
                    <p className="text-slate-400 font-medium">Time Out</p>
                    <p className="font-extrabold text-blue-600 text-sm mt-0.5">4:30 PM</p>
                  </div>
                  <div className="h-7 w-px bg-slate-200" />
                  <div>
                    <p className="text-slate-400 font-medium mb-1">Status</p>
                    <span className="px-3 py-1 bg-emerald-500 text-white rounded-full font-bold text-[10px]">
                      Present
                    </span>
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-700 mb-2">This month summary</p>
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="bg-emerald-100 border border-emerald-300 rounded-2xl p-2.5 text-emerald-950">
                    <p className="text-[11px] font-bold">Present</p>
                    <p className="text-lg font-black mt-0.5">21</p>
                  </div>
                  <div className="bg-amber-100 border border-amber-300 rounded-2xl p-2.5 text-amber-950">
                    <p className="text-[11px] font-bold">Late</p>
                    <p className="text-lg font-black mt-0.5">2</p>
                  </div>
                  <div className="bg-rose-100 border border-rose-300 rounded-2xl p-2.5 text-rose-950">
                    <p className="text-[11px] font-bold">Absent</p>
                    <p className="text-lg font-black mt-0.5">0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Task Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">Today&apos;s Task</h3>
                  <a href="#view-all" className="text-xs font-bold text-blue-600 hover:underline">View All</a>
                </div>

                <div className="space-y-3 text-xs">
                  {tasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 cursor-pointer transition-colors text-left"
                    >
                      <span className={`font-semibold transition-colors ${
                        task.completed ? 'text-slate-800' : 'text-slate-400 line-through'
                      }`}>
                        {task.text}
                      </span>
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                        task.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {task.completed && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Quick Actions */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              <button
                type="button"
                className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-50 border border-slate-200/80 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-200 group active:scale-95 text-center"
              >
                <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2.5 group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="text-xs font-bold">Profile</span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-50 border border-slate-200/80 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-200 group active:scale-95 text-center"
              >
                <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-2.5 group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                  </svg>
                </div>
                <span className="text-xs font-bold">Attendance Record</span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-50 border border-slate-200/80 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-200 group active:scale-95 text-center"
              >
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2.5 group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <span className="text-xs font-bold">Tasks</span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-50 border border-slate-200/80 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-200 group active:scale-95 text-center"
              >
                <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2.5 group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  </svg>
                </div>
                <span className="text-xs font-bold">View Announcements</span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-50 border border-slate-200/80 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-200 group active:scale-95 text-center"
              >
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2.5 group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <span className="text-xs font-bold">Submit Leave</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* My Profile Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 text-center shadow-xs">
            <h3 className="text-base font-bold text-slate-900 text-left mb-4">My Profile</h3>

            <div className="relative w-16 h-16 mx-auto mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/20">
                {initials}
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <h4 className="text-lg font-black text-slate-900">{name}</h4>
            <p className="text-xs font-bold text-blue-600 mb-4">{position}</p>

            <div className="space-y-2.5 text-xs text-left bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Employee ID</span>
                <span className="font-bold text-slate-900 font-mono">{employeeId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Department</span>
                <span className="font-bold text-slate-900">{department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Status</span>
                <span className="px-2.5 py-0.5 bg-emerald-500 text-white rounded-full font-bold text-[10px]">
                  Active
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-600 hover:text-white border border-slate-200 hover:border-blue-600 text-slate-800 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              View Full Profile
            </button>
          </div>

          {/* Announcements Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Announcements</h3>
              <a href="#view-all" className="text-xs font-bold text-blue-600 hover:underline">View All</a>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-slate-900 truncate">New Company Policy</p>
                    <span className="text-[10px] text-slate-400 shrink-0">Today, 8:40 AM</span>
                  </div>
                  <p className="text-slate-400 text-[11px] truncate">Please review the employee handbook.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-slate-900 truncate">Holiday Notice</p>
                    <span className="text-[10px] text-slate-400 shrink-0">Today, 10:40 AM</span>
                  </div>
                  <p className="text-slate-400 text-[11px] truncate">Please review the employee handbook.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-slate-900 truncate">Staff Meeting Reminder</p>
                    <span className="text-[10px] text-slate-400 shrink-0">Today, 11:40 AM</span>
                  </div>
                  <p className="text-slate-400 text-[11px] truncate">Please review the employee handbook.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-slate-900 truncate">System Maintenance</p>
                    <span className="text-[10px] text-slate-400 shrink-0">Today, 12:40 AM</span>
                  </div>
                  <p className="text-slate-400 text-[11px] truncate">Please review the employee handbook.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
