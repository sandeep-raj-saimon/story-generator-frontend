import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import VoiceSelectionModal from './VoiceSelectionModal'
const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
const MediaGeneration = () => {
  const { storyId } = useParams()
  const navigate = useNavigate()
  const [scenes, setScenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [generatingAll, setGeneratingAll] = useState(false)
  const [selectedScenes, setSelectedScenes] = useState([])
  const [generatingSelected, setGeneratingSelected] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isMp4SubmenuOpen, setIsMp4SubmenuOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [previewType, setPreviewType] = useState('pdf')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [pollingInterval, setPollingInterval] = useState(null)
  const [selectedMediaType, setSelectedMediaType] = useState('image')
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [previewAudio, setPreviewAudio] = useState(null)
  const [isSelectedAll, setIsSelectedAll] = useState(false)
  const MAX_SELECTED_SCENES = 3

  useEffect(() => {
    fetchScenes()
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [storyId])

  const fetchScenes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/stories/${storyId}/scenes/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch scenes')
      }
      const data = await response.json()
      setScenes(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch scenes')
      console.error('Error fetching scenes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateAll = async () => {
    if (selectedMediaType === 'audio' && !showVoiceModal) {
      setIsSelectedAll(true)
      setShowVoiceModal(true)
      return
    }

    try {
      setGeneratingAll(true)
      const body = selectedMediaType === 'audio' ? { voice_id: selectedVoice } : {}
      const response = await fetch(`${API_BASE_URL}/stories/${storyId}/generate-bulk-${selectedMediaType}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      if (!response.ok) {
        throw new Error(`Failed to generate all ${selectedMediaType}`)
      }

      // Get all scene IDs
      const scenesResponse = await fetch(`${API_BASE_URL}/stories/${storyId}/scenes/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      if (!scenesResponse.ok) {
        throw new Error('Failed to fetch scenes')
      }
      const scenes = await scenesResponse.json()
      let sceneIds = scenes.map(scene => scene.id)
      const sceneStatus = new Map(sceneIds.map(id => [id, false]))

      // Start polling for each scene
      const pollInterval = setInterval(async () => {
        try {
          const scenePromises = sceneIds.map(sceneId =>
            fetch(`${API_BASE_URL}/stories/${storyId}/scenes/${sceneId}/`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
              }
            })
          )
          
          const sceneResponses = await Promise.all(scenePromises)
          const sceneData = await Promise.all(sceneResponses.map(r => r.json()))
          
          // Update status for each scene
          sceneData.forEach((scene, index) => {
            const sceneId = sceneIds[index]
            if (scene?.media?.some(m => m.media_type === selectedMediaType)) {
              sceneStatus.set(sceneId, true)
              // remove the sceneId from the sceneIds array when the media is generated
              sceneIds = sceneIds.filter(id => id !== sceneId)
            }
          })
          
          // Check if all scenes are done
          const allDone = Array.from(sceneStatus.values()).every(status => status)
          if (allDone) {
            clearInterval(pollInterval)
            setGeneratingAll(false)
            await fetchScenes()
          }
        } catch (err) {
          console.error('Error polling media status:', err)
          clearInterval(pollInterval)
          setGeneratingAll(false)
        }
      }, 5000) // Poll every 5 seconds

      // Cleanup polling after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval)
        if (generatingAll) {
          setError(`${selectedMediaType} generation timed out`)
          setGeneratingAll(false)
        }
      }, 300000) // 5 minutes
      setIsSelectedAll(false)
    } catch (err) {
      setError(`Failed to generate all ${selectedMediaType}`)
      console.error(`Error generating all ${selectedMediaType}:`, err)
      setGeneratingAll(false)
      setIsSelectedAll(false)
    }
  }

  const handleGenerateSelected = async () => {
    if (selectedMediaType === 'audio' && !showVoiceModal) {
      setShowVoiceModal(true)
      return
    }

    try {
      setGeneratingSelected(true)
      const sceneStatus = new Map(selectedScenes.map(id => [id, false]))
      const body = selectedMediaType === 'audio' ? { voice_id: selectedVoice } : {}
      // Start generation for each scene
      const promises = []
      // if(sele)
      for (const sceneId of selectedScenes) {
        promises.push(
          fetch(`${API_BASE_URL}/stories/${storyId}/scenes/${sceneId}/generate-${selectedMediaType}/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          })
        )
      }
      const responses = await Promise.all(promises)
      for (const response of responses) {
        if (!response.ok) {
          throw new Error(`Failed to generate ${selectedMediaType} for scene`)
        }
      }

      // Start polling for each scene
      const pollInterval = setInterval(async () => {
        try {
          const scenePromises = selectedScenes.map(sceneId =>
            fetch(`${API_BASE_URL}/stories/${storyId}/scenes/${sceneId}/`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
              }
            })
          )
          
          const sceneResponses = await Promise.all(scenePromises)
          const sceneData = await Promise.all(sceneResponses.map(r => r.json()))
          
          // Update status for each scene
          sceneData.forEach((scene, index) => {
            const sceneId = selectedScenes[index]
            if (scene?.media?.some(m => m.media_type === selectedMediaType)) {
              sceneStatus.set(sceneId, true)
            }
          })
          
          // Check if all scenes are done
          const allDone = Array.from(sceneStatus.values()).every(status => status)
          if (allDone) {
            clearInterval(pollInterval)
            setGeneratingSelected(false)
            setSelectedScenes([])
            await fetchScenes()
          }
        } catch (err) {
          console.error('Error polling media status:', err)
          clearInterval(pollInterval)
          setGeneratingSelected(false)
        }
      }, 5000) // Poll every 5 seconds

      // Cleanup polling after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval)
        if (generatingSelected) {
          setError(`${selectedMediaType} generation timed out`)
          setGeneratingSelected(false)
        }
      }, 300000) // 5 minutes
      
    } catch (err) {
      setError(`Failed to generate selected ${selectedMediaType}`)
      console.error(`Error generating selected ${selectedMediaType}:`, err)
      setGeneratingSelected(false)
    }
  }

  const handleSceneSelection = (sceneId) => {
    setSelectedScenes(prev => {
      if (prev.includes(sceneId)) {
        return prev.filter(id => id !== sceneId)
      } else if (prev.length >= MAX_SELECTED_SCENES) {
        setError(`You can only select up to ${MAX_SELECTED_SCENES} scenes at a time`)
        return prev
      } else {
        return [...prev, sceneId]
      }
    })
  }

  const getMediaStatus = (scene) => {
    const hasImage = scene.media?.some(m => m.media_type === 'image')
    const hasAudio = scene.media?.some(m => m.media_type === 'audio')
    
    return {
      hasImage,
      hasAudio
    }
  }

  const startPolling = (format) => {
    const interval = setInterval(async () => {
      try {

        const response = await fetch(`${API_BASE_URL}/stories/${storyId}/preview-status/${format}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.status === 'complete') {
            setPreviewUrl(data.url)
            setPreviewType(data.format)
            setIsPreviewOpen(true)
            setIsGeneratingPreview(false)
            clearInterval(interval)
            setPollingInterval(null)
          }
        }
      } catch (err) {
        console.error('Error polling preview status:', err)
        clearInterval(interval)
        setPollingInterval(null)
      }
    }, 5000) // Poll every 5 seconds
    
    setPollingInterval(interval)

    // Cleanup polling after 5 minutes
    setTimeout(() => {
      if (interval === pollingInterval) {
        clearInterval(interval)
        setPollingInterval(null)
        if (isGeneratingPreview) {
          setError('Preview generation timed out')
          setIsGeneratingPreview(false)
        }
      }
    }, 300000) // 5 minutes
  }

  const handlePreview = async (format, subFormat = null) => {
    try {
      setIsGeneratingPreview(true)
      setError(null)
      setPreviewType(format)

      const endpoint = subFormat 
        ? `/stories/${storyId}/preview/${format}/${subFormat}/`
        : `/stories/${storyId}/preview-${format}/`
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      startPolling(format)
    } catch (err) {
      setError(err.message)
      console.error(`Error generating preview for ${format}:`, err)
      setIsGeneratingPreview(false)
    }
  }


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Media Generation</h2>
            <div className="mt-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-red-700">
                You can select up to <span className="font-bold">{MAX_SELECTED_SCENES}</span> scenes at a time for media generation
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedMediaType}
              onChange={(e) => setSelectedMediaType(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="image">Image</option>
              <option value="audio">Audio</option>
            </select>
            {selectedScenes.length > 0 && (
              <button
                onClick={handleGenerateSelected}
                disabled={generatingSelected}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {generatingSelected ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  `Generate ${selectedMediaType.charAt(0).toUpperCase() + selectedMediaType.slice(1)} (${selectedScenes.length}/${MAX_SELECTED_SCENES})`
                )}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="space-y-8">
          {scenes.map((scene, index) => {
            const { hasImage, hasAudio } = getMediaStatus(scene)
            const isSelected = selectedScenes.includes(scene.id)
            const canSelect = !isSelected && selectedScenes.length < MAX_SELECTED_SCENES
            
            return (
              <div key={scene.id} className={`border rounded-lg overflow-hidden ${isSelected ? 'ring-2 ring-green-500' : ''}`}>
                <div className="flex">
                  {/* Scene Section */}
                  <div className="w-1/2 p-4 border-r">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSceneSelection(scene.id)}
                          disabled={!isSelected && !canSelect}
                          className={`h-4 w-4 text-blue-600 rounded border-gray-300 ${!isSelected && !canSelect ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium">Scene {index + 1}: {scene.title}</h3>
                        <p className="text-gray-600 mt-1">{scene.content}</p>
                        <p className="text-gray-500 italic mt-1">{scene.scene_description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <svg className={`w-5 h-5 ${hasImage ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          <svg className={`w-5 h-5 ${hasAudio ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 3v4a3 3 0 01-3 3H4V3h6zm0 10v4H4v-4h3a3 3 0 003-3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media Section */}
                  <div className="w-1/2 p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                      {scene.media?.map((media) => (
                        <div key={media.id} className="border rounded p-2">
                          {media.media_type === 'image' ? (
                            <div className="relative">
                              <img 
                                src={media.url} 
                                alt={media.description} 
                                className="w-full h-48 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setSelectedImage(media.url)}
                              />
                              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                Image
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded p-4">
                              <svg className="w-12 h-12 text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 3v4a3 3 0 01-3 3H4V3h6zm0 10v4H4v-4h3a3 3 0 003-3z" clipRule="evenodd" />
                              </svg>
                              <audio 
                                controls 
                                className="w-full mt-2"
                                src={media.url}
                              >
                                Your browser does not support the audio element.
                              </audio>
                              <div className="text-xs text-gray-500 mt-1">
                                Audio
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={selectedImage} 
              alt="Enlarged view" 
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4 mt-6">
        <div className="relative">
          <button
            onClick={() => setIsExportOpen(!isExportOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Preview & Export
            <svg className={`w-5 h-5 ml-2 text-gray-500 transition-transform duration-200 ${isExportOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExportOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  onClick={() => handlePreview('pdf')}
                  disabled={isGeneratingPreview}
                  className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Preview PDF
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsMp4SubmenuOpen(!isMp4SubmenuOpen)}
                    disabled={isGeneratingPreview}
                    className="group flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Preview MP4
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 group-hover:text-gray-500 transition-transform duration-200 ${isMp4SubmenuOpen ? 'transform rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {isMp4SubmenuOpen && (
                    <div className="absolute left-full top-0 mt-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handlePreview('audio')}
                          disabled={isGeneratingPreview}
                          className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
                          </svg>
                          Audio Only
                        </button>
                        <button
                          onClick={() => handlePreview('video')}
                          disabled={isGeneratingPreview}
                          className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Video with Audio
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(`/stories/${storyId}`)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Story
        </button>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {previewType === 'pdf' ? 'PDF Preview' : 'MP4 Preview'}
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => window.open(previewUrl, '_blank')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
               
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={() => {
                    setIsPreviewOpen(false)
                    setPreviewUrl(null)
                    setPreviewType('pdf')
                    navigate(`/generated-content/`)
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              {previewType === 'pdf' ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-[70vh] border-0"
                  title="PDF Preview"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="max-w-full max-h-[70vh]"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Voice Selection Modal */}
      <VoiceSelectionModal
        isOpen={showVoiceModal}
        onClose={() => {
          setShowVoiceModal(false)
          setSelectedVoice(null)
          setSelectedScenes([])
        }}
        onSelect={setSelectedVoice}
        selectedVoice={selectedVoice}
        onSubmit={isSelectedAll ? handleGenerateAll : handleGenerateSelected}
      />

      {/* Audio Preview */}
      {previewAudio && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4">
          <audio controls src={previewAudio} className="w-full" />
          <button
            onClick={() => {
              URL.revokeObjectURL(previewAudio)
              setPreviewAudio(null)
            }}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Close Preview
          </button>
        </div>
      )}
    </div>
  )
}

export default MediaGeneration