import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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
  const [previewType, setPreviewType] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)

  useEffect(() => {
    fetchScenes()
  }, [storyId])

  const fetchScenes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8000/api/stories/${storyId}/scenes/`, {
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
    try {
      setGeneratingAll(true)
      const response = await fetch(`http://localhost:8000/api/stories/${storyId}/generate-bulk-image/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to generate all media')
      }
      await fetchScenes()
    } catch (err) {
      setError('Failed to generate all media')
      console.error('Error generating all media:', err)
    } finally {
      setGeneratingAll(false)
    }
  }

  const handleGenerateSelected = async () => {
    try {
      setGeneratingSelected(true)
      for (const sceneId of selectedScenes) {
        const response = await fetch(`http://localhost:8000/api/stories/${storyId}/scenes/${sceneId}/generate-image/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        if (!response.ok) {
          throw new Error(`Failed to generate media for scene ${sceneId}`)
        }
      }
      await fetchScenes()
      setSelectedScenes([])
    } catch (err) {
      setError('Failed to generate selected media')
      console.error('Error generating selected media:', err)
    } finally {
      setGeneratingSelected(false)
    }
  }

  const handleSceneSelection = (sceneId) => {
    setSelectedScenes(prev => 
      prev.includes(sceneId) 
        ? prev.filter(id => id !== sceneId)
        : [...prev, sceneId]
    )
  }

  const getMediaStatus = (scene) => {
    const hasImage = scene.media?.some(m => m.media_type === 'image')
    const hasAudio = scene.media?.some(m => m.media_type === 'audio')
    
    return {
      hasImage,
      hasAudio
    }
  }

  const handlePreview = async (format, subFormat = null) => {
    try {
      setIsGeneratingPreview(true)
      setError(null)
      
      const endpoint = subFormat 
        ? `/stories/${storyId}/preview/${format}/${subFormat}/`
        : `/stories/${storyId}/preview/${format}/`
      
      const response = await fetch(`http://localhost:8000/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to generate preview for ${format}`)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      setPreviewType(format)
      setIsPreviewOpen(true)
      setIsExportOpen(false)
    } catch (err) {
      setError(`Failed to generate preview for ${format}`)
      console.error(`Error generating preview for ${format}:`, err)
    } finally {
      setIsGeneratingPreview(false)
    }
  }

  const handleExport = async () => {
    try {
      const endpoint = previewType === 'mp4' 
        ? `/stories/${storyId}/export/${previewType}/${previewType === 'mp4' ? 'video' : 'audio'}/`
        : `/stories/${storyId}/export/${previewType}/`
      
      const response = await fetch(`http://localhost:8000/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to export as ${previewType}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `story-${storyId}.${previewType}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(`Failed to export as ${previewType}`)
      console.error(`Error exporting as ${previewType}:`, err)
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
          <h2 className="text-2xl font-bold">Media Generation</h2>
          <div className="flex gap-4">
            <button
              onClick={handleGenerateAll}
              disabled={generatingAll}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {generatingAll ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate All Media'
              )}
            </button>
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
                  `Generate Selected (${selectedScenes.length})`
                )}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {scenes.map((scene, index) => {
            const { hasImage, hasAudio } = getMediaStatus(scene)
            
            return (
              <div key={scene.id} className="border rounded-lg overflow-hidden">
                <div className="flex">
                  {/* Scene Section */}
                  <div className="w-1/2 p-4 border-r">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedScenes.includes(scene.id)}
                          onChange={() => handleSceneSelection(scene.id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
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
                            <div className="flex items-center justify-center h-48 bg-gray-100 rounded">
                              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 3v4a3 3 0 01-3 3H4V3h6zm0 10v4H4v-4h3a3 3 0 003-3z" clipRule="evenodd" />
                              </svg>
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
                          onClick={() => handlePreview('mp4', 'audio')}
                          disabled={isGeneratingPreview}
                          className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
                          </svg>
                          Audio Only
                        </button>
                        <button
                          onClick={() => handlePreview('mp4', 'video')}
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
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </button>
                <button
                  onClick={() => {
                    setIsPreviewOpen(false)
                    setPreviewUrl(null)
                    setPreviewType(null)
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
    </div>
  )
}

export default MediaGeneration