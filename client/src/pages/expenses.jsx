import React, { useEffect, useState, useCallback } from 'react';
import './Expenses.css';
import Navbar from '../components/navbar';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [total, setTotal] = useState(0);
  const [userPlan, setUserPlan] = useState('free'); // ✅ plan state

  const [form, setForm] = useState({
    vehicleId: '',
    type: 'Fuel',
    amount: '',
    note: '',
    currency: 'USD',
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
      setVehicles(Array.isArray(data.vehicles) ? data.vehicles : []);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
      setVehicles([]);
    }
  }, [token]);

  const fetchCurrencies = useCallback(async () => {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      if (data?.rates) {
        setCurrencyOptions(Object.keys(data.rates));
      }
    } catch (err) {
      console.error('Failed to fetch currencies:', err);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUserPlan(data.plan || 'free');
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      alert('Please login to view expenses.');
      return;
    }
    fetchExpenses();
    fetchVehicles();
    fetchCurrencies();
    fetchUserProfile(); // ✅ fetch plan
  }, [token, fetchExpenses, fetchVehicles, fetchCurrencies, fetchUserProfile]);

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
        setForm({ vehicleId: '', type: 'Fuel', amount: '', note: '', currency: 'USD' });
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

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setExpenses((prev) => prev.filter((exp) => exp._id !== id));
        setMessage('🗑️ Expense deleted!');
      } else {
        const data = await res.json();
        setMessage(data.message || '❌ Failed to delete expense.');
      }
    } catch (err) {
      console.error('Delete expense error:', err);
      setMessage('❌ Error occurred while deleting expense.');
    }
  };

  // ✅ SECURE EXPORT FUNCTIONS with limit alert
  const exportExpensesCSV = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/export/expenses/csv`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403) {
        const data = await res.json();
        alert(data.message || 'Export limit reached. Upgrade to Premium.');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'expenses.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('CSV export failed:', err);
    }
  };

  const exportExpensesPDF = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/export/expenses/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403) {
        const data = await res.json();
        alert(data.message || 'Export limit reached. Upgrade to Premium.');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'expenses.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('PDF export failed:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="expenses-container">
        <h2>💸 Your Expenses</h2>
        <p><strong>Total:</strong> ${total}</p>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
          <button onClick={exportExpensesCSV} className="export-btn">📄 Export CSV</button>
          <button onClick={exportExpensesPDF} className="export-btn">🧾 Export PDF</button>
        </div>

        <form onSubmit={handleSubmit} className="expense-form">
          <select name="vehicleId" value={form.vehicleId} onChange={handleChange} required>
            <option value="">Select Vehicle</option>
            {vehicles.map((v) => (
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

          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            required
            disabled={userPlan === 'free'} // 🔒 lock for free users
          >
            <option value="">Select Currency</option>
            {currencyOptions.map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>

          {userPlan === 'free' && (
            <p style={{ color: '#e67e22', fontSize: '0.9rem' }}>
              Multi-currency is a Premium feature. You’re limited to USD.
            </p>
          )}

          <button type="submit">Add Expense</button>
          {message && <p>{message}</p>}
        </form>

        <ul className="expense-list">
          {expenses.map((exp) => (
            <li key={exp._id} className="expense-item">
              <strong>{exp.type}</strong>: {exp.amount} {exp.currency || 'USD'} on {new Date(exp.date).toLocaleDateString()}<br />
              <em>Note:</em> {exp.note || 'N/A'}<br />
              <em>Vehicle:</em>{' '}
              {exp.vehicleId?.name
                ? `${exp.vehicleId.name} – ${exp.vehicleId.model} (${exp.vehicleId.year})`
                : 'N/A'}
              <br />
              <button className="delete-btn" onClick={() => handleDelete(exp._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
