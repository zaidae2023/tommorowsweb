import React, { useEffect, useState } from 'react';
import './settings.css';
import Navbar from '../components/navbar';
import defaultAvatar from '../assets/default-avatar.png';

export default function Settings() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // ✅ Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Handle name change
  const handleNameChange = (e) => {
    setUser((prev) => ({ ...prev, name: e.target.value }));
  };

  // ✅ Save profile info
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: user.name }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Profile updated');
        setUser((prev) => ({ ...prev, name: data.name }));
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  // ✅ Upload new profile picture
  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert('Avatar updated');
        setUser((prev) => ({ ...prev, avatar: data.avatar }));
        setSelectedFile(null);
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
    }
  };

  // ✅ Delete profile picture
  const handleDeleteAvatar = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/avatar`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert('Avatar deleted');
        setUser((prev) => ({ ...prev, avatar: '' }));
      }
    } catch (err) {
      console.error('Failed to delete avatar:', err);
    }
  };

  return (
    <div className="settings-container">
      <Navbar />
      <div className="settings-box">
        <h2>Profile Settings</h2>

        <div className="avatar-section">
          <img
            src={user.avatar || defaultAvatar}
            alt="Avatar"
            className="avatar-preview"
          />
          <div>
            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            <button onClick={handleImageUpload}>Change</button>
            <button className="delete-btn" onClick={handleDeleteAvatar}>Delete</button>
          </div>
        </div>

        <div className="input-group">
          <label>Name</label>
          <input type="text" value={user.name} onChange={handleNameChange} />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input type="email" value={user.email} disabled />
        </div>

        <button className="save-btn" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}
