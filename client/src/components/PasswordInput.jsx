import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function PasswordInput({ value, onChange, placeholder = 'Password', ...rest }) {
  const [show, setShow] = useState(false);

  return (
    <div className="password-wrapper">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
      <span className="toggle" onClick={() => setShow(!show)}>
        {show ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
}
