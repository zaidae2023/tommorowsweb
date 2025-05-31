import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { UserContext } from "../context/usercontextContext";
import './success.css';

export default function Success() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.plan) {
          localStorage.setItem('userPlan', data.plan);
          setUser((prev) => ({ ...prev, plan: data.plan }));
        }
      } catch (err) {
        console.error('Failed to fetch updated user profile:', err);
      }
    };

    fetchUser();

    const timeout = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate, setUser]);

  return (
    <div className="success-page">
      <div className="success-card">
        <FaCheckCircle className="success-icon" />
        <h1>Payment Successful!</h1>
        <p>🎉 Thank you for upgrading to <strong>Premium</strong>.</p>
        <p>Redirecting you to your dashboard...</p>
      </div>
    </div>
  );
}
