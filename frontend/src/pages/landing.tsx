import { useState } from 'react'
import LoginModal from '../components/forms/loginModal'
import Navbar from '../components/Navbar'

function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bm-gray">
      <Navbar onLoginClick={() => setIsModalOpen(true)} />
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Landing