import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forgot.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
        setMessage('📩 OTP sent to your email.');
      } else {
        setMessage(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setMessage('Server error. Try again.');
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Password reset successful. You can now login.');
      } else {
        setMessage(data.message || '❌ OTP verification failed.');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setMessage('Server error. Try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Reset Your Password 🔐</h2>
        <p className="subtitle">{message}</p>

        <div className="forgot-form">
          {step === 1 ? (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button onClick={sendOtp} className="primary-btn">Send OTP</button>
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
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span className="toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button onClick={verifyOtp} className="primary-btn">Verify & Reset</button>
            </>
          )}
        </div>

        <div className="bottom-links">
          <span onClick={() => navigate('/login')}>← Back to <b>Login</b></span>
        </div>
      </div>
    </div>
  );
}
