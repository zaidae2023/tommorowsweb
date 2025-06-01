// Import React and required components
import React from 'react';
import Navbar from '../components/navbar';
import './Upgrade.css'; // Page-specific styles

// Import icons from react-icons
import {
  FaCrown,
  FaFileExport,
  FaCalendarAlt,
  FaCar,
  FaMoneyBill,
  FaShieldAlt,
  FaGlobe,
  FaFileAlt,
} from 'react-icons/fa';

export default function UpgradePage() {
  // Handles the Stripe checkout process
  const handleUpgrade = async () => {
    const email = localStorage.getItem('userEmail'); // Get logged-in user's email

    if (!email) {
      alert('User email not found. Please log in again.');
      return;
    }

    try {
      // Call backend to create a Stripe checkout session
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      // Redirect user to Stripe payment page
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session.');
      }
    } catch (error) {
      console.error('Stripe Checkout Error:', error);
      alert('Upgrade failed. Please try again.');
    }
  };

  return (
    <>
      {/* Navigation bar */}
      <Navbar />

      {/* Upgrade main content */}
      <div className="upgrade-page">
        {/* Header section */}
        <div className="upgrade-header">
          <FaCrown className="crown-icon-big" />
          <h1>
            Upgrade to <span>Premium</span>
          </h1>
          <p>
            Unlock the full power of TuneUp with advanced features designed for
            serious vehicle tracking and management.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="features-grid">
          <div className="feature-card">
            <FaFileExport className="feature-icon" />
            <h3>Unlimited Exports</h3>
            <p>Export unlimited PDF and CSV reports of your vehicle data anytime.</p>
          </div>

          <div className="feature-card">
            <FaCalendarAlt className="feature-icon" />
            <h3>Unlimited Scheduled Services</h3>
            <p>Set as many reminders as you need for maintenance and repairs.</p>
          </div>

          <div className="feature-card">
            <FaCar className="feature-icon" />
            <h3>Add Unlimited Vehicles</h3>
            <p>No limits—track all your personal or business vehicles in one place.</p>
          </div>

          <div className="feature-card">
            <FaMoneyBill className="feature-icon" />
            <h3>Track All Expenses</h3>
            <p>Log unlimited fuel, insurance, maintenance, and other expenses.</p>
          </div>

          <div className="feature-card">
            <FaShieldAlt className="feature-icon" />
            <h3>2-Factor Authentication</h3>
            <p>Keep your account more secure with OTP-based login verification.</p>
          </div>

          <div className="feature-card">
            <FaFileAlt className="feature-icon" />
            <h3>Documents Upload</h3>
            <p>Upload unlimited registration or insurance documents and set expiry dates for timely reminders.</p>
          </div>
        </div>

        {/* Extra standalone feature */}
        <div className="feature-card standalone-card">
          <FaGlobe className="feature-icon" />
          <h3>Multi-Currency Support</h3>
          <p>Manage your expenses in your preferred currency, wherever you are.</p>
        </div>

        {/* Call-to-action button */}
        <div className="upgrade-cta">
          <button className="upgrade-now-btn" onClick={handleUpgrade}>
            Buy Premium only $10.00/month
          </button>
        </div>
      </div>
    </>
  );
}
