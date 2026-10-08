import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Poppins } from 'next/font/google'
import LoginForm from './login-form'

export const metadata: Metadata = {
  title: 'Login - CareConnect',
  description: 'Sign in to your CareConnect account.',
}

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

function SecureMonitorIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 450 420"
      fill="none"
      stroke="currentColor"
      strokeWidth="18"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Screen frame, open at the top-right where the lock sits */}
      <path d="M230 10H40Q10 10 10 40V300Q10 330 40 330H410Q440 330 440 300V245" />
      {/* Stand */}
      <path d="M222 330V404M118 404H326" />
      {/* Padlock */}
      <path d="M331 88V60A37 37 0 0 1 405 60V88" />
      <rect x="296" y="88" width="144" height="84" rx="32" />
      <path d="M368 122V138" strokeWidth="14" />
    </svg>
  )
}

export default function LoginPage() {
  return (
    <div
      className={`${poppins.className} min-h-dvh w-full flex flex-col md:flex-row bg-white antialiased md:h-dvh md:overflow-hidden`}
    >
      {/* Left brand panel */}
      <aside className="relative w-full md:w-[42%] lg:w-[41%] shrink-0 bg-[#0D2352] text-white overflow-hidden flex flex-col px-6 py-6 sm:px-10 md:px-10 md:py-10 lg:px-12">
        {/* Soft background glows */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-[#00A482]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-[#2563EB]/25 blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 sm:gap-4">
          <img
            src="/image/careconnect-logo.svg"
            alt=""
            className="h-12 w-auto sm:h-14 lg:h-[72px] shrink-0"
          />
          <div className="leading-tight">
            <p className="text-2xl sm:text-3xl lg:text-[2.6rem] font-medium tracking-tight">
              CareConnect
            </p>
            <p className="text-xs sm:text-sm lg:text-base text-white/80 mt-0.5">
              Your Health, Our priority
            </p>
          </div>
        </div>

        {/* Illustration + message (hidden on small screens) */}
        <div className="relative hidden md:flex flex-1 flex-col items-center justify-center gap-10 py-8">
          <SecureMonitorIllustration className="w-full max-w-[360px] lg:max-w-[420px] text-[#00FF57] drop-shadow-[0_0_24px_rgba(0,255,87,0.25)]" />
          <div className="text-center">
            <h2 className="text-2xl lg:text-[1.75rem] font-bold">Secure Access</h2>
            <p className="mt-3 text-base lg:text-lg text-white/85 leading-relaxed max-w-[280px] mx-auto">
              Please login to continue to your account.
            </p>
          </div>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex-1 flex items-center justify-center px-6 py-10 sm:px-12 md:px-14 lg:px-24 md:overflow-y-auto">
        <div className="w-full max-w-[460px]">
          <header className="mb-9">
            <h1 className="text-3xl sm:text-[2.6rem] font-semibold text-slate-950 tracking-tight leading-tight">
              Welcome Back!
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mt-2">
              Login to your account.
            </p>
          </header>

          <Suspense fallback={<div className="h-64 animate-pulse bg-slate-100 rounded-3xl" />}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
