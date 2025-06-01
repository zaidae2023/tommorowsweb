// Import React and useState hook
import React, { useState } from 'react';

// Import eye icons for show/hide password toggle
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Reusable PasswordInput component
export default function PasswordInput({ value, onChange, placeholder = 'Password', ...rest }) {
  // State to track whether the password is visible or hidden
  const [show, setShow] = useState(false);

  return (
    <div className="password-wrapper">
      {/* Input field type changes based on 'show' state */}
      <input
        type={show ? 'text' : 'password'} // Show plain text if 'show' is true, else hide
        value={value}                    // Current password value
        onChange={onChange}              // Handle input change
        placeholder={placeholder}        // Default or passed placeholder
        {...rest}                        // Pass any additional props
      />

      {/* Eye icon that toggles password visibility on click */}
      <span className="toggle" onClick={() => setShow(!show)}>
        {show ? <FaEyeSlash /> : <FaEye />} {/* Icon changes based on state */}
      </span>
    </div>
  );
}
