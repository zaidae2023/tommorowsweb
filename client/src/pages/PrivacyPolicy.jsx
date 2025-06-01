//  Import React and required dependencies
import React from 'react';
import Navbar from '../components/navbar'; // Reusable navbar component
import './PrivacyPolicy.css'; // External CSS for styling the privacy policy page

//  Main functional component for the Privacy Policy page
export default function PrivacyPolicy() {
  return (
    <>
      {/* Navbar at the top */}
      <Navbar />

      {/* Main container for the policy content */}
      <div className="privacy-container">
        {/* Page title */}
        <h1 className="privacy-title">Privacy Policy</h1>

        {/* Introduction paragraph */}
        <p className="privacy-paragraph">
          At <strong>TuneUp</strong>, your privacy is our priority. This Privacy Policy explains how we collect, use, and protect your personal information when you use our web app.
        </p>

        {/* Section: What data we collect */}
        <section>
          <h2 className="privacy-section-title">📋 What We Collect</h2>
          <ul className="privacy-list">
            <li><strong>Account Information:</strong> Full name, email address, and password.</li>
            <li><strong>Vehicle Data:</strong> Information about your vehicles including make, model, and VIN.</li>
            <li><strong>Usage Data:</strong> Information like login times, service logs, and user preferences.</li>
          </ul>
        </section>

        {/* Section: How we use collected data */}
        <section>
          <h2 className="privacy-section-title">🔒 How We Use Your Data</h2>
          <ul className="privacy-list">
            <li>To personalize your dashboard and experience.</li>
            <li>To store and manage your vehicle-related data securely.</li>
            <li>To improve app performance and add new features.</li>
          </ul>
        </section>

        {/* Section: Data sharing practices */}
        <section>
          <h2 className="privacy-section-title">📤 Sharing Your Data</h2>
          <p className="privacy-paragraph">
            We do not sell or rent your personal information. We may share minimal data with trusted third-party services (like authentication providers) solely to provide core app functionality.
          </p>
        </section>

        {/* Section: How we protect user data */}
        <section>
          <h2 className="privacy-section-title">🛡️ Data Protection</h2>
          <p className="privacy-paragraph">
            We use encryption, secure databases, and access controls to protect your data. Passwords are hashed using industry-standard algorithms (like bcrypt).
          </p>
        </section>

        {/* Section: User rights and control over data */}
        <section>
          <h2 className="privacy-section-title">👤 Your Rights</h2>
          <ul className="privacy-list">
            <li>Access your personal data.</li>
            <li>Update or delete your account details.</li>
            <li>Request account deletion at any time.</li>
          </ul>
        </section>

        {/* Section: Updates to the privacy policy */}
        <section>
          <h2 className="privacy-section-title">📅 Policy Updates</h2>
          <p className="privacy-paragraph">
            This policy may be updated occasionally to reflect changes in law or app features. We'll notify users about significant updates.
          </p>

          {/* Contact info for privacy-related concerns */}
          <p className="privacy-contact">
            If you have any questions about this Privacy Policy, contact us at <a href="mailto:privacy@tuneupapp.com">privacy@tuneupapp.com</a>.
          </p>
        </section>
      </div>
    </>
  );
}
