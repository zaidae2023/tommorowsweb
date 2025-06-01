// src/components/Footer.jsx
import React from 'react';
import './footer.css'; // Import styles for the footer
import { Link } from 'react-router-dom'; // For internal navigation links

// Functional component to render the footer section
export default function Footer() {
  return (
    <footer className="footer">
      {/* Decorative accent bar at the top of the footer */}
      <div className="footer-accent" />

      <div className="footer-content">
        {/* App brand section with name or logo */}
        <div className="footer-section footer-brand">
          <h2 className="brand-title">TuneUp</h2>
        </div>

        {/* Navigation links to key pages in the app */}
        <div className="footer-section footer-nav">
          <h3 className="section-title">Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/services">Services</Link>
        </div>

        {/* Legal links and help center */}
        <div className="footer-section footer-legal">
          <h3 className="section-title">Legal</h3>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
          <Link to="/help">Help Center</Link> {/* Help Center link placed here */}
        </div>

        {/* Contact section with email for user support */}
        <div className="footer-section footer-contact">
          <h3 className="section-title">Let’s Connect</h3>
          <p className="contact-text">
            Have questions or feedback? Drop us a line:
          </p>
          <a href="mailto:support@tuneup.com" className="contact-email">
            support@tuneup.com
          </a>
        </div>
      </div>

      {/* Bottom line showing the copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TuneUp. All rights reserved.</p>
      </div>
    </footer>
  );
}
