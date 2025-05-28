import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const LandingPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      navigate('/create')
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-24 sm:py-32">
          <div className="space-y-4 animate-fade-in">
            <div className="mb-12">
              <div className="inline-flex items-center justify-center space-x-3 mb-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
                  <div className="relative bg-white p-3 rounded-full">
                    <svg className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 sm:text-5xl">
                  Whispr<span className="text-indigo-600">TALES</span>
                </h2>
              </div>
              <div className="relative">
                <div className="absolute -inset-x-20 top-1/2 h-px bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-50"></div>
                <p className="relative text-lg font-medium text-gray-600 sm:text-xl">
                  Where Stories Come to Life with AI
                </p>
              </div>
            </div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 sm:text-6xl sm:tracking-tight lg:text-7xl">
              Create Amazing Stories
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
              Transform your ideas into captivating stories with our AI-powered WhisprTales.
              <span className="block mt-2 text-indigo-600 font-medium">Where imagination meets technology.</span>
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signin"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  Get Started
                  <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                to="/signup"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-indigo-600 bg-white border-2 border-indigo-600 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <span className="absolute inset-0 w-full h-full bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">Sign Up</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 mb-32">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Create Stories Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-lg p-8 transition-transform duration-300 group-hover:scale-[0.98]">
                <div className="flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                  <svg className="h-8 w-8 text-white transform rotate-6 group-hover:rotate-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Create Stories</h3>
                <p className="text-gray-600 leading-relaxed">
                  Write your story and let our AI help you enhance it with scenes, images, and audio. Bring your imagination to life.
                </p>
              </div>
            </div>

            {/* Add Media Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-lg p-8 transition-transform duration-300 group-hover:scale-[0.98]">
                <div className="flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl transform rotate-6 group-hover:rotate-0 transition-transform duration-300">
                  <svg className="h-8 w-8 text-white transform -rotate-6 group-hover:rotate-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Add Media</h3>
                <p className="text-gray-600 leading-relaxed">
                  Enhance your story with AI-generated images and audio that perfectly match your narrative. Create a visual and auditory experience.
                </p>
              </div>
            </div>

            {/* Share & Collaborate Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-lg p-8 transition-transform duration-300 group-hover:scale-[0.98]">
                <div className="flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                  <svg className="h-8 w-8 text-white transform rotate-6 group-hover:rotate-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Share & Collaborate</h3>
                <p className="text-gray-600 leading-relaxed">
                  Share your stories with others and collaborate on creating amazing narratives together. Build a community of storytellers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="fixed bottom-8 right-8 flex space-x-4">
          <div className="animate-float-slow">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-20"></div>
          </div>
          <div className="animate-float-slower">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 0.5; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 8s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default LandingPage 