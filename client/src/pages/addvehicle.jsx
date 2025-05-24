import React, { useState } from 'react';
import './addvehicle.css';
import Navbar from '../components/navbar';

export default function AddVehicle() {
  const [form, setForm] = useState({
    name: '',
    model: '',
    year: '',
    registration: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // for cookies (sessions)
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Vehicle added successfully!');
        setForm({ name: '', model: '', year: '', registration: '' });
      } else {
        setMessage(data.message || '❌ Failed to add vehicle');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error occurred while adding vehicle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-vehicle-container">
        <h2>Add New Vehicle</h2>
        {message && <p style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
        <form className="vehicle-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Vehicle Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            value={form.model}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="year"
            placeholder="Year"
            value={form.year}
            min="1900"
            max={new Date().getFullYear() + 1}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="registration"
            placeholder="Registration Number"
            value={form.registration}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Vehicle'}
          </button>
        </form>
      </div>
    </>
  );
}
