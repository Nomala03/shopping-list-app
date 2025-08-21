

import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { registerThunk } from '../store/authSlice'

export default function Register() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status, error } = useAppSelector(s => s.auth)

  const [form, setForm] = useState({ email: '', password: '', name: '', surname: '', phone: '' })

  function set<K extends keyof typeof form>(k: K, v: string) { setForm(prev => ({ ...prev, [k]: v })) }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const res = await dispatch(registerThunk(form))
    if (registerThunk.fulfilled.match(res)) navigate('/')
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:520, margin:'40px auto'}}>
        <h2>Register</h2>
        <form className="row cols-2" onSubmit={onSubmit}>
          <div>
            <label>Name</label>
            <input className="input" value={form.name} onChange={e=>set('name', e.target.value)} required />
          </div>
          <div>
            <label>Surname</label>
            <input className="input" value={form.surname} onChange={e=>set('surname', e.target.value)} required />
          </div>
          <div>
            <label>Cellphone number</label>
            <input className="input" value={form.phone} onChange={e=>set('phone', e.target.value)} required />
          </div>
          <div>
            <label>Email</label>
            <input className="input" type="email" value={form.email} onChange={e=>set('email', e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input className="input" type="password" value={form.password} onChange={e=>set('password', e.target.value)} required />
          </div>
          <div style={{alignSelf:'end'}}>
            <button className="btn" disabled={status==='loading'}>{status==='loading'?'Creating...':'Create Account'}</button>
          </div>
        </form>
        {error && <div className="help" style={{marginTop:8}}>{error}</div>}
        <p className="help" style={{marginTop:12}}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}