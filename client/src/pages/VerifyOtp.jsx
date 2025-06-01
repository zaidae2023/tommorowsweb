import React, { useEffect, useState } from 'react';
import './VerifyOtp.css';
import { useLocation, useNavigate } from 'react-router-dom';

export default function VerifyOtp() {
  // State to store user input and status
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoginVerification, setIsLoginVerification] = useState(false); // True if it's login 2FA

  const navigate = useNavigate();
  const location = useLocation();

  // Run on initial load to determine verification type and fetch email
  useEffect(() => {
    const storedEmail = localStorage.getItem('emailForOtp'); // For 2FA login
    const urlEmail = new URLSearchParams(location.search).get('email'); // For email verification

    if (storedEmail) {
      setEmail(storedEmail);
      setIsLoginVerification(true); // It's a login OTP
    } else if (urlEmail) {
      setEmail(urlEmail);
      setIsLoginVerification(false); // It's a registration OTP
    }
  }, [location.search]);

  // Handles OTP verification when button is clicked
  const handleVerify = async () => {
    if (!email || !otp) return setMessage('Please enter both email and OTP');

    try {
      // Use different API endpoints for login vs registration
      const endpoint = isLoginVerification
        ? 'http://localhost:5000/auth/verify-login-otp'
        : 'http://localhost:5000/auth/verify-otp';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLoginVerification) {
          // Save token to localStorage for authenticated sessions
          localStorage.setItem('token', data.token);
          localStorage.removeItem('emailForOtp');
          setMessage('Verified! Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          // Email verification success
          setMessage('Email verified! Redirecting to login...');
          setTimeout(() => navigate('/login'), 1500);
        }
      } else {
        // Show error message from server
        setMessage(data.message || 'Verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setMessage('Error verifying OTP');
    }
  };

  return (
    <div className="auth-box">
      {/* Title changes based on verification type */}
      <h2>{isLoginVerification ? 'Enter Login OTP' : 'Verify Your Email'}</h2>

      {/* Email input (read-only if it's login verification) */}
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        readOnly={isLoginVerification}
      />

      {/* OTP input field */}
      <input
        type="text"
        placeholder="6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      {/* Verify button */}
      <button onClick={handleVerify}>Verify</button>

      {/* Message area for success or error feedback */}
      {message && <p className="verify-msg">{message}</p>}
    </div>
  );
}
