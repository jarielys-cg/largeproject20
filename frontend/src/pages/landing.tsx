import LoginModal from '../components/forms/loginModal'
import { useState } from 'react'

function Landing() {
    const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className = "text-center">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setIsModalOpen(true)}>
        Login
      </button>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Landing