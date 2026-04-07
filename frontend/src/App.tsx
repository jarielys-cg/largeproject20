import { useState } from 'react'
import { Routes, Route } from 'react-router'
import Landing from './pages/landing'
import UserSignUp from './pages/userSignUp'
import LoginModal from './components/forms/loginModal'

function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing onLoginClick={() => setLoginModalOpen(true)} />} />
        <Route path="/signup" element={<UserSignUp onLoginClick={() => setLoginModalOpen(true)} />} />
      </Routes>
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  )
}

export default App