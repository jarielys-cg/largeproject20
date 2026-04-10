import { useNavigate } from 'react-router'
import { Store, Star } from 'lucide-react'
import logo from '../../assets/logo.png'

interface Props {
  isOpen: boolean
  onClose: () => void
  onBusinessSignUp: () => void
}

const SignUpChoiceModal = ({ isOpen, onClose, onBusinessSignUp }: Props) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="BizMart" className="w-14 h-14 mb-3" />
          <h2 className="text-xl font-bold text-gray-900">Join BizMart as...</h2>
          <p className="text-sm text-gray-500 mt-1">Choose how you want to sign up</p>
        </div>

        {/* Choices */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onClose()
              onBusinessSignUp()
            }}
            className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-bm-coral hover:bg-red-50 transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-full bg-bm-gray group-hover:bg-bm-coral/10 flex items-center justify-center shrink-0 transition-colors">
              <Store size={22} className="text-bm-coral" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-bm-coral transition-colors">A Business Owner</p>
              <p className="text-xs text-gray-500 mt-0.5">List and manage your business</p>
            </div>
          </button>

          <button
            onClick={() => {
              onClose()
              navigate('/signup')
            }}
            className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-bm-coral hover:bg-red-50 transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-full bg-bm-gray group-hover:bg-bm-coral/10 flex items-center justify-center shrink-0 transition-colors">
              <Star size={22} className="text-bm-coral" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-bm-coral transition-colors">A Reviewer</p>
              <p className="text-xs text-gray-500 mt-0.5">Discover and review local businesses</p>
            </div>
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <span
            onClick={onClose}
            className="text-bm-coral hover:underline cursor-pointer font-medium"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignUpChoiceModal