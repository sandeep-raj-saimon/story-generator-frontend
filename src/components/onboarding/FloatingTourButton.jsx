import { useState } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const FloatingTourButton = () => {
  const { triggerTour, resetTour, hasCompletedTour } = useOnboarding();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main floating tour button */}
      <div className="relative">
        <button
          onClick={triggerTour}
          className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:from-blue-600 hover:to-purple-700 flex items-center justify-center"
          title="Take a guided tour of Story Generator"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Main icon */}
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          
          {/* Animated pulse effect */}
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
          
          {/* Notification badge for new users */}
          {!hasCompletedTour && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce font-bold">
              !
            </div>
          )}
        </button>

        {/* Expanded tooltip */}
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-3 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 transform transition-all duration-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Guided Tour</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {hasCompletedTour 
                    ? "Take the tour again to refresh your memory"
                    : "Learn how to use Story Generator features"
                  }
                </p>
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={triggerTour}
                    className="flex-1 bg-blue-500 text-white text-xs px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Start Tour
                  </button>
                  {hasCompletedTour && (
                    <button
                      onClick={resetTour}
                      className="flex-1 bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Arrow pointing to button */}
            <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="mt-3 bg-white rounded-lg shadow-sm px-3 py-2 border border-gray-200">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${hasCompletedTour ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-xs text-gray-600">
            {hasCompletedTour ? 'Tour completed' : 'Tour available'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FloatingTourButton; 