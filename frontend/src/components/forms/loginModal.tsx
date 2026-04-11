import logo from '../../assets/logo.png'
import { useState } from 'react'
import { type LoginForm, type LoginModalProps } from "../../types"
import api from '../../lib/axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

const LoginModal = ({ isOpen, onClose, defaultBusinessOwner = false, onBusinessSignUp }: LoginModalProps) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
    isBusinessOwner: defaultBusinessOwner
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  try {
    const res = await api.post('/login', { email: form.email, password: form.password })
    localStorage.setItem('token', res.data.token)
    toast.success(`Hello ${res.data.user.username}!`)
    onClose()

    if (form.isBusinessOwner || res.data.user.isBusinessOwner) {
        navigate('/business/dashboard')
      }
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Incorrect email or password')
  } finally {
    setLoading(false)
  }
}

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-100"
      onClick={onClose}
    >
      <div
        className="flex flex-col bg-white p-7 rounded-xl shadow-xl w-96 text-center"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="self-end text-bm-coral hover:text-bm-coral-dark font-bold cursor-pointer">✕</button>

        <div className="flex flex-col items-center mb-4">
          <img src={logo} alt="BizMart logo" className="w-16 h-16 mb-2" />
          <h2 className="text-xl font-bold">Sign In to BizMart</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4 text-left">
            <label htmlFor="email">Email:</label>
            <input onChange={handleChange} value={form.email}
              placeholder="Email" type="email" id="email" name="email"
              className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-bm-coral" />
          </div>

          <div className="flex flex-col mb-4 text-left">
            <label htmlFor="password">Password:</label>
            <input onChange={handleChange} value={form.password}
              placeholder="Password" type="password" id="password" name="password"
              className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-bm-coral" />
          </div>

          {/* Business owner toggle */}
          <div
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer mb-4 transition-colors ${
              form.isBusinessOwner ? 'border-bm-coral bg-red-50' : 'border-gray-200'
            }`}
            onClick={() => setForm(prev => ({ ...prev, isBusinessOwner: !prev.isBusinessOwner }))}
          >
            <span className="text-sm font-medium text-gray-700">Signing in as business owner</span>
            <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${
              form.isBusinessOwner ? 'bg-bm-coral' : 'bg-gray-300'
            }`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                form.isBusinessOwner ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </div>
          </div>

          <div className="text-center mb-2">
            <button type="button" className="text-sm text-bm-coral hover:underline">Forgot password?</button>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-bm-coral hover:bg-bm-coral-dark text-white font-bold py-2 px-10 rounded mb-3 mt-1">
            {loading ? 'Logging in...' : form.isBusinessOwner ? 'Login as Business Owner' : 'Login'}
          </button>
        </form>

        <p>
          New to BizMart?{" "}
          <span
            className="text-bm-coral hover:text-bm-coral-dark cursor-pointer hover:underline"
            onClick={() => {
              onClose()
              onBusinessSignUp?.()  // ← this opens the choice modal
            }}
          >
            Sign up here
          </span>
        </p>
      </div>
    </div>
  )
}

export default LoginModal