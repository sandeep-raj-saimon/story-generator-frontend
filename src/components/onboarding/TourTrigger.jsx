import { useOnboarding } from '../../contexts/OnboardingContext';

const TourTrigger = () => {
  const { triggerTour, resetTour, hasCompletedTour } = useOnboarding();

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      {/* Main Tour Button */}
      <button
        onClick={triggerTour}
        className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-blue-600 hover:to-purple-700"
        title="Take a guided tour of Story Generator"
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {/* Animated pulse effect */}
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm">Take Tour</div>
            <div className="text-xs opacity-90">Learn the features</div>
          </div>
        </div>
        
        {/* Floating notification badge */}
        {!hasCompletedTour && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
            !
          </div>
        )}
      </button>

      {/* Reset Button - Only show on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={resetTour}
          className="bg-white text-gray-600 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300"
          title="Reset tour to show it again"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-medium">Reset Tour</span>
          </div>
        </button>
      </div>

      {/* Status indicator */}
      <div className="bg-white rounded-lg shadow-sm px-3 py-2 border border-gray-200">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${hasCompletedTour ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-xs text-gray-600">
            Tour: {hasCompletedTour ? 'Completed' : 'Available'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TourTrigger; 