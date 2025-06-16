import { createContext, useContext, useState, useEffect } from 'react';

const GuestContext = createContext();

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};

export const GuestProvider = ({ children }) => {
  const [isGuest, setIsGuest] = useState(false);
  const [guestStoriesRead, setGuestStoriesRead] = useState(0);
  const [guestStoriesLimit] = useState(2); // Limit guest users to 2 stories

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsGuest(true);
      // Load guest stories read count from localStorage
      const readCount = localStorage.getItem('guestStoriesRead') || 0;
      setGuestStoriesRead(parseInt(readCount));
    } else {
      setIsGuest(false);
    }
  }, []);

  const incrementStoriesRead = () => {
    if (isGuest) {
      const newCount = guestStoriesRead + 1;
      setGuestStoriesRead(newCount);
      localStorage.setItem('guestStoriesRead', newCount.toString());
    }
  };

  const canReadMoreStories = () => {
    if (!isGuest) return true;
    return guestStoriesRead < guestStoriesLimit;
  };

  const getRemainingStories = () => {
    if (!isGuest) return null;
    return Math.max(0, guestStoriesLimit - guestStoriesRead);
  };

  const resetGuestAccess = () => {
    setGuestStoriesRead(0);
    localStorage.removeItem('guestStoriesRead');
  };

  const value = {
    isGuest,
    guestStoriesRead,
    guestStoriesLimit,
    incrementStoriesRead,
    canReadMoreStories,
    getRemainingStories,
    resetGuestAccess
  };

  return (
    <GuestContext.Provider value={value}>
      {children}
    </GuestContext.Provider>
  );
}; 