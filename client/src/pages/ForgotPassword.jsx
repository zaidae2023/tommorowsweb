// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import "../components/AuthForm.css";


const API_URL = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Verify OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  // Step 1: Send OTP to user's email
  const sendOtp = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
        setMessage('OTP sent to your email.');
      } else {
        setMessage(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
    }
  };

  // Step 2: Verify OTP and reset password
  const verifyOtp = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Password reset successfully. You can now login.');
      } else {
        setMessage(data.message || 'OTP verification failed.');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <p>{message}</p>
      {step === 1 ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button onClick={verifyOtp}>Verify & Reset</button>
        </>
      )}
    </div>
  );
}
