import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuest } from '../../contexts/GuestContext';

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const GuestStoryBrowser = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(8);
  const { isGuest, guestStoriesRead, guestStoriesLimit, canReadMoreStories, getRemainingStories } = useGuest();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch public stories without authentication
        const response = await fetch(
          `${API_BASE_URL}/stories/public/?page=${currentPage}&page_size=${pageSize}&search=${searchTerm}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }
        
        const data = await response.json();
        console.log("Public Stories API Response:", data);
        
        // Ensure we're getting an array of stories
        if (Array.isArray(data)) {
          setStories(data);
        } else if (data.results && Array.isArray(data.results)) {
          setStories(data.results);
          setTotalPages(Math.max(1, data.total_pages || 1));
        } else {
          console.error("Unexpected API response format:", data);
          setStories([]);
          setError("Invalid data format received from server");
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching public stories:', error);
        setError('Failed to fetch stories');
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm, pageSize]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Helper function to get media preview
  const getMediaPreview = (story) => {
    if (!story.scenes || story.scenes.length === 0) return null;
    
    // Get the first scene with media
    const firstSceneWithMedia = story.scenes.find(scene => 
      scene.media && scene.media.length > 0
    );
    
    if (firstSceneWithMedia) {
      const imageMedia = firstSceneWithMedia.media.find(m => m.media_type === 'image');
      const audioMedia = firstSceneWithMedia.media.find(m => m.media_type === 'audio');
      
      return { image: imageMedia, audio: audioMedia };
    }
    
    return null;
  };

  // Helper function to count media types
  const getMediaCounts = (story) => {
    if (!story.scenes) return { images: 0, audio: 0 };
    
    let imageCount = 0;
    let audioCount = 0;
    
    story.scenes.forEach(scene => {
      if (scene.media) {
        scene.media.forEach(media => {
          if (media.media_type === 'image') imageCount++;
          if (media.media_type === 'audio') audioCount++;
        });
      }
    });
    
    return { images: imageCount, audio: audioCount };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-indigo-600 animate-ping opacity-75"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center items-center min-h-[60vh]"
            >
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
                <div className="text-red-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
                <p className="text-gray-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Browse Stories
            </h1>
            <p className="mt-2 text-gray-600">Discover amazing stories from our community</p>
            {isGuest && (
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Guest Mode: {guestStoriesRead}/{guestStoriesLimit} stories read
                {getRemainingStories() > 0 && (
                  <span className="ml-2 text-green-600">
                    ({getRemainingStories()} remaining)
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>

        {/* Guest Limit Warning */}
        {isGuest && !canReadMoreStories() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-amber-800">Guest Limit Reached</h3>
                <p className="text-amber-700">
                  You've reached the limit of {guestStoriesLimit} stories for guest users. 
                  <Link to="/signup" className="ml-1 text-amber-800 underline hover:text-amber-900">
                    Sign up for free
                  </Link>
                  {' '}to read unlimited stories and create your own!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stories Grid */}
        <AnimatePresence mode="wait">
          {!loading && stories && stories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16 bg-white rounded-xl shadow-sm"
            >
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Stories Found</h3>
              <p className="text-gray-600">Be the first to create a story!</p>
              <Link
                to="/signup"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Sign Up to Create
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {stories.map((story) => {
                const mediaPreview = getMediaPreview(story);
                const mediaCounts = getMediaCounts(story);
                
                return (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <Link 
                      to={`/guest/story/${story.id}`} 
                      className="block"
                      onClick={() => {
                        if (isGuest && !canReadMoreStories()) {
                          // Prevent navigation if guest limit reached
                          return;
                        }
                      }}
                    >
                      {/* Media Preview */}
                      {mediaPreview?.image && (
                        <div className="relative h-48 bg-gray-100">
                          <img 
                            src={mediaPreview.image.url} 
                            alt={mediaPreview.image.description || 'Story scene'} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                            AI Generated
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold text-gray-800 truncate">
                            {story.title || 'Untitled Story'}
                          </h2>
                          <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-800">
                            {story.status || 'Draft'}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {story.author?.username || 'Anonymous'}
                          </p>
                          <p className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {story.created_at ? new Date(story.created_at).toLocaleDateString() : 'No date'}
                          </p>
                        </div>

                        {/* Media Indicators */}
                        {(mediaCounts.images > 0 || mediaCounts.audio > 0) && (
                          <div className="flex items-center space-x-3 mb-4">
                            {mediaCounts.images > 0 && (
                              <div className="flex items-center text-sm text-green-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                                </svg>
                                {mediaCounts.images} Images
                              </div>
                            )}
                            {mediaCounts.audio > 0 && (
                              <div className="flex items-center text-sm text-blue-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
                                </svg>
                                {mediaCounts.audio} Audio
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex justify-end">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                            Read Story
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-8 space-x-2"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GuestStoryBrowser; 