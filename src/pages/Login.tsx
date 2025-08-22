import  { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { loginThunk } from '../store/authSlice'

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status, error } = useAppSelector(s => s.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const res = await dispatch(loginThunk({ email, password }))
    if (loginThunk.fulfilled.match(res)) {
      const from = (location.state as { from?: Location })?.from || { pathname: '/' }
      navigate((from as unknown as { pathname: string }).pathname)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:480, margin:'40px auto'}}>
        <h2>Login</h2>
        <form className="row" onSubmit={onSubmit}>
          <div>
            <label>Email</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          {error && <div className="help">{error}</div>}
          <button className="btn" disabled={status==='loading'}>{status==='loading'?'Signing in...':'Login'}</button>
        </form>
        <p className="help" style={{marginTop:12}}>No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}
