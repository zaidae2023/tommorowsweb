import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vehicles`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();

        if (res.ok) {
          setVehicles(data.vehicles || []);
        } else {
          setError(data.message || 'Failed to load vehicles');
        }
      } catch {
        setError('Error loading vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this vehicle?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setVehicles((prev) => prev.filter((v) => v._id !== id));
      } else {
        alert(data.message || 'Failed to delete vehicle');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting');
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          backgroundColor: '#ffffff',
          color: '#222',
          minHeight: '100vh',
          width: '100%',
          padding: '30px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>My Vehicles</h2>
          <button
            onClick={() => navigate('/add-vehicle')}
            style={{
              backgroundColor: '#1f7aec',
              color: '#fff',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ➕ Add Vehicle
          </button>
        </div>

        {loading && <p>Loading vehicles...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && vehicles.length === 0 && (
          <p>You haven't added any vehicles yet.</p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              style={{
                background: '#f9f9f9',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                width: '250px',
                position: 'relative',
              }}
            >
              <h3>{vehicle.name}</h3>
              <p><strong>Model:</strong> {vehicle.model}</p>
              <p><strong>Year:</strong> {vehicle.year}</p>
              <p><strong>Reg #:</strong> {vehicle.registration}</p>
              <button
                onClick={() => handleDelete(vehicle._id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#ff4d4f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                ❌ Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
