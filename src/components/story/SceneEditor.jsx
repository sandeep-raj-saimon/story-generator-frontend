import { useState } from 'react'

const SceneEditor = ({ scene, onSave, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedDescription, setEditedDescription] = useState(scene.description)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    onSave({
      ...scene,
      description: editedDescription
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedDescription(scene.description)
    setIsEditing(false)
    onCancel()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Scene {scene.order}
        </h3>
        <div className="flex space-x-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter scene description..."
        />
      ) : (
        <p className="text-gray-600">{scene.description}</p>
      )}

      {scene.imageUrl && (
        <div className="mt-4">
          <img
            src={scene.imageUrl}
            alt={`Scene ${scene.order}`}
            className="rounded-lg max-w-full h-auto"
          />
        </div>
      )}

      {scene.audioUrl && (
        <div className="mt-4">
          <audio controls className="w-full">
            <source src={scene.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  )
}

export default SceneEditor 