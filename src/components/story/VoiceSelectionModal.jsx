import React, { useRef } from 'react'

const AVAILABLE_VOICES = [{'id': 's3://voice-cloning-zero-shot/13ff8c72-7e5a-471e-b3fc-0e708ea4046c/original/manifest.json', 'name': 'Pravin Narrative', 'sample': 'https://parrot-samples.s3.amazonaws.com/v3-samples/Hindi+Pravin+Narrative.wav', 'accent': 'indian', 'age': null, 'gender': 'male', 'language': 'Hindi', 'language_code': 'hi', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/29c3fc22-d566-492c-b38a-5797862dc1ee/original/manifest.json', 'name': 'Sachin Conversational', 'sample': 'https://parrot-samples.s3.amazonaws.com/v3-samples/Hindi+Sachin+Conversational.wav', 'accent': 'indian', 'age': null, 'gender': 'male', 'language': 'Hindi', 'language_code': 'hi', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/29dd9a52-bd32-4a6e-bff1-bbb98dcc286a/original/manifest.json', 'name': 'Miles', 'sample': 'https://s3.amazonaws.com/voice-cloning-zero-shot/c5bdeb8e-a99e-413d-8937-ad8da3a841b6/original/original.wav', 'accent': 'american', 'age': null, 'gender': 'male', 'language': 'English', 'language_code': 'en-US', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/373e9621-167b-4efb-8c62-3167fe5b521d/original/manifest.json', 'name': 'Fritz', 'sample': 'https://s3.amazonaws.com/voice-cloning-zero-shot/504e7b18-6c95-432e-891c-73df0e2b5154/original/original.wav', 'accent': 'american', 'age': null, 'gender': 'male', 'language': 'English', 'language_code': 'en-US', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/610e98bb-5c9c-4a98-b390-94d539a77996/original/manifest.json', 'name': 'Anuj Narrative', 'sample': 'https://parrot-samples.s3.amazonaws.com/v3-samples/Hindi+Anuj+Narrative.wav', 'accent': 'indian', 'age': null, 'gender': 'male', 'language': 'Hindi', 'language_code': 'hi', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/65977f5e-a22a-4b36-861b-ecede19bdd65/original/manifest.json', 'name': 'Arsenio', 'sample': 'https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Arsenio_Sample.wav', 'accent': 'american', 'age': null, 'gender': 'male', 'language': 'English', 'language_code': 'en-US', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/677a4ae3-252f-476e-85ce-eeed68e85951/original/manifest.json', 'name': 'Timo', 'sample': 'https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Timo_Sample.wav', 'accent': 'american', 'age': null, 'gender': 'male', 'language': 'English', 'language_code': 'en-US', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/6f3decaf-f64f-414a-b16a-f8a1492d28a6/original/manifest.json', 'name': 'Anuj Conversational', 'sample': 'https://parrot-samples.s3.amazonaws.com/v3-samples/Hindi+Anuj+Conversational.wav', 'accent': 'indian', 'age': null, 'gender': 'male', 'language': 'Hindi', 'language_code': 'hi', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/71cdb799-1e03-41c6-8a05-f7cd55134b0b/original/manifest.json', 'name': 'Briggs', 'sample': 'https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Briggs_Sample.wav', 'accent': 'american', 'age': null, 'gender': 'male', 'language': 'English', 'language_code': 'en-US', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/8049484f-3055-42b8-ab13-25ccf0475710/original/manifest.json', 'name': 'Meenakshi Conversational', 'sample': 'https://parrot-samples.s3.amazonaws.com/v3-samples/Hindi+Maanekshi+Conversational.wav', 'accent': 'indian', 'age': null, 'gender': 'female', 'language': 'Hindi', 'language_code': 'hi', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/831bd330-85c6-4333-b2b4-10c476ea3491/original/manifest.json', 'name': 'Nia', 'sample': 'https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Nia_Sample.wav', 'accent': 'american', 'age': null, 'gender': 'female', 'language': 'English', 'language_code': 'en-US', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/adb83b67-8d75-48ff-ad4d-a0840d231ef1/original/manifest.json', 'name': 'Inara', 'sample': 'https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Inara_Sample.wav', 'accent': 'american', 'age': null, 'gender': 'female', 'language': 'English', 'language_code': 'en-US', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/b27bc13e-996f-4841-b584-4d35801aea98/original/manifest.json', 'name': 'Dexter', 'sample': 'https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Dexter_Sample.wav', 'accent': 'american', 'age': null, 'gender': 'male', 'language': 'English', 'language_code': 'en-US', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/baf1ef41-36b6-428c-9bdf-50ba54682bd8/original/manifest.json', 'name': 'Angelo', 'sample': 'https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Angelo_Sample.wav', 'accent': 'american', 'age': null, 'gender': 'male', 'language': 'English', 'language_code': 'en-US', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/bc3aac42-8e8f-43e2-8919-540f817a0ac4/original/manifest.json', 'name': 'Meenakshi Narrative', 'sample': 'https://parrot-samples.s3.amazonaws.com/v3-samples/Hindi+Maanekshi+Narrative.wav', 'accent': 'indian', 'age': null, 'gender': 'female', 'language': 'Hindi', 'language_code': 'hi', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/c14e50f2-c5e3-47d1-8c45-fa4b67803d19/original/manifest.json', 'name': 'Mitch', 'sample': 'https://voice-cloning-zero-shot.s3.amazonaws.com/219d633d-2ec9-4d6a-992c-62b43c73646a/original/original.wav', 'accent': 'australian', 'age': null, 'gender': 'male', 'language': 'English', 'language_code': 'en-US', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/e4749094-943d-4751-82e0-c13930e0a659/original/manifest.json', 'name': 'Pravin Conversational', 'sample': 'https://parrot-samples.s3.amazonaws.com/v3-samples/Hindi+Pravin+Conversational.wav', 'accent': 'indian', 'age': null, 'gender': 'male', 'language': 'Hindi', 'language_code': 'hi', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}, {'id': 's3://voice-cloning-zero-shot/f0c4da39-8030-474b-ae88-e76312b98ae1/original/manifest.json', 'name': 'Sachin Narrative', 'sample': 'https://parrot-samples.s3.amazonaws.com/v3-samples/Hindi+Cachin+Narrative.wav', 'accent': 'indian', 'age': null, 'gender': 'male', 'language': 'Hindi', 'language_code': 'hi', 'loudness': null, 'style': null, 'tempo': null, 'texture': null, 'is_cloned': false, 'voice_engine': 'PlayDialog'}]

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL

const VoiceSelectionModal = ({ isOpen, onClose, onSelect, selectedVoice, onSubmit, userLanguage }) => {
  const currentAudio = useRef(null)

  // Filter voices based on user's language preference
  const getFilteredVoices = () => {
    if (userLanguage === 'hi') {
      // Show Hindi voices for Hindi users
      return AVAILABLE_VOICES.filter(voice => voice.language === 'Hindi')
    } else {
      // Show English voices for others
      return AVAILABLE_VOICES.filter(voice => voice.language === 'English')
    }
  }

  const playAudio = (sample) => {
    // Stop any currently playing audio
    if (currentAudio.current) {
      currentAudio.current.pause()
      currentAudio.current.currentTime = 0
    }

    // Create and play new audio
    const audio = new Audio(sample)
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

  const filteredVoices = getFilteredVoices()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Select a Voice
          <span className="ml-2 text-sm text-gray-500">
            ({userLanguage === 'hi' ? 'Hindi' : 'English'} voices)
          </span>
        </h3>
        
        <div className="space-y-4">
          {filteredVoices.map((voice) => (
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
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {voice.language}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {voice.accent}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {voice.gender}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        playAudio(voice.sample)
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