import { useState } from 'react'
import { Link } from 'react-router-dom'

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: [
        '5 image generations per month',
        '2 audio generations per month',
        'Basic story creation',
        'Community support'
      ],
      buttonText: 'Get Started',
      buttonLink: '/signup',
      highlighted: false
    },
    {
      name: 'Pro',
      price: isAnnual ? 9.99 : 14.99,
      features: [
        'Unlimited image generations',
        'Unlimited audio generations',
        'Priority generation queue',
        'Advanced story features',
        'Email support',
        'Export to multiple formats'
      ],
      buttonText: 'Subscribe Now',
      buttonLink: '/subscribe',
      highlighted: true
    }
  ]

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
            <div className="relative bg-white rounded-lg p-1 flex">
              <button
                onClick={() => setIsAnnual(false)}
                className={`${
                  !isAnnual ? 'bg-indigo-600 text-white' : 'text-gray-500'
                } relative py-2 px-6 rounded-md text-sm font-medium transition-colors duration-200`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`${
                  isAnnual ? 'bg-indigo-600 text-white' : 'text-gray-500'
                } relative py-2 px-6 rounded-md text-sm font-medium transition-colors duration-200`}
              >
                Annual
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                plan.highlighted
                  ? 'border-2 border-indigo-500 relative'
                  : 'border border-gray-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                  <span className="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                    Popular
                  </span>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-base font-medium text-gray-500">
                    /{isAnnual ? 'year' : 'month'}
                  </span>
                </p>
                <Link
                  to={plan.buttonLink}
                  className={`mt-8 block w-full bg-${
                    plan.highlighted ? 'indigo' : 'gray'
                  }-600 text-white rounded-md py-2 text-sm font-semibold text-center hover:bg-${
                    plan.highlighted ? 'indigo' : 'gray'
                  }-700`}
                >
                  {plan.buttonText}
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