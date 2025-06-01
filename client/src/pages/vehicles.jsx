// Import required modules and components
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar'; // Navigation bar
import './vehicles.css'; // Page-specific styles
import { ToastContainer, toast } from 'react-toastify'; // Toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Toast styles

export default function Vehicles() {
  // State for storing fetched vehicles
  const [vehicles, setVehicles] = useState([]);
  // Loading state to show a spinner or message while fetching data
  const [loading, setLoading] = useState(true);
  // Error message state
  const [error, setError] = useState('');
  // Modal visibility toggle
  const [showConfirm, setShowConfirm] = useState(false);
  // Vehicle ID to delete
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const navigate = useNavigate(); // For navigation

  // Fetch user's vehicles on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem('token'); // Get auth token
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        // Fetch vehicle data from the API
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

  // Triggered when delete button is clicked
  const handleDeleteClick = (id) => {
    setVehicleToDelete(id); // Store vehicle ID
    setShowConfirm(true);   // Show confirmation modal
  };

  // Called when user confirms deletion
  const confirmDelete = async () => {
    setShowConfirm(false); // Close the modal
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
        // Remove the deleted vehicle from state
        setVehicles((prev) => prev.filter((v) => v._id !== vehicleToDelete));
        toast.success('Vehicle deleted successfully');
      } else {
        toast.error(data.message || 'Failed to delete vehicle');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('An error occurred while deleting');
    }
  };

  return (
    <>
      {/* Navigation bar */}
      <Navbar />

      {/* Toast notifications container */}
      <ToastContainer position="top-center" />

      {/* Main content */}
      <div className="vehicles-page">
        {/* Header section with page title and add button */}
        <div className="vehicles-header">
          <h2 className="vehicles-title">🚗 My Vehicles</h2>
          <button className="add-vehicle-btn" onClick={() => navigate('/add-vehicle')}>
            ➕ Add Vehicle
          </button>
        </div>

        {/* Conditional UI rendering */}
        {loading && <p style={{ textAlign: 'center' }}>Loading vehicles...</p>}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {!loading && !error && vehicles.length === 0 && (
          <p style={{ textAlign: 'center' }}>You haven't added any vehicles yet.</p>
        )}

        {/* Display the list of vehicles in a grid */}
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

      {/* Confirmation modal for deleting a vehicle */}
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
