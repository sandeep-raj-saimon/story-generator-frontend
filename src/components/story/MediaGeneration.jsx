import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import VoiceSelectionModal from './VoiceSelectionModal'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL

// Credit costs from backend utils.py
const CREDIT_COSTS = {
  image: 10,  // 10 credits per image
  audio: 0.25,  // 0.25 credits per audio
}

const MediaGeneration = () => {
  const { storyId } = useParams()
  const navigate = useNavigate()
  const [scenes, setScenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState([])
  const [generatingAll, setGeneratingAll] = useState(false)
  const [selectedScenes, setSelectedScenes] = useState([])
  const [generatingSelected, setGeneratingSelected] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [previewType, setPreviewType] = useState('pdf')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [pollingInterval, setPollingInterval] = useState(null)
  const [selectedMediaType, setSelectedMediaType] = useState('generate')
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [previewAudio, setPreviewAudio] = useState(null)
  const [isSelectedAll, setIsSelectedAll] = useState(false)
  const [MAX_SELECTED_SCENES] = useState(3)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [userLanguage, setUserLanguage] = useState(null)
  const [userCredits, setUserCredits] = useState(0)
  const [loadingCredits, setLoadingCredits] = useState(true)

  useEffect(() => {
    fetchUserLanguage()
    fetchUserCredits()
  }, [])

  const fetchUserLanguage = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUserLanguage(userData.language || 'en-US')
      }
    } catch (error) {
      console.error('Error fetching user language:', error)
      setUserLanguage('en-US') // Default to English
    }
  }

  const fetchUserCredits = async () => {
    try {
      setLoadingCredits(true)
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('User credits:', data.credits.credits_remaining)
        setUserCredits(data.credits.credits_remaining || 0)
      } else {
        console.error('Failed to fetch user profile')
        setUserCredits(0)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUserCredits(0)
    } finally {
      setLoadingCredits(false)
    }
  }

  // Calculate credit cost for selected scenes
  const calculateCreditCost = (scenesToCalculate, mediaType = 'generate') => {
    let totalCost = 0
    
    scenesToCalculate.forEach(scene => {
      if (mediaType === 'generate' || mediaType === 'image') {
        totalCost += CREDIT_COSTS.image
      }
      if (mediaType === 'generate' || mediaType === 'audio') {
        // Calculate audio cost based on word count
        const wordCount = scene.content.length
        totalCost += wordCount * CREDIT_COSTS.audio
      }
    })
    
    return Math.ceil(totalCost * 100) / 100 // Round to 2 decimal places
  }

  // Check if user has enough credits for selected scenes
  const hasEnoughCredits = (scenesToCheck, mediaType = 'generate') => {
    const requiredCredits = calculateCreditCost(scenesToCheck, mediaType)
    return userCredits >= requiredCredits
  }

  // Get credit cost display text
  const getCreditCostText = (scenesToCheck, mediaType = 'generate') => {
    const cost = calculateCreditCost(scenesToCheck, mediaType)
    return `${cost} credits`
  }

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
      console.log('Fetched scenes data:', data)
      setScenes(data)
    } catch (err) {
      console.error('Error fetching scenes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateAll = async () => {
    if (selectedMediaType === 'generate') {
      try {
        setErrors([])
        
        // Get all scenes
        const scenesResponse = await fetch(`${API_BASE_URL}/stories/${storyId}/scenes/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        if (!scenesResponse.ok) {
          throw new Error('Failed to fetch scenes')
        }
        const scenes = await scenesResponse.json()
        const sceneStatus = new Map(scenes.map(scene => [scene.id, { image: false, audio: false }]))

        // Check for voice selection before proceeding
        if (!selectedVoice) {
          setIsSelectedAll(true)
          setShowVoiceModal(true)
          return
        }

        // Now set generating to true after voice is confirmed
        setGeneratingAll(true)

        // Generate media for each scene
        const generationPromises = scenes.flatMap(scene => [
          // Image generation for this scene
          fetch(`${API_BASE_URL}/stories/${storyId}/scenes/${scene.id}/generate-image/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json'
            }
          }).then(async response => {
            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(`Failed to generate image for scene ${scene.id}: ${errorData.error || 'Unknown error'}`)
            }
            return { sceneId: scene.id, type: 'image' }
          }),
          
          // Audio generation for this scene
          fetch(`${API_BASE_URL}/stories/${storyId}/scenes/${scene.id}/generate-audio/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ voice_id: selectedVoice })
          }).then(async response => {
            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(`Failed to generate audio for scene ${scene.id}: ${errorData.error || 'Unknown error'}`)
            }
            return { sceneId: scene.id, type: 'audio' }
          })
        ])

        try {
          // Wait for all generation requests to be initiated
          await Promise.all(generationPromises)
          
          // Start polling for each scene's media status
          let pollInterval = setInterval(async () => {
            try {
              const scenePromises = scenes.map(scene =>
                fetch(`${API_BASE_URL}/stories/${storyId}/scenes/${scene.id}/`, {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                  }
                })
              )
              
              const sceneResponses = await Promise.all(scenePromises)
              const sceneData = await Promise.all(sceneResponses.map(r => r.json()))
              
              // Update status for each scene
              sceneData.forEach((scene, index) => {
                const sceneId = scenes[index].id
                const hasImage = scene?.media?.some(m => m.media_type === 'image')
                const hasAudio = scene?.media?.some(m => m.media_type === 'audio')
                
                console.log(`Scene ${sceneId}: hasImage=${hasImage}, hasAudio=${hasAudio}, media count=${scene?.media?.length || 0}`)
                
                if (hasImage) sceneStatus.get(sceneId).image = true
                if (hasAudio) sceneStatus.get(sceneId).audio = true
              })
              
              // Check if all scenes are done
              const allDone = Array.from(sceneStatus.values()).every(status => status.image && status.audio)
              console.log('All scenes done:', allDone)
              if (allDone) {
                console.log('Media generation completed, refreshing scenes...')
                clearInterval(pollInterval)
                setGeneratingAll(false)
                setSelectedVoice(null)
                // Add a small delay to ensure backend has processed all media
                setTimeout(async () => {
                  await fetchScenes()
                  await fetchUserCredits() // Refresh credits after successful generation
                  toast.success('All media generated successfully!')
                }, 2000)
              }
            } catch (err) {
              console.error('Error polling media status:', err)
              clearInterval(pollInterval)
              setGeneratingAll(false)
              setSelectedVoice(null)
            }
          }, 5000)

          // Cleanup polling after 5 minutes
          setTimeout(() => {
            if (pollInterval) {
              clearInterval(pollInterval)
            }
            if (generatingAll) {
              setErrors([{
                id: Date.now(),
                message: 'Media generation timed out',
                sceneId: null
              }])
              setGeneratingAll(false)
              setSelectedVoice(null)
            }
          }, 300000)

        } catch (err) {
          // Handle any errors during the initial generation requests
          setErrors([{
            id: Date.now(),
            message: err.message || 'Failed to initiate media generation',
            sceneId: null
          }])
          console.error('Error initiating media generation:', err)
          setGeneratingAll(false)
          setSelectedVoice(null)
        }

        setIsSelectedAll(false)
      } catch (err) {
        setErrors([{
          id: Date.now(),
          message: err.message || 'Failed to generate media',
          sceneId: null
        }])
        console.error('Error generating media:', err)
        setGeneratingAll(false)
        setIsSelectedAll(false)
        setSelectedVoice(null)
      }
    } else {
      // Handle single media type generation (existing code)
      if (selectedMediaType === 'audio' && !selectedVoice) {
        setShowVoiceModal(true)
        return
      }

      try {
        setGeneratingAll(true)
        setErrors([])
        const sceneStatus = new Map(selectedScenes.map(scene => [scene.id, false]))
        const body = selectedMediaType === 'audio' 
          ? { voice_id: selectedVoice }
          : {}
        
        // Start generation for each scene
        const promises = selectedScenes.map(scene =>
          fetch(`${API_BASE_URL}/stories/${storyId}/scenes/${scene.id}/generate-${selectedMediaType}/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          })
        )

        const responses = await Promise.all(promises)
        const errors = responses.filter(response => !response.ok)
        if (errors.length > 0) {
          const errorMessages = await Promise.all(errors.map(async (error, index) => {
            const errorData = await error.json();
            return {
              id: Date.now() + index,
              message: errorData.error || error.statusText,
              sceneId: selectedScenes[index].id
            };
          }));
          setErrors(errorMessages);
          setGeneratingAll(false);
          setSelectedVoice(null);
          return;
        }

        // Start polling for each scene
        let pollInterval = setInterval(async () => {
          try {
            const scenePromises = selectedScenes.map(scene =>
              fetch(`${API_BASE_URL}/stories/${storyId}/scenes/${scene.id}/`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
              })
            )
            
            const sceneResponses = await Promise.all(scenePromises)
            const sceneData = await Promise.all(sceneResponses.map(r => r.json()))
            
            // Update status for each scene
            sceneData.forEach((scene, index) => {
              const sceneId = selectedScenes[index].id
              if (scene?.media?.some(m => m.media_type === selectedMediaType)) {
                sceneStatus.set(sceneId, true)
              }
            })
            
            // Check if all scenes are done
            const allDone = Array.from(sceneStatus.values()).every(status => status)
            if (allDone) {
              clearInterval(pollInterval)
              setGeneratingAll(false)
              setSelectedScenes([])
              setSelectedVoice(null) // Reset voice selection after generation
              // Add a small delay to ensure backend has processed all media
              setTimeout(async () => {
                await fetchScenes()
                await fetchUserCredits() // Refresh credits after successful generation
                toast.success(`${selectedMediaType.charAt(0).toUpperCase() + selectedMediaType.slice(1)} generation completed!`)
              }, 2000)
            }
          } catch (err) {
            console.error('Error polling media status:', err)
            clearInterval(pollInterval)
            setGeneratingAll(false)
            setSelectedVoice(null) // Reset voice selection on error
          }
        }, 5000) // Poll every 5 seconds

        // Cleanup polling after 5 minutes
        setTimeout(() => {
          clearInterval(pollInterval)
          if (generatingAll) {
            setErrors([{
              id: Date.now(),
              message: `${selectedMediaType} generation timed out`,
              sceneId: null
            }])
            setGeneratingAll(false)
            setSelectedVoice(null) // Reset voice selection on timeout
          }
        }, 300000) // 5 minutes
        
      } catch (err) {
        setErrors([{
          id: Date.now(),
          message: err.message,
          sceneId: null
        }])
        console.error(`Error generating selected ${selectedMediaType}:`, err)
        setGeneratingAll(false)
        setSelectedVoice(null) // Reset voice selection on error
      }
    }
  }

  const handleGenerateSelected = async () => {
    if (selectedMediaType === 'generate') {
      try {
        setErrors([])

        // Check for voice selection before proceeding
        if (!selectedVoice) {
          setShowVoiceModal(true)
          return
        }

        // Now set generating to true after voice is confirmed
        setGeneratingSelected(true)

        // Generate media for each selected scene
        const generationPromises = selectedScenes.flatMap(scene => [
          // Image generation for this scene
          fetch(`${API_BASE_URL}/stories/${storyId}/scenes/${scene.id}/generate-image/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json'
            }
          }).then(async response => {
            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(`Failed to generate image for scene ${scene.id}: ${errorData.error || 'Unknown error'}`)
            }
            return { sceneId: scene.id, type: 'image' }
          }),
          
          // Audio generation for this scene
          fetch(`${API_BASE_URL}/stories/${storyId}/scenes/${scene.id}/generate-audio/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ voice_id: selectedVoice })
          }).then(async response => {
            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(`Failed to generate audio for scene ${scene.id}: ${errorData.error || 'Unknown error'}`)
            }
            return { sceneId: scene.id, type: 'audio' }
          })
        ])

        try {
          // Wait for all generation requests to be initiated
          await Promise.all(generationPromises)
          
          // Start polling for each scene's media status
          const sceneStatus = new Map(selectedScenes.map(scene => [scene.id, { image: false, audio: false }]))
          let pollInterval

          pollInterval = setInterval(async () => {
            try {
              const scenePromises = selectedScenes.map(scene =>
                fetch(`${API_BASE_URL}/stories/${storyId}/scenes/${scene.id}/`, {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                  }
                })
              )
              
              const sceneResponses = await Promise.all(scenePromises)
              const sceneData = await Promise.all(sceneResponses.map(r => r.json()))
              
              // Update status for each scene
              sceneData.forEach((scene, index) => {
                const sceneId = selectedScenes[index].id
                const hasImage = scene?.media?.some(m => m.media_type === 'image')
                const hasAudio = scene?.media?.some(m => m.media_type === 'audio')
                
                if (hasImage) sceneStatus.get(sceneId).image = true
                if (hasAudio) sceneStatus.get(sceneId).audio = true
              })
              
              // Check if all scenes are done
              const allDone = Array.from(sceneStatus.values()).every(status => status.image && status.audio)
              if (allDone) {
                clearInterval(pollInterval)
                setGeneratingSelected(false)
                setSelectedScenes([])
                setSelectedVoice(null)
                // Add a small delay to ensure backend has processed all media
                setTimeout(async () => {
                  await fetchScenes()
                  await fetchUserCredits() // Refresh credits after successful generation
                  toast.success('All media generated successfully!')
                }, 2000)
              }
            } catch (err) {
              console.error('Error polling media status:', err)
              clearInterval(pollInterval)
              setGeneratingSelected(false)
              setSelectedVoice(null)
            }
          }, 5000)

          // Cleanup polling after 5 minutes
          setTimeout(() => {
            if (pollInterval) {
              clearInterval(pollInterval)
            }
            if (generatingSelected) {
              setErrors([{
                id: Date.now(),
                message: 'Media generation timed out',
                sceneId: null
              }])
              setGeneratingSelected(false)
              setSelectedVoice(null)
            }
          }, 300000)

        } catch (err) {
          // Handle any errors during the initial generation requests
          setErrors([{
            id: Date.now(),
            message: err.message || 'Failed to initiate media generation',
            sceneId: null
          }])
          console.error('Error initiating media generation:', err)
          setGeneratingSelected(false)
          setSelectedVoice(null)
        }
      } catch (err) {
        setErrors([{
          id: Date.now(),
          message: err.message || 'Failed to generate media',
          sceneId: null
        }])
        console.error('Error generating media:', err)
        setGeneratingSelected(false)
        setSelectedVoice(null)
      }
    } else {
      // Handle single media type generation (existing code)
      if (selectedMediaType === 'audio' && !selectedVoice) {
        setShowVoiceModal(true)
        return
      }

      try {
        setGeneratingSelected(true)
        setErrors([])
        const sceneStatus = new Map(selectedScenes.map(scene => [scene.id, false]))
        const body = selectedMediaType === 'audio' 
          ? { voice_id: selectedVoice }
          : {}
        
        // Start generation for each scene
        const promises = selectedScenes.map(scene =>
          fetch(`${API_BASE_URL}/stories/${storyId}/scenes/${scene.id}/generate-${selectedMediaType}/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          })
        )

        const responses = await Promise.all(promises)
        const errors = responses.filter(response => !response.ok)
        if (errors.length > 0) {
          const errorMessages = await Promise.all(errors.map(async (error, index) => {
            const errorData = await error.json();
            return {
              id: Date.now() + index,
              message: errorData.error || error.statusText,
              sceneId: selectedScenes[index].id
            };
          }));
          setErrors(errorMessages);
          setGeneratingSelected(false);
          setSelectedVoice(null);
          return;
        }

        // Start polling for each scene
        let pollInterval = setInterval(async () => {
          try {
            const scenePromises = selectedScenes.map(scene =>
              fetch(`${API_BASE_URL}/stories/${storyId}/scenes/${scene.id}/`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
              })
            )
            
            const sceneResponses = await Promise.all(scenePromises)
            const sceneData = await Promise.all(sceneResponses.map(r => r.json()))
            
            // Update status for each scene
            sceneData.forEach((scene, index) => {
              const sceneId = selectedScenes[index].id
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
              setSelectedVoice(null) // Reset voice selection after generation
              // Add a small delay to ensure backend has processed all media
              setTimeout(async () => {
                await fetchScenes()
                await fetchUserCredits() // Refresh credits after successful generation
                toast.success(`${selectedMediaType.charAt(0).toUpperCase() + selectedMediaType.slice(1)} generation completed!`)
              }, 2000)
            }
          } catch (err) {
            console.error('Error polling media status:', err)
            clearInterval(pollInterval)
            setGeneratingSelected(false)
            setSelectedVoice(null) // Reset voice selection on error
          }
        }, 5000) // Poll every 5 seconds

        // Cleanup polling after 5 minutes
        setTimeout(() => {
          clearInterval(pollInterval)
          if (generatingSelected) {
            setErrors([{
              id: Date.now(),
              message: `${selectedMediaType} generation timed out`,
              sceneId: null
            }])
            setGeneratingSelected(false)
            setSelectedVoice(null) // Reset voice selection on timeout
          }
        }, 300000) // 5 minutes
        
      } catch (err) {
        setErrors([{
          id: Date.now(),
          message: err.message,
          sceneId: null
        }])
        console.error(`Error generating selected ${selectedMediaType}:`, err)
        setGeneratingSelected(false)
        setSelectedVoice(null) // Reset voice selection on error
      }
    }
  }

  const handleSceneSelection = (scene) => {
    setSelectedScenes(prev => {
      if (prev.some(s => s.id === scene.id)) {
        return prev.filter(s => s.id !== scene.id)
      } else if (prev.length >= MAX_SELECTED_SCENES) {
        setErrors([{
          id: Date.now(),
          message: `You can only select up to ${MAX_SELECTED_SCENES} scenes at a time`,
          sceneId: null
        }])
        return prev
      } else {
        return [...prev, scene]
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
          setErrors([{
            id: Date.now(),
            message: 'Preview generation timed out',
            sceneId: null
          }])
          setIsGeneratingPreview(false)
        }
      }
    }, 300000) // 5 minutes
  }

  const handlePreview = async (format, subFormat = null) => {
    try {
      setIsGeneratingPreview(true)
      setErrors([])
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
      setErrors([{
        id: Date.now(),
        message: err.message,
        sceneId: null
      }])
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

  // Show loading state during media generation
  if (generatingAll || generatingSelected) {
    const isGeneratingAll = generatingAll
    const scenesToProcess = isGeneratingAll ? scenes : selectedScenes
    const mediaType = selectedMediaType === 'generate' ? 'images and audio' : selectedMediaType === 'image' ? 'images' : 'audio'
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Animated background shapes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative p-6 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Media Generation
              </h2>
            </div>

            {/* Media Generation Loading State */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Generating {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} for Your Story
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We're creating {mediaType} for {scenesToProcess.length} scene{scenesToProcess.length > 1 ? 's' : ''}. 
                  This process usually takes 2-5 minutes depending on the number of scenes.
                </p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6 max-w-md mx-auto">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                </div>
                
                <div className="text-sm text-gray-500 mb-8">
                  <p>• Processing scene content and descriptions</p>
                  <p>• Generating {mediaType} using AI models</p>
                  <p>• Optimizing media quality and format</p>
                  <p>• Preparing for download and export</p>
                </div>

                {/* Scene Progress */}
                <div className="bg-gray-50 rounded-xl p-6 max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Processing {scenesToProcess.length} Scene{scenesToProcess.length > 1 ? 's' : ''}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scenesToProcess.slice(0, 6).map((scene, index) => (
                      <div key={scene.id} className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {scene.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-500">Processing...</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {scenesToProcess.length > 6 && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        +{scenesToProcess.length - 6} more scenes
                      </div>
                    )}
                  </div>
                </div>

                {/* Credit Information */}
                <div className="mt-6 text-xs text-gray-400">
                  <p>Credits will be deducted once generation is complete</p>
                  <p>You can safely navigate away - generation will continue in the background</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Media Generation
              </h2>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-blue-700">
                    You can select up to <span className="font-bold">{MAX_SELECTED_SCENES}</span> scenes at a time
                  </p>
                </div>
                
                {/* Credit Display */}
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <p className="text-sm font-medium text-green-700">
                    {loadingCredits ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading credits...
                      </span>
                    ) : (
                      <span>
                        <span className="font-bold">{userCredits}</span> credits remaining
                        {userCredits < 10 && (
                          <Link 
                            to="/pricing" 
                            className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
                          >
                            Get More Credits
                          </Link>
                        )}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedMediaType}
                onChange={(e) => setSelectedMediaType(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="generate">Generate</option>
                <option value="image">Image</option>
                <option value="audio">Audio</option>
              </select>
              
              {/* Generate All Button */}
              <div className="flex flex-col items-end">
                <button
                  onClick={handleGenerateAll}
                  disabled={generatingAll || !hasEnoughCredits(scenes, selectedMediaType)}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm"
                >
                  {generatingAll ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating All...
                    </>
                  ) : (
                    <>
                      Generate All ({scenes.length} scenes)
                    </>
                  )}
                </button>
                <div className="mt-1 text-xs text-gray-500">
                  Cost: {getCreditCostText(scenes, selectedMediaType)}
                  {!hasEnoughCredits(scenes, selectedMediaType) && (
                    <span className="text-red-500 ml-2">Insufficient credits</span>
                  )}
                </div>
              </div>
              
              {selectedScenes.length > 0 && (
                <div className="flex flex-col items-end">
                  <button
                    onClick={handleGenerateSelected}
                    disabled={generatingSelected || !hasEnoughCredits(selectedScenes, selectedMediaType)}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm"
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
                      <>
                        Generate ({selectedScenes.length}/{MAX_SELECTED_SCENES})
                      </>
                    )}
                  </button>
                  <div className="mt-1 text-xs text-gray-500">
                    Cost: {getCreditCostText(selectedScenes, selectedMediaType)}
                    {!hasEnoughCredits(selectedScenes, selectedMediaType) && (
                      <span className="text-red-500 ml-2">Insufficient credits</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {errors.map((error) => (
              <div
                key={error.id}
                className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-4 flex justify-between items-center"
              >
                <div className="flex-1">
                  <span className="font-medium">Scene {scenes.findIndex(s => s.id === error.sceneId) + 1}: </span>
                  <span>{error.message}</span>
                </div>
                <button 
                  onClick={() => setErrors(errors.filter(e => e.id !== error.id))}
                  className="ml-4 text-red-700 hover:text-red-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </AnimatePresence>

          <div className="space-y-8">
            {scenes.map((scene, index) => {
              const { hasImage, hasAudio } = getMediaStatus(scene)
              const isSelected = selectedScenes.some(s => s.id === scene.id)
              const canSelect = !isSelected && selectedScenes.length < MAX_SELECTED_SCENES
              
              return (
                <div
                  key={scene.id}
                  className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-green-500 shadow-lg' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex">
                    {/* Scene Section */}
                    <div className="w-1/2 p-6 border-r">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSceneSelection(scene)}
                            disabled={!isSelected && !canSelect}
                            className={`h-5 w-5 text-green-600 rounded border-gray-300 transition-all duration-200 ${
                              !isSelected && !canSelect ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-900">Scene {index + 1}: {scene.title}</h3>
                            <div className="flex flex-col items-end">
                              {selectedMediaType === 'generate' && (
                                <span className="text-xs text-gray-400 mt-1">
                                  (Image + Audio)
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 mt-2">{scene.content}</p>
                          <p className="text-gray-500 italic mt-2">{scene.scene_description}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <div
                              className={`p-2 rounded-full ${hasImage ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div
                              className={`p-2 rounded-full ${hasAudio ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 3v4a3 3 0 01-3 3H4V3h6zm0 10v4H4v-4h3a3 3 0 003-3z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-sm text-blue-500 bg-gray-100 px-3 py-1 rounded-full">
                              {Math.ceil(scene.content.length)} characters
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Media Section */}
                    <div className="w-1/2 p-6 bg-gray-50">
                      <div className="grid grid-cols-2 gap-4">
                        {scene.media?.map((media) => (
                          <div
                            key={media.id}
                            className="border rounded-xl overflow-hidden bg-white shadow-sm"
                          >
                            {media.media_type === 'image' ? (
                              <div className="relative">
                                <img 
                                  src={media.url} 
                                  alt={media.description} 
                                  className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => setSelectedImage(media.url)}
                                />
                                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                                  Image
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center h-48 bg-gray-50 p-4">
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
        <AnimatePresence>
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              onClick={() => setSelectedImage(null)}
            >
              <div
                className="relative max-w-4xl max-h-[90vh]"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img 
                  src={selectedImage} 
                  alt="Enlarged view" 
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              </div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex justify-end gap-4 mt-6">
          <div 
            className="relative"
          >
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center shadow-sm"
              data-tour="export-share"
            >
              Export Story
              <svg className={`w-5 h-5 ml-2 text-gray-500 transition-transform duration-200 ${isExportOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <AnimatePresence>
              {isExportOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 overflow-hidden"
                >
                  <div className="py-2">
                    {/* PDF Option */}
                    <button
                      onClick={() => handlePreview('pdf')}
                      disabled={isGeneratingPreview}
                      className="group flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Export story as PDF with images"
                    >
                      <div className="flex items-center flex-1">
                        <div className="p-2 bg-blue-50 rounded-lg mr-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">PDF Format</span>
                          <span className="text-xs text-gray-500">Images with story text</span>
                        </div>
                      </div>
                      {isGeneratingPreview && (
                        <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                    </button>

                    {/* Audio Option */}
                    <button
                      onClick={() => handlePreview('audio')}
                      disabled={isGeneratingPreview}
                      className="group flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Export story as audio narration"
                    >
                      <div className="flex items-center flex-1">
                        <div className="p-2 bg-purple-50 rounded-lg mr-3">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
                          </svg>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Audio Format</span>
                          <span className="text-xs text-gray-500">Narration only</span>
                        </div>
                      </div>
                      {isGeneratingPreview && (
                        <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                    </button>

                    {/* Video Option */}
                    <button
                      onClick={() => handlePreview('video')}
                      disabled={isGeneratingPreview || userLanguage !== 'en-US'}
                      className="group flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Export story as video with images and audio"
                    >
                      
                      <div className="flex items-center flex-1">
                        <div className="p-2 bg-green-50 rounded-lg mr-3">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Video Format</span>
                          <span className="text-xs text-gray-500">Images with narration</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Preview Modal */}
        <AnimatePresence>
          {isPreviewOpen && previewUrl && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            >
              <div
                className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {previewType === 'pdf' ? 'PDF Preview' : 'MP4 Preview'}
                  </h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => window.open(previewUrl, '_blank')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
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
                        navigate(`/profile/content/`)
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
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
                      className="w-full h-[70vh] border-0 rounded-lg"
                      title="PDF Preview"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      className="max-w-full max-h-[70vh] rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Voice Selection Modal */}
        <VoiceSelectionModal
          isOpen={showVoiceModal}
          onClose={() => {
            setShowVoiceModal(false)
            setSelectedVoice(null)
          }}
          onSelect={setSelectedVoice}
          selectedVoice={selectedVoice}
          onSubmit={isSelectedAll ? handleGenerateAll : handleGenerateSelected}
          userLanguage={userLanguage}
        />

        {/* Audio Preview */}
        <AnimatePresence>
          {previewAudio && (
            <div
              className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-4"
            >
              <audio controls src={previewAudio} className="w-full" />
              <button
                onClick={() => {
                  URL.revokeObjectURL(previewAudio)
                  setPreviewAudio(null)
                }}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Close Preview
              </button>
            </div>
          )}
        </AnimatePresence>

        <ToastContainer />
      </div>
    </div>
  )
}

export default MediaGeneration