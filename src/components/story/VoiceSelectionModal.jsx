import React, { useRef } from 'react'

const AVAILABLE_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', "labels": {
                "accent": "american",
                "description": "calm",
                "age": "young",
                "gender": "female",
                "use_case": "narration"
            } },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', "labels": {
                "accent": "american",
                "description": "deep",
                "age": "young",
                "gender": "male",
                "use_case": "narration"
            } },
  { id: 'flq6f7yk4E4fJM5XTYuZ', name: 'Michael', "labels": {
                "accent": "american",
                "description": "calm",
                "age": "old",
                "gender": "male",
                "use_case": "narration"
            } },
]

const VoiceSelectionModal = ({ isOpen, onClose, onSelect, selectedVoice, onSubmit }) => {
  const currentAudio = useRef(null)

  const playAudio = (voiceName) => {
    // Stop any currently playing audio
    if (currentAudio.current) {
      currentAudio.current.pause()
      currentAudio.current.currentTime = 0
    }

    // Create and play new audio
    const audio = new Audio(`https://story-generation-voices.s3.ap-south-1.amazonaws.com/${voiceName.toLowerCase()}.mp3`)
    currentAudio.current = audio
    audio.play()
  }

  // Cleanup audio when modal closes
  const handleClose = () => {
    if (currentAudio.current) {
      currentAudio.current.pause()
      currentAudio.current.currentTime = 0
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Select a Voice
        </h3>
        
        <div className="space-y-4">
          {AVAILABLE_VOICES.map((voice) => (
            <div
              key={voice.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedVoice === voice.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => onSelect(voice.id)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={selectedVoice === voice.id}
                    onChange={(e) => {
                      e.stopPropagation()
                      onSelect(voice.id)
                    }}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{voice.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(voice.labels).map(([key, value]) => (
                          <span 
                            key={key}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        playAudio(voice.name)
                      }}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div> 
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => { console.log(selectedVoice); onSubmit(onSubmit); handleClose() }}
            disabled={!selectedVoice}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Audio
          </button>
        </div>
      </div>
    </div>
  )
}

export default VoiceSelectionModal 