import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCrown, FaUserCircle } from 'react-icons/fa';
import './navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        if (res.ok) {
          if (data.avatar) {
            setAvatar(`${import.meta.env.VITE_API_URL}${data.avatar}`);
          }
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
      <div className="navbar-logo">
        <Link to="/" className="navbar-brand">TuneUp</Link>
      </div>

      <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
        <li><Link to="/vehicles" onClick={() => setMenuOpen(false)}>Vehicles</Link></li>
        <li><Link to="/expenses" onClick={() => setMenuOpen(false)}>Expenses</Link></li>
        <li><Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
        <li><Link to="/documents" onClick={() => setMenuOpen(false)}>Documents</Link></li>
      </ul>

      <div className="navbar-actions">
        {isPremium ? (
          <div className="premium-badge">
            <FaCrown className="animated-crown" />
            <span>Premium</span>
          </div>
        ) : (
          <button className="upgrade-btn" onClick={() => navigate('/upgrade')}>
            <FaCrown className="crown-icon" />
            Upgrade
          </button>
        )}

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
