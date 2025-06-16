import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuest } from '../../contexts/GuestContext';

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const GuestStoryView = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeRevision, setActiveRevision] = useState(0);
  const { isGuest, canReadMoreStories, incrementStoriesRead, guestStoriesLimit } = useGuest();

  useEffect(() => {
    fetchStoryData();
  }, [id]);

  const fetchStoryData = async () => {
    try {
      setLoading(true);
      
      // Check if guest can read more stories
      if (isGuest && !canReadMoreStories()) {
        setError('Guest limit reached');
        setLoading(false);
        return;
      }

      // Fetch public story details without authentication
      const storyResponse = await fetch(`${API_BASE_URL}/stories/public/${id}/`);

      if (!storyResponse.ok) {
        throw new Error('Failed to fetch story');
      }

      const storyData = await storyResponse.json();
      setStory(storyData);

      // Fetch story revisions for public stories
      const revisionsResponse = await fetch(`${API_BASE_URL}/stories/public/${id}/revisions/`);

      if (revisionsResponse.ok) {
        const revisionsData = await revisionsResponse.json();
        // Sort revisions by creation date (newest first)
        const sortedRevisions = revisionsData.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setRevisions(sortedRevisions);
      }

      // Increment guest stories read count
      if (isGuest) {
        incrementStoriesRead();
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

  const renderRevisionMedia = (mediaUrl, mediaType) => {
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

  // Helper function to render media
  const renderMedia = (media) => {
    if (!media || !media.url) return null;

    if (media.media_type === 'image') {
      return (
        <div className="relative">
          <img 
            src={media.url} 
            alt={media.description || 'Scene image'} 
            className="w-full h-64 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setSelectedImage(media.url)}
            loading="lazy"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
            AI Generated
          </div>
        </div>
      );
    } else if (media.media_type === 'audio') {
      return (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
            </svg>
            <span className="text-sm font-medium text-gray-700">AI Generated Audio</span>
          </div>
          <audio 
            controls 
            className="w-full"
            preload="metadata"
          >
            <source src={media.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }

    return null;
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
              {error === 'Guest limit reached' ? (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    You've reached the limit of {guestStoriesLimit} stories for guest users.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to="/signup"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Sign Up for Free
                    </Link>
                    <Link
                      to="/"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Go Home
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Go Home
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Story Not Found</h3>
            <p className="text-gray-600">The story you're looking for doesn't exist or is not public.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Link
                to="/browse"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Browse Other Stories
              </Link>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go Home
              </Link>
            </div>
          </div>
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
            <div className="flex items-center space-x-4">
              <Link
                to="/browse"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Browse
              </Link>
              <Link
                to="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
            </div>
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

        {/* Story Content and Scenes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Main Story Content */}
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

          {/* Scenes with Generated Content */}
          {story.scenes && story.scenes.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                </svg>
                Story Scenes with AI-Generated Content
              </h2>
              
              <div className="space-y-8">
                {story.scenes.map((scene, index) => (
                  <motion.div
                    key={scene.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Scene {index + 1}: {scene.title}
                      </h3>
                      <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-800">
                        Scene {index + 1}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Scene Content */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-700 mb-3">Scene Description</h4>
                        <p className="text-gray-600 leading-relaxed mb-4">{scene.content}</p>
                        
                        {scene.scene_description && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Visual Description</h5>
                            <p className="text-sm text-gray-600 italic">{scene.scene_description}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Generated Media */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-700 mb-3">Generated Media</h4>
                        {scene.media && scene.media.length > 0 ? (
                          <div className="space-y-4">
                            {scene.media.map((media) => (
                              <div key={media.id}>
                                {renderMedia(media)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-6 text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500">No media generated for this scene yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Story Revisions */}
          {revisions.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Story Revisions
              </h2>

              <div className="space-y-4">
                {/* Revision List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {revisions.map((revision, index) => {
                    const mediaType = revision.url ? getMediaType(revision.url) : null;
                    const isCurrent = revision.is_current;
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
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <div className="font-medium text-gray-900">
                                  {revision.format.toUpperCase()} Revision
                                </div>
                                {isCurrent && (
                                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                    Current
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(revision.created_at)}
                              </div>
                              {revision.sub_format && (
                                <div className="text-xs text-gray-400 mt-1">
                                  Sub-format: {revision.sub_format}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {activeRevision === index && (
                              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            )}
                            <div className="text-xs text-gray-400">
                              #{revisions.length - index}
                            </div>
                          </div>
                        </div>
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
                        {revisions[activeRevision].format.toUpperCase()} Revision #{revisions.length - activeRevision}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {revisions[activeRevision].is_current && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Current
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatDate(revisions[activeRevision].created_at)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Revision Details */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Format:</span>
                          <span className="ml-2 text-gray-600">{revisions[activeRevision].format.toUpperCase()}</span>
                        </div>
                        {revisions[activeRevision].sub_format && (
                          <div>
                            <span className="font-medium text-gray-700">Sub-format:</span>
                            <span className="ml-2 text-gray-600">{revisions[activeRevision].sub_format}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>
                          <span className="ml-2 text-gray-600">
                            {revisions[activeRevision].is_current ? 'Current' : 'Previous'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Created:</span>
                          <span className="ml-2 text-gray-600">
                            {new Date(revisions[activeRevision].created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
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
                        {renderRevisionMedia(revisions[activeRevision].url, getMediaType(revisions[activeRevision].url))}
                      </div>
                      <div className="text-center">
                        <a
                          href={revisions[activeRevision].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Open in New Tab
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Guest Sign Up CTA */}
          {isGuest && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6"
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Enjoying this story?
                </h3>
                <p className="text-gray-600 mb-4">
                  Sign up for free to read unlimited stories and create your own amazing narratives with AI-generated images and audio!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Sign Up for Free
                  </Link>
                  <Link
                    to="/browse"
                    className="inline-flex items-center px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Browse More Stories
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              onClick={() => setSelectedImage(null)}
            >
              <div
                className="relative max-w-4xl max-h-[90vh]"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img 
                  src={selectedImage} 
                  alt="Enlarged view" 
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GuestStoryView; 