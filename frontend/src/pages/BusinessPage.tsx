import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Star, MapPin, Phone, Globe, Store} from 'lucide-react'
import api from '../lib/axios'
import Navbar from '../components/Navbar'
import type { Business, Review } from '../types'
import toast from 'react-hot-toast'
import { getRatingColor } from "../utils/ratingConfig"

interface ReviewFormProps {
  onLoginClick?: () => void
}

const BusinessPage = ({ onLoginClick }: ReviewFormProps) => {
  const { businessId } = useParams()
  const navigate = useNavigate()

  const [business, setBusiness] = useState<Business | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(true)

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await api.get(`/businesses/${businessId}`)
        setBusiness(res.data)
      } catch {
        toast.error('Business not found')
        navigate(-1)
      } finally {
        setLoading(false)
      }
    }
    if (businessId) fetchBusiness()
  }, [businessId])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/business/${businessId}`)
        setReviews(res.data.reviews ?? [])
        setTotalReviews(res.data.totalReviews ?? 0)
      } catch {
        setReviews([])
      } finally {
        setReviewsLoading(false)
      }
    }
    if (businessId) fetchReviews()
  }, [businessId])

  if (loading) {
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
    <div className="min-h-screen bg-bm-gray">
      <Navbar onLoginClick={onLoginClick} />

      {/* Hero — photos */}
      {business?.image && business.image.filter(p => p && p.trim() !== '').length > 0 ? (
        <div className="flex h-full">
            {business.image
            .filter(p => p && p.trim() !== '')  // ← filter empty strings
            .slice(0, 3)
            .map((photo, i) => (
                <img
                key={i}
                src={photo}
                alt=""
                className={`h-full object-cover ${business.image!.filter(p => p).length === 1 ? 'w-full' : 'flex-1'}`}
                />
            ))}
        </div>
        ) : (
        <div className="w-full h-full bg-bm-gray flex items-center justify-center">
            <Store size={48} className="text-gray-300" />
        </div>
        )}

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">

        {/* Main content */}
        <div className="flex-1 space-y-6">

          {/* Business header */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start gap-4">

              {/* Logo */}
              <div className="w-20 h-20 rounded-xl bg-bm-gray border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                {business?.image?.[0] ? (
                  <img src={business.image[0]} alt={business.name} className="w-full h-full object-cover" />
                ) : (
                  <Store size={32} className="text-bm-coral" />
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{business?.name}</h1>

                {/* Category tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {business?.category.map(cat => (
                    <span key={cat} className="text-xs bg-bm-gray text-gray-600 px-3 py-1 rounded-full">
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={16}
                        fill={s <= Math.round(business?.averageReviewScore ?? 0) ? '#F26B5B' : '#d1d5db'}
                        stroke={s <= Math.round(business?.averageReviewScore ?? 0) ? '#F26B5B' : '#d1d5db'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {totalReviews === 0 ? 'No reviews yet'
                      : `${business?.averageReviewScore?.toFixed(1)} · ${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'}`}
                  </span>
                </div>
              </div>

              {/* Write review button */}
              <button
                onClick={() => navigate(`/review/${businessId}`)}
                className="bg-bm-coral hover:bg-bm-coral-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shrink-0"
              >
                Write a Review
              </button>
            </div>

            {/* Description */}
            {business?.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">{business.description}</p>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div id="reviews" className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Reviews {totalReviews > 0 && <span className="text-gray-400 font-normal text-base">({totalReviews})</span>}
            </h2>

            {reviewsLoading ? (
              <div className="flex items-center justify-center h-24">
                <div className="w-6 h-6 border-2 border-bm-coral border-t-transparent rounded-full animate-spin" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10">
                <Star size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No reviews yet — be the first to review!</p>
                <button
                  onClick={() => navigate(`/review/${businessId}`)}
                  className="mt-4 text-sm text-bm-coral border border-bm-coral px-4 py-2 rounded-lg hover:bg-bm-coral hover:text-white transition-colors"
                >
                  Write a Review
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review._id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-bm-gray flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-bm-coral">U</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Customer</p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star
                            key={s}
                            size={14}
                            fill={s <= review.rating ? getRatingColor(review.rating) : '#d1d5db'}
                            stroke={s <= review.rating ? getRatingColor(review.rating) : '#d1d5db'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed ml-12">{review.review}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right sidebar */}
        <div className="w-72 shrink-0 space-y-4">

          {/* Business Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Business Info</h2>
            <div className="space-y-4">

              {/* Address */}
              {(business?.address || business?.city) && (
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                  <MapPin size={18} className="text-bm-coral shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">Address</p>
                    {business?.address && <p className="text-sm text-gray-500">{business.address}</p>}
                    {(business?.city || business?.state || business?.zipCode) && (
                      <p className="text-sm text-gray-500">
                        {[business.city, business.state, business.zipCode].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Phone */}
              {business?.phone && (
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                  <Phone size={18} className="text-bm-coral shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">Call</p>
                    <a href={`tel:${business.phone}`} className="text-sm text-bm-coral hover:underline">
                      {business.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Website */}
              {business?.websiteLink && (
                <div className="flex items-start gap-3">
                  <Globe size={18} className="text-bm-coral shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">Website</p>
                    <a
                      href={business.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-bm-coral hover:underline break-all"
                    >
                      {business.websiteLink}
                    </a>
                  </div>
                </div>
              )}

              {!business?.address && !business?.phone && !business?.websiteLink && (
                <p className="text-sm text-gray-400">No business info added yet</p>
              )}
            </div>
          </div>

          {/* Photos */}
          {business?.image && business.image.filter(p => p && p.trim() !== '').length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Photos</h2>
                <div className="grid grid-cols-2 gap-2">
                {business.image
                    .filter(p => p && p.trim() !== '')
                    .slice(0, 4)
                    .map((photo, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden">
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                    </div>
                    ))}
                </div>
            </div>
            )}

        </div>
      </div>
    </div>
  )
}

export default BusinessPage