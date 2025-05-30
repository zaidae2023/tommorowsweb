// src/components/Footer.jsx
import React from 'react';
import './footer.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Accent stripe */}
      <div className="footer-accent" />

      <div className="footer-content">
        {/* Brand & tagline */}
        <div className="footer-section footer-brand">
          <h2 className="brand-title">TuneUp</h2>
        </div>

        {/* Navigation links */}
        <div className="footer-section footer-nav">
          <h3 className="section-title">Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/services">Services</Link>
        </div>

        {/* Legal links with Help Center moved here */}
        <div className="footer-section footer-legal">
          <h3 className="section-title">Legal</h3>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
          <Link to="/help">Help Center</Link> {/* ✅ Moved here */}
        </div>

        {/* Contact / Let’s Connect */}
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

      {/* Bottom copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TuneUp. All rights reserved.</p>
      </div>
    </footer>
  );
}
