import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Store the email for later use (e.g., Stripe checkout)
        localStorage.setItem('userEmail', email);

        alert('✅ Registration successful! OTP sent to your email.');
        navigate(`/verify-otp?email=${email}`);
      } else {
        alert(data.message || '❌ Registration failed.');
      }
    } catch (err) {
      console.error('Register error:', err);
      alert('❌ Something went wrong during registration.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Create Account 🚘</h2>
        <p className="subtitle">Register to get started with TuneUp</p>

        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="primary-btn">Register</button>
        </form>

        <div className="bottom-links">
          <span onClick={() => navigate('/login')}>
            Already have an account? <b>Login</b>
          </span>
        </div>
      </div>
    </div>
  );
}
