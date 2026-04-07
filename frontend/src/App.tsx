import { useState } from 'react'
import { Routes, Route } from 'react-router'
import Landing from './pages/landing'
import UserSignUp from './pages/userSignUp'
import LoginModal from './components/forms/loginModal'
import WriteReview from "./pages/WriteReview"

function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing onLoginClick={() => setLoginModalOpen(true)} />} />
        <Route path="/signup" element={<UserSignUp onLoginClick={() => setLoginModalOpen(true)} />} />
        <Route path="/write-review" element={<WriteReview onLoginClick={() => setLoginModalOpen(true)} />} />
      </Routes>
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  )
}

export default App