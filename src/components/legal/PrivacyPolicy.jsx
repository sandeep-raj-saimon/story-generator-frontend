import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
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
            Privacy Policy
          </motion.h1>
          
          <div className="prose prose-lg max-w-none">
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-none space-y-2">
                  {[
                    'Account information (name, email address, password)',
                    'Payment information (processed securely through our payment providers)',
                    'Content you create using our service',
                    'Usage data and preferences'
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
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
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  We use the collected information to:
                </p>
                <ul className="list-none space-y-2">
                  {[
                    'Provide and maintain our service',
                    'Process your transactions',
                    'Send you important updates and notifications',
                    'Improve our service and user experience',
                    'Comply with legal obligations'
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
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
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul className="list-none space-y-2">
                  {[
                    'Service providers who assist in operating our service',
                    'Payment processors for handling transactions',
                    'Law enforcement when required by law'
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
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
              transition={{ delay: 0.9 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  We implement appropriate security measures to protect your personal information. However, no 
                  method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  You have the right to:
                </p>
                <ul className="list-none space-y-2">
                  {[
                    'Access your personal information',
                    'Correct inaccurate information',
                    'Request deletion of your information',
                    'Opt-out of marketing communications'
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
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
              transition={{ delay: 1.3 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  We use cookies and similar tracking technologies to improve your experience on our platform. 
                  You can control cookie settings through your browser preferences.
                </p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Changes to Privacy Policy</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  We may update this privacy policy from time to time. We will notify you of any changes by 
                  posting the new policy on this page and updating the "Last updated" date.
                </p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.9 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="mb-4 text-gray-700">
                  If you have any questions about this Privacy Policy, please contact us at sandeeprajsaimon999@gmail.com
                </p>
              </div>
            </motion.section>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
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

export default PrivacyPolicy; 