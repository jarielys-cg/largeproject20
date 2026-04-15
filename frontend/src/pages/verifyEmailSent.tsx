import { useNavigate } from 'react-router'
import logo from '../assets/logo.png'

const VerifyEmailSent = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen from-[#fff7f4] via-white to-[#fef1d1] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_24px_80px_rgba(45,45,45,0.14)]">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative flex flex-col justify-between overflow-hidden bg-bm-coral p-8 text-white sm:p-10 lg:p-12">
            <div className="absolute inset-0 opacity-20" />
            <div className="relative flex items-center gap-3">
              <img src={logo} alt="BizMart logo" className="h-11 w-11 bg-transparent" />
              <span className="text-xl font-bold tracking-tight">BizMart</span>
            </div>

            <div className="relative mt-16 max-w-md">
              <p className="mb-3 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-bm-coral">
                Verification email sent
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                Check your inbox to finish creating your account.
              </h1>
              <p className="mt-4 text-sm leading-6 text-white/85 sm:text-base">
                We sent a verification link to the email address you used during signup. The link expires in 1 hour.
              </p>
            </div>

            <div className="relative mt-10 flex justify-center text-sm">
              <div className="w-full max-w-sm rounded-2xl border border-transparent bg-white p-4 text-bm-coral">
                <p className="font-semibold">Didn't see it?</p>
                <p className="mt-1 text-gray-600">Check spam, promotions, or other filtered folders.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-8 sm:p-10 lg:p-12">
            <div className="w-full max-w-md text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-bm-coral/10 text-bm-coral shadow-inner shadow-bm-coral/10">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25A2.25 2.25 0 0 1 5.25 6h13.5A2.25 2.25 0 0 1 21 8.25v7.5A2.25 2.25 0 0 1 18.75 18H5.25A2.25 2.25 0 0 1 3 15.75v-7.5Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 7.5 7.83 5.22a2.25 2.25 0 0 0 2.34 0l7.83-5.22" />
                </svg>
              </div>

              <h2 className="mt-6 text-3xl font-bold text-bm-dark">Almost there</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
                Your account is created, but email verification is required before sign in and other account actions will fully work.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-bm-coral px-6 text-sm font-semibold text-white transition-colors hover:bg-bm-coral-dark"
                >
                  Back to Landing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailSent