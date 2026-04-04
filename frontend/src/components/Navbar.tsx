import { BriefcaseBusinessIcon, ChevronDown, LogInIcon } from "lucide-react"
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router'
import { useEffect, useRef, useState } from "react"
import BusinessSignUpModal from "./forms/BusinessSignUpModal"

interface NavbarProps {
  onLoginClick?: () => void
}

const Navbar = ({ onLoginClick }: NavbarProps) => {
  const navigate = useNavigate()
  const [bizDropdownOpen, setBizDropdownOpen] = useState(false)
  const [bizModalOpen, setBizModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
   // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBizDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 relative z-10">

      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('/')}>
        <img src={logo} alt="BizMart logo" className="w-10 h-10" />
        <span className="text-lg font-bold text-bm-dark">
          Biz<span className="text-bm-coral">Mart</span>
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 shrink-0 ml-auto">

        {/* For Businesses dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setBizDropdownOpen(prev => !prev)}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-bm-coral whitespace-nowrap transition-colors"
          >
            For Businesses
            <ChevronDown size={16} strokeWidth={2} className={`transition-transform ${bizDropdownOpen ? 'rotate-180' : ''}`}/>
          </button>

          {/* Dropdown menu */}
          {bizDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => { setBizModalOpen(true); setBizDropdownOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-bm-gray hover:text-bm-coral transition-colors text-left"
              >
                <BriefcaseBusinessIcon size={16} color="currentColor"/>
                Add Business Account
              </button>
              <div className="h-px bg-gray-100"></div>
              <button
                onClick={() => { navigate('/business/login'); setBizDropdownOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-bm-gray hover:text-bm-coral transition-colors text-left"
              >
                <LogInIcon size={16} color="currentColor"/>
                Login to Business Account
              </button>
            </div>
          )}
        </div>

        <button className="text-m font-medium text-gray-700 hover:text-bm-coral whitespace-nowrap">
          Write a Review
        </button>
        <button
          onClick={onLoginClick}
          className="text-sm font-medium border border-gray-400 text-gray-700 hover:border-bm-coral hover:text-bm-coral px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Log In
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="text-m font-medium bg-bm-coral hover:bg-bm-coral-dark text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Sign Up
        </button>
          
      </div>
       <BusinessSignUpModal isOpen={bizModalOpen} onClose={() => setBizModalOpen(false)} />
    </nav>
  )
}

export default Navbar