import React from 'react';
import { motion } from 'framer-motion';

const TermsAndConditions = () => {
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
            Terms and Conditions
          </motion.h1>
          
          <div className="prose prose-lg max-w-none">
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  By accessing and using WhisprTales, you agree to be bound by these Terms and Conditions. 
                  If you do not agree to these terms, please do not use our service.
                </p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. User Accounts</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  To use our service, you must:
                </p>
                <ul className="list-none space-y-2">
                  {[
                    'Be at least 13 years of age',
                    'Provide accurate and complete information',
                    'Maintain the security of your account',
                    'Notify us immediately of any unauthorized use'
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
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Service Usage</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  When using our service, you agree to:
                </p>
                <ul className="list-none space-y-2">
                  {[
                    'Use the service only for lawful purposes',
                    'Not violate any intellectual property rights',
                    'Not attempt to gain unauthorized access',
                    'Not interfere with the service operation',
                    'Not use automated systems or bots without permission'
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Content Ownership</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  You retain ownership of your content, but grant us a license to:
                </p>
                <ul className="list-none space-y-2">
                  {[
                    'Store and display your content on our platform',
                    'Use your content to provide and improve our service',
                    'Share your content as part of our service features',
                    'Use your content for promotional purposes (with your permission)'
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  For paid services:
                </p>
                <ul className="list-none space-y-2">
                  {[
                    'All fees are non-refundable unless required by law',
                    'We may change our fees with notice',
                    'You are responsible for all applicable taxes',
                    'Subscription fees are billed in advance'
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Termination</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  We may terminate or suspend your account if you:
                </p>
                <ul className="list-none space-y-2">
                  {[
                    'Violate these terms',
                    'Engage in fraudulent activity',
                    'Fail to pay applicable fees',
                    'Use the service in a way that may harm others'
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  To the maximum extent permitted by law, WhisprTales shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages resulting from your use of or 
                  inability to use the service.
                </p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  We reserve the right to modify these terms at any time. We will notify you of any material 
                  changes by posting the new terms on this page and updating the "Last updated" date.
                </p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  For any questions about these Terms and Conditions, please contact us at terms@whisprtales.com
                </p>
              </div>
            </motion.section>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 }}
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

export default TermsAndConditions; 