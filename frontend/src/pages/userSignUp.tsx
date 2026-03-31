import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import type { SignUpForm } from '../types'
import logo from '../assets/logo.png'
import toast from "react-hot-toast"
import api from "../lib/axios"

const UserSignUp = () => {
  const [form, setForm] = useState<SignUpForm>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    zipCode: '',
    isBusinessOwner: false
  })
  
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  try {
    await api.post('/signup', form)
    toast.success(`Welcome to BizMart, ${form.username}!`, { duration: 10000 })
    navigate('/')
  } catch (error: any) {
    const message = error.response?.data?.error || 'Failed to create account. Try again'
    toast.error(message, { duration: 5000 })
  } finally {
    setLoading(false)
  }
}



  return (
    <div className="min-h-screen flex">

      {/* Left panel */}
      <div className="hidden lg:flex w-5/12 bg-bm-coral flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-2">
          <img src={logo} alt="BizMart logo" className="w-10 h-10" />
          <span className="text-xl font-bold">BizMart</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">Find the best local businesses near you.</h2>
          <p className="text-red-100 text-sm leading-relaxed">Discover restaurants, shops, services, and more.</p>
        </div>
        <div className="flex gap-8">
          
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">

          {/* Logo — mobile only */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <img src={logo} alt="BizMart logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-bm-dark">
              Biz<span className="text-bm-coral">Mart</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-8">
            Already have one? <Link to="/login" className="text-bm-coral font-medium">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">First name</label>
                <input name="firstName" type="text" required onChange={handleChange}
                  className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Last name</label>
                <input name="lastName" type="text" required onChange={handleChange}
                  className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Username</label>
              <input name="username" type="text" required onChange={handleChange}
                className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Email address</label>
              <input name="email" type="email" required onChange={handleChange}
                className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Password</label>
              <input name="password" type="password" required minLength={8} onChange={handleChange}
                className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">ZIP code</label>
              <input name="zipCode" type="text" required pattern="\d{5}" maxLength={5} title="ZIP code must be exactly 5 digits" onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault()}} onChange={handleChange} className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-12 bg-bm-coral hover:bg-bm-coral-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default UserSignUp