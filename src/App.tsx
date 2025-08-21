import React, { Suspense, useMemo } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAppSelector } from './hooks'
import { logout } from './store/authSlice'
import { useAppDispatch } from './hooks'

const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Profile = React.lazy(() => import('./pages/Profile'))
const ShareView = React.lazy(() => import('./pages/ShareView'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

function Header() {
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

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { user } = useAppSelector(s => s.auth)
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

function PublicOnlyRoute({ children }: { children: React.ReactElement }) {
  const { user } = useAppSelector(s => s.auth)
  if (user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const fallback = useMemo(() => <div className="container">Loading...</div>, [])
  return (
    <>
      <Header />
      <Suspense fallback={fallback}>
        <Routes>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          <Route path="/share/:itemId" element={<ShareView />} />
          <Route path="/share/guide" element={<ShareView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
