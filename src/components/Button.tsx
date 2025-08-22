import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ children, disabled }) => {
  return (
    <button className="bg-blue-600 text-white mt-2 px-4 py-2 rounded-xl hover:bg-blue-700" disabled={disabled}>
      {children}
    </button>
  )
}