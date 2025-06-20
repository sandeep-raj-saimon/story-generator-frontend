import React from 'react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We'd love to hear from you! Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Suggestions and Feedback</h2>
          <p className="text-gray-600 mb-6">
            Have a suggestion or some feedback for us? We are always looking for ways to improve our platform and would love to hear your thoughts. Please use the form below to share your feedback.
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfe5DkI8tXRJ1EvA6KXCST_Q2GDR6HkZ-Ob_ZgFoytauc9c8g/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Provide Feedback
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 