import { useEffect, useState } from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router'
import { Toaster } from 'react-hot-toast'
import Landing from './pages/landing'
import UserSignUp from './pages/userSignUp'
import VerifyEmailSent from './pages/verifyEmailSent'
import VerifyEmail from './pages/verifyEmail'
import LoginModal from './components/forms/loginModal'
import WriteReview from "./pages/WriteReview"
import ReviewForm from "./pages/ReviewForm"
import BusinessDashboard from "./pages/BusinessDashboard"
import BusinessSignUpModal from "./components/forms/BusinessSignUpModal"
import SignUpChoiceModal from "./components/forms/SignUpModalChoice"
import BusinessReviews from "./pages/BusinessReviews"
import BusinessPage from "./pages/BusinessPage"
import UserDashboard from "./pages/userDashboard"

function SearchRedirect() {
  const location = useLocation()

  return <Navigate to={`/dashboard${location.search}`} replace />
}

function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [choiceModalOpen, setChoiceModalOpen] = useState(false)
  const [bizSignUpOpen, setBizSignUpOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')))

  const getHomeRedirectPath = () => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) return '/dashboard'

    try {
      const parsedUser = JSON.parse(storedUser)
      return parsedUser?.isBusinessOwner ? '/business/dashboard' : '/dashboard'
    } catch {
      return '/dashboard'
    }
  }

  useEffect(() => {
    const syncAuthFromStorage = () => {
      setIsLoggedIn(Boolean(localStorage.getItem('token')))
    }

    window.addEventListener('storage', syncAuthFromStorage)
    window.addEventListener('auth-changed', syncAuthFromStorage)

    return () => {
      window.removeEventListener('storage', syncAuthFromStorage)
      window.removeEventListener('auth-changed', syncAuthFromStorage)
    }
  }, [])

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn
              ? <Navigate to={getHomeRedirectPath()} replace />
              : <Landing onLoginClick={() => setLoginModalOpen(true)} />
          }
        />
        <Route path="/signup" element={<UserSignUp onLoginClick={() => setLoginModalOpen(true)} />} />
        <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
        <Route path="/verify-email/:token" element={<VerifyEmail onLoginClick={() => setLoginModalOpen(true)} />} />
        <Route path="/write-review" element={<WriteReview onLoginClick={() => setLoginModalOpen(true)} />} />
        <Route path="/review/:businessId" element={<ReviewForm onLoginClick={() => setLoginModalOpen(true)} />} />
        <Route path="/business/dashboard" element={<BusinessDashboard />} />
        <Route path="/business/reviews/:businessId" element={<BusinessReviews />} />
        <Route path="/business/:businessId" element={<BusinessPage onLoginClick={() => setLoginModalOpen(true)} />} />
        <Route path="/search" element={<SearchRedirect />} />
        <Route path="/dashboard" element={<UserDashboard onLoginClick={() => setLoginModalOpen(true)} />} />
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