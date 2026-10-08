import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manager Dashboard' }

export default function ManagerDashboardPage() {
  return (
    <main>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.025em' }}>
          Manager Dashboard
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9375rem' }}>
          Overview of your team&apos;s activity.
        </p>
      </div>

      <div className="alert alert-info" style={{ maxWidth: '560px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/>
        </svg>
        <div>
          <strong>Phase 1 complete.</strong> Manager Dashboard widgets (attendance, tasks, leave requests, announcements) will be populated in Phase 6 after source modules are built.
        </div>
      </div>
    </main>
  )
}
