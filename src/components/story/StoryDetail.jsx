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
  const [sceneToDelete, setSceneToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

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
    try {
      setIsDeleting(true)
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
      setSceneToDelete(null)
    } catch (err) {
      console.error('Delete scene error:', err)
      setError('Failed to delete scene')
    } finally {
      setIsDeleting(false)
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
    return <div className="text-center p-4">Loading story...</div>
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }

  if (!story) {
    return <div className="text-center p-4">Story not found</div>
  }

  if (isEditingScene) {
    return (
      <SceneEditor
        sceneId={currentScene?.id}
        storyId={id}
        onSave={handleSaveScene}
        onCancel={handleCancelEdit}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{story.title}</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleSegmentStory}
            disabled={isSegmenting || isSegmentingDone}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSegmenting ? 'Segmenting...' : 'Segment Story'}
          </button>
          {/* {scenes.length > 0 && (
            <button
              onClick={() => setShowBulkMediaDialog(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Generate All Media
            </button>
          )} */}
        </div>
      </div>

      <div className="prose max-w-none mb-8">
        <p className="whitespace-pre-wrap">{story.content}</p>
      </div>

      {scenes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Scenes</h2>
          <div className="space-y-6">
            {scenes.map((scene, index) => (
              <div key={scene.id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold">{index + 1}</span>
                    </div>
                    <h3 className="ml-4 text-xl font-semibold text-gray-800">{scene.title}</h3>
                  </div>
                  <div className="flex space-x-2">
                    {/* <button
                      onClick={() => {
                        setSelectedSceneForMedia(scene)
                        setShowMediaDialog(true)
                      }}
                      className="px-3 py-1 text-sm text-green-600 hover:text-green-800"
                    >
                      Generate Media
                    </button> */}
                    <button
                      onClick={() => handleEditScene(scene)}
                      className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setSceneToDelete(scene)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="pl-14">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Scene Content</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{scene.content}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                    <p className="text-gray-600 italic">{scene.scene_description}</p>
                  </div>
                  
                  {/* Media Display Section */}
                  <SceneMedia scene={scene} index={index} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={handleCreateScene}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Create New Scene
            </button>
            <button
              onClick={() => navigate(`/stories/${id}/media`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Move to Media Generation
            </button>
          </div>
        </div>
      )}

      {/* Media Generation Dialog */}
      {showMediaDialog && selectedSceneForMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Generate Media for Scene {scenes.findIndex(s => s.id === selectedSceneForMedia.id) + 1}
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => handleGenerateMedia(selectedSceneForMedia.id, 'image')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Generate Image
              </button>
              <button
                onClick={() => handleGenerateMedia(selectedSceneForMedia.id, 'audio')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Generate Audio
              </button>
              <button
                onClick={() => {
                  setShowMediaDialog(false)
                  setSelectedSceneForMedia(null)
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Media Generation Dialog */}
      {showBulkMediaDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Generate Media for All Scenes
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => handleGenerateBulkMedia('image')}
                disabled={isGeneratingBulkMedia}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isGeneratingBulkMedia ? 'Generating Images...' : 'Generate All Images'}
              </button>
              <button
                onClick={() => handleGenerateBulkMedia('audio')}
                disabled={isGeneratingBulkMedia}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isGeneratingBulkMedia ? 'Generating Audio...' : 'Generate All Audio'}
              </button>
              <button
                onClick={() => setShowBulkMediaDialog(false)}
                disabled={isGeneratingBulkMedia}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {sceneToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Delete Scene
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete scene "{sceneToDelete.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSceneToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteScene(sceneToDelete.id)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete Scene'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default StoryDetail 