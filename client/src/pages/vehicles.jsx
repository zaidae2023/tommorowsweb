import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import './vehicles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
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

  const handleDeleteClick = (id) => {
    setVehicleToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vehicles/${vehicleToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setVehicles((prev) => prev.filter((v) => v._id !== vehicleToDelete));
        toast.success('✅ Vehicle deleted successfully');
      } else {
        toast.error(data.message || '❌ Failed to delete vehicle');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('❌ An error occurred while deleting');
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" />
      <div className="vehicles-page">
        <div className="vehicles-header">
          <h2 className="vehicles-title">🚗 My Vehicles</h2>
          <button className="add-vehicle-btn" onClick={() => navigate('/add-vehicle')}>
            ➕ Add Vehicle
          </button>
        </div>

        {loading && <p style={{ textAlign: 'center' }}>Loading vehicles...</p>}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {!loading && !error && vehicles.length === 0 && (
          <p style={{ textAlign: 'center' }}>You haven't added any vehicles yet.</p>
        )}

        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="vehicle-card">
              <h3>{vehicle.name}</h3>
              <p><strong>Model:</strong> {vehicle.model}</p>
              <p><strong>Year:</strong> {vehicle.year}</p>
              <p><strong>Reg #:</strong> {vehicle.registration}</p>
              <button
                className="vehicle-delete-btn"
                onClick={() => handleDeleteClick(vehicle._id)}
              >
                ❌ Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Confirm Delete Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Are you sure?</h3>
            <p>This vehicle will be permanently deleted.</p>
            <div className="modal-buttons">
              <button onClick={confirmDelete} className="confirm-btn">Yes, Delete</button>
              <button onClick={() => setShowConfirm(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
