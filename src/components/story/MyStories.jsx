import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
const MyStories = () => {
  const [stories, setStories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stories/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch stories')
      }

      const data = await response.json()
      setStories(data)
    } catch (err) {
      console.error('Error fetching stories:', err)
      setError('Failed to load stories')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading stories...</div>
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Stories</h1>
      
      {stories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't created any stories yet.</p>
          <Link
            to="/create"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Your First Story
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {stories.map((story) => (
            <div key={story.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Link
                to={`/stories/${story.id}`}
                className="flex-1"
              >
                <h2 className="text-xl font-semibold text-gray-800">{story.title}</h2>
              </Link>
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const response = await fetch(`${API_BASE_URL}/stories/${story.id}/`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                      },
                      body: JSON.stringify({
                        is_active: false
                      })
                    });
                    if (response.ok) {
                      // Refresh stories list after deletion
                      fetchStories();
                    } else {
                      throw new Error('Failed to delete story');
                    }
                  } catch (err) {
                    console.error('Error deleting story:', err);
                    setError('Failed to delete story');
                  }
                }}
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyStories 