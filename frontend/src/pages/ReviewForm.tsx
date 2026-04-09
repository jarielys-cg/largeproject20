import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import Navbar from '../components/Navbar'
import { Star, Store } from 'lucide-react'
import api from '../lib/axios'
import toast from 'react-hot-toast'
import type { Business } from "../types"

interface ReviewFormProps {
  onLoginClick?: () => void
}

const RATING_CONFIG = [
  { label: 'Not good', color: '#E03B3B' },
  { label: 'Could be better', color: '#E03B3B' },
  { label: 'OK', color: '#E8A030' },
  { label: 'Good', color: '#F2A44A' },
  { label: 'Great!', color: '#F2A44A' },
]

const HINT_TAGS: Record<string, string[]> = {
  Restaurants: ['Food Quality', 'Service', 'Ambiance', 'Wait Time'],
  Automotive: ['Service Requested', 'Quality', 'Timeliness', 'Staff'],
  'Beauty & Spas': ['Service', 'Cleanliness', 'Staff', 'Atmosphere'],
  'Home Services': ['Service Requested', 'Quality', 'Professionalism'],
  Shopping: ['Product Quality', 'Service', 'Staff'],
  default: ['Service', 'Quality', 'Experience', 'Staff'],
}

const ReviewForm = ({ onLoginClick }: ReviewFormProps) => {
  const { businessId } = useParams()
  const navigate = useNavigate()
  const [business, setBusiness] = useState<Business | null>(null)
  const [bizLoading, setBizLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await api.get(`/businesses/${businessId}`)
        setBusiness(res.data)
      } catch {
        toast.error('Business not found')
        navigate(-1)
      } finally {
        setBizLoading(false)
      }
    }
    if (businessId) fetchBusiness()
  }, [businessId])

  const activeRating = hoveredRating || rating
  const ratingConfig = activeRating > 0 ? RATING_CONFIG[activeRating - 1] : null
  const hints = business ? (HINT_TAGS[business.category] || HINT_TAGS.default) : HINT_TAGS.default
  const minChars = 85
  const remaining = minChars - review.length

  const getStarColor = (star: number) => {
    if (activeRating === 0) return '#d1d5db'
    if (star <= activeRating) return RATING_CONFIG[activeRating - 1].color
    return '#d1d5db'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || review.length < minChars) return
    setLoading(true)
    try {
      await api.post('/reviews', { businessId, rating, review })
      toast.success('Review posted!')
      navigate(-1)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to post review')
    } finally {
      setLoading(false)
    }
  }

  if (bizLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar onLoginClick={onLoginClick} />
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-2 border-bm-coral border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onLoginClick={onLoginClick} />

      <div className="max-w-2xl mx-auto px-6 py-12">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-bm-coral mb-8 transition-colors"
        >
          ← Back
        </button>

        {/* Business header*/}
        {business && (
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            {business.photo ? (
              <img src={business.photo} alt={business.name} className="w-14 h-14 rounded-lg object-cover" />
            ) : (
              <div className="w-14 h-14 bg-bm-gray rounded-lg flex items-center justify-center shrink-0">
                <Store size={28} className="text-bm-coral" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900">{business.name}</h2>
              <p className="text-sm text-gray-500">{business.city}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Star rating */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">How would you rate your experience?</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={40}
                    fill={getStarColor(star)}
                    stroke={getStarColor(star)}
                    className="transition-colors duration-150"
                  />
                </button>
              ))}
              <span
                className="ml-2 text-sm font-medium transition-all duration-200"
                style={{ color: ratingConfig ? ratingConfig.color : '#9ca3af' }}
              >
                {ratingConfig ? ratingConfig.label : 'Select your rating'}
              </span>
            </div>
          </div>

          {/* Review text */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Tell us about your experience</h3>
            <p className="text-sm text-gray-400 mb-3">A few things to consider in your review</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {hints.map(hint => (
                <span key={hint} className="text-xs text-gray-600 border border-gray-300 rounded-full px-3 py-1">
                  {hint}
                </span>
              ))}
            </div>

            <textarea
              placeholder="Start your review..."
              value={review}
              onChange={e => setReview(e.target.value)}
              rows={7}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-bm-coral resize-none"
            />

            <div className="flex items-center gap-2 mt-2">
              <div className="relative w-5 h-5">
                <svg viewBox="0 0 20 20" className="w-5 h-5 -rotate-90">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
                  <circle
                    cx="10" cy="10" r="8" fill="none"
                    stroke={review.length >= minChars ? '#63C132' : '#F26B5B'}
                    strokeWidth="2.5"
                    strokeDasharray={`${Math.min((review.length / minChars) * 50.3, 50.3)} 50.3`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-500">
                {review.length >= minChars
                  ? 'Minimum length reached'
                  : `Reviews need to be at least ${minChars} characters. (${remaining} more to go)`
                }
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 h-12 border border-gray-200 text-gray-600 hover:border-bm-coral hover:text-bm-coral font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0 || review.length < minChars}
              className="flex-1 h-12 bg-bm-coral hover:bg-bm-coral-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Post Review'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ReviewForm