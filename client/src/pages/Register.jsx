// Import React and useState for handling form input state
import React, { useState } from 'react';

// useNavigate for redirecting users after registration
import { useNavigate } from 'react-router-dom';

// Import stylesheet specific to this component
import './register.css';

// Import eye icons to toggle password visibility
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Import toast functions and styling for notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Get the API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  // State for form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Navigation hook for redirecting
  const navigate = useNavigate();

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      // Send registration data to the backend
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json(); // Parse response JSON

      if (res.ok) {
        // Save email in localStorage for OTP verification
        localStorage.setItem('userEmail', email);

        // Show success toast
        toast.success('Registration successful! OTP sent to your email.');

        // Redirect to OTP verification after short delay
        setTimeout(() => navigate(`/verify-otp?email=${email}`), 2000);
      } else {
        // Show error toast if backend returns an error
        toast.error(data.message || 'Registration failed.');
      }
    } catch (err) {
      // Catch unexpected errors
      console.error('Register error:', err);
      toast.error('Something went wrong during registration.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Create Account 🚘</h2>
        <p className="subtitle">Register to get started with TuneUp</p>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="register-form">
          {/* Full Name Input */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Input with toggle visibility */}
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Toggle password visibility */}
            <span className="toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Submit Button */}
          <button type="submit" className="primary-btn">Register</button>
        </form>

        {/* Link to login page */}
        <div className="bottom-links">
          <span onClick={() => navigate('/login')}>
            Already have an account? <b>Login</b>
          </span>
        </div>
      </div>

      {/* Toast container for notifications */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar pauseOnHover />
    </div>
  );
}
