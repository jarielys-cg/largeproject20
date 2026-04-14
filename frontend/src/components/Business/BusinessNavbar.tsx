import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import logo from '../../assets/logo.png'
import { Settings, LogOut, ChevronDown } from 'lucide-react'

interface Props {
  owner: { firstName: string; lastName: string; username: string } | null
  onLogout: () => void
}

const BusinessNavbar = ({ owner, onLogout }: Props) => {
  const navigate = useNavigate()
  const [profileDropdown, setProfileDropdown] = useState(false)
  const [showOwnerName, setShowOwnerName] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get initials from firstName and lastName
  const initials = owner
    ? `${owner.firstName.charAt(0)}${owner.lastName.charAt(0)}`.toUpperCase()
    : 'B'

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between relative z-10">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/business/dashboard')}>
        <img src={logo} alt="BizMart logo" className="w-9 h-9" />
        <div>
          <span className="text-lg font-bold text-bm-dark">Biz<span className="text-bm-coral">Mart</span></span>
          <span className="text-base text-gray-600 ml-2">for Business</span>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileDropdown(prev => !prev)}
          onMouseEnter={() => setShowOwnerName(true)}
          onMouseLeave={() => setShowOwnerName(false)}
          className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
        >
          {/* Owner initials */}
          <div className="w-8 h-8 rounded-full bg-bm-coral flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
          <ChevronDown size={16} className={`text-gray-500 transition-transform ${profileDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Tooltip */}
        {showOwnerName && !profileDropdown && (
          <div className="absolute top-full right-0 mt-1 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-50">
            {owner?.firstName} {owner?.lastName}
          </div>
        )}

        {profileDropdown && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{owner?.firstName} {owner?.lastName}</p>
              <p className="text-xs text-gray-400">Business Owner</p>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Settings size={16} className="text-gray-500" />
              Account Settings
            </button>
            <div className="h-px bg-gray-100" />
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default BusinessNavbar