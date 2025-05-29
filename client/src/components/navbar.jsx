import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCrown, FaUserCircle } from 'react-icons/fa';
import './navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        if (res.ok && data.avatar) {
          setAvatar(`${import.meta.env.VITE_API_URL}${data.avatar}`);
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

      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/vehicles">Vehicles</Link></li>
        <li><Link to="/expenses">Expenses</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/documents">Documents</Link></li>
      </ul>

      <div className="navbar-actions">
        {/* Upgrade Button */}
        <button className="upgrade-btn" onClick={() => navigate('/upgrade')}>
          <FaCrown className="crown-icon" />
          Upgrade
        </button>

        {/* Profile Icon */}
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
