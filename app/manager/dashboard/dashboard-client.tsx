'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface ManagerDashboardClientProps {
  managerName: string
  department: string
}

export default function ManagerDashboardClient({
  managerName,
  department,
}: ManagerDashboardClientProps) {
  const searchParams = useSearchParams()
  const isActivated = searchParams.get('activated') === 'true'

  // Review modal / action state
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)

  const leaveRequests = [
    {
      id: 1,
      employee: 'Franz Fernando',
      leaveType: 'Sick Leave',
      dates: 'March 3, 2026',
      totalDays: 1,
      status: 'Pending',
    },
    {
      id: 2,
      employee: 'Elizehr Manlapat',
      leaveType: 'Vacation Leave',
      dates: 'Dec 25, 2026',
      totalDays: 1,
      status: 'Approved',
    },
    {
      id: 3,
      employee: 'Aaron Tumaliuan',
      leaveType: 'Emergency Leave',
      dates: 'May 29, 2026',
      totalDays: 1,
      status: 'Denied',
    },
    {
      id: 4,
      employee: 'Red Reyes',
      leaveType: 'Holiday Leave',
      dates: 'Dec 24, 2026',
      totalDays: 1,
      status: 'Approved',
    },
    {
      id: 5,
      employee: 'Dennis Bumanlag',
      leaveType: 'Sick Leave',
      dates: 'Jan 1, 2027',
      totalDays: 1,
      status: 'Pending',
    },
  ]

  const announcements = [
    {
      id: 1,
      title: 'Department Meeting',
      time: 'May 23, 2026 - 2:30 PM',
    },
    {
      id: 2,
      title: 'New Policy Reminder',
      time: 'May 27, 2026 - 2:30 PM',
    },
    {
      id: 3,
      title: 'Staff Training',
      time: 'May 29, 2026 - 2:30 PM',
    },
    {
      id: 4,
      title: 'Department Meeting',
      time: 'May 30, 2026 - 2:30 PM',
    },
  ]

  // Circumference for r=54 is 2 * pi * 54 = 339.292
  const C = 339.292

  // Attendance slices (Total 24)
  // Present: 20 (83.33%) -> 282.74
  // Late: 2 (8.33%) -> 28.27
  // Absent: 2 (8.33%) -> 28.27
  const attPresent = (20 / 24) * C
  const attLate = (2 / 24) * C
  const attAbsent = (2 / 24) * C

  // Task slices (Total 24)
  // Completed: 9 (37.5%) -> 127.23
  // In Progress: 8 (33.33%) -> 113.10
  // Pending: 7 (29.17%) -> 98.96
  const taskCompleted = (9 / 24) * C
  const taskInProgress = (8 / 24) * C
  const taskPending = (7 / 24) * C

  return (
    <div className="max-w-[1650px] mx-auto space-y-6 pb-8 select-none">
      {/* Account Activated Success Banner */}
      {isActivated && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3 shadow-xs"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 mt-0.5 text-emerald-600"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div>
            <p className="font-bold text-emerald-950 text-base">
              Manager Account Activated Successfully! 🎉
            </p>
            <p className="text-emerald-800 text-xs mt-0.5 font-medium">
              Your new credentials have been saved. Welcome to the CareConnect Department Manager
              Portal!
            </p>
          </div>
        </div>
      )}

      {/* Breadcrumb Header */}
      <div>
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
          <span>Dashboard</span>
          <span className="text-slate-300">&gt;</span>
          <span className="text-slate-600 font-bold">Dashboard</span>
        </nav>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome, {managerName}!
        </h1>
        <p className="text-sm text-slate-500 mt-0.5 font-medium">
          Department: <span className="font-semibold text-blue-600">{department}</span>
        </p>
      </div>

      {/* 1. Top Section: 4 Deep Navy Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Employees */}
        <div className="bg-[#0B2050] text-white rounded-3xl p-5.5 shadow-md flex items-center gap-4 hover:shadow-lg transition-all border border-blue-900/40">
          <div className="w-13 h-13 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/10">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-300">Total Employees</p>
            <p className="text-3xl font-black text-white tracking-tight mt-0.5">24</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">In your department</p>
          </div>
        </div>

        {/* Card 2: Present Today */}
        <div className="bg-[#0B2050] text-white rounded-3xl p-5.5 shadow-md flex items-center gap-4 hover:shadow-lg transition-all border border-blue-900/40">
          <div className="w-13 h-13 rounded-2xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0 border border-white/10">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <polyline points="17 11 19 13 23 9" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-300">Present Today</p>
            <p className="text-3xl font-black text-white tracking-tight mt-0.5">20</p>
            <p className="text-[11px] text-emerald-400 font-bold mt-0.5">83.33% Present</p>
          </div>
        </div>

        {/* Card 3: Late Today */}
        <div className="bg-[#0B2050] text-white rounded-3xl p-5.5 shadow-md flex items-center gap-4 hover:shadow-lg transition-all border border-blue-900/40">
          <div className="w-13 h-13 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center shrink-0 border border-white/10">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-300">Late Today</p>
            <p className="text-3xl font-black text-white tracking-tight mt-0.5">2</p>
            <p className="text-[11px] text-amber-400 font-bold mt-0.5">8.33% Late</p>
          </div>
        </div>

        {/* Card 4: Absent Today */}
        <div className="bg-[#0B2050] text-white rounded-3xl p-5.5 shadow-md flex items-center gap-4 hover:shadow-lg transition-all border border-blue-900/40">
          <div className="w-13 h-13 rounded-2xl bg-white/10 text-rose-400 flex items-center justify-center shrink-0 border border-white/10">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-300">Absent Today</p>
            <p className="text-3xl font-black text-white tracking-tight mt-0.5">2</p>
            <p className="text-[11px] text-rose-400 font-bold mt-0.5">8.33% Absent</p>
          </div>
        </div>
      </div>

      {/* 2. Middle Section: Two Donut Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Summary (Today) */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 lg:p-7 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Attendance Summary (Today)</h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* SVG Donut Chart */}
            <div className="relative w-52 h-52 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                {/* Background Ring */}
                <circle cx="70" cy="70" r="54" fill="none" stroke="#F1F5F9" strokeWidth="20" />
                {/* Present Slice (Green) */}
                <circle
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="20"
                  strokeDasharray={`${attPresent} ${C}`}
                  strokeDashoffset="0"
                />
                {/* Late Slice (Orange) */}
                <circle
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="20"
                  strokeDasharray={`${attLate} ${C}`}
                  strokeDashoffset={`-${attPresent}`}
                />
                {/* Absent Slice (Rose) */}
                <circle
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  stroke="#F87171"
                  strokeWidth="20"
                  strokeDasharray={`${attAbsent} ${C}`}
                  strokeDashoffset={`-${attPresent + attLate}`}
                />
              </svg>
              {/* Donut Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-slate-900 tracking-tight">24</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-md bg-[#4ADE80] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Present</p>
                    <p className="text-[11px] text-slate-400 font-medium">20 Employees</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-slate-800">83.33%</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-md bg-[#FBBF24] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Late</p>
                    <p className="text-[11px] text-slate-400 font-medium">2 Employees</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-slate-800">8.33%</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-md bg-[#F87171] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Absent</p>
                    <p className="text-[11px] text-slate-400 font-medium">2 Employees</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-slate-800">8.33%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Overview */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 lg:p-7 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Task Overview</h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* SVG Donut Chart */}
            <div className="relative w-52 h-52 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                {/* Background Ring */}
                <circle cx="70" cy="70" r="54" fill="none" stroke="#F1F5F9" strokeWidth="20" />
                {/* Completed Slice (Green) */}
                <circle
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="20"
                  strokeDasharray={`${taskCompleted} ${C}`}
                  strokeDashoffset="0"
                />
                {/* In Progress Slice (Navy/Blue) */}
                <circle
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  stroke="#1E3A8A"
                  strokeWidth="20"
                  strokeDasharray={`${taskInProgress} ${C}`}
                  strokeDashoffset={`-${taskCompleted}`}
                />
                {/* Pending Slice (Yellow) */}
                <circle
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="20"
                  strokeDasharray={`${taskPending} ${C}`}
                  strokeDashoffset={`-${taskCompleted + taskInProgress}`}
                />
              </svg>
              {/* Donut Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-slate-900 tracking-tight">24</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-md bg-[#4ADE80] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Completed</p>
                    <p className="text-[11px] text-slate-400 font-medium">9 Tasks</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-slate-800">37.50%</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-md bg-[#1E3A8A] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">In Progress</p>
                    <p className="text-[11px] text-slate-400 font-medium">8 Tasks</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-slate-800">33.33%</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-md bg-[#FBBF24] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Pending</p>
                    <p className="text-[11px] text-slate-400 font-medium">7 Tasks</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-slate-800">29.17%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Recent Leave Requests (Left) + Upcoming Announcements (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Leave Requests Table (Left 8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base lg:text-lg font-bold text-slate-900">Recent Leave Requests</h3>
            <a href="#view-all-leaves" className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-2 font-bold">Employee</th>
                  <th className="pb-3 px-2 font-bold">Leave Type</th>
                  <th className="pb-3 px-2 font-bold">Dates</th>
                  <th className="pb-3 px-2 font-bold text-center">Total Days</th>
                  <th className="pb-3 px-2 font-bold text-center">Status</th>
                  <th className="pb-3 px-2 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {leaveRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-slate-900">{req.employee}</td>
                    <td className="py-3.5 px-2 text-slate-600">{req.leaveType}</td>
                    <td className="py-3.5 px-2 text-slate-500 whitespace-nowrap">{req.dates}</td>
                    <td className="py-3.5 px-2 text-center font-bold">{req.totalDays}</td>
                    <td className="py-3.5 px-2 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                          req.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : req.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(`${req.employee} - ${req.leaveType} (${req.status})`)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                          req.status === 'Pending'
                            ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-xs'
                            : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {req.status === 'Pending' ? 'Review' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Announcements (Right 4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
          <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-5">Upcoming Announcements</h3>
          <div className="space-y-4">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal Dialog */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Leave Request Review</h3>
            <p className="text-sm text-slate-600 mb-6 font-medium">{selectedRequest}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Leave review recorded!')
                  setSelectedRequest(null)
                }}
                className="flex-1 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
