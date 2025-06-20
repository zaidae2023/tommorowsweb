// React and core hooks
import React, { useEffect, useState } from 'react';
import './dashboard.css';

// Custom components and React Router hooks
import Navbar from '../components/navbar';
import { useLocation, useNavigate } from 'react-router-dom';

// Chart.js setup for bar chart visualization
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  // State variables to store app data
  const [vehicles, setVehicles] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [nextService, setNextService] = useState({ date: 'N/A', type: 'N/A' });
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [documents, setDocuments] = useState([]);

  // Navigation and URL parameters
  const location = useLocation();
  const navigate = useNavigate();

  // Store token from query params if it exists
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate]);

  // Fetch vehicles, expenses, and upcoming service on load
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in.');
        navigate('/login');
        return;
      }

      try {
        const base = import.meta.env.VITE_API_URL;

        // Send all 3 requests in parallel
        const [vehiclesRes, expensesRes, serviceRes] = await Promise.all([
          fetch(`${base}/api/vehicles`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${base}/api/expenses`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${base}/api/services/upcoming`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        // If any response is unauthorized or invalid, redirect
        if (!vehiclesRes.ok || !expensesRes.ok || !serviceRes.ok) {
          throw new Error('Session expired');
        }

        // Store vehicles
        const vehiclesData = await vehiclesRes.json();
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : vehiclesData.vehicles || []);

        // Store expenses
        const expensesData = await expensesRes.json();
        setExpenses(expensesData);

        // Set next upcoming service
        const serviceData = await serviceRes.json();
        if (Array.isArray(serviceData) && serviceData.length > 0) {
          const firstService = serviceData[0];
          const dateObj = new Date(firstService.date);
          const daysLeft = Math.ceil((dateObj - new Date()) / (1000 * 60 * 60 * 24));
          setNextService({
            date: dateObj.toLocaleDateString(),
            type: firstService.type || 'Service',
            countdown: daysLeft,
          });
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        alert('Session expired or unauthorized. Please log in again.');
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  // Fetch uploaded documents
  useEffect(() => {
    const fetchDocuments = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/documents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error('Document fetch error:', err);
      }
    };

    fetchDocuments();
  }, []);

  // Get city name based on user IP address
  useEffect(() => {
    const fetchCityFromIP = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        setCity(data?.city || 'Delhi');
      } catch {
        setCity('Delhi');
      }
    };
    fetchCityFromIP();
  }, []);

  // Fetch weather info using the city name
  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) return;
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
        );
        const data = await res.json();
        if (res.ok) {
          setWeather({
            temp: data.main.temp,
            condition: data.weather[0].description,
            icon: data.weather[0].icon,
          });
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
      }
    };
    fetchWeather();
  }, [city]);

  // Prepare data for bar chart
  const getChartData = () => {
    const types = ['Fuel', 'Maintenance', 'Insurance'];
    const data = types.map((type) =>
      expenses
        .filter((exp) => exp.type === type)
        .reduce((sum, exp) => sum + exp.amount, 0)
    );
    return {
      labels: types,
      datasets: [
        {
          label: 'Expenses by Type',
          data,
          backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
          borderRadius: 6,
        },
      ],
    };
  };

  // Suggest whether it's a good time to wash the car
  const getCarWashAdvice = () => {
    if (!weather?.condition) return '';
    const cond = weather.condition.toLowerCase();
    if (['rain', 'storm', 'drizzle', 'snow'].some((w) => cond.includes(w))) {
      return '❌ Not a good time for a car wash.';
    }
    return '✅ Great time to wash your car!';
  };

  // Dashboard layout
  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h1 className="typing-glow-title"><span>Welcome to Your Dashboard!</span></h1>

        {/* Quick navigation buttons */}
        <div className="quick-links">
          <button onClick={() => navigate('/documents')}>📄 Documents</button>
          <button onClick={() => navigate('/vehicles')}>➕ Add Vehicle</button>
          <button onClick={() => navigate('/expenses')}>💸 Log Expense</button>
          <button onClick={() => navigate('/services')}>🛠️ Schedule Service</button>
        </div>

        <div className="info-grid">
          {/* Weather card */}
          {weather && (
            <div className="weather-card">
              <img
                src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt="weather icon"
              />
              <div>
                <h4>🌤️ Weather in {city}</h4>
                <p>{weather.temp}°C – {weather.condition}</p>
                <p><strong>{getCarWashAdvice()}</strong></p>
              </div>
            </div>
          )}

          {/* Vehicle and Service Info Cards */}
          <Card title="Registered Vehicles" value={vehicles.length} />

          <Card
            title="Next Service"
            value={
              nextService.date !== 'N/A'
                ? `${nextService.type} on ${nextService.date} (${nextService.countdown} days left)`
                : 'No upcoming service'
            }
          />

          {/* Expiring documents warning */}
          {documents
            .filter((doc) => {
              const daysLeft = Math.ceil((new Date(doc.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
              return daysLeft <= 15;
            })
            .map((doc) => {
              const daysLeft = Math.ceil((new Date(doc.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <Card
                  key={doc._id}
                  title={`${doc.docType} Expiry`}
                  value={`Expires in ${daysLeft} days (${new Date(doc.expiryDate).toLocaleDateString()})`}
                />
              );
            })}

          {/* List of recent expenses */}
          <div className="recent-activity">
            <h2>Recent Expenses</h2>
            <ul>
              {expenses.length > 0 ? (
                expenses
                  .slice(-3)
                  .reverse()
                  .map((exp, i) => (
                    <li key={i}>
                      {exp.type} – {exp.amount} {exp.currency} on{' '}
                      {new Date(exp.date).toLocaleDateString()}
                    </li>
                  ))
              ) : (
                <li>No recent expenses logged.</li>
              )}
            </ul>
          </div>

          {/* Expense chart section */}
          <div className="chart-section">
            <h2>Expense Breakdown</h2>
            <Bar
              data={getChartData()}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, ticks: { precision: 0 } },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable card component
function Card({ title, value }) {
  const isExpiryAlert = title.toLowerCase().includes('expiry');

  return (
    <div className={`card ${isExpiryAlert ? 'expiry-card' : ''}`}>
      <h2>{isExpiryAlert ? '⚠️ ' + title : title}</h2>
      <p>{value}</p>
    </div>
  );
}
