import React, { useEffect, useState, useCallback } from 'react';
import './Expenses.css';
import Navbar from '../components/navbar';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({
    vehicleId: '',
    type: 'Fuel',
    amount: '',
    note: '',
  });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setExpenses(data);
        const totalAmount = data.reduce((sum, exp) => sum + exp.amount, 0);
        setTotal(totalAmount);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [token]);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log('Fetched vehicles:', data); // 🐞 Debug

      setVehicles(Array.isArray(data.vehicles) ? data.vehicles : []);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
      setVehicles([]);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      alert('Please login to view expenses.');
      return;
    }

    fetchExpenses();
    fetchVehicles();
  }, [token, fetchExpenses, fetchVehicles]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage('✅ Expense added!');
        setForm({ vehicleId: '', type: 'Fuel', amount: '', note: '' });

        // ✅ Wait for populated data
        await fetchExpenses();
      } else {
        const data = await res.json();
        setMessage(data.message || '❌ Failed to add expense.');
      }
    } catch (err) {
      console.error('Add expense error:', err);
      setMessage('❌ Error occurred while adding expense.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="expenses-container">
        <h2>💸 Your Expenses</h2>
        <p><strong>Total:</strong> ${total}</p>

        <form onSubmit={handleSubmit} className="expense-form">
          <select name="vehicleId" value={form.vehicleId} onChange={handleChange} required>
            <option value="">Select Vehicle</option>
            {Array.isArray(vehicles) &&
              vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name} – {v.model} ({v.year})
                </option>
              ))}
          </select>

          <select name="type" value={form.type} onChange={handleChange}>
            <option value="Fuel">Fuel</option>
            <option value="Repair">Repair</option>
            <option value="Insurance">Insurance</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="note"
            placeholder="Note"
            value={form.note}
            onChange={handleChange}
          />

          <button type="submit">Add Expense</button>
          {message && <p>{message}</p>}
        </form>

        <ul className="expense-list">
          {expenses.map((exp) => (
            <li key={exp._id} className="expense-item">
              <strong>{exp.type}</strong>: ${exp.amount} on {new Date(exp.date).toLocaleDateString()}<br />
              <em>Note:</em> {exp.note || 'N/A'}<br />
              <em>Vehicle:</em>{' '}
              {exp.vehicleId?.name
                ? `${exp.vehicleId.name} – ${exp.vehicleId.model} (${exp.vehicleId.year})`
                : 'N/A'}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
