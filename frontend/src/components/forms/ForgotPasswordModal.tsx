import { useState } from 'react'
import logo from '../../assets/logo.png'
import api from '../../lib/axios'
import toast from 'react-hot-toast'

interface Props {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
}

const ForgotPasswordModal = ({ isOpen, onClose, onBack }: Props) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/forgotPassword', { email })
      setSent(true)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <div
        className="flex flex-col bg-white p-7 rounded-xl shadow-xl w-96 text-center"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="self-end text-bm-coral hover:text-bm-coral-dark font-bold cursor-pointer">✕</button>

        <div className="flex flex-col items-center mb-4">
          <img src={logo} alt="BizMart logo" className="w-16 h-16 mb-2" />
          <h2 className="text-xl font-bold">Reset your password</h2>
          <p className="text-sm text-gray-500 mt-1">
            {sent ? 'Check your email for a reset link' : 'Enter your email and we\'ll send you a reset link'}
          </p>
        </div>

        {sent ? (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                Reset link sent to <strong>{email}</strong>. Check your inbox — link expires in 15 minutes.
              </p>
            </div>
            <button
              onClick={onBack}
              className="w-full border border-gray-200 text-gray-600 font-bold py-2 px-10 rounded hover:border-bm-coral hover:text-bm-coral transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col text-left">
              <label htmlFor="reset-email">Email:</label>
              <input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-bm-coral"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bm-coral hover:bg-bm-coral-dark text-white font-bold py-2 px-10 rounded disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full border border-gray-200 text-gray-600 py-2 px-10 rounded hover:border-bm-coral hover:text-bm-coral transition-colors"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordModal