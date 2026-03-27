import logo from '../assets/logo.png'
import { useNavigate } from 'react-router'

interface NavbarProps {
  onLoginClick?: () => void
}

const Navbar = ({ onLoginClick }: NavbarProps) => {
  const navigate = useNavigate()

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <img src={logo} alt="BizMart logo" className="w-10 h-10" />
        <span className="text-xl font-bold text-bm-dark">
          Biz<span className="text-bm-coral">Mart</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/signup')}
          className="bg-bm-coral hover:bg-bm-coral-dark text-white font-bold py-2 px-5 rounded-lg transition-colors"
        >
          Sign Up
        </button>
        <button
          onClick={onLoginClick}
          className="border-2 border-bm-coral text-bm-coral hover:bg-bm-coral hover:text-white font-bold py-2 px-5 rounded-lg transition-colors"
        >
          Log In
        </button>
      </div>
    </nav>
  )
}

export default Navbar