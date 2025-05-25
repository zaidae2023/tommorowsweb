import React, { useEffect, useState, useRef } from 'react';
import './settings.css';
import Navbar from '../components/navbar';

export default function Settings() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        if (res.ok) {
          setFullName(data.fullName || '');
          setEmail(data.email || '');
          setAvatar(data.avatar ? `${import.meta.env.VITE_API_URL}${data.avatar}` : '');
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

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

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

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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

  return (
    <>
      <Navbar />
      <div className="settings-page">
        <div className="settings-card">
          <h2 className="settings-title">Profile Settings</h2>

          {message && <p className="settings-message">{message}</p>}

          <form className="settings-form" onSubmit={handleSave}>
            <div className="avatar-wrapper">
              <img
                src={avatar || '/default-avatar.png'}
                alt="Avatar"
                className="avatar-image"
                onClick={handleImageClick}
                title="Click to change photo"
              />
              {avatar && (
                <button
                  type="button"
                  className="avatar-delete-btn"
                  onClick={handleDeletePhoto}
                  title="Delete photo"
                >
                  ✖
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>

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

            <div className="input-group">
              <label>Email</label>
              <input type="email" value={email} readOnly />
            </div>

            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        </div>
      </div>
    </>
  );
}
