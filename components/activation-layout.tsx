import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

function EnvelopeCheckIllustration({ className }: { className?: string }) {
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
      {/* Envelope body, open at the top-right where the check badge sits */}
      <path d="M230 120H50Q10 120 10 160V360Q10 400 50 400H370Q410 400 410 360V245" />
      {/* Flap */}
      <path d="M14 150L196 262Q215 274 234 262L262 246" />
      {/* Check badge */}
      <circle cx="320" cy="110" r="100" fill="#00FF57" stroke="#0D2352" strokeWidth="16" />
      <path d="M272 112L308 148L370 80" stroke="#0D2352" strokeWidth="22" />
    </svg>
  )
}

function MonitorLockIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 450 420"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Screen */}
      <rect x="10" y="10" width="430" height="320" rx="46" />
      {/* Stand */}
      <path d="M190 330Q190 372 176 388H120Q96 388 96 404Q96 410 112 410H338Q354 410 354 404Q354 388 330 388H274Q260 372 260 330" />
      {/* Padlock */}
      <path d="M170 150V122A55 55 0 0 1 280 122V150" />
      <rect x="120" y="150" width="210" height="130" rx="34" />
      <path d="M225 198V232" />
    </svg>
  )
}

export default function ActivationLayout({
  title,
  subtitle,
  welcomeTitle = 'Welcome!',
  welcomeText = 'Your account has been created, please activate your account to get started.',
  illustration = 'envelope',
  contentClassName = 'max-w-[460px]',
  children,
}: {
  title: string
  subtitle: string
  welcomeTitle?: string
  welcomeText?: string
  illustration?: 'envelope' | 'monitor'
  contentClassName?: string
  children: React.ReactNode
}) {
  const Illustration = illustration === 'monitor' ? MonitorLockIllustration : EnvelopeCheckIllustration
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
          <Illustration className="w-full max-w-[360px] lg:max-w-[420px] text-[#00FF57] drop-shadow-[0_0_24px_rgba(0,255,87,0.25)]" />
          <div className="text-center">
            <h2 className="text-2xl lg:text-[1.75rem] font-bold">{welcomeTitle}</h2>
            <p className="mt-3 text-base lg:text-lg text-white/85 leading-relaxed max-w-[300px] mx-auto">
              {welcomeText}
            </p>
          </div>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex-1 flex items-center justify-center px-6 py-10 sm:px-12 md:px-14 lg:px-24 md:overflow-y-auto">
        <div className={`w-full ${contentClassName}`}>
          <header className="mb-9">
            <h1 className="text-3xl sm:text-[2.6rem] font-semibold text-slate-950 tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mt-2">{subtitle}</p>
          </header>
          {children}
        </div>
      </main>
    </div>
  )
}
