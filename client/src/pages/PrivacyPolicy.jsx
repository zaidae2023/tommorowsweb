import React from 'react';
import Navbar from '../components/navbar';

export default function PrivacyPolicy() {
  return (
    <div className="page-container" style={{ padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Privacy Policy</h1>

      <p style={{ marginBottom: '16px' }}>
        At TuneUp, your privacy is our priority. This Privacy Policy explains how we collect, use, and protect your personal information when you use our web app.
      </p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>📋 What We Collect</h2>
      <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
        <li><strong>Account Information:</strong> Full name, email address, and password.</li>
        <li><strong>Vehicle Data:</strong> Information about your vehicles including make, model, and VIN.</li>
        <li><strong>Usage Data:</strong> Information like login times, service logs, and user preferences.</li>
      </ul>

      <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>🔒 How We Use Your Data</h2>
      <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
        <li>To personalize your dashboard and experience.</li>
        <li>To store and manage your vehicle-related data securely.</li>
        <li>To improve app performance and add new features.</li>
      </ul>

      <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>📤 Sharing Your Data</h2>
      <p style={{ marginBottom: '20px' }}>
        We do not sell or rent your personal information. We may share minimal data with trusted third-party services (like authentication providers) solely to provide core app functionality.
      </p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>🛡️ Data Protection</h2>
      <p style={{ marginBottom: '20px' }}>
        We use encryption, secure databases, and access controls to protect your data. Passwords are hashed using industry-standard algorithms (like bcrypt).
      </p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>👤 Your Rights</h2>
      <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
        <li>Access your personal data.</li>
        <li>Update or delete your account details.</li>
        <li>Request account deletion at any time.</li>
      </ul>

      <h2 style={{ fontSize: '1.3rem', marginTop: '30px' }}>📅 Policy Updates</h2>
      <p style={{ marginBottom: '20px' }}>
        This policy may be updated occasionally to reflect changes in law or app features. We'll notify users about significant updates.
      </p>

      <p style={{ fontStyle: 'italic', color: '#555' }}>
        If you have any questions about this Privacy Policy, contact us at <a href="mailto:privacy@tuneupapp.com">privacy@tuneupapp.com</a>.
      </p>
    </div>
  );
}
