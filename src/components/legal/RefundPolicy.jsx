import React from 'react';
import { motion } from 'framer-motion';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8"
          >
            Refund Policy
          </motion.h1>
          
          <div className="prose prose-lg max-w-none">
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. General Policy</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  At WhisprTales, we strive to provide the best possible service to our users. Our refund policy 
                  is designed to be fair and transparent while protecting both our users and our business.
                </p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Credit Purchases</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  Credits purchased on our platform are generally non-refundable. However, we may consider refunds in the following cases:
                </p>
                <ul className="list-none space-y-2">
                  {[
                    'Technical issues preventing credit usage',
                    'Duplicate purchases',
                    'Unauthorized transactions',
                    'Service unavailability for extended periods'
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center text-gray-600"
                    >
                      <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Refund Process</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  To request a refund:
                </p>
                <ul className="list-none space-y-2">
                  {[
                    'Contact our support team within 14 days of purchase',
                    'Provide your account details and transaction information',
                    'Explain the reason for your refund request',
                    'Allow up to 5 business days for review'
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex items-center text-gray-600"
                    >
                      <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Non-Refundable Items</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  The following are generally not eligible for refunds:
                </p>
                <ul className="list-none space-y-2">
                  {[
                    'Used credits for content generation',
                    'Subscription time already consumed',
                    'Promotional or discounted purchases',
                    'Custom or personalized services'
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className="flex items-center text-gray-600"
                    >
                      <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Special Circumstances</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  We may consider refunds in special circumstances such as:
                </p>
                <ul className="list-none space-y-2">
                  {[
                    'Extended service outages',
                    'Significant changes to service terms',
                    'Legal requirements',
                    'Discretionary cases of hardship'
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + index * 0.1 }}
                      className="flex items-center text-gray-600"
                    >
                      <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact Information</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  For refund requests or questions about our refund policy, please contact us at refunds@whisprtales.com
                </p>
              </div>
            </motion.section>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="text-sm text-gray-500 mt-8 border-t border-gray-100 pt-4"
            >
              Last updated: May 20, 2024
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy; 