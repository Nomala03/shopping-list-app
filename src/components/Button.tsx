import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ children, disabled }) => {
  return (
    <button className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-emerald-400 to-green-800 hover:from-emerald-700 hover:to-green-700 transition" disabled={disabled}>
      {children}
    </button>
  )
}