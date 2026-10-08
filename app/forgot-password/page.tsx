import type { Metadata } from 'next'
import ForgotPasswordForm from './forgot-password-form'

export const metadata: Metadata = {
  title: 'Forgot Password - CareConnect',
  description: 'Reset your CareConnect account password.',
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans antialiased">
      {/* Left Deep Navy Panel with the Exact Vector Illustration */}
      <div className="w-full md:w-[41.5%] lg:w-[41.5%] bg-[#0D2352] min-h-[460px] md:min-h-screen relative flex items-center justify-center overflow-hidden shrink-0">
        <img
          src="/image/login-panel.svg"
          alt="CareConnect - Your Health, Our priority"
          className="w-full h-full object-cover object-center pointer-events-none select-none"
        />
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-[58.5%] lg:w-[58.5%] bg-white flex items-center justify-center p-8 lg:p-16 min-h-screen">
        <div className="w-full max-w-[440px] space-y-7">
          <div>
            <h1 className="text-4xl lg:text-[42px] font-bold text-[#111827] tracking-tight leading-tight">
              Forgot Password?
            </h1>
            <p className="text-base text-[#4B5563] mt-2 font-normal">
              Enter your email address to receive password reset instructions.
            </p>
          </div>

          <ForgotPasswordForm />

          <div className="text-center pt-2 text-base text-[#374151]">
            Remember your password?{' '}
            <a href="/login" className="font-semibold text-[#2563EB] hover:underline">
              Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
