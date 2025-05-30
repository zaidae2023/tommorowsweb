import React from 'react';
import Navbar from '../components/navbar';

export default function TermsConditions() {
  return (
    <>
      <Navbar /> {/* ✅ Navbar will now appear on this page */}

      <div className="page-container" style={{ padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Terms & Conditions</h1>

        <p style={{ marginBottom: '16px' }}>
          These Terms and Conditions govern your use of the TuneUp web application. By accessing or using TuneUp, you agree to comply with and be bound by the following terms.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>1. Acceptance of Terms</h2>
        <p style={{ marginBottom: '16px' }}>
          By registering, accessing, or using TuneUp, you agree to these Terms and our Privacy Policy. If you do not agree, please do not use the app.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>2. User Responsibilities</h2>
        <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
          <li>Provide accurate information during registration and profile updates.</li>
          <li>Use the app in compliance with all applicable laws and regulations.</li>
          <li>Do not share your login credentials or access unauthorized data.</li>
        </ul>

        <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>3. Data & Privacy</h2>
        <p style={{ marginBottom: '16px' }}>
          Your personal and vehicle data is handled in accordance with our <a href="/privacy-policy">Privacy Policy</a>. We take your privacy seriously and implement industry-standard security measures.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>4. Prohibited Activities</h2>
        <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
          <li>Reverse-engineering or copying any part of the TuneUp app.</li>
          <li>Uploading malicious code or attempting to access restricted areas.</li>
          <li>Using the app to track unauthorized vehicles or impersonate others.</li>
        </ul>

        <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>5. Intellectual Property</h2>
        <p style={{ marginBottom: '16px' }}>
          All content, logos, and code in TuneUp are the property of the TuneUp team. You may not copy, modify, or distribute any part of the app without permission.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>6. Changes to Terms</h2>
        <p style={{ marginBottom: '16px' }}>
          We may update these Terms from time to time. Any changes will be reflected on this page, and continued use of the app means you accept those changes.
        </p>

        <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>7. Contact Us</h2>
        <p style={{ marginBottom: '20px' }}>
          For questions about these Terms, please contact us at <a href="mailto:legal@tuneupapp.com">legal@tuneupapp.com</a>.
        </p>

        <p style={{ fontStyle: 'italic', color: '#555' }}>
          Last updated: May 2025
        </p>
      </div>
    </>
  );
}
