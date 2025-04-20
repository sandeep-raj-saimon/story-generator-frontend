import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const SceneEditor = ({ sceneId, storyId, onSave, onCancel }) => {
  const [scene, setScene] = useState({
    title: '',
    content: '',
    scene_description: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (sceneId) {
      fetchScene()
    }
  }, [sceneId])

  const fetchScene = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/stories/${storyId}/scenes/${sceneId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch scene')
      }

      const data = await response.json()
      setScene(data)
    } catch (err) {
      console.error('Error fetching scene:', err)
      setError('Failed to load scene')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const url = sceneId 
        ? `http://localhost:8000/api/stories/${storyId}/scenes/${sceneId}/`
        : `http://localhost:8000/api/stories/${storyId}/scenes/`
      
      const method = sceneId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(scene)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save scene')
      }

      const data = await response.json()
      onSave(data)
    } catch (err) {
      console.error('Save scene error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setScene(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {sceneId ? 'Edit Scene' : 'Create New Scene'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Scene Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={scene.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Scene Content
          </label>
          <textarea
            id="content"
            name="content"
            value={scene.content}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="scene_description" className="block text-sm font-medium text-gray-700 mb-1">
            Scene Description
          </label>
          <textarea
            id="scene_description"
            name="scene_description"
            value={scene.scene_description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Scene'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SceneEditor 