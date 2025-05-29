import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/navbar';
import './Documents.css';

export default function Documents() {
  const [docType, setDocType] = useState('Insurance');
  const [file, setFile] = useState(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState('');
  const [userPlan, setUserPlan] = useState('free');

  const token = localStorage.getItem('token');

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
    fetchDocuments();
    fetchUserProfile();
  }, [fetchDocuments, fetchUserProfile]);

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
        fetchDocuments();
      } else {
        setMessage(data.message || 'Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Document upload error:', err);
      setMessage('Upload failed. Please try again.');
    }
  };

  const deleteDocument = async (docId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this document?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/documents/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchDocuments();
      } else {
        setMessage('Failed to delete document.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setMessage('Error deleting document.');
    }
  };

  const daysLeft = (date) => {
    const d = new Date(date);
    const now = new Date();
    return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  };

  const isUploadDisabled = userPlan === 'free' && documents.length >= 3;

  return (
    <div>
      <Navbar />
      <div className="documents-container">
        <h1>Upload Your Vehicle Documents</h1>

        {isUploadDisabled && (
          <div className="upgrade-warning">
            <p>🚫 Free users can upload up to 3 documents only.</p>
            <p>
              <a href="/upgrade" className="upgrade-link">Upgrade to Premium</a> to unlock unlimited uploads.
            </p>
          </div>
        )}

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
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="view-link">
                        View / Download
                      </a>
                      <button onClick={() => deleteDocument(doc._id)} className="delete-btn">🗑️ Delete</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
