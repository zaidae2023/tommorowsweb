import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forgot.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
        toast.success('📩 OTP sent to your email.');
      } else {
        toast.error(data.message || '❌ Failed to send OTP.');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      toast.error('❌ Server error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userEmail', email);
        toast.success('✅ Password reset successful! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.message || '❌ OTP verification failed.');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      toast.error('❌ Server error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Reset Your Password 🔐</h2>
        <p className="subtitle">Follow the steps below to recover your account</p>

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
              <button onClick={sendOtp} className="primary-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
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
              <button onClick={verifyOtp} className="primary-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Reset'}
              </button>
            </>
          )}
        </div>

        <div className="bottom-links">
          <span onClick={() => navigate('/login')}>← Back to <b>Login</b></span>
        </div>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar pauseOnHover />
    </div>
  );
}
