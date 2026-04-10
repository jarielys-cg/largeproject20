import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import api from '../lib/axios'

import { ImagePlus, MessageSquare, Pencil, Plus, Star } from 'lucide-react'
import type { Business } from '../types'
import BusinessNavbar from "../components/Business/BusinessNavbar"
import BusinessSidebar from "../components/Business/BusinessSidebar"
import BusinessCategories from "../components/Business/BusinessCategories"
import BusinessPhotos from "../components/Business/BusinessPhotos"

interface ReviewStats { count: number; avgRating: number }
interface Owner { _id: string; firstName: string; lastName: string; username: string }

const BusinessDashboard = () => {
  const navigate = useNavigate()

  const [owner, setOwner] = useState<Owner | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null)
  const [reviewStats, setReviewStats] = useState<ReviewStats>({ count: 0, avgRating: 0 })

  const [ownerLoading, setOwnerLoading] = useState(true)
  const [businessesLoading, setBusinessesLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [editingWebsite, setEditingWebsite] = useState(false)
  const [tempWebsite, setTempWebsite] = useState('')
  const [savingWebsite, setSavingWebsite] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await api.get('/auth/me')
        setOwner(res.data)
      } catch {
        navigate('/business/login')
      } finally {
        setOwnerLoading(false)
      }
    }
    fetchOwner()
  }, [])

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await api.get('/businesses/mine')
        setBusinesses(res.data)
        if (res.data.length > 0) {
          setActiveBusiness(res.data[0])
          setTempName(res.data[0].name)
        }
      } catch {
        setBusinesses([])
      } finally {
        setBusinessesLoading(false)
      }
    }
    fetchBusinesses()
  }, [])

  useEffect(() => {
    if (!activeBusiness) return
    const fetchStats = async () => {
      setStatsLoading(true)
      try {
        const res = await api.get(`/reviews/business-stats/${activeBusiness._id}`)
        setReviewStats(res.data)
      } catch {
        setReviewStats({ count: 0, avgRating: 0 })
      } finally {
        setStatsLoading(false)
      }
    }
    fetchStats()
  }, [activeBusiness])

  const handleSelectBusiness = (biz: Business) => {
    setActiveBusiness(biz)
    setTempName(biz.name)
  }

  const handleSaveName = async () => {
    if (!activeBusiness) return
    setSavingName(true)
    try {
      const res = await api.patch(`/businesses/${activeBusiness._id}`, { name: tempName })
      setActiveBusiness(res.data)
      setBusinesses(prev => prev.map(b => b._id === res.data._id ? res.data : b))
      setEditingName(false)
    } catch {
    } finally {
      setSavingName(false)
    }
  }

  const handleSaveWebsite = async () => {
    if (!activeBusiness) return
    setSavingWebsite(true)
    try {
      const res = await api.patch(`/businesses/${activeBusiness._id}`, { website: tempWebsite })
      setActiveBusiness(res.data)
      setBusinesses(prev => prev.map(b => b._id === res.data._id ? res.data : b))
      setEditingWebsite(false)
    } catch {
    } finally {
      setSavingWebsite(false)
    }
  }

  const handleAddCategory = async (cat: string) => {
    if (!activeBusiness) return
    try {
      const res = await api.patch(`/businesses/${activeBusiness._id}`, { category: [...activeBusiness.category, cat] })
      setActiveBusiness(res.data)
      setBusinesses(prev => prev.map(b => b._id === res.data._id ? res.data : b))
    } catch {
    }
  }

  const handleRemoveCategory = async (cat: string) => {
    if (!activeBusiness) return
    try {
      const res = await api.patch(`/businesses/${activeBusiness._id}`, { category: activeBusiness.category.filter(c => c !== cat) })
      setActiveBusiness(res.data)
      setBusinesses(prev => prev.map(b => b._id === res.data._id ? res.data : b))
    } catch {
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeBusiness || !e.target.files) return
    setUploadingPhoto(true)
    try {
      const formData = new FormData()
      Array.from(e.target.files).forEach(file => formData.append('photos', file))
      const res = await api.post(`/businesses/${activeBusiness._id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setActiveBusiness(res.data)
      setBusinesses(prev => prev.map(b => b._id === res.data._id ? res.data : b))
    } catch {
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleRemovePhoto = async (photoUrl: string) => {
    if (!activeBusiness) return
    try {
      const res = await api.delete(`/businesses/${activeBusiness._id}/photos`, { data: { photoUrl } })
      setActiveBusiness(res.data)
      setBusinesses(prev => prev.map(b => b._id === res.data._id ? res.data : b))
    } catch {
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  if (ownerLoading || businessesLoading) {
    return (
      <div className="min-h-screen bg-bm-gray flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-bm-coral border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bm-gray">
      <BusinessNavbar owner={owner} onLogout={handleLogout} />

      <div className="flex max-w-6xl mx-auto px-6 py-10 gap-6">
        <BusinessSidebar
          businesses={businesses}
          activeBusiness={activeBusiness}
          onSelectBusiness={handleSelectBusiness}
        />

        <div className="flex-1 space-y-6">

          {/* Business header card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start gap-6">

              {/* Logo upload */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-full bg-bm-gray border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-bm-coral transition-colors group-hover:bg-red-50 overflow-hidden">
                  {activeBusiness?.photos?.[0] ? (
                    <img src={activeBusiness.photos[0]} alt="logo" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImagePlus size={20} className="text-gray-400 group-hover:text-bm-coral" />
                      <span className="text-xs text-gray-400 mt-1 group-hover:text-bm-coral">Add logo</span>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePhotoUpload} />
              </div>

              <div className="flex-1">

                {/* Business name */}
                <div className="flex items-center gap-3 mb-2">
                  {editingName ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input value={tempName} onChange={e => setTempName(e.target.value)}
                        className="flex-1 border border-bm-coral rounded-lg px-3 py-1.5 text-lg font-bold focus:outline-none" autoFocus />
                      <button onClick={handleSaveName} disabled={savingName}
                        className="bg-bm-coral text-white text-sm px-3 py-1.5 rounded-lg hover:bg-bm-coral-dark transition-colors disabled:opacity-60">
                        {savingName ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => setEditingName(false)}
                        className="border border-gray-200 text-gray-600 text-sm px-3 py-1.5 rounded-lg hover:border-gray-400 transition-colors">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900">{activeBusiness?.name}</h1>
                      <button onClick={() => { setTempName(activeBusiness?.name ?? ''); setEditingName(true) }}
                        className="flex items-center gap-1.5 text-sm border border-gray-200 text-gray-600 hover:border-bm-coral hover:text-bm-coral px-3 py-1.5 rounded-lg transition-colors">
                        <Pencil size={13} /> Edit
                      </button>
                    </>
                  )}
                </div>

                {/* Website */}
                <div className="flex items-center gap-2 mb-3">
                  {editingWebsite ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input value={tempWebsite} onChange={e => setTempWebsite(e.target.value)}
                        placeholder="https://yourbusiness.com" type="url"
                        className="flex-1 border border-bm-coral rounded-lg px-3 py-1.5 text-sm focus:outline-none" autoFocus />
                      <button onClick={handleSaveWebsite} disabled={savingWebsite}
                        className="bg-bm-coral text-white text-sm px-3 py-1.5 rounded-lg hover:bg-bm-coral-dark transition-colors disabled:opacity-60">
                        {savingWebsite ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => setEditingWebsite(false)}
                        className="border border-gray-200 text-gray-600 text-sm px-3 py-1.5 rounded-lg hover:border-gray-400 transition-colors">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {activeBusiness?.website ? (
                        <>
                          <a href={activeBusiness.website} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-bm-coral hover:underline">
                            {activeBusiness.website}
                          </a>
                          <button onClick={() => { setTempWebsite(activeBusiness.website ?? ''); setEditingWebsite(true) }}
                            className="flex items-center gap-1.5 text-sm border border-gray-200 text-gray-600 hover:border-bm-coral hover:text-bm-coral px-3 py-1.5 rounded-lg transition-colors">
                            <Pencil size={13} /> Edit
                          </button>
                        </>
                      ) : (
                        <button onClick={() => { setTempWebsite(''); setEditingWebsite(true) }}
                          className="flex items-center gap-2 text-sm text-gray-400 border border-dashed border-gray-300 hover:border-bm-coral hover:text-bm-coral px-3 py-1.5 rounded-lg transition-colors">
                          <Plus size={13} /> Add website
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-2 mb-3">
                  {statsLoading ? (
                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                  ) : (
                    <>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={16}
                            fill={s <= Math.round(reviewStats.avgRating) ? '#F26B5B' : '#d1d5db'}
                            stroke={s <= Math.round(reviewStats.avgRating) ? '#F26B5B' : '#d1d5db'} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">
                        {reviewStats.count === 0 ? '0 reviews'
                          : `${reviewStats.avgRating.toFixed(1)} · ${reviewStats.count} ${reviewStats.count === 1 ? 'review' : 'reviews'}`}
                      </span>
                    </>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-bm-coral border border-bm-coral px-3 py-1.5 rounded-lg hover:bg-bm-coral hover:text-white transition-colors cursor-pointer">
                    <ImagePlus size={14} />
                    {uploadingPhoto ? 'Uploading...' : 'Add Photo'}
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                  </label>
                  <button
                    onClick={() => navigate(`/business/reviews/${activeBusiness?._id}`)}
                    className="flex items-center gap-2 text-sm text-bm-coral border border-bm-coral px-3 py-1.5 rounded-lg hover:bg-bm-coral hover:text-white transition-colors"
                  >
                    <MessageSquare size={14} />
                    See Reviews
                    {reviewStats.count > 0 && (
                      <span className="bg-bm-coral text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {reviewStats.count}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <BusinessCategories
            categories={activeBusiness?.category ?? []}
            onAdd={handleAddCategory}
            onRemove={handleRemoveCategory}
          />

          <BusinessPhotos
            photos={activeBusiness?.photos ?? []}
            uploading={uploadingPhoto}
            onUpload={handlePhotoUpload}
            onRemove={handleRemovePhoto}
          />

        </div>
      </div>
    </div>
  )
}

export default BusinessDashboard