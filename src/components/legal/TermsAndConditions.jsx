import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      
      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using WhisprTales, you agree to be bound by these Terms and Conditions. 
            If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
          <p className="mb-4">
            WhisprTales is an AI-powered platform that helps users create stories, generate images, 
            and produce audio content. Our service includes various features such as story creation, 
            image generation, and audio narration.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="mb-4">
            To use our service, you must create an account. You are responsible for maintaining the 
            confidentiality of your account credentials and for all activities that occur under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Credit System</h2>
          <p className="mb-4">
            Our service operates on a credit-based system. Credits are used for various features such as 
            image generation and audio creation. Credits can be purchased through our platform or earned 
            through promotional activities.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Content Ownership</h2>
          <p className="mb-4">
            You retain ownership of the stories you create. However, by using our service, you grant us 
            a license to use, store, and display your content for the purpose of providing and improving 
            our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Prohibited Activities</h2>
          <p className="mb-4">
            Users are prohibited from:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Creating content that violates any laws or regulations</li>
            <li>Using the service for any illegal purposes</li>
            <li>Attempting to manipulate or abuse the credit system</li>
            <li>Sharing account credentials with others</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Service Modifications</h2>
          <p className="mb-4">
            We reserve the right to modify, suspend, or discontinue any aspect of our service at any time. 
            We will notify users of any significant changes to our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">
            WhisprTales is provided "as is" without any warranties. We are not liable for any damages 
            arising from the use or inability to use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
          <p className="mb-4">
            For any questions regarding these Terms and Conditions, please contact us at support@whisprtales.com
          </p>
        </section>

        <p className="text-sm text-gray-600 mt-8">
          Last updated: May 20, 2024
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions; 