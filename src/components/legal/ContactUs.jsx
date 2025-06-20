import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        <div>
          <div className="prose prose-lg">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="mb-4">
              Have questions about our service? We're here to help! Choose the most convenient way to reach us:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Email Support</h3>
                <p className="text-gray-600">
                  For general inquiries, please email us at:{' '}
                  <a 
                    href="mailto:sandeeprajsaimon999@gmail.com"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    sandeeprajsaimon999@gmail.com
                  </a>
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Response Time</h3>
                <p className="text-gray-600">
                  We typically respond to all inquiries within 24-48 hours during business days.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Office Address</h3>
                <p className="text-gray-600">
                  Hyderabad, India - 500056
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Office Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                  Saturday: 10:00 AM - 2:00 PM IST<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 bg-indigo-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          💬 Got feedback or feature ideas?
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Help us improve WhisprTales by sharing your thoughts.
        </p>
        <div className="text-center">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfe5DkI8tXRJ1EvA6KXCST_Q2GDR6HkZ-Ob_ZgFoytauc9c8g/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Share Your Feedback
          </a>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default ContactUs; 