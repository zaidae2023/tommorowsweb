import React from 'react';
import Navbar from '../components/navbar';
import './HelpSupport.css'; // ✅ External CSS for styling

export default function HelpSupport() {
  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">Help & Support</h1>

        <p className="page-text">
          Welcome to the TuneUp Help Center! Whether you're just getting started or need assistance with a specific issue, we’re here to help you make the most of your experience.
        </p>

        <h2 className="section-heading">💬 Frequently Asked Questions</h2>
        <ul>
          <li>🔑 <strong>How do I reset my password?</strong><br />
            Click on “Forgot Password” on the login page. An OTP will be sent to your email to reset your password securely.</li>
          <li>🚗 <strong>How can I add a vehicle?</strong><br />
            Go to the “Add Vehicle” page, fill in the required details like make, model, year, and VIN, and click “Save”.</li>
          <li>📊 <strong>Why aren’t my expenses showing?</strong><br />
            Ensure you’re logged in, and check your internet connection. Refresh the dashboard and try again.</li>
        </ul>

        <h2 className="section-heading">📨 Contact Support</h2>
        <p className="page-text">
          Can’t find what you're looking for? Get in touch with our support team:
        </p>
        <ul>
          <li>Email: <a href="mailto:support@tuneupapp.com">support@tuneupapp.com</a></li>
          <li>Phone: +971 1234 5678 (Monday to Friday, 9AM – 6PM)</li>
          <li>Live Chat: Coming soon to the dashboard!</li>
        </ul>

        <h2 className="section-heading">📚 How-To Guides</h2>
        <ul>
          <li><strong>Managing Scheduled Services:</strong> Learn how to create, edit, and track your vehicle maintenance tasks.</li>
          <li><strong>Tracking Fuel Expenses:</strong> Easily log your fuel fill-ups and monitor costs over time.</li>
          <li><strong>Using Reports:</strong> View summarized reports of all your expenses by type, currency, and date.</li>
        </ul>

        <p className="page-note">
          We’re always working to make TuneUp better. If you have suggestions or feature requests, feel free to email us!
        </p>
      </div>
    </>
  );
}
