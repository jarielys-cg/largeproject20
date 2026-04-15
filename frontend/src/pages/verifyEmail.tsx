import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import api from '../lib/axios'

interface VerifyEmailProps {
  onLoginClick?: () => void
}

const VerifyEmail = ({ onLoginClick }: VerifyEmailProps) => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your email...')
  const [email, setEmail] = useState('')
  const [resendMessage, setResendMessage] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Verification link is missing a token.')
        return
      }

      try {
        const response = await api.get(`/verify-email/${token}`)
        setStatus('success')
        setMessage(response.data?.message || 'Email verified successfully.')
      } catch (error: any) {
        setStatus('error')
        setMessage(error.response?.data?.error || 'Invalid or expired verification token.')
      }
    }

    verify()
  }, [token])

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
    } catch (error: any) {
      const retryAfterSeconds = error.response?.data?.retryAfterSeconds

      if (error.response?.status === 429 && retryAfterSeconds) {
        setResendCooldown(retryAfterSeconds)
      }

      setResendMessage(error.response?.data?.error || 'Unable to resend verification email.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7f4] via-white to-[#fef1d1] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(45,45,45,0.14)] backdrop-blur">
        <div className="flex flex-col items-center px-6 py-10 text-center sm:px-10 sm:py-14">
          {status === 'loading' && (
            <>
              <div className="mt-6 h-12 w-12 animate-spin rounded-full border-4 border-bm-coral/25 border-t-bm-coral" />
              <h1 className="mt-6 text-3xl font-bold text-bm-dark">Verifying your email</h1>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                <svg className="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h1 className="mt-6 text-3xl font-bold text-bm-dark">Email verified</h1>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-700">
                <svg className="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="mt-6 text-3xl font-bold text-bm-dark">Verification failed</h1>
            </>
          )}

          <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">{message}</p>

          {status === 'error' && (
            <div className="mt-8 w-full max-w-md rounded-2xl border border-gray-200 bg-white px-4 py-5 text-left shadow-sm">
              <label htmlFor="resend-email" className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email address
              </label>
              <input
                id="resend-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the account email"
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
          )}

          {status === 'success' && (
            <button
              type="button"
              onClick={onLoginClick}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-bm-coral px-8 text-sm font-semibold text-white transition-colors hover:bg-bm-coral-dark"
            >
              Login
            </button>
          )}

          {status === 'error' && (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-4 inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-bm-dark ring-1 ring-gray-300 transition-colors hover:bg-gray-50"
            >
              Back to Landing
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail