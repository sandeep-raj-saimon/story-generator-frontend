import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import SceneEditor from './SceneEditor'
import SceneMedia from './SceneMedia'

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL

const StoryDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSegmenting, setIsSegmenting] = useState(false)
  const [isSegmentingDone, setIsSegmentingDone] = useState(false)
  const [error, setError] = useState('')
  const [scenes, setScenes] = useState([])
  const [isEditingScene, setIsEditingScene] = useState(false)
  const [currentScene, setCurrentScene] = useState(null)
  const [showMediaDialog, setShowMediaDialog] = useState(false)
  const [selectedSceneForMedia, setSelectedSceneForMedia] = useState(null)
  const [showBulkMediaDialog, setShowBulkMediaDialog] = useState(false)
  const [isGeneratingBulkMedia, setIsGeneratingBulkMedia] = useState(false)

  useEffect(() => {
    fetchStory()
    fetchScenes()
  }, [id])

  const fetchStory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stories/${id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch story')
      }

      const data = await response.json()
      setStory(data)
    } catch (err) {
      console.error('Error fetching story:', err)
      setError('Failed to load story')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchScenes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stories/${id}/scenes/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch scenes')
      }

      const data = await response.json()
      if (data.length > 0) {
        setScenes(data)
        setIsSegmentingDone(true)
      } else {
        setScenes([])
      }
    } catch (err) {
      console.error('Error fetching scenes:', err)
      setError('Failed to load scenes')
    }
  }

  const handleSegmentStory = async () => {
    setIsSegmenting(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/stories/${id}/segment/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to segment story')
      }

      const data = await response.json()
      setScenes(data.scenes)
    } catch (err) {
      console.error('Segment story error:', err)
      setError(err.message)
    } finally {
      setIsSegmenting(false)
    }
  }

  const handleGenerateMedia = async (sceneId, mediaType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stories/${id}/scenes/${sceneId}/generate-${mediaType}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to generate ${mediaType}`)
      }

      await fetchScenes()
      setShowMediaDialog(false)
      setSelectedSceneForMedia(null)
    } catch (err) {
      console.error(`Generate ${mediaType} error:`, err)
      setError(err.message)
    }
  }

  const handleGenerateBulkMedia = async (mediaType) => {
    setIsGeneratingBulkMedia(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/stories/${id}/generate-bulk-${mediaType}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to generate bulk ${mediaType}`)
      }

      await fetchScenes()
      setShowBulkMediaDialog(false)
    } catch (err) {
      console.error(`Generate bulk ${mediaType} error:`, err)
      setError(err.message)
    } finally {
      setIsGeneratingBulkMedia(false)
    }
  }

  const handleCreateScene = () => {
    setCurrentScene(null)
    setIsEditingScene(true)
  }

  const handleEditScene = (scene) => {
    setCurrentScene(scene)
    setIsEditingScene(true)
  }

  const handleDeleteScene = async (sceneId) => {
    if (!window.confirm('Are you sure you want to delete this scene?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/stories/${id}/scenes/${sceneId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete scene')
      }

      await fetchScenes()
    } catch (err) {
      console.error('Delete scene error:', err)
      setError('Failed to delete scene')
    }
  }

  const handleSaveScene = async () => {
    setIsEditingScene(false)
    await fetchScenes()
  }

  const handleCancelEdit = () => {
    setIsEditingScene(false)
    setCurrentScene(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-indigo-600 animate-ping opacity-75"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center min-h-[60vh]"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center min-h-[60vh]"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
              <div className="text-indigo-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Story Not Found</h3>
              <p className="text-gray-600 mb-4">The story you're looking for doesn't exist or has been removed.</p>
              <button
                onClick={() => navigate('/stories')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Back to Stories
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (isEditingScene) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <SceneEditor
          sceneId={currentScene?.id}
          storyId={id}
          onSave={handleSaveScene}
          onCancel={handleCancelEdit}
        />
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {story.title}
              </h1>
              <p className="text-gray-600">Created on {new Date(story.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSegmentStory}
                disabled={isSegmenting || isSegmentingDone}
                className={`px-6 py-3 rounded-xl text-sm font-semibold text-center transition-all duration-200 ${
                  isSegmenting || isSegmentingDone
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                }`}
              >
                {isSegmenting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Segmenting...
                  </div>
                ) : (
                  'Segment Story'
                )}
              </motion.button>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-8 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Story Content</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{story.content}</p>
            </div>
          </motion.div>

          {scenes.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Scenes
                </h2>
              </div>

              <AnimatePresence mode="wait">
                {scenes.map((scene, index) => (
                  <motion.div
                    key={scene.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">{index + 1}</span>
                          </div>
                          <h3 className="ml-4 text-xl font-semibold text-gray-800">{scene.title}</h3>
                        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEditScene(scene)}
                            className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteScene(scene.id)}
                            className="px-4 py-2 text-sm text-red-600 hover:text-red-800 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </motion.button>
                        </div>
                      </div>
                      <div className="pl-16 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Scene Content</h4>
                          <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">{scene.content}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                          <p className="text-gray-600 italic bg-gray-50 rounded-lg p-4">{scene.scene_description}</p>
                        </div>
                        
                        <SceneMedia scene={scene} index={index} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateScene}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-colors"
                >
                  Create New Scene
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/stories/${id}/media`)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-colors"
                >
                  Move to Media Generation
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Media Generation Dialog */}
          <AnimatePresence>
            {showMediaDialog && selectedSceneForMedia && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Generate Media for Scene {scenes.findIndex(s => s.id === selectedSceneForMedia.id) + 1}
                  </h3>
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGenerateMedia(selectedSceneForMedia.id, 'image')}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-colors"
                    >
                      Generate Image
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGenerateMedia(selectedSceneForMedia.id, 'audio')}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors"
                    >
                      Generate Audio
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowMediaDialog(false)
                        setSelectedSceneForMedia(null)
                      }}
                      className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk Media Generation Dialog */}
          <AnimatePresence>
            {showBulkMediaDialog && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Generate Media for All Scenes
                  </h3>
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGenerateBulkMedia('image')}
                      disabled={isGeneratingBulkMedia}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-colors disabled:opacity-50"
                    >
                      {isGeneratingBulkMedia ? 'Generating Images...' : 'Generate All Images'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGenerateBulkMedia('audio')}
                      disabled={isGeneratingBulkMedia}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isGeneratingBulkMedia ? 'Generating Audio...' : 'Generate All Audio'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowBulkMediaDialog(false)}
                      disabled={isGeneratingBulkMedia}
                      className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default StoryDetail 