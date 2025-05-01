const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
console.log('API_BASE_URL', API_BASE_URL)
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
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('username')
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

export default apiFetch 