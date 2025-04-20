import { useNavigate } from 'react-router-dom'

const API_BASE_URL = 'http://localhost:8000/api'

// Store the original fetch function
const originalFetch = window.fetch

// Override the global fetch
window.fetch = async (input, init = {}) => {
  // Only intercept API calls
  if (typeof input === 'string' && input.startsWith(API_BASE_URL)) {
    const token = localStorage.getItem('accessToken')
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...init.headers
    }

    try {
      const response = await originalFetch(input, {
        ...init,
        headers
      })

      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('accessToken')
        window.location.href = '/signin'
        throw new Error('Session expired. Please sign in again.')
      }

      return response
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // For non-API calls, use the original fetch
  return originalFetch(input, init)
}

// Export a helper function for making API calls
export const apiFetch = async (url, options = {}) => {
  return fetch(`${API_BASE_URL}${url}`, options)
}

// Export a function to initialize the interceptor
export const initializeApiInterceptor = () => {
  console.log('API Interceptor initialized')
}

// Create a custom hook for API calls
export const useApi = () => {
  const navigate = useNavigate()

  const apiFetchWithNavigate = async (url, options = {}) => {
    try {
      return await apiFetch(url, options)
    } catch (error) {
      if (error.message.includes('Session expired')) {
        navigate('/signin')
      }
      throw error
    }
  }

  return {
    apiFetch: apiFetchWithNavigate
  }
}

export default apiFetch 