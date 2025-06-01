// Import React, hooks, routing tools, and icons
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCrown, FaUserCircle } from 'react-icons/fa';
import './navbar.css';

// Navbar component for navigation and user actions
export default function Navbar() {
  const navigate = useNavigate();

  // State to hold user's profile avatar URL
  const [avatar, setAvatar] = useState('');

  // State to check if user has a premium plan
  const [isPremium, setIsPremium] = useState(false);

  // State to toggle the mobile menu (hamburger)
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const data = await res.json();

        if (res.ok) {
          // If user has a profile picture, set the avatar
          if (data.avatar) {
            setAvatar(`${import.meta.env.VITE_API_URL}${data.avatar}`);
          }

          // Set premium badge if user's plan is 'premium'
          setIsPremium(data.plan === 'premium');
        }
      } catch (err) {
        console.error('Failed to fetch profile avatar', err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="navbar">
      {/* App logo */}
      <div className="navbar-logo">
        <Link to="/" className="navbar-brand">TuneUp</Link>
      </div>

      {/* Hamburger menu for mobile view */}
      <div
        className={`hamburger ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Main navigation links */}
      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
        <li><Link to="/vehicles" onClick={() => setMenuOpen(false)}>Vehicles</Link></li>
        <li><Link to="/expenses" onClick={() => setMenuOpen(false)}>Expenses</Link></li>
        <li><Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
        <li><Link to="/documents" onClick={() => setMenuOpen(false)}>Documents</Link></li>
      </ul>

      {/* Right-side actions: Premium badge or Upgrade button + profile */}
      <div className="navbar-actions">
        {isPremium ? (
          // Show premium badge if user is premium
          <div className="premium-badge">
            <FaCrown className="animated-crown" />
            <span>Premium</span>
          </div>
        ) : (
          // Show upgrade button if user is not premium
          <button className="upgrade-btn" onClick={() => navigate('/upgrade')}>
            <FaCrown className="crown-icon" />
            Upgrade
          </button>
        )}

        {/* Show profile icon or avatar */}
        <Link to="/settings" className="profile-icon">
          {avatar ? (
            <img src={avatar} alt="Profile" className="navbar-avatar" />
          ) : (
            <FaUserCircle size={26} />
          )}
        </Link>
      </div>
    </header>
  );
}
