// Import React and necessary hooks
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Import success icon from react-icons
import { FaCheckCircle } from 'react-icons/fa';

// Import user context to update user info globally
import { UserContext } from "../context/usercontextContext";

// Import CSS for styling the success page
import './success.css';

export default function Success() {
  const navigate = useNavigate(); // Used to redirect user
  const { setUser } = useContext(UserContext); // Update user context with new plan info

  useEffect(() => {
    // Fetch the latest user profile after payment
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // Get JWT from local storage
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` } // Send token in header
        });
        const data = await res.json();

        // Update user plan in local storage and context
        if (data.plan) {
          localStorage.setItem('userPlan', data.plan);
          setUser((prev) => ({ ...prev, plan: data.plan }));
        }
      } catch (err) {
        console.error('Failed to fetch updated user profile:', err);
      }
    };

    fetchUser();

    // Automatically redirect to dashboard after 3 seconds
    const timeout = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    // Clear the timeout when component unmounts
    return () => clearTimeout(timeout);
  }, [navigate, setUser]);

  return (
    <div className="success-page">
      <div className="success-card">
        {/* Success icon */}
        <FaCheckCircle className="success-icon" />
        
        {/* Success message */}
        <h1>Payment Successful!</h1>
        <p>🎉 Thank you for upgrading to <strong>Premium</strong>.</p>
        <p>Redirecting you to your dashboard...</p>
      </div>
    </div>
  );
}
