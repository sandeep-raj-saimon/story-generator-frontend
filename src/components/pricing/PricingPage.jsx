import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import apiFetch from '../../utils/api'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
const RAZORPAY_KEY = import.meta.env.VITE_TEST_RAZORPAY_KEY_ID

const PricingPage = () => {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [pricingConfig, setPricingConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      name: "Story Generator",
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

  const handlePlanSelect = async (plan) => {
    try {
      setSelectedPlan(plan)
      const domain = window.location.hostname.split('.').pop() === 'localhost' ? 'in' : 'com'
      
      // Create order
      const response = await fetch(`${API_BASE_URL}/payment/create-order/?plan_id=${plan.id}&domain=${domain}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
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
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <ToastContainer position="top-center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that best fits your needs
          </p>
          
          {/* Billing Toggle */}
          <div className="mt-6 flex justify-center">
            {/* Billing toggle removed for INR/credit plans */}
          </div>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto">
          {pricingConfig?.plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                selectedPlan?.id === plan.id
                  ? 'border-2 border-indigo-500 relative'
                  : 'border border-gray-200'
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {pricingConfig.currency}{plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-base font-medium text-gray-500"> for {plan.credits} credits</span>
                  )}
                  {plan.price === 0 && (
                    <span className="text-base font-medium text-gray-500"> / month</span>
                  )}
                </p>
                <button
                  to={plan.price === 0 ? '/signup' : `/subscribe?plan=${plan.name.toLowerCase()}`}
                  className={`mt-8 block w-full bg-${
                    selectedPlan?.id === plan.id ? 'indigo' : 'blue'
                  }-600 text-white rounded-md py-2 text-sm font-semibold text-center transition-transform transition-shadow duration-200 transform hover:scale-105 hover:shadow-2xl hover:bg-${
                    selectedPlan?.id === plan.id ? 'indigo' : 'blue'
                  }-500`}
                  onClick={() => handlePlanSelect(plan)}
                  disabled={plan.price === 0 ? true : false}
                >
                  {plan.price === 0 ? 'Get Started' : 'Buy Now'}
                </button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">What's included</h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
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
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  )
}

export default PricingPage 