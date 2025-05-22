import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LandingPage from './components/layout/LandingPage'
import StoryInput from './components/story/StoryInput'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import StoryDetail from './components/story/StoryDetail'
import MyStories from './components/story/MyStories'
import MediaGeneration from './components/story/MediaGeneration'
import GeneratedContent from './components/story/GeneratedContent'
import PricingPage from './components/pricing/PricingPage'
import ProfilePage from './components/profile/ProfilePage'
import TermsAndConditions from './components/legal/TermsAndConditions'
import PrivacyPolicy from './components/legal/PrivacyPolicy'
import RefundPolicy from './components/legal/RefundPolicy'
import ContactUs from './components/legal/ContactUs'
// import SubscriptionManager from './components/subscription/SubscriptionManager'
import { NavigationProvider } from './utils/navigationContext'

const AppContent = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isLandingPage = location.pathname === '/'
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup'
  const isLegalPage = location.pathname === '/terms' || location.pathname === '/privacy' || 
                     location.pathname === '/refund' || location.pathname === '/contact'

  return (
    <NavigationProvider navigate={navigate}>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {!isLandingPage && !isAuthPage && !isLegalPage && <Navbar />}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<StoryInput />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/stories/:id" element={<StoryDetail />} />
            <Route path="/my-stories" element={<MyStories />} />
            <Route path="/stories/:storyId/media" element={<MediaGeneration />} />
            <Route path="/generated-content" element={<GeneratedContent />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/pricing" element={<PricingPage />} />
            {/* <Route path="/subscription" element={<SubscriptionManager />} /> */}
            {/* Add more routes as needed */}
          </Routes>
        </div>
        {!isAuthPage && <Footer />}
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