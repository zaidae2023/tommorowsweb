import React, { useEffect, useState, useCallback } from 'react';
import './Services.css';
import Navbar from '../components/navbar';

export default function Services() {
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    vehicleId: '',
    type: 'Oil Change',
    date: '',
    note: '',
  });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVehicles(Array.isArray(data.vehicles) ? data.vehicles : []);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    }
  }, [token]);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchVehicles();
    fetchServices();
  }, [fetchVehicles, fetchServices]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Service added!');
        setForm({ vehicleId: '', type: 'Oil Change', date: '', note: '' });
        fetchServices();
      } else {
        setMessage(data.message || '❌ Failed to add service.');
      }
    } catch (err) {
      console.error('Add service error:', err);
      setMessage('❌ Error occurred while adding service.');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) fetchServices();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const deleteService = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this service?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchServices();
      } else {
        console.error('Failed to delete service');
      }
    } catch (err) {
      console.error('Delete service error:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="services-container">
        <h2>🔧 Vehicle Services</h2>

        <form onSubmit={handleSubmit} className="service-form">
          <select name="vehicleId" value={form.vehicleId} onChange={handleChange} required>
            <option value="">Select Vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name} – {v.model} ({v.year})
              </option>
            ))}
          </select>

          <select name="type" value={form.type} onChange={handleChange}>
            <option>Oil Change</option>
            <option>Brake Check</option>
            <option>Tire Rotation</option>
            <option>Insurance Renewal</option>
            <option>Registration Renewal</option>
            <option>Other</option>
          </select>

          <input type="date" name="date" value={form.date} onChange={handleChange} required />
          <input type="text" name="note" placeholder="Note (optional)" value={form.note} onChange={handleChange} />

          <button type="submit">Add Service</button>
          {message && <p>{message}</p>}
        </form>

        <h3 style={{ marginTop: '30px' }}>🗓️ Upcoming & Past Services</h3>
        <ul className="service-list">
          {services.map((svc) => (
            <li key={svc._id} className={`service-item ${svc.status}`}>
              <strong>{svc.type}</strong> on {new Date(svc.date).toLocaleDateString()}<br />
              🚗 {svc.vehicleId?.name} – {svc.vehicleId?.model} ({svc.vehicleId?.year})<br />
              <em>Note:</em> {svc.note || 'N/A'}<br />
              <em>Status:</em> {svc.status}
              <div style={{ marginTop: '5px' }}>
                {svc.status === 'upcoming' && (
                  <>
                    <button onClick={() => updateStatus(svc._id, 'completed')}>Mark Completed</button>
                    <button onClick={() => updateStatus(svc._id, 'missed')}>Mark Missed</button>
                  </>
                )}
                <button
                  onClick={() => deleteService(svc._id)}
                  style={{ marginLeft: '10px', color: 'red' }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
