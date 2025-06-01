// Import React
import React from 'react';

// Import the Navbar component for consistent navigation across pages
import Navbar from '../components/navbar';

// Import external CSS file for styling this page
import './TermsConditions.css';

export default function TermsConditions() {
  return (
    <>
      {/* Top navigation bar */}
      <Navbar />

      {/* Main container for the terms content */}
      <div className="terms-container">
        {/* Page title */}
        <h1 className="terms-title">Terms & Conditions</h1>

        {/* Introduction paragraph */}
        <p className="terms-paragraph">
          These Terms and Conditions govern your use of the TuneUp web application. 
          By accessing or using TuneUp, you agree to comply with and be bound by the following terms.
        </p>

        {/* Section 1: Acceptance of Terms */}
        <h2 className="terms-section-title">1. Acceptance of Terms</h2>
        <p className="terms-paragraph">
          By registering, accessing, or using TuneUp, you agree to these Terms and our{' '}
          <a href="/privacy-policy" className="terms-link">Privacy Policy</a>. 
          If you do not agree, please do not use the app.
        </p>

        {/* Section 2: User Responsibilities */}
        <h2 className="terms-section-title">2. User Responsibilities</h2>
        <ul className="terms-list">
          <li>Provide accurate information during registration and profile updates.</li>
          <li>Use the app in compliance with all applicable laws and regulations.</li>
          <li>Do not share your login credentials or access unauthorized data.</li>
        </ul>

        {/* Section 3: Data & Privacy */}
        <h2 className="terms-section-title">3. Data & Privacy</h2>
        <p className="terms-paragraph">
          Your personal and vehicle data is handled in accordance with our{' '}
          <a href="/privacy-policy" className="terms-link">Privacy Policy</a>. 
          We take your privacy seriously and implement industry-standard security measures.
        </p>

        {/* Section 4: Prohibited Activities */}
        <h2 className="terms-section-title">4. Prohibited Activities</h2>
        <ul className="terms-list">
          <li>Reverse-engineering or copying any part of the TuneUp app.</li>
          <li>Uploading malicious code or attempting to access restricted areas.</li>
          <li>Using the app to track unauthorized vehicles or impersonate others.</li>
        </ul>

        {/* Section 5: Intellectual Property */}
        <h2 className="terms-section-title">5. Intellectual Property</h2>
        <p className="terms-paragraph">
          All content, logos, and code in TuneUp are the property of the TuneUp team. 
          You may not copy, modify, or distribute any part of the app without permission.
        </p>

        {/* Section 6: Changes to Terms */}
        <h2 className="terms-section-title">6. Changes to Terms</h2>
        <p className="terms-paragraph">
          We may update these Terms from time to time. Any changes will be reflected on this page, 
          and continued use of the app means you accept those changes.
        </p>

        {/* Section 7: Contact Information */}
        <h2 className="terms-section-title">7. Contact Us</h2>
        <p className="terms-paragraph">
          For questions about these Terms, please contact us at{' '}
          <a href="mailto:legal@tuneupapp.com" className="terms-link">legal@tuneupapp.com</a>.
        </p>

        {/* Last updated date */}
        <p className="terms-updated">
          Last updated: May 2025
        </p>
      </div>
    </>
  );
}
