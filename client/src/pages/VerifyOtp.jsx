// src/pages/VerifyOtp.jsx
import React, { useState } from 'react';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Verified! Redirecting to login...');
        setTimeout(() => window.location.href = '/login', 2000);
      } else {
        setMessage(data.message || 'Verification failed');
      }
    } catch {
      setMessage('Error verifying OTP');
    }
  };

  return (
    <div className="auth-box">
      <h2>Enter OTP</h2>
      <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button onClick={handleVerify}>Verify</button>
      <p>{message}</p>
    </div>
  );
}
