import React, { useState } from 'react';
import './addvehicle.css';
import Navbar from '../components/navbar';

export default function AddVehicle() {
  const [form, setForm] = useState({
    vin: '',
    name: '',
    model: '',
    year: '',
    registration: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [safetyRatings, setSafetyRatings] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchVehicleDetails = async () => {
    setMessage('');
    setSafetyRatings(null);

    if (!form.vin || form.vin.length !== 17) {
      setMessage('❌ VIN must be exactly 17 characters.');
      return;
    }

    try {
      // Step 1: VIN decoding
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${form.vin}?format=json`);
      const data = await res.json();

      const get = (field) => data.Results.find(item => item.Variable === field)?.Value || '';
      const make = get('Make');
      const model = get('Model');
      const year = get('Model Year');

      setForm(prev => ({
        ...prev,
        name: make,
        model,
        year,
      }));

      setMessage('✅ Vehicle details fetched from VIN.');

      // Step 2: Fetch Safety Ratings summary
      const ratingRes = await fetch(`https://api.nhtsa.gov/SafetyRatings/modelyear/${year}/make/${make}/model/${model}?format=json`);
      const ratingData = await ratingRes.json();

      const firstResult = ratingData.Results?.[0];
      if (firstResult) {
        const vehicleId = firstResult.VehicleId;

        // Step 3: Fetch detailed safety ratings
        const detailRes = await fetch(`https://api.nhtsa.gov/SafetyRatings/VehicleId/${vehicleId}?format=json`);
        const detailData = await detailRes.json();

        const result = detailData.Results?.[0];
        if (result) {
          setSafetyRatings({
            overall: result.OverallRating || 'N/A',
            frontal: result.FrontCrashDriversideRating || 'N/A',
            rollover: result.RolloverRating || 'N/A',
          });
        }
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to fetch VIN or safety details.');
    }
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Vehicle added successfully!');
        setForm({ vin: '', name: '', model: '', year: '', registration: '' });
        setSafetyRatings(null);
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
        {message && (
          <p style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>
        )}
        <form className="vehicle-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="vin"
            placeholder="Enter VIN (17 characters)"
            value={form.vin}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={fetchVehicleDetails}>Fetch Details</button>

          <input
            type="text"
            name="name"
            placeholder="Vehicle Make"
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

          {safetyRatings && (
            <div style={{
              marginTop: '15px',
              padding: '12px',
              background: '#f9f9f9',
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}>
              <h4>🛡️ Safety Ratings</h4>
              <p>⭐ Overall: {safetyRatings.overall}</p>
              <p>💥 Frontal Crash: {safetyRatings.frontal}</p>
              <p>🔄 Rollover: {safetyRatings.rollover}</p>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Vehicle'}
          </button>
        </form>
      </div>
    </>
  );
}
