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
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-bm-coral px-8 text-sm font-semibold text-white transition-colors hover:bg-bm-coral-dark"
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