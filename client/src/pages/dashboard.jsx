import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import Navbar from '../components/navbar'; // Adjust the path as needed

export default function Dashboard() {
  const [vehicleCount, setVehicleCount] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [nextService, setNextService] = useState({ date: 'N/A', type: 'N/A' });

  useEffect(() => {
    // Mock fetching dashboard data (Replace this with real API calls)
    const fetchDashboardData = async () => {
      setVehicleCount(2); // fetched from backend
      setExpenses(450);   // fetched from backend
      setNextService({ date: '2025-06-15', type: 'Oil Change' }); // fetched from backend
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h1>Dashboard Overview</h1>
        <div className="dashboard-cards">
          <div className="card vehicle-card">
            <h2>Registered Vehicles</h2>
            <p>{vehicleCount}</p>
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
