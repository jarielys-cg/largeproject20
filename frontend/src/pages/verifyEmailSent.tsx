import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import api from '../lib/axios'
import logo from '../assets/logo.png'

const VerifyEmailSent = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const navigationState = location.state as { email?: string; source?: 'signup' | 'login' } | null
  const [email, setEmail] = useState(navigationState?.email ?? '')
  const [resendMessage, setResendMessage] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const isLoginVerificationState = navigationState?.source === 'login'

  useEffect(() => {
    if (navigationState?.email) {
      setEmail(navigationState.email)
    }
  }, [navigationState?.email])

  useEffect(() => {
    if (resendCooldown <= 0) return

    const timer = window.setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          window.clearInterval(timer)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [resendCooldown])

  const handleResend = async () => {
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setResendMessage('Please enter the email address for this account.')
      return
    }

    setResendLoading(true)
    setResendMessage('')

    try {
      const response = await api.post('/resend-email', { email: trimmedEmail })
      setResendCooldown(response.data?.retryAfterSeconds ?? 60)
      setResendMessage('Verification email sent. Check your inbox.')
      toast.success('Verification email sent.')
    } catch (error: any) {
      const retryAfterSeconds = error.response?.data?.retryAfterSeconds

      if (error.response?.status === 429 && retryAfterSeconds) {
        setResendCooldown(retryAfterSeconds)
      }

      setResendMessage(error.response?.data?.error || 'Unable to resend verification email.')
      toast.error(error.response?.data?.error || 'Unable to resend verification email.')
    } finally {
      setResendLoading(false)
    }
  }

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
                {isLoginVerificationState ? 'Account not verified' : 'Verification email sent'}
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                {isLoginVerificationState ? 'You need to verify your account first.' : 'Check your inbox to finish creating your account.'}
              </h1>
              <p className="mt-4 text-sm leading-6 text-white/85 sm:text-base">
                {isLoginVerificationState
                  ? 'This account has not been verified yet. Resend the verification link to continue.'
                  : 'We sent a verification link to the email address you used during signup. The link expires in 1 hour.'}
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
                {isLoginVerificationState
                  ? 'Your account exists, but you must verify it before signing in.'
                  : 'Your account is created, but email verification is required before sign in and other account actions will fully work.'}
              </p>

              <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm">
                <label htmlFor="verification-email" className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email address
                </label>
                <input
                  id="verification-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-bm-coral focus:outline-none"
                />

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading || resendCooldown > 0}
                  className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-bm-coral px-8 text-sm font-semibold text-white transition-colors hover:bg-bm-coral-dark disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {resendLoading
                    ? 'Sending...'
                    : resendCooldown > 0
                      ? `Resend available in ${resendCooldown}s`
                      : 'Resend verification email'}
                </button>

                {resendMessage && (
                  <p className={`mt-3 text-sm ${resendMessage.includes('sent') ? 'text-green-700' : 'text-red-600'}`}>
                    {resendMessage}
                  </p>
                )}
              </div>

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