import React from 'react'

const SceneMedia = ({ scene, index }) => {
  return (
    <div className="mt-4 space-y-4">
      {/* Generated Image */}
      {scene.generated_image && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Generated Image</h4>
          <div className="relative w-full max-w-md">
            <img 
              src={scene.generated_image} 
              alt={`Scene ${index + 1} image`}
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
        </div>
      )}

      {/* Generated Audio */}
      {scene.generated_audio && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Generated Audio</h4>
          <audio 
            controls 
            className="w-full max-w-md"
          >
            <source src={scene.generated_audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  )
}

export default SceneMedia 