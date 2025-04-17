import { useState } from 'react'
import SceneEditor from './SceneEditor'

const SceneList = ({ scenes: initialScenes, onScenesUpdate }) => {
  const [scenes, setScenes] = useState(initialScenes)
  const [isCreatingScene, setIsCreatingScene] = useState(false)

  const handleSceneUpdate = (updatedScene) => {
    const updatedScenes = scenes.map(scene => 
      scene.id === updatedScene.id ? updatedScene : scene
    )
    setScenes(updatedScenes)
    onScenesUpdate(updatedScenes)
  }

  const handleCreateScene = async (sceneIndex) => {
    setIsCreatingScene(true)
    try {
      // TODO: Implement API call to create scene
      console.log('Creating scene for segment:', sceneIndex)
      // After successful creation, update the scenes list
    } catch (error) {
      console.error('Failed to create scene:', error)
    } finally {
      setIsCreatingScene(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Scene Management</h2>
        <button
          onClick={() => handleCreateScene(scenes.length)}
          disabled={isCreatingScene}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isCreatingScene ? 'Creating Scene...' : 'Create New Scene'}
        </button>
      </div>

      <div className="space-y-6">
        {scenes.map((scene) => (
          <SceneEditor
            key={scene.id}
            scene={scene}
            onSave={handleSceneUpdate}
            onCancel={() => {}}
          />
        ))}
      </div>
    </div>
  )
}

export default SceneList 