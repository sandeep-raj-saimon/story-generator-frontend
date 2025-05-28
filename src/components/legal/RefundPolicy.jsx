import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Refund and Cancellation Policy</h1>
      
      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Credit Purchases</h2>
          <p className="mb-4">
            Credits purchased on WhisprTales are non-refundable once used. However, unused credits 
            may be eligible for a refund under certain circumstances.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Refund Eligibility</h2>
          <p className="mb-4">
            You may be eligible for a refund if:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>You have unused credits and request a refund within 7 days of purchase</li>
            <li>There was a technical issue that prevented you from using the service</li>
            <li>The service was unavailable for an extended period</li>
          </ul>
          <p className="mb-4">
            Refunds will not be provided for:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Credits that have already been used</li>
            <li>Purchases made more than 7 days ago</li>
            <li>Dissatisfaction with generated content quality</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Subscription Cancellation</h2>
          <p className="mb-4">
            You can cancel your subscription at any time. Upon cancellation:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your subscription will remain active until the end of the current billing period</li>
            <li>You will continue to have access to all features until the end of the billing period</li>
            <li>No refunds will be provided for the current billing period</li>
            <li>You will not be charged for the next billing period</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. How to Request a Refund</h2>
          <p className="mb-4">
            To request a refund:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li>Contact our support team at support@whisprtales.com</li>
            <li>Include your account email and order details</li>
            <li>Specify the reason for your refund request</li>
            <li>Allow up to 5 business days for processing</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Refund Processing</h2>
          <p className="mb-4">
            Approved refunds will be processed using the original payment method. The time it takes for 
            the refund to appear in your account depends on your payment provider, typically 5-10 business days.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Changes to Policy</h2>
          <p className="mb-4">
            We reserve the right to modify this refund and cancellation policy at any time. Any changes 
            will be effective immediately upon posting on our website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our refund and cancellation policy, please contact us at 
            support@storygenerator.com
          </p>
        </section>

        <p className="text-sm text-gray-600 mt-8">
          Last updated: May 20, 2024
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy; 