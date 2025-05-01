import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
const StoryInput = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

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
          is_public: false
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Your Story</h1>
      
      <form onSubmit={handleSaveStory} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Story Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your story title"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Story Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            rows={15}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Write your story here..."
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            Word count: {wordCount}/10000
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-blue-800">How it works:</h3>
          <ol className="mt-2 text-sm text-blue-700 list-decimal list-inside space-y-1">
            <li>Enter your story title and content</li>
            <li>Click "Save Story" to save your story</li>
            <li>After saving, you'll be able to segment your story into scenes</li>
            <li>Review and edit scene descriptions</li>
            <li>Create scenes from the descriptions</li>
          </ol>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSaving ? 'Saving Story...' : 'Save Story'}
        </button>
      </form>
    </div>
  )
}

export default StoryInput 