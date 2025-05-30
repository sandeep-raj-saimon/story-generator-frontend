import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import apiFetch from '../../utils/api'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, reverseEasing } from 'framer-motion'

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
const RAZORPAY_KEY = import.meta.env.VITE_TEST_RAZORPAY_KEY_ID

const PricingPage = () => {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [pricingConfig, setPricingConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [referralCode, setReferralCode] = useState('')
  const [isValidatingCode, setIsValidatingCode] = useState(false)
  const [discountApplied, setDiscountApplied] = useState(false)
  const [discountPercentage, setDiscountPercentage] = useState(0)
  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      console.log('Razorpay script loaded')
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const initializeRazorpay = (orderData, plan_id) => {
    console.log(orderData, RAZORPAY_KEY)
    const options = {
      key: RAZORPAY_KEY,
      amount: orderData.amount * 100,
      currency: orderData.currency,
      name: "WhisprTales",
      description: '',
      order_id: orderData.order_id,
      handler: function (response) {
        console.log('Payment successful:', response)
        // Handle successful payment
        verifyPayment({ ...response, order_id: orderData.order_id, plan_id: plan_id })
      },
      prefill: {
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
      },
      theme: {
        color: "#4F46E5" // Indigo color matching our UI
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const verifyPayment = async (response) => {
    try {
      const domain = window.location.hostname.split('.').pop() === 'localhost' ? 'in' : 'com'
      const verifyResponse = await fetch(`${API_BASE_URL}/payment/verify/?domain=${domain}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          order_id: response.order_id,
          plan_id: response.plan_id
        })
      })
      
      if (verifyResponse.ok) {
        const data = await verifyResponse.json()
        toast.success(data.message, {
          autoClose: 5000,
          theme: "colored",
        })
        setTimeout(() => {
          navigate('/')
        }, 5000)
      } else {
        toast.error('Payment failed!', {
          autoClose: 5000,
          theme: "colored",
        })
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
    }
  }

  const validateReferralCode = async (code) => {
    if (!code) return
    setIsValidatingCode(true)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-referral/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ referral_code: code })
      })
      if (response.ok) {
        const discountPercentage = (await response.json())['discountPercentage']
        if (discountPercentage > 0) {
          setDiscountApplied(true)
          setDiscountPercentage(discountPercentage)
          toast.success(`${discountPercentage}% discount applied successfully!`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          })
        }
      } else {
        const errorMessage = (await response.json())['error']
        setDiscountApplied(false)
        toast.error(`${errorMessage}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        })
      }
    } catch (err) {
      console.error('Error validating referral code:', err)
      toast.error('Error validating referral code', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
    } finally {
      setIsValidatingCode(false)
    }
  }

  const handlePlanSelect = async (plan) => {
    try {
      setSelectedPlan(plan)
      const domain = window.location.hostname.split('.').pop() === 'localhost' ? 'in' : 'com'
      console.log('discountApplied', discountApplied)
      // Create order with referral code if applied
      const response = await fetch(`${API_BASE_URL}/payment/create-order/?plan_id=${plan.id}&domain=${domain}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          referral_code: discountApplied ? referralCode : null
        })
      })

      if (!response.ok) {
        const errorMessage = (await response.json())['error']
        throw new Error(`Failed to create order due to ${errorMessage}`)
      }

      const orderData = await response.json()
      console.log('Order created:', orderData)
      
      // Initialize Razorpay with order data
      initializeRazorpay(orderData, plan.id)
    } catch (error) {
      console.error('Order creation failed:', error)
      setError(error.message)
    }
  }

  useEffect(() => {
    const fetchPricingConfig = async () => {
      try {
        // Get domain from window.location
        const domain = window.location.hostname.split('.').pop() === 'localhost' ? 'in' : 'com'
        const response = await apiFetch(`/pricing/config/?domain=${domain}`)
        if (!response.ok) throw new Error('Failed to fetch pricing configuration')
        
        const data = await response.json()
        setPricingConfig(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPricingConfig()
  }, [])

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
    )
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
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <ToastContainer position="top-center" />
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Select the perfect plan for your creative journey. All plans include access to our AI-powered story generation platform.
          </p>

          {/* Referral Code Input */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="Enter referral code"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                disabled={discountApplied || isValidatingCode}
              />
              <button
                onClick={() => validateReferralCode(referralCode)}
                disabled={!referralCode || discountApplied || isValidatingCode}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  discountApplied
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : isValidatingCode
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isValidatingCode ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validating...
                  </div>
                ) : discountApplied ? (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Applied
                  </div>
                ) : (
                  'Apply Code'
                )}
              </button>
            </div>
            {discountApplied && (
              <p className="mt-2 text-sm text-green-600 font-medium">
                {discountPercentage}% discount applied successfully!
              </p>
            )}
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {pricingConfig?.plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ${
                  selectedPlan?.id === plan.id ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                {plan.price === 0 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      Free
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mt-4 mb-6">
                    {plan.price > 0 ? (
                      <div className="flex items-baseline">
                        {discountApplied && (
                          <span className="text-lg font-medium text-gray-500 line-through mr-2">
                            {pricingConfig.currency}{plan.price}
                          </span>
                        )}
                        <span className="text-4xl font-extrabold text-gray-900">
                          {pricingConfig.currency}
                          {discountApplied 
                            ? (plan.price * (1 - (discountPercentage / 100))).toFixed(2)
                            : plan.price}
                        </span>
                        <span className="text-base font-medium text-gray-500 ml-2">
                          for {plan.credits} credits
                        </span>
                      </div>
                    ) : (
                      <span className="text-4xl font-extrabold text-gray-900">
                        {pricingConfig.currency}{plan.price}
                        <span className="text-base font-medium text-gray-500 ml-2">
                          / month
                        </span>
                      </span>
                    )}
                  </div>

                  { plan.price !== 0 ? <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePlanSelect(plan)}
                    disabled={plan.price === 0}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold text-center transition-all duration-200 ${
                      plan.price === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : selectedPlan?.id === plan.id
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                    }`}
                  >
                    {'Buy now'}
                  </motion.button> : ''}

                  <div className="mt-8">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + featureIndex * 0.1 }}
                          className="flex items-start"
                        >
                          <svg
                            className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="ml-3 text-sm text-gray-600">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {selectedPlan?.id === plan.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      Selected
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need more information?</h2>
          <p className="text-gray-600 mb-6">
            Check out our detailed pricing guide or contact our support team for personalized assistance.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/faq"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
            >
              View FAQ
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Contact Support
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PricingPage 