import { useState } from "react"
import { NavLink } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks"
import { logout } from "../store/authSlice"
import { Menu, X } from "lucide-react" // icon library (lucide-react)

export default function Navbar() {
  const { user } = useAppSelector(s => s.auth)
  const dispatch = useAppDispatch()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <strong className="text-lg font-semibold text-blue-600">
          🛒 My Dashboard
        </strong>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-gray-700">
          {user && (
            <>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `hover:text-blue-600 ${isActive ? "text-blue-600 font-medium" : ""}`
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => 
                  `hover:text-blue-600 ${isActive ? "text-blue-600 font-medium" : ""}`
                }
              >
                Profile
              </NavLink>
            </>
          )}
          <NavLink 
            to="/share/guide" 
            className={({ isActive }) => 
              `hover:text-blue-600 ${isActive ? "text-blue-600 font-medium" : ""}`
            }
          >
            Share
          </NavLink>
        </nav>

        {/* Auth buttons (desktop) */}
        <div className="hidden md:block">
          {user ? (
            <button
              onClick={() => dispatch(logout())}
              className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Logout
            </button>
          ) : (
            <NavLink 
              to="/login"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <nav className="flex flex-col gap-4 p-4 text-gray-700">
            {user && (
              <>
                <NavLink 
                  to="/" 
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => 
                    `hover:text-blue-600 ${isActive ? "text-blue-600 font-medium" : ""}`
                  }
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/profile" 
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => 
                    `hover:text-blue-600 ${isActive ? "text-blue-600 font-medium" : ""}`
                  }
                >
                  Profile
                </NavLink>
              </>
            )}
            <NavLink 
              to="/share/guide" 
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => 
                `hover:text-blue-600 ${isActive ? "text-blue-600 font-medium" : ""}`
              }
            >
              Share
            </NavLink>

            {/* Auth Button */}
            {user ? (
              <button
                onClick={() => {
                  dispatch(logout())
                  setMenuOpen(false)
                }}
                className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-left"
              >
                Logout
              </button>
            ) : (
              <NavLink 
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition text-center"
              >
                Login
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
