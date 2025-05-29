import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import './Documents.css';

export default function Documents() {
  const [docType, setDocType] = useState('Insurance');
  const [file, setFile] = useState(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState('');

  const fetchDocuments = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setDocuments(data);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !expiryDate) {
      return setMessage('Please upload a file and set expiry date.');
    }

    const formData = new FormData();
    formData.append('docType', docType);
    formData.append('file', file);
    formData.append('expiryDate', expiryDate);

    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      setMessage('Document uploaded successfully.');
      setDocType('Insurance');
      setFile(null);
      setExpiryDate('');
      fetchDocuments();
    } else {
      setMessage('Upload failed. Please try again.');
    }
  };

  const daysLeft = (date) => {
    const d = new Date(date);
    const now = new Date();
    return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      <Navbar />
      <div className="documents-container">
        <h1>Upload Your Vehicle Documents</h1>
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

        <div className="uploaded-documents">
          <h2>Your Documents</h2>
          {documents.length === 0 ? (
            <p>No documents uploaded yet.</p>
          ) : (
            <ul>
              {documents.map((doc) => {
                const days = daysLeft(doc.expiryDate);
                const isExpiring = days <= 15;
                const fileUrl = `${import.meta.env.VITE_API_URL}${doc.fileUrl}`;

                return (
                  <li key={doc._id} className={isExpiring ? 'expiring' : ''}>
                    <div className="doc-info">
                      <strong>{doc.docType}</strong> – Expires on{' '}
                      {new Date(doc.expiryDate).toLocaleDateString()} ({days} days left)
                      {isExpiring && <span className="alert">⚠️ Renew Soon</span>}
                    </div>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="view-link">
                      View / Download
                    </a>
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
