import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import LandingPage from './components/layout/LandingPage'
import StoryInput from './components/story/StoryInput'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import StoryDetail from './components/story/StoryDetail'
import MyStories from './components/story/MyStories'
import MediaGeneration from './components/story/MediaGeneration'
import GeneratedContent from './components/story/GeneratedContent'
import PricingPage from './components/pricing/PricingPage'
// import SubscriptionManager from './components/subscription/SubscriptionManager'
import { NavigationProvider } from './utils/navigationContext'

const AppContent = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isLandingPage = location.pathname === '/'
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup'

  return (
    <NavigationProvider navigate={navigate}>
      <div className="min-h-screen bg-gray-100">
        {!isLandingPage && !isAuthPage && <Navbar />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<StoryInput />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/my-stories" element={<MyStories />} />
          <Route path="/stories/:storyId/media" element={<MediaGeneration />} />
          <Route path="/generated-content" element={<GeneratedContent />} />
          {/* <Route path="/pricing" element={<PricingPage />} /> */}
          {/* <Route path="/subscription" element={<SubscriptionManager />} /> */}
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </NavigationProvider>
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