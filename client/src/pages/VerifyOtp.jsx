import React, { useEffect, useState } from 'react';
import './VerifyOtp.css';
import { useLocation, useNavigate } from 'react-router-dom';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoginVerification, setIsLoginVerification] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedEmail = localStorage.getItem('emailForOtp');
    const urlEmail = new URLSearchParams(location.search).get('email');

    if (storedEmail) {
      setEmail(storedEmail);
      setIsLoginVerification(true); // 2FA login
    } else if (urlEmail) {
      setEmail(urlEmail); // Registration verification
      setIsLoginVerification(false);
    }
  }, [location.search]);

  const handleVerify = async () => {
    if (!email || !otp) return setMessage('Please enter both email and OTP');

    try {
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
          localStorage.setItem('token', data.token); // ✅ Save token
          localStorage.removeItem('emailForOtp');
          setMessage('✅ Verified! Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          setMessage('✅ Email verified! Redirecting to login...');
          setTimeout(() => navigate('/login'), 1500);
        }
      } else {
        setMessage(data.message || '❌ Verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setMessage('Error verifying OTP');
    }
  };

  return (
    <div className="auth-box">
      <h2>{isLoginVerification ? 'Enter Login OTP' : 'Verify Your Email'}</h2>

      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        readOnly={isLoginVerification}
      />

      <input
        type="text"
        placeholder="6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={handleVerify}>Verify</button>

      {message && <p className="verify-msg">{message}</p>}
    </div>
  );
}
