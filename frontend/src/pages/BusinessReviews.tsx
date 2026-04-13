import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Star } from 'lucide-react'
import api from "../lib/axios"
import BusinessNavbar from "../components/Business/BusinessNavbar"
import type { Owner, Review } from "../types"
import { getRatingColor } from "../utils/ratingConfig"

const BusinessReviews = () => {
  const { businessId } = useParams()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [owner, setOwner] = useState<Owner | null>(null)
  const [totalReviews, setTotalReviews] = useState(0) 

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await api.get('/auth/me')
        setOwner(res.data)
      } catch {
        navigate('/business/login')
      }
    }
    fetchOwner()
  }, [])

  useEffect(() => {
  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/business/${businessId}`)
      setReviews(res.data.reviews ?? [])
      setTotalReviews(res.data.totalReviews ?? 0)
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }
  if (businessId) fetchReviews()
}, [businessId])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }



  return (
    <div className="min-h-screen bg-bm-gray">
      <BusinessNavbar owner={owner} onLogout={handleLogout} />

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/business/dashboard')}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-bm-coral mb-2 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
            <p className="text-sm text-gray-500 mt-1"> 
              {totalReviews === 0 ? 'No reviews yet' : `${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'}`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-2 border-bm-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-bm-gray rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={28} className="text-bm-coral" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">No reviews yet</h2>
            <p className="text-sm text-gray-400">When customers leave reviews they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review._id} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-bm-gray flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-bm-coral">U</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Customer</p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={16}
                        fill={s <= review.rating ? getRatingColor(review.rating) : '#d1d5db'}
                        stroke={s <= review.rating ? getRatingColor(review.rating) : '#d1d5db'}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">{review.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BusinessReviews