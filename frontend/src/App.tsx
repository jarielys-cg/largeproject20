import { Routes, Route } from 'react-router'
import Landing from './pages/landing'
import UserSignUp from './pages/userSignUp'

function App() {
  return (
  
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<UserSignUp />} />
      </Routes>
   
  )
}

export default App
