import  { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { loginThunk } from '../store/authSlice'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

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
    <section className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="bg-white p-12 text-sm rounded-2xl shadow-lg w-full max-w-md" style={{maxWidth:480, margin:'40px auto'}}>
        <h2 className='text-xl font-bold mb-6 text-center text-gray-700'>Login</h2>
        <form className="max-w-md w-full space-y-4" onSubmit={onSubmit}>
          
            <Input placeholder='email' type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <Input placeholder='password' type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          
          {error && <div className="help">{error}</div>}
          <Button disabled={status==='loading'}>{status==='loading'?'Signing in...':'Login'}</Button>
        </form>
        <p className="text-sm " style={{marginTop:12}}>No account? <Link to="/register">Register</Link></p>
      </div>
    </section>
  )
}
