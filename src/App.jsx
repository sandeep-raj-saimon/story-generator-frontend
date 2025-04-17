import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import LandingPage from './components/layout/LandingPage'
import StoryInput from './components/story/StoryInput'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'

const AppContent = () => {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup'

  return (
    <div className="min-h-screen bg-gray-100">
      {!isLandingPage && !isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<StoryInput />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App