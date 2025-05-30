import React from 'react';
import Navbar from '../components/navbar';

export default function HelpSupport() {
  return (
    <>
      <Navbar /> {/* ✅ This ensures the navbar appears */}

      <div className="page-container" style={{ padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Help & Support</h1>

        <p style={{ marginBottom: '16px' }}>
          Welcome to the TuneUp Help Center! Whether you're just getting started or need assistance with a specific issue, we’re here to help you make the most of your experience.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>💬 Frequently Asked Questions</h2>
        <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
          <li>🔑 <strong>How do I reset my password?</strong><br />
            Click on “Forgot Password” on the login page. An OTP will be sent to your email to reset your password securely.</li>
          <li>🚗 <strong>How can I add a vehicle?</strong><br />
            Go to the “Add Vehicle” page, fill in the required details like make, model, year, and VIN, and click “Save”.</li>
          <li>📊 <strong>Why aren’t my expenses showing?</strong><br />
            Ensure you’re logged in, and check your internet connection. Refresh the dashboard and try again.</li>
        </ul>

        <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>📨 Contact Support</h2>
        <p style={{ marginBottom: '8px' }}>
          Can’t find what you're looking for? Get in touch with our support team:
        </p>
        <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
          <li>Email: <a href="mailto:support@tuneupapp.com">support@tuneupapp.com</a></li>
          <li>Phone: +971 1234 5678 (Monday to Friday, 9AM – 6PM)</li>
          <li>Live Chat: Coming soon to the dashboard!</li>
        </ul>

        <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>📚 How-To Guides</h2>
        <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
          <li><strong>Managing Scheduled Services:</strong> Learn how to create, edit, and track your vehicle maintenance tasks.</li>
          <li><strong>Tracking Fuel Expenses:</strong> Easily log your fuel fill-ups and monitor costs over time.</li>
          <li><strong>Using Reports:</strong> View summarized reports of all your expenses by type, currency, and date.</li>
        </ul>

        <p style={{ fontStyle: 'italic', color: '#555' }}>
          We’re always working to make TuneUp better. If you have suggestions or feature requests, feel free to email us!
        </p>
      </div>
    </>
  );
}
