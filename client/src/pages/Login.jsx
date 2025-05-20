import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import googleIcon from '../assets/google.jpg'; // adjust path if needed


const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/dashboard');
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

  // Redirect to backend Google OAuth
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login to TuneUp</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <button onClick={handleGoogleLogin} className="google-btn">
  <img src={googleIcon} alt="Google" className="google-icon" />
  Continue with Google
</button>


        <div className="links">
          <span onClick={() => navigate('/register')}>Don't have an account? Register</span>
          <span onClick={() => navigate('/forgot-password')}>Forgot Password?</span>
        </div>
      </div>
    </div>
  );
}
