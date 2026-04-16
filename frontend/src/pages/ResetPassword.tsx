import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import logo from '../assets/logo.png'
import api from '../lib/axios'
import toast from 'react-hot-toast'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await api.post(`/resetPassword/${token}`, { password })
      toast.success('Password reset successfully!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid or expired token')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bm-gray flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="BizMart" className="w-16 h-16 mb-3 cursor-pointer" onClick={() => navigate('/')} />
          <h2 className="text-xl font-bold text-gray-900">Set new password</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-bm-coral hover:bg-bm-coral-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword