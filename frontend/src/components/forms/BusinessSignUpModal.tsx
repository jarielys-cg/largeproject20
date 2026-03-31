import { useState } from 'react'
import toast from 'react-hot-toast'
import api from "../../lib/axios"
import type { BusinessForm, BusinessSignUpModalProps } from "../../types"

const CATEGORIES = [
  'Restaurants',
  'Shopping',
  'Automotive',
  'Home Services',
  'Beauty & Spas',
  'Other'
]

const BusinessSignUpModal = ({ isOpen, onClose }: BusinessSignUpModalProps) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<BusinessForm>({
    businessName: '', category: '', phone: '',
    address: '', city: '', zipCode: '',
    ownerName: '', email: '', password: ''
  })

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(prev => prev + 1)
  }

  const handleBack = () => setStep(prev => prev - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/business/signup', form)
      toast.success(`${form.businessName} has been registered!`, { duration: 4000 })
      onClose()
      setStep(1)
      setForm({
        businessName: '', category: '', phone: '',
        address: '', city: '', zipCode: '',
        ownerName: '', email: '', password: ''
      })
    } catch (error) {
      toast.error('Failed to register business. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const stepTitles = [
    'Business Info',
    'Location',
    'Your Account'
  ]

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-bm-coral px-8 pt-8 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-xl font-bold">Add Your Business</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white text-xl">✕</button>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2">
            {stepTitles.map((title, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                    ${step > i + 1 ? 'bg-white text-bm-coral' :
                      step === i + 1 ? 'bg-white text-bm-coral' :
                      'bg-white/30 text-white'}`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs whitespace-nowrap ${step === i + 1 ? 'text-white font-medium' : 'text-white/60'}`}>
                    {title}
                  </span>
                </div>
                {i < stepTitles.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${step > i + 1 ? 'bg-white' : 'bg-white/30'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form body */}
        <div className="px-8 py-6">

          {/* Step 1 - Business Info */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Business name</label>
                <input
                  name="businessName" type="text" required value={form.businessName}
                  onChange={handleChange} placeholder="e.g. China Chef"
                  className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Category</label>
                <select
                  name="category" required value={form.category} onChange={handleChange}
                  className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white text-gray-700"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Phone number</label>
                <input
                  name="phone" type="tel" required value={form.phone}
                  onChange={handleChange} placeholder="(407) 555-0100"
                  pattern="[\d\s\-\(\)]{10,}"
                  title="Please enter a valid phone number"
                  className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white"
                />
              </div>
              <button type="submit"
                className="w-full h-11 bg-bm-coral hover:bg-bm-coral-dark text-white font-semibold rounded-lg transition-colors">
                Continue →
              </button>
            </form>
          )}

          {/* Step 2 - Location */}
          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Street address</label>
                <input
                  name="address" type="text" required value={form.address}
                  onChange={handleChange} placeholder="123 Main St"
                  className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">City</label>
                <input
                  name="city" type="text" required value={form.city}
                  onChange={handleChange} placeholder="Orlando"
                  pattern="[A-Za-z\s]+"
                  title="City can only contain letters"
                  className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">ZIP code</label>
                <input
                  name="zipCode" type="text" required value={form.zipCode}
                  onChange={handleChange} placeholder="32801"
                  pattern="\d{5}" maxLength={5}
                  title="ZIP code must be exactly 5 digits"
                  onKeyPress={e => { if (!/[0-9]/.test(e.key)) e.preventDefault() }}
                  className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={handleBack}
                  className="flex-1 h-11 border border-gray-200 text-gray-600 hover:border-bm-coral hover:text-bm-coral font-semibold rounded-lg transition-colors">
                  ← Back
                </button>
                <button type="submit"
                  className="flex-1 h-11 bg-bm-coral hover:bg-bm-coral-dark text-white font-semibold rounded-lg transition-colors">
                  Continue →
                </button>
              </div>
            </form>
          )}

          {/* Step 3 - Account */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Your name</label>
                <input
                  name="ownerName" type="text" required value={form.ownerName}
                  onChange={handleChange} placeholder="Jane Smith"
                  pattern="[A-Za-z\s]+"
                  title="Name can only contain letters"
                  className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Email address</label>
                <input
                  name="email" type="email" required value={form.email}
                  onChange={handleChange} placeholder="company@business.com"
                  className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Password</label>
                <input
                  name="password" type="password" required value={form.password}
                  onChange={handleChange} placeholder="Min. 8 characters"
                  minLength={8}
                  pattern="(?=.*[A-Za-z])(?=.*\d).{8,}"
                  title="Password must be at least 8 characters and include a letter and a number"
                  className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-bm-coral bg-white"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={handleBack}
                  className="flex-1 h-11 border border-gray-200 text-gray-600 hover:border-bm-coral hover:text-bm-coral font-semibold rounded-lg transition-colors">
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 h-11 bg-bm-coral hover:bg-bm-coral-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-60">
                  {loading ? 'Registering...' : 'Create Business'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}

export default BusinessSignUpModal