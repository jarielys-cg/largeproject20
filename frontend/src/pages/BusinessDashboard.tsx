import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import api from '../lib/axios'
import { ImagePlus, MessageSquare, Pencil, Star, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Business } from '../types'
import BusinessNavbar from "../components/Business/BusinessNavbar"
import BusinessSidebar from "../components/Business/BusinessSidebar"
import BusinessCategories from "../components/Business/BusinessCategories"
import BusinessPhotos from "../components/Business/BusinessPhotos"
import BusinessSignUpModal from '../components/forms/BusinessSignUpModal'
import BusinessDescription from "../components/Business/BusinessDescription"
import BusinessInfo from "../components/Business/BusinessInfo"

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
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [addBusinessModalOpen, setAddBusinessModalOpen] = useState(false)

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
      toast.error('Failed to load your businesses. Please refresh.')
    } finally {
      setBusinessesLoading(false)
    }
  }

  useEffect(() => {
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

  const handleRemoveBusiness = async () => {
    if (!activeBusiness) return
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token!.split('.')[1]))
      await api.delete('/removeB', {
        data: { ownerId: payload.userId, name: activeBusiness.name }
      })
      toast.success('Business removed')
      const remaining = businesses.filter(b => b._id !== activeBusiness._id)
      setBusinesses(remaining)
      setActiveBusiness(remaining[0] ?? null)
      if (remaining.length === 0) navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to remove business')
    }
  }

  const handleSaveName = async () => {
    if (!activeBusiness) return
    setSavingName(true)
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token!.split('.')[1]))
      const res = await api.patch('/editB', {
        ownerId: payload.userId,
        name: activeBusiness.name,
        newName: tempName
      })
      setActiveBusiness(res.data)
      setBusinesses(prev => prev.map(b => b._id === res.data._id ? res.data : b))
      setEditingName(false)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update name')
    } finally {
      setSavingName(false)
    }
  }
  
  const handleAddCategory = async (cat: string) => {
  if (!activeBusiness) return
  try {
    const token = localStorage.getItem('token')
    const payload = JSON.parse(atob(token!.split('.')[1]))
    const updatedCategories = [...activeBusiness.category, cat]
    const res = await api.patch('/editB', {
      ownerId: payload.userId,
      name: activeBusiness.name,
      category: updatedCategories
    })
    setActiveBusiness(res.data)
    setBusinesses(prev => prev.map(b => b._id === res.data._id ? res.data : b))
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Failed to add category')
  }
}

const handleRemoveCategory = async (cat: string) => {
  if (!activeBusiness) return
  try {
    const token = localStorage.getItem('token')
    const payload = JSON.parse(atob(token!.split('.')[1]))
    const updatedCategories = activeBusiness.category.filter(c => c !== cat)
    const res = await api.patch('/editB', {
      ownerId: payload.userId,
      name: activeBusiness.name,
      category: updatedCategories
    })
    setActiveBusiness(res.data)
    setBusinesses(prev => prev.map(b => b._id === res.data._id ? res.data : b))
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Failed to remove category')
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
      toast.success('Photo uploaded successfully.')
    } catch {
      toast.error('Failed to upload photo. Please try again.')
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
      toast.error('Failed to remove photo. Please try again.')
    }
  }

  const handleSaveDescription = async (description: string) => {
    if (!activeBusiness) return
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token!.split('.')[1]))
      const res = await api.patch('/editB', {
        ownerId: payload.userId,
        name: activeBusiness.name,
        description
      })
      setActiveBusiness(res.data)
      setBusinesses(prev => prev.map(b => b._id === res.data._id ? res.data : b))
      toast.success('Description updated!')
    } catch {
      toast.error('Failed to update description')
    }
  }
  const handleSaveWebsite = async (url: string) => {
    if (!activeBusiness) return
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token!.split('.')[1]))
      const res = await api.patch('/editB', {
        ownerId: payload.userId,
        name: activeBusiness.name,
        websiteLink: url
      })
      setActiveBusiness(res.data)
      setBusinesses(prev => prev.map(b => b._id === res.data._id ? res.data : b))
      toast.success('Website updated!')
    } catch {
      toast.error('Failed to update website')
    }
}

  const handleSavePhone = async (phone: string) => {
    if (!activeBusiness) return
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token!.split('.')[1]))
      const res = await api.patch('/editB', {
        ownerId: payload.userId,
        name: activeBusiness.name,
        phone
      })
      setActiveBusiness(res.data)
      setBusinesses(prev => prev.map(b => b._id === res.data._id ? res.data : b))
      toast.success('Phone updated!')
    } catch {
      toast.error('Failed to update phone')
    }
  }

  const handleSaveAddress = async (address: string) => {
    if (!activeBusiness) return
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token!.split('.')[1]))
      const res = await api.patch('/editB', {
        ownerId: payload.userId,
        name: activeBusiness.name,
        address
      })
      setActiveBusiness(res.data)
      setBusinesses(prev => prev.map(b => b._id === res.data._id ? res.data : b))
      toast.success('Address updated!')
    } catch {
      toast.error('Failed to update address')
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

      <div className="flex max-w-7xl mx-auto px-6 py-10 gap-6">
        <BusinessSidebar
          businesses={businesses}
          activeBusiness={activeBusiness}
          onSelectBusiness={handleSelectBusiness}
          onAddBusiness={() => setAddBusinessModalOpen(true)}
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

                {/*Business name*/}
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

                  {/* Delete business */}
                  {!confirmDelete ? (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="flex items-center gap-2 text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                      Remove Business
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Are you sure?</span>
                      <button
                        onClick={handleRemoveBusiness}
                        className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Yes, remove
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="text-sm border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:border-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
           {/* Description — between header and categories */}
        <BusinessDescription
          description={activeBusiness?.description}
          onSave={handleSaveDescription}
        />

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

         <BusinessInfo
          address={activeBusiness?.address}
          phone={activeBusiness?.phone}
          websiteLink={activeBusiness?.websiteLink}
          onSaveWebsite={handleSaveWebsite}
          onSavePhone={handleSavePhone}
          onSaveAddress={handleSaveAddress}
        />
      </div>

      <BusinessSignUpModal
        isOpen={addBusinessModalOpen}
        onClose={() => setAddBusinessModalOpen(false)}
        skipAccountStep={true}
        onSuccess={fetchBusinesses}
      />
    </div>
  )
}

export default BusinessDashboard