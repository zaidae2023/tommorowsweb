// Import React library to use JSX and React components
import React from 'react';

// Define and export the Cancel component
export default function Cancel() {
  return (
    // Centered message container with padding
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      {/* Heading to show cancellation */}
      <h1>❌ Payment Cancelled</h1>

      {/* Description text */}
      <p>Your payment was not completed. You can try again anytime.</p>
    </div>
  );
}
