import { useState } from 'react'
import { Routes, Route } from 'react-router'
import { Toaster } from 'react-hot-toast'
import Landing from './pages/landing'
import UserSignUp from './pages/userSignUp'
import LoginModal from './components/forms/loginModal'
import WriteReview from "./pages/WriteReview"
import ReviewForm from "./pages/ReviewForm"
import BusinessDashboard from "./pages/BusinessDashboard"
import BusinessSignUpModal from "./components/forms/BusinessSignUpModal"
import SignUpChoiceModal from "./components/forms/SignUpModalChoice"
import BusinessReviews from "./pages/BusinessReviews"

function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [choiceModalOpen, setChoiceModalOpen] = useState(false)
  const [bizSignUpOpen, setBizSignUpOpen] = useState(false)

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing onLoginClick={() => setLoginModalOpen(true)} />} />
        <Route path="/signup" element={<UserSignUp onLoginClick={() => setLoginModalOpen(true)} />} />
        <Route path="/write-review" element={<WriteReview onLoginClick={() => setLoginModalOpen(true)} />} />
        <Route path="/review/:businessId" element={<ReviewForm onLoginClick={() => setLoginModalOpen(true)} />} />
        <Route path="/business/dashboard" element={<BusinessDashboard />} />
        <Route path="/business/reviews/:businessId" element={<BusinessReviews />} />
      </Routes>

     
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onBusinessSignUp={() => {
          setLoginModalOpen(false)
          setChoiceModalOpen(true)  
        }}
      />

      <SignUpChoiceModal
        isOpen={choiceModalOpen}
        onClose={() => setChoiceModalOpen(false)}
        onBusinessSignUp={() => {
          setChoiceModalOpen(false)
          setBizSignUpOpen(true)
        }}
      />

      <BusinessSignUpModal
        isOpen={bizSignUpOpen}
        onClose={() => setBizSignUpOpen(false)}
        skipAccountStep={false}
      />

      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    </>
  )
}

export default App