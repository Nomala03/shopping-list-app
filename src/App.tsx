import React, { Suspense, useMemo } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAppSelector } from './hooks'

const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Profile = React.lazy(() => import('./pages/Profile'))
const ShareView = React.lazy(() => import('./pages/ShareView'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

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
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
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
