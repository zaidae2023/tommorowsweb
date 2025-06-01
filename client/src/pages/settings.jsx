// Import React and necessary hooks
import React, { useEffect, useState, useRef } from 'react';

// Import custom styling and components
import './settings.css';
import Navbar from '../components/navbar';
import { FaCamera } from 'react-icons/fa'; // Camera icon for placeholder

export default function Settings() {
  // User profile-related states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [message, setMessage] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [plan, setPlan] = useState('free'); // Tracks user's current plan
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Toggle logout confirmation modal

  // File input reference for image upload
  const fileInputRef = useRef(null);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const data = await res.json();

        if (res.ok) {
          // Update state with user data
          setFullName(data.fullName || '');
          setEmail(data.email || '');
          setAvatar(data.avatar ? `${import.meta.env.VITE_API_URL}${data.avatar}` : '');
          setTwoFactorEnabled(data.twoFactorEnabled || false);
          setPlan(data.plan || 'free');
        } else {
          setMessage(data.message || 'Failed to load profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setMessage('Error fetching profile');
      }
    };

    fetchProfile();
  }, []);

  // Toggle 2FA for premium users
  const handle2FAToggle = async () => {
    if (plan === 'free') return; // Block for free users

    try {
      const updated = !twoFactorEnabled;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/twofactor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ enabled: updated }),
      });

      const data = await res.json();

      if (res.ok) {
        setTwoFactorEnabled(updated);
        setMessage(`✅ 2FA ${updated ? 'enabled' : 'disabled'}`);
      } else {
        setMessage(data.message || 'Failed to update 2FA');
      }
    } catch (err) {
      console.error('2FA toggle error:', err);
      setMessage('Error updating 2FA');
    }
  };

  // Trigger file upload dialog
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Handle profile picture upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        // Append timestamp to force refresh
        setAvatar(`${import.meta.env.VITE_API_URL}${data.avatar}?t=${Date.now()}`);
        setMessage('✅ Avatar uploaded');
      } else {
        setMessage(data.message || '❌ Failed to upload avatar');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      setMessage('❌ Error uploading avatar');
    }
  };

  // Handle profile picture deletion
  const handleDeletePhoto = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/avatar`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await res.json();

      if (res.ok) {
        setAvatar('');
        setMessage('🗑️ Avatar deleted');
      } else {
        setMessage(data.message || '❌ Failed to delete avatar');
      }
    } catch (err) {
      console.error('Avatar delete error:', err);
      setMessage('❌ Error deleting avatar');
    }
  };

  // Save profile (e.g., name)
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ fullName }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Profile updated successfully');
      } else {
        setMessage(data.message || '❌ Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage('❌ Error updating profile');
    }
  };

  // Handle user logout
  const confirmLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Top navigation */}
      <Navbar />

      {/* Main settings layout */}
      <div className="settings-page">
        <div className="settings-card">
          <h2 className="settings-title">Profile Settings</h2>

          {/* Display message */}
          {message && <p className="settings-message">{message}</p>}

          {/* Profile form */}
          <form className="settings-form" onSubmit={handleSave}>
            {/* Avatar upload section */}
            <div className="avatar-wrapper">
              {avatar ? (
                <>
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="avatar-image"
                    onClick={handleImageClick}
                    title="Click to change photo"
                  />
                  <button
                    type="button"
                    className="avatar-delete-btn"
                    onClick={handleDeletePhoto}
                    title="Delete photo"
                  >
                    ✖
                  </button>
                </>
              ) : (
                // Camera icon placeholder if no avatar
                <div className="avatar-placeholder" onClick={handleImageClick} title="Upload profile photo">
                  <FaCamera size={28} />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>

            {/* Full name input */}
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Email field (read-only) */}
            <div className="input-group">
              <label>Email</label>
              <input type="email" value={email} readOnly />
            </div>

            {/* 2FA toggle switch */}
            <div className="input-group toggle-group">
              <label htmlFor="2fa-toggle">
                2-Factor Authentication
                {plan === 'free' && (
                  <span style={{ color: 'red', fontSize: '12px', marginLeft: '10px' }}>
                    Premium Only
                  </span>
                )}
              </label>
              <label className="switch" title={plan === 'free' ? 'Upgrade to Premium to enable 2FA' : ''}>
                <input
                  type="checkbox"
                  id="2fa-toggle"
                  checked={twoFactorEnabled}
                  onChange={handle2FAToggle}
                  disabled={plan === 'free'}
                />
                <span className="slider round"></span>
              </label>
            </div>

            {/* Save and logout buttons */}
            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button" className="logout-btn" onClick={() => setShowLogoutModal(true)}>Logout</button>
          </form>
        </div>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button className="modal-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="modal-confirm" onClick={confirmLogout}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
