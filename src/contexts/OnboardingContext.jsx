import { createContext, useContext, useState, useEffect } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  // Check if user is first time on component mount
  useEffect(() => {
    const checkFirstTimeUser = () => {
      // Check localStorage for tour completion status
      const tourCompleted = localStorage.getItem('storyGenerator_tourCompleted');
      const userRegistrationTime = localStorage.getItem('storyGenerator_userRegistered');
      
      if (!tourCompleted && userRegistrationTime) {
        // If tour hasn't been completed and user has registered, show tour
        setIsFirstTimeUser(true);
      } else if (!tourCompleted && !userRegistrationTime) {
        // If no registration time is set, this might be a new user
        // You can set this when user completes registration
        setIsFirstTimeUser(false);
      } else {
        setIsFirstTimeUser(false);
        setHasCompletedTour(true);
      }
    };

    checkFirstTimeUser();
  }, []);

  // Mark user as registered (call this after successful registration)
  const markUserAsRegistered = () => {
    localStorage.setItem('storyGenerator_userRegistered', Date.now().toString());
    setIsFirstTimeUser(true);
  };

  // Mark tour as completed
  const completeTour = () => {
    localStorage.setItem('storyGenerator_tourCompleted', Date.now().toString());
    setIsFirstTimeUser(false);
    setHasCompletedTour(true);
  };

  // Reset tour (for testing or admin purposes)
  const resetTour = () => {
    localStorage.removeItem('storyGenerator_tourCompleted');
    localStorage.removeItem('storyGenerator_userRegistered');
    setIsFirstTimeUser(false);
    setHasCompletedTour(false);
  };

  // Manually trigger tour
  const triggerTour = () => {
    setIsFirstTimeUser(true);
  };

  const value = {
    isFirstTimeUser,
    hasCompletedTour,
    markUserAsRegistered,
    completeTour,
    resetTour,
    triggerTour
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}; 