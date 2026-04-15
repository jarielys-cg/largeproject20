import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Star, MapPin, Phone, Globe, Store, X } from 'lucide-react'
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
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const isLoggedIn = Boolean(localStorage.getItem('token'))

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editRating, setEditRating] = useState(0)

  type LocalUser = {
    _id: string
    isBusinessOwner?: boolean
  }

  const storedUser = localStorage.getItem('user')

  const parsedUser: LocalUser | null = storedUser ? (JSON.parse(storedUser) as LocalUser) : null

  const currentUserId = parsedUser?._id

  const isBusinessOwner = Boolean(parsedUser?.isBusinessOwner)
  const canWriteReview = isLoggedIn && !isBusinessOwner
  const heroImage = business?.image?.find((photo) => photo && photo.trim() !== '') ?? null

  const handleEditClick = (review: Review) => {
    setEditingReviewId(review._id)
    setEditText(review.review)
    setEditRating(review.rating)
  }

  const handleUpdate = async (reviewId: string) => {
    if (editText.length < 80) {
      toast.error("Review must be at least 80 characters")
      return
    }

    try {
      await api.put(`/reviews/${reviewId}`, {
        rating: editRating,
        review: editText
      })

      toast.success("Review updated")
      setEditingReviewId(null)

      const res = await api.get(`/reviews/business/${businessId}`)
      setReviews(res.data.reviews)
      setTotalReviews(res.data.totalReviews)

    } catch {
      toast.error("Failed to update review")
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return

    try {
      await api.delete(`/reviews/${reviewId}`)

      toast.success("Review deleted")
      setReviews(prev => prev.filter(r => r._id !== reviewId))
      setTotalReviews(prev => prev - 1)

    } catch {
      toast.error("Failed to delete review")
    }
  }

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
      {heroImage ? (
        <div className="h-64 w-full overflow-hidden bg-gray-100 sm:h-80">
          <img
            src={heroImage}
            alt={business?.name ?? 'Business'}
            role="button"
            tabIndex={0}
            onClick={() => setExpandedImage(heroImage)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setExpandedImage(heroImage)
              }
            }}
            className="h-full w-full cursor-zoom-in object-cover"
          />
        </div>
      ) : (
        <div className="flex h-64 w-full items-center justify-center bg-bm-gray sm:h-80">
          <Store size={48} className="text-gray-300" />
        </div>
      )}

      <div className="max-w-6xl mx-auto flex min-w-0 gap-8 px-6 py-8">

        {/* Main content */}
        <div className="min-w-0 flex-1 space-y-6">

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
              {canWriteReview && (
                <button
                  onClick={() => navigate(`/review/${businessId}`)}
                  className="bg-bm-coral hover:bg-bm-coral-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shrink-0"
                >
                  Write a Review
                </button>
              )}
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
                {canWriteReview && (
                  <button
                    onClick={() => navigate(`/review/${businessId}`)}
                    className="mt-4 text-sm text-bm-coral border border-bm-coral px-4 py-2 rounded-lg hover:bg-bm-coral hover:text-white transition-colors"
                  >
                    Write a Review
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => {
                  const isOwner = review.userId === currentUserId

                  return (
                    <div key={review._id} className="min-w-0 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
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
                        <div className="flex flex-col items-end gap-1">
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
                          {isOwner && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditClick(review)}
                                className="text-xs text-blue-500 hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(review._id)}
                                className="text-xs text-red-500 hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          )}

                        </div>
                      </div>
                      {editingReviewId === review._id ? (
                        <div className="pl-12 space-y-2">

                          {/* Star selector */}
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star
                                key={s}
                                size={20}
                                onClick={() => setEditRating(s)}
                                className="cursor-pointer"
                                fill={s <= editRating ? '#F26B5B' : '#d1d5db'}
                                stroke={s <= editRating ? '#F26B5B' : '#d1d5db'}
                              />
                            ))}
                          </div>

                          {/* Text */}
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full border rounded-lg p-2 text-sm"
                          />

                          {/* Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdate(review._id)}
                              className="text-sm bg-bm-coral text-white px-3 py-1 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingReviewId(null)}
                              className="text-sm text-gray-500"
                            >
                              Cancel
                            </button>
                          </div>

                          {editText.length < 80 && (
                            <p className="text-xs text-red-400">
                              Review must be at least 80 characters
                            </p>
                          )}

                        </div>
                      ) : (
                        <p className="w-full min-w-0 pl-12 text-sm leading-relaxed text-gray-700 break-words break-normal [overflow-wrap:break-word]">
                          {review.review}
                        </p>
                      )}
                    </div>
                  )
                })}
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
                      <img
                        src={photo}
                        alt={`${business.name} ${i + 1}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => setExpandedImage(photo)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setExpandedImage(photo)
                          }
                        }}
                        className="h-full w-full cursor-zoom-in object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {expandedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 py-6"
          onClick={() => setExpandedImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[95vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setExpandedImage(null)}
              className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-colors hover:text-bm-coral"
              aria-label="Close expanded image"
            >
              <X size={20} />
            </button>
            <img
              src={expandedImage}
              alt={`${business?.name ?? 'Business'} expanded view`}
              className="max-h-[90vh] max-w-[95vw] rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default BusinessPage