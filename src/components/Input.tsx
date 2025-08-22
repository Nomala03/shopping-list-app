import React from 'react'

export interface InputProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({ type, value, onChange, required, placeholder }) => {
  return (
    <input
      className="w-full border border-gray-300 rounded-xl p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
    />
  )
}

