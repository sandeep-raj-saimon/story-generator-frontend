import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiFetch from '../../utils/api'
import { loadStripe } from '@stripe/stripe-js'

const SubscriptionManager = () => {
  const navigate = useNavigate()
  const [usage, setUsage] = useState({
    imageGenerations: 0,
    audioGenerations: 0,
    imageLimit: 5,
    audioLimit: 2
  })
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      const response = await apiFetch('/subscription/status/')
      if (!response.ok) throw new Error('Failed to fetch subscription data')
      
      const data = await response.json()
      setSubscription(data.subscription)
      setUsage(data.usage)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planId) => {
    try {
      const response = await apiFetch('/subscription/create-checkout-session/', {
        method: 'POST',
        body: JSON.stringify({ planId })
      })
      
      if (!response.ok) throw new Error('Failed to create checkout session')
      
      const { sessionId } = await response.json()
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
      await stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Subscription & Usage</h1>
      
      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {subscription ? 'Pro Plan' : 'Free Plan'}
            </p>
            <p className="text-gray-500">
              {subscription ? 'Unlimited generations' : 'Limited generations'}
            </p>
          </div>
          {!subscription && (
            <button
              onClick={() => navigate('/pricing')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage This Month</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Image Generations</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                    {usage.imageGenerations} / {usage.imageLimit}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-600">
                    {Math.round((usage.imageGenerations / usage.imageLimit) * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div
                  style={{ width: `${(usage.imageGenerations / usage.imageLimit) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                ></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Audio Generations</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                    {usage.audioGenerations} / {usage.audioLimit}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-600">
                    {Math.round((usage.audioGenerations / usage.audioLimit) * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div
                  style={{ width: `${(usage.audioGenerations / usage.audioLimit) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
}

export default SubscriptionManager 