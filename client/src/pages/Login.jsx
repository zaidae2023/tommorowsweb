import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import googleIcon from '../assets/google.jpg';
import logo from '../assets/Logo.png'; // App logo
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  // States for form input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Show/hide password
  const navigate = useNavigate();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // If OTP is required before login
        if (data.requireOtp) {
          localStorage.setItem('emailForOtp', email);
          toast.info('OTP required. Redirecting...');
          setTimeout(() => navigate('/verify-otp'), 1500);
        } 
        // If login is successful with token
        else if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userEmail', email);
          toast.success('Login successful! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 1500);
        } 
        // Fallback if something is missing
        else {
          toast.error('Something went wrong. Please try again.');
        }
      } else {
        // If email not verified
        if (res.status === 403) {
          toast.warn('Email not verified. Redirecting to OTP...');
          setTimeout(() => navigate(`/verify-otp?email=${email}`), 1500);
        } else {
          toast.error(data.message || 'Login failed');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  // Handle Google login button click
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* App Logo */}
        <div className="logo-wrapper">
          <img src={logo} alt="TuneUp Logo" className="login-logo" />
        </div>

        <h3>Welcome Back 👋</h3>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Field with Toggle Icon */}
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

          <button type="submit" className="primary-btn">Login</button>
        </form>

        {/* Divider and Google Login */}
        <div className="divider">OR</div>

        <button onClick={handleGoogleLogin} className="google-btn">
          <img src={googleIcon} alt="Google" className="google-icon" />
          Continue with Google
        </button>

        {/* Register and Forgot Password Links */}
        <div className="bottom-links">
          <span onClick={() => navigate('/register')}>
            Don't have an account? <b>Register</b>
          </span>
          <span onClick={() => navigate('/forgot-password')}>
            <b>Forgot Password?</b>
          </span>
        </div>
      </div>

      {/* Toast messages */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  );
}
