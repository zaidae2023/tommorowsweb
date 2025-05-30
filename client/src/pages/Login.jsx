import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import googleIcon from '../assets/google.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
        if (data.requireOtp) {
          // ✅ 2FA is ON → redirect to OTP verification page
          localStorage.setItem('emailForOtp', email);
          navigate('/verify-otp');
        } else if (data.token) {
          // ✅ 2FA is OFF → login and save token
          localStorage.setItem('token', data.token);
          localStorage.setItem('userEmail', email); // ✅ Save email for Stripe
          navigate('/dashboard');
        } else {
          alert('Something went wrong. Please try again.');
        }
      } else {
        if (res.status === 403) {
          const goVerify = confirm('Email not verified. Would you like to enter OTP now?');
          if (goVerify) {
            navigate(`/verify-otp?email=${email}`);
          }
        } else {
          alert(data.message || 'Login failed');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to your TuneUp account</p>

        <form onSubmit={handleLogin} className="login-form">
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
          <button type="submit" className="primary-btn">Login</button>
        </form>

        <div className="divider">OR</div>

        <button onClick={handleGoogleLogin} className="google-btn">
          <img src={googleIcon} alt="Google" className="google-icon" />
          Continue with Google
        </button>

        <div className="bottom-links">
          <span onClick={() => navigate('/register')}>Don't have an account? <b>Register</b></span>
          <span onClick={() => navigate('/forgot-password')}><b>Forgot Password?</b></span>
        </div>
      </div>
    </div>
  );
}
