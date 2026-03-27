import { useState } from 'react'
import { Link } from 'react-router'
import type { SignUpForm } from '../types'
import logo from '../assets/logo.png'

const UserSignUp = () => {
  const [form, setForm] = useState<SignUpForm>({
    firstName: '', lastName: '', email: '',
    password: '', zipCode: '', role: 'user'
  })
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Check your email</h2>
          <p className="text-gray-500">We sent a verification link to <strong>{form.email}</strong></p>
        </div>
      </div>
    )
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
          <div><div className="text-2xl font-bold">50K+</div><div className="text-red-200 text-xs mt-1">Businesses</div></div>
          <div><div className="text-2xl font-bold">2M+</div><div className="text-red-200 text-xs mt-1">Reviews</div></div>
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
              <input name="zipCode" type="text" required maxLength={5} onChange={handleChange}
                className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white" />
            </div>

            <button type="submit"
              className="w-full h-12 bg-bm-coral hover:bg-bm-coral-dark text-white font-semibold rounded-lg transition-colors">
              Create account
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default UserSignUp