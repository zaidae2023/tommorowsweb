// src/pages/HelpSupport.jsx
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import './HelpSupport.css';

const faqs = [
  {
    question: "🔑 How do I reset my password?",
    answer: "Click on “Forgot Password” on the login page. An OTP will be sent to your email to reset your password securely.",
  },
  {
    question: "🚗 How can I add a vehicle?",
    answer: "Go to the “Add Vehicle” page, fill in the required details like make, model, year, and VIN, and click “Save”.",
  },
  {
    question: "📊 Why aren’t my expenses showing?",
    answer: "Ensure you’re logged in, and check your internet connection. Refresh the dashboard and try again.",
  },
];

export default function HelpSupport() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />

      <div className="help-container">
        <h1 className="help-title">Help & Support</h1>

        <p className="help-paragraph">
          Welcome to the TuneUp Help Center! Whether you're just getting started or need assistance with a specific issue, we’re here to help you make the most of your experience.
        </p>

        <h2 className="help-section-title">💬 Frequently Asked Questions</h2>
        <div className="faq-wrapper">
          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
                <span className="faq-icon">{openIndex === index ? '–' : '+'}</span>
              </div>
              {openIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>

        <h2 className="help-section-title">📨 Contact Support</h2>
        <p className="help-paragraph">
          Can’t find what you're looking for? Get in touch with our support team:
        </p>
        <ul className="help-list">
          <li>Email: <a href="mailto:support@tuneupapp.com" className="help-link">support@tuneupapp.com</a></li>
          <li>Phone: +971 1234 5678 (Monday to Friday, 9AM – 6PM)</li>
          <li>Live Chat: Coming soon to the dashboard!</li>
        </ul>

        <h2 className="help-section-title">📚 How-To Guides</h2>
        <ul className="help-list">
          <li><strong>Managing Scheduled Services:</strong> Learn how to create, edit, and track your vehicle maintenance tasks.</li>
          <li><strong>Tracking Fuel Expenses:</strong> Easily log your fuel fill-ups and monitor costs over time.</li>
          <li><strong>Using Reports:</strong> View summarized reports of all your expenses by type, currency, and date.</li>
        </ul>

        <p className="help-note">
          We’re always working to make TuneUp better. If you have suggestions or feature requests, feel free to email us!
        </p>
      </div>
    </>
  );
}
