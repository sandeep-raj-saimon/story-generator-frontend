// create profile page, that shows the user's name, email, and credits

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL

const ProfilePage = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('accessToken')
                if (!token) {
                    navigate('/signin')
                    return
                }

                const response = await fetch(`${API_BASE_URL}/profile/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch user data')
                }

                const data = await response.json()
                setUser(data)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchUserData()
    }, [navigate])

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Animated background shapes */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative max-w-4xl mx-auto p-6">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8">
                        Profile
                    </h1>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between animate-shake">
                            <span>{error}</span>
                            <button 
                                onClick={() => setError(null)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : user ? (
                        <div className="space-y-8">
                            {/* Profile Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 transform transition-all duration-300 hover:shadow-lg">
                                <div className="flex items-center space-x-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.username}</h2>
                                        <p className="text-gray-600 mb-4">{user.email}</p>
                                        
                                        {/* Referral Code Section */}
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 mb-1">Your Referral Code</p>
                                                    <p className="text-lg font-mono font-semibold text-indigo-600">
                                                        {user.referral_code || 'Not generated yet'}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Language: {user.language === 'en-US' ? 'English-US' : 'Hindi' }
                                                    </p>
                                                </div>
                                                {user.referral_code && (
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(user.referral_code);
                                                            toast.success('Referral code copied to clipboard!');
                                                        }}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                                    >
                                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                        </svg>
                                                        Copy
                                                    </button>
                                                )}
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Share this code with friends to get referral rewards!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Credits Card */}
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 p-8 transform transition-all duration-300 hover:shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800">Available Credits</h3>
                                    <Link
                                        to="/pricing"
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                                    >
                                        Get More Credits
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                                            style={{ width: `${Math.min((user.credits?.credits_remaining / 1000) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-800">{user.credits?.credits_remaining || 0}</span>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Credits are used for generating images and audio for your stories.
                                </p>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Link
                                    to="/create"
                                    className="group bg-white rounded-lg shadow-sm border border-gray-100 p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">Create New Story</h3>
                                            <p className="text-sm text-gray-500">Start writing your next masterpiece</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link
                                    to="/my-stories"
                                    className="group bg-white rounded-lg shadow-sm border border-gray-100 p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white transform rotate-6 group-hover:rotate-0 transition-transform duration-300">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">View My Stories</h3>
                                            <p className="text-sm text-gray-500">Access and manage your stories</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Add custom styles for animations */}
            <style jsx="true">{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animate-fade-in {
                    animation: fadeIn 1s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

export default ProfilePage