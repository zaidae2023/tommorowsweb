// Import required modules and components
import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/navbar';
import './Documents.css';

export default function Documents() {
  // Form input states
  const [docType, setDocType] = useState('Insurance');
  const [file, setFile] = useState(null);
  const [expiryDate, setExpiryDate] = useState('');

  // App states
  const [documents, setDocuments] = useState([]);         // List of uploaded documents
  const [message, setMessage] = useState('');             // Success/Error message
  const [userPlan, setUserPlan] = useState('free');       // User's plan: free or premium

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null); // ID of document to delete

  const token = localStorage.getItem('token'); // Get JWT token from local storage

  // Fetch uploaded documents from backend
  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  }, [token]);

  // Fetch user profile to check plan (free/premium)
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

  // Fetch data when component loads
  useEffect(() => {
    fetchDocuments();
    fetchUserProfile();
  }, [fetchDocuments, fetchUserProfile]);

  // Handle document upload form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !expiryDate) {
      return setMessage('Please upload a file and set expiry date.');
    }

    const formData = new FormData();
    formData.append('docType', docType);
    formData.append('file', file);
    formData.append('expiryDate', expiryDate);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Document uploaded successfully.');
        setDocType('Insurance');
        setFile(null);
        setExpiryDate('');
        fetchDocuments(); // Refresh the list
      } else {
        setMessage(data.message || 'Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Document upload error:', err);
      setMessage('Upload failed. Please try again.');
    }
  };

  // Trigger the delete modal
  const handleDeleteClick = (docId) => {
    setSelectedDocId(docId);
    setShowDeleteModal(true);
  };

  // Confirm and delete the document
  const confirmDelete = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/documents/${selectedDocId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchDocuments(); // Refresh list after delete
        setMessage('Document deleted.');
      } else {
        setMessage('Failed to delete document.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setMessage('Error deleting document.');
    } finally {
      setShowDeleteModal(false);
      setSelectedDocId(null);
    }
  };

  // Calculate days left from expiry date
  const daysLeft = (date) => {
    const d = new Date(date);
    const now = new Date();
    return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  };

  // Limit document upload for free plan
  const isUploadDisabled = userPlan === 'free' && documents.length >= 3;

  return (
    <div>
      <Navbar />
      <div className="documents-container">
        <h1>Upload Your Vehicle Documents</h1>

        {/* Show upgrade warning for free users */}
        {isUploadDisabled && (
          <div className="upgrade-warning">
            <p>🚫 Free users can upload up to 3 documents only.</p>
            <p>
              <a href="/upgrade" className="upgrade-link">Upgrade to Premium</a> to unlock unlimited uploads.
            </p>
          </div>
        )}

        {/* Show upload form if allowed */}
        {!isUploadDisabled && (
          <form className="document-form" onSubmit={handleSubmit}>
            <label>Document Type</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)}>
              <option>Insurance</option>
              <option>Registration</option>
              <option>Pollution Certificate</option>
            </select>

            <label>Upload File</label>
            <input type="file" accept="application/pdf,image/*" onChange={(e) => setFile(e.target.files[0])} />

            <label>Expiry Date</label>
            <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />

            <button type="submit">Upload</button>
            {message && <p className="upload-message">{message}</p>}
          </form>
        )}

        {/* Uploaded documents list */}
        <div className="uploaded-documents">
          <h2>Your Documents</h2>
          {documents.length === 0 ? (
            <p>No documents uploaded yet.</p>
          ) : (
            <ul className="documents-list">
              {documents.map((doc) => {
                const days = daysLeft(doc.expiryDate);
                const fileUrl = `${import.meta.env.VITE_API_URL}${doc.fileUrl}`;

                return (
                  <li key={doc._id} className="document-item expiring">
                    <div className="doc-info">
                      <strong>{doc.docType}</strong> – Expires on{' '}
                      {new Date(doc.expiryDate).toLocaleDateString()} ({days} days left)
                      {days <= 15 && <span className="alert">⚠️ Renew Soon</span>}
                    </div>
                    <div className="doc-actions">
                      <div className="button-group">
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-link"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDeleteClick(doc._id)}
                          className="delete-btn"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Confirm Delete Modal */}
        {showDeleteModal && (
          <div className="delete-modal-overlay">
            <div className="delete-modal">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this document?</p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="confirm-btn" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
