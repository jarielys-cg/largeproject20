import { Search } from "lucide-react"
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router'

interface NavbarProps {
  onLoginClick?: () => void
}

const Navbar = ({ onLoginClick }: NavbarProps) => {
  const navigate = useNavigate()

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">

      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('/')}>
        <img src={logo} alt="BizMart logo" className="w-9 h-9" />
        <span className="text-lg font-bold text-bm-dark">
          Biz<span className="text-bm-coral">Mart</span>
        </span>
      </div>

      {/* Search bar */}
      <div className="flex flex-1 max-w-2xl border border-gray-300 rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder="things to do, restaurants, auto-service"
          className="flex-1 px-4 py-2 text-sm focus:outline-none"
        />
        <div className="w-px bg-gray-300"></div>
        <input
          type="text"
          placeholder="Location"
          className="w-36 px-4 py-2 text-sm focus:outline-none"
        />
        <button className="bg-bm-coral hover:bg-bm-coral-dark px-4 flex items-center justify-center transition-colors">
          <Search size={16} color="white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Right side links */}
      <div className="flex items-center gap-4 shrink-0 ml-auto">
        <button className="text-sm font-medium text-gray-700 hover:text-bm-coral whitespace-nowrap">
          For Businesses
        </button>
        <button className="text-sm font-medium text-gray-700 hover:text-bm-coral whitespace-nowrap">
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
          className="text-sm font-medium bg-bm-coral hover:bg-bm-coral-dark text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Sign Up
        </button>
      </div>

    </nav>
  )
}

export default Navbar