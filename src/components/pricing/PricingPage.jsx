import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import apiFetch from '../../utils/api'

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [pricingConfig, setPricingConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
                <Link
                  to={plan.price === 0 ? '/signup' : `/subscribe?plan=${plan.name.toLowerCase()}`}
                  className={`mt-8 block w-full bg-${
                    selectedPlan?.id === plan.id ? 'indigo' : 'blue'
                  }-600 text-white rounded-md py-2 text-sm font-semibold text-center transition-transform transition-shadow duration-200 transform hover:scale-105 hover:shadow-2xl hover:bg-${
                    selectedPlan?.id === plan.id ? 'indigo' : 'blue'
                  }-500`}
                >
                  {plan.price === 0 ? 'Get Started' : 'Buy Now'}
                </Link>
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