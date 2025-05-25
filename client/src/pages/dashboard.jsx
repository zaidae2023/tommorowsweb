import React, { useEffect, useState } from 'react';
import './dashboard.css';
import Navbar from '../components/navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [nextService, setNextService] = useState({ date: 'N/A', type: 'N/A' });

  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in.');
        navigate('/login');
        return;
      }

      try {
        const [vehiclesRes, expensesRes, serviceRes] = await Promise.all([
          fetch('http://localhost:5000/api/vehicles', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/expenses', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/services/upcoming', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const vehiclesData = await vehiclesRes.json();
        const vehiclesList = Array.isArray(vehiclesData)
          ? vehiclesData
          : vehiclesData.vehicles || [];
        setVehicles(vehiclesList);

        const expensesData = await expensesRes.json();
        setExpenses(expensesData);

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
        } else {
          setNextService({ date: 'N/A', type: 'N/A', countdown: null });
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        alert('Session expired or unauthorized. Please log in again.');
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchCityFromIP = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        setCity(data?.city || 'Dubai');
      } catch {
        setCity('Dubai');
      }
    };

    fetchCityFromIP();
  }, []);

  useEffect(() => {
    if (!city) return;
    const fetchWeather = async () => {
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

  const getCarWashAdvice = (condition) => {
    const desc = condition.toLowerCase();
    if (desc.includes('clear') || desc.includes('sun')) return '✅ Perfect day for a car wash!';
    if (desc.includes('cloud')) return '✅ Okay for a car wash.';
    if (desc.includes('rain') || desc.includes('storm')) return '❌ Not ideal – it\'s rainy.';
    if (desc.includes('dust') || desc.includes('sand')) return '❌ Avoid – dusty conditions.';
    return 'ℹ️ Check conditions before washing your car.';
  };

  const getAdviceColor = (condition) => {
    const desc = condition.toLowerCase();
    if (desc.includes('clear') || desc.includes('sun')) return '#2e7d32';
    if (desc.includes('cloud')) return '#f57c00';
    return '#c62828';
  };

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

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h1>Welcome to Your Dashboard</h1>
        <p>Here’s an overview of your vehicle activities 🚘</p>

        {/* Grid Layout: Weather + Cards */}
        <div className="dashboard-top-grid">
          {weather && (
            <div className="weather-card">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt="weather-icon"
              />
              <div>
                <h4>{city}</h4>
                <p>{weather.temp}°C – {weather.condition}</p>
                <p style={{ fontWeight: 'bold', color: getAdviceColor(weather.condition) }}>
                  {getCarWashAdvice(weather.condition)}
                </p>
              </div>
            </div>
          )}
          <Card title="Registered Vehicles" value={vehicles.length} />
          <Card
            title="Next Service"
            value={
              nextService.date !== 'N/A'
                ? `${nextService.type} on ${nextService.date} (${nextService.countdown} days left)`
                : 'No upcoming service'
            }
          />
        </div>

        {/* Buttons */}
        <div className="quick-links">
          <button onClick={() => navigate('/vehicles')}>➕ Add Vehicle</button>
          <button onClick={() => navigate('/expenses')}>💸 Log Expense</button>
          <button onClick={() => navigate('/services')}>🛠️ Schedule Service</button>
        </div>

        {/* Recent Expenses */}
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

        {/* Chart Section */}
        <div className="chart-section">
          <h2>Expense Breakdown</h2>
          <Bar
            data={getChartData()}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { precision: 0 },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ✅ Reusable Card
function Card({ title, value }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{value}</p>
    </div>
  );
}
