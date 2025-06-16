import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useOnboarding } from '../../contexts/OnboardingContext'

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL

const StoryInput = () => {
  const navigate = useNavigate()
  const { triggerTour } = useOnboarding()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [isPublic, setIsPublic] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [userCredits, setUserCredits] = useState(null)
  const [loadingCredits, setLoadingCredits] = useState(true)

  useEffect(() => {
    fetchUserCredits()
  }, [])

  const fetchUserCredits = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUserCredits(data.credits?.credits_remaining || 0)
      }
    } catch (err) {
      console.error('Error fetching user credits:', err)
    } finally {
      setLoadingCredits(false)
    }
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }

  const handleContentChange = (e) => {
    const text = e.target.value
    setContent(text)
    setWordCount(text.trim().split(/\s+/).length)
  }

  const handleSaveStory = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/stories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          title,
          content,
          is_public: isPublic
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save story')
      }

      const data = await response.json()
      // After successful save, redirect to story detail page
      navigate(`/stories/${data.id}`)
    } catch (err) {
      console.error('Save story error:', err)
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerateStory = async () => {
    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/stories/generate/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate story')
      }

      const data = await response.json()
      setTitle(data.title)
      setContent(data.content)
      setWordCount(data.content.trim().split(/\s+/).length)
      setIsDialogOpen(false)
    } catch (err) {
      console.error('Generate story error:', err)
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto p-6">
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Create Your Story
            </h1>
            <div className="flex items-center space-x-4">
              {/* Credit Display */}
              <div className="bg-white rounded-lg shadow-sm px-4 py-2 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {loadingCredits ? (
                        <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
                      ) : (
                        `${userCredits} Credits`
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Remaining</div>
                  </div>
                </div>
              </div>
              
              {/* Tour Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={triggerTour}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  title="Take a guided tour of Story Generator features"
                >
                  <span className="font-medium">🎯 Start Tour</span>
                </button>
                {/* <button
                  onClick={resetTour}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-600 bg-white rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Reset tour to show it again"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm">Reset</span>
                </button> */}
              </div>
              
              <button
                onClick={() => setIsDialogOpen(true)}
                className="p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
                title="Need help getting started?"
                data-tour="generate-story-help"
              >
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Dialog */}
          {isDialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 transform transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Don't know where to start?</h3>
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Let us help you get started! Click the button below to generate a story idea with a title and content.
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={handleGenerateStory}
                    disabled={isGenerating}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      'Generate Story'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSaveStory} className="space-y-6">
            <div className="group">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Story Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 group-hover:shadow-md"
                placeholder="Enter your story title"
                required
              />
            </div>

            <div className="group">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Story Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={handleContentChange}
                rows={15}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 group-hover:shadow-md resize-none"
                placeholder="Write your story here..."
                required
              />
              <div className="mt-2 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Word count: <span className="font-medium text-indigo-600">{wordCount}</span>/10000
                </p>
                <div className="h-1 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${Math.min((wordCount / 10000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Story Visibility
              </label>
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="public"
                        name="visibility"
                        value="public"
                        checked={isPublic}
                        onChange={() => setIsPublic(true)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="public" className="ml-2 text-sm font-medium text-gray-700">
                        Public
                      </label>
                    </div>
                    <div className="flex items-center ml-6">
                      <input
                        type="radio"
                        id="private"
                        name="visibility"
                        value="private"
                        checked={!isPublic}
                        onChange={() => setIsPublic(false)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="private" className="ml-2 text-sm font-medium text-gray-700">
                        Private
                      </label>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {isPublic ? (
                      <div className="flex items-center text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Visible to everyone
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                        Only visible to you
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {isPublic 
                    ? "Your story will be visible in the Explore section and can be discovered by other users."
                    : "Your story will only be visible to you in your My Stories section."
                  }
                </p>
              </div>
            </div>

            {/* Credit Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-blue-800">Credit Information</h3>
                    <p className="text-blue-700 text-sm">
                      {loadingCredits ? (
                        <span className="animate-pulse bg-blue-200 h-4 w-32 rounded"></span>
                      ) : userCredits > 0 ? (
                        `You have ${userCredits} credit${userCredits !== 1 ? 's' : ''} remaining. Saving this story will cost 1 credit.`
                      ) : (
                        <span className="text-red-600 font-medium">You need at least 1 credit to save a story.</span>
                      )}
                    </p>
                  </div>
                </div>
                {userCredits === 0 && (
                  <Link
                    to="/pricing"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Get Credits
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 transform transition-all duration-300 hover:scale-[1.02]">
              <h3 className="text-lg font-medium text-blue-800 mb-3">How it works:</h3>
              <ol className="space-y-3 text-blue-700">
                <li className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">1</span>
                  <span>Enter your story title and content</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">2</span>
                  <span>Click "Save Story" to save your story</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">3</span>
                  <span>After saving, you'll be able to segment your story into scenes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">4</span>
                  <span>Review and edit scene descriptions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">5</span>
                  <span>Create scenes from the descriptions</span>
                </li>
              </ol>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between animate-shake">
                <span>{error}</span>
                <button 
                  onClick={() => setError('')}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving || userCredits === 0}
                className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Story
                      <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
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

export default StoryInput 