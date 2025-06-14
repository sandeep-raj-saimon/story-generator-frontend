import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const StoryView = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRevision, setActiveRevision] = useState(0);

  useEffect(() => {
    fetchStoryData();
  }, [id]);

  const fetchStoryData = async () => {
    try {
      setLoading(true);
      
      // Fetch story details
      const storyResponse = await fetch(`${API_BASE_URL}/stories/${id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!storyResponse.ok) {
        throw new Error('Failed to fetch story');
      }

      const storyData = await storyResponse.json();
      setStory(storyData);

      // Fetch story revisions
      const revisionsResponse = await fetch(`${API_BASE_URL}/stories/${id}/revisions/current/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (revisionsResponse.ok) {
        const revisionsData = await revisionsResponse.json();
        setRevisions(revisionsData);
      }

    } catch (err) {
      console.error('Error fetching story data:', err);
      setError('Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMediaType = (url) => {
    if (url.includes('.mp4') || url.includes('.avi') || url.includes('.mov')) {
      return 'video';
    } else if (url.includes('.mp3') || url.includes('.wav') || url.includes('.m4a')) {
      return 'audio';
    } else if (url.includes('.pdf')) {
      return 'pdf';
    } else {
      return 'image';
    }
  };

  const getMediaIcon = (mediaType) => {
    switch (mediaType) {
      case 'video':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'audio':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        );
      case 'pdf':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const renderMedia = (mediaUrl, mediaType) => {
    if (!mediaUrl) return null;

    switch (mediaType) {
      case 'video':
        return (
          <video 
            controls 
            className="w-full h-64 object-cover rounded-lg shadow-md"
            preload="metadata"
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <audio 
            controls 
            className="w-full"
            preload="metadata"
          >
            <source src={mediaUrl} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        );
      case 'pdf':
        return (
          <iframe
            src={mediaUrl}
            className="w-full h-96 rounded-lg shadow-md"
            title="PDF Document"
          />
        );
      default:
        return (
          <img 
            src={mediaUrl} 
            alt="Story revision media" 
            className="w-full h-64 object-cover rounded-lg shadow-md"
            loading="lazy"
          />
        );
    }
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

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
        <div className="container mx-auto px-4 py-8">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Story Not Found</h3>
              <p className="text-gray-600 mb-4">{error || 'The story you are looking for does not exist or is not available.'}</p>
              <Link
                to="/explore"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Explore
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/explore"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Explore
            </Link>
            <div className="text-sm text-gray-500">
              {formatDate(story.created_at)}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {story.title}
          </h1>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {story.author?.username || 'Anonymous'}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {story.status}
            </div>
          </div>
        </motion.div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Story Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Story Content
              </h2>
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {story.content}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Revisions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Story Revisions
              </h2>

              {revisions.length > 0 ? (
                <div className="space-y-4">
                  {/* Revision List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {revisions.map((revision, index) => {
                      const mediaType = revision.url ? getMediaType(revision.url) : null;
                      return (
                        <button
                          key={revision.id}
                          onClick={() => setActiveRevision(index)}
                          className={`w-full p-3 rounded-lg text-left transition-all border ${
                            activeRevision === index
                              ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {mediaType && (
                                <div className="text-indigo-600">
                                  {getMediaIcon(mediaType)}
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">
                                  Revision {index + 1}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatDate(revision.created_at)}
                                </div>
                              </div>
                            </div>
                            {activeRevision === index && (
                              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            )}
                          </div>
                          {revision.description && (
                            <div className="mt-2 text-sm text-gray-600 truncate">
                              {revision.description}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Revision Display */}
                  <div className="border-t pt-4">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Revision {activeRevision + 1}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatDate(revisions[activeRevision].created_at)}
                        </span>
                      </div>
                      {revisions[activeRevision].description && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {revisions[activeRevision].description}
                        </p>
                      )}
                    </div>

                    {/* Revision Media */}
                    {revisions[activeRevision].url && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center">
                          {getMediaIcon(getMediaType(revisions[activeRevision].url))}
                          <span className="ml-2">
                            {getMediaType(revisions[activeRevision].url).charAt(0).toUpperCase() + 
                             getMediaType(revisions[activeRevision].url).slice(1)} File
                          </span>
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          {renderMedia(revisions[activeRevision].url, getMediaType(revisions[activeRevision].url))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Revisions Available</h3>
                  <p className="text-gray-600">No revision files have been generated for this story yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StoryView; 