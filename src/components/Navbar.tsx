import { NavLink } from 'react-router-dom'
import { logout } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks'


function Navbar() {
  const { user } = useAppSelector(s => s.auth)
  const dispatch = useAppDispatch()

  
  return (
    <header className="header">
      <div className="inner container">
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <strong>🛒 Shopping List</strong>
          <nav className="nav" style={{display:'flex', gap:8}}>
            {user && (<>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/profile">Profile</NavLink>
            </>)}
            <NavLink to="/share/guide">Share</NavLink>
          </nav>
        </div>
        <div>
          {user ? (
            <button className="btn secondary" onClick={() => dispatch(logout())}>Logout</button>
          ) : (
            <NavLink className="btn" to="/login">Login</NavLink>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar;