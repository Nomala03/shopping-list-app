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
      className="w-full  px-4 py-2 border border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:outline-none transition"
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
    />
  )
}

