import React, { useEffect, useState } from 'react';
import './dashboard.css';
import Navbar from '../components/navbar';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [expenses, setExpenses] = useState(0);
  const [nextService, setNextService] = useState({ date: 'N/A', type: 'N/A' });

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Handle Google redirect token
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate]);

  // ✅ Fetch vehicles and expenses
  useEffect(() => {
    const fetchVehiclesAndExpenses = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in.');
        navigate('/login');
        return;
      }

      try {
        // ✅ Fetch vehicles
        const vehiclesRes = await fetch('http://localhost:5000/api/vehicles', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const vehiclesData = await vehiclesRes.json();
        const vehiclesList = Array.isArray(vehiclesData)
          ? vehiclesData
          : vehiclesData.vehicles || [];

        setVehicles(vehiclesList);

        // ✅ Fetch expenses
        const expensesRes = await fetch('http://localhost:5000/api/expenses', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const expensesData = await expensesRes.json();

        if (Array.isArray(expensesData)) {
          const total = expensesData.reduce((sum, exp) => sum + exp.amount, 0);
          setExpenses(total);
        } else {
          setExpenses(0);
        }

        // ✅ Static next service (optional: make dynamic)
        setNextService({ date: '2025-06-15', type: 'Oil Change' });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        alert('Session expired or unauthorized. Please log in again.');
        navigate('/login');
      }
    };

    fetchVehiclesAndExpenses();
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h1>Dashboard Overview</h1>

        <div className="dashboard-cards">
          <div className="card vehicle-card">
            <h2>Registered Vehicles</h2>
            <p>Total: {vehicles.length}</p>

            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              {vehicles.length > 0 ? (
                vehicles.map((vehicle, index) => (
                  <li key={vehicle._id || index}>
                    🚗 <strong>{vehicle.name}</strong> – {vehicle.model} ({vehicle.year})
                  </li>
                ))
              ) : (
                <li>No vehicles found.</li>
              )}
            </ul>
          </div>

          <div className="card expenses-card">
            <h2>Total Expenses</h2>
            <p>${expenses}</p>
          </div>

          <div className="card service-card">
            <h2>Next Service Reminder</h2>
            <p>{nextService.type}</p>
            <p>Date: {nextService.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
