import { useRef, useState, useEffect } from 'react'
import { ChevronDown, Store, Plus } from 'lucide-react'
import type { Business } from '../../types'

interface Props {
  businesses: Business[]
  activeBusiness: Business | null
  onSelectBusiness: (biz: Business) => void
  onAddBusiness: () => void
}

const BusinessSidebar = ({ businesses, activeBusiness, onSelectBusiness, onAddBusiness }: Props) => {
  const [showLocationsDropdown, setShowLocationsDropdown] = useState(false)
  const locationsDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationsDropdownRef.current && !locationsDropdownRef.current.contains(e.target as Node)) {
        setShowLocationsDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-gray-200 p-5">

        {activeBusiness ? (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{activeBusiness.name}</h2>
            <p className="text-sm text-gray-500">{activeBusiness.address}</p>
            <p className="text-sm text-gray-500 mb-4">{activeBusiness.city}, {activeBusiness.state} {activeBusiness.zipCode}</p>
          </>
        ) : (
          <p className="text-sm text-gray-400 mb-4">No business found</p>
        )}

        <div className="h-px bg-gray-100 mb-4" />

        {businesses.length > 1 && (
          <div className="relative mb-3" ref={locationsDropdownRef}>
            <button
              onClick={() => setShowLocationsDropdown(prev => !prev)}
              className="w-full flex items-center justify-between text-sm text-gray-700 hover:text-bm-coral font-medium transition-colors"
            >
              <span>See all businesses ({businesses.length})</span>
              <ChevronDown size={16} className={`transition-transform ${showLocationsDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showLocationsDropdown && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {businesses.map(biz => (
                  <button
                    key={biz._id}
                    onClick={() => { onSelectBusiness(biz); setShowLocationsDropdown(false) }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-bm-gray transition-colors ${activeBusiness?._id === biz._id ? 'bg-bm-gray' : ''}`}
                  >
                    <Store size={16} className="text-bm-coral shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-sm font-medium ${activeBusiness?._id === biz._id ? 'text-bm-coral' : 'text-gray-700'}`}>
                        {biz.name}
                      </p>
                      <p className="text-xs text-gray-400">{biz.city}, {biz.state}</p>
                    </div>
                  </button>
                ))}
                <div className="h-px bg-gray-100" />
                <button
                  type="button"
                  onClick={() => { onAddBusiness(); setShowLocationsDropdown(false) }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-bm-coral font-medium hover:bg-bm-gray transition-colors"
                >
                  <Plus size={15} />
                  Add Business
                </button>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onAddBusiness}
          className="flex items-center gap-2 text-sm text-bm-coral font-medium hover:underline transition-colors"
        >
          <Plus size={16} />
          Add Business
        </button>

      </div>
    </div>
  )
}

export default BusinessSidebar