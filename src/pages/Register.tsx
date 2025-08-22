import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { registerThunk } from '../store/authSlice'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="bg-white p-12 text-sm rounded-2xl shadow-lg w-full max-w-md" style={{maxWidth:520, margin:'40px auto'}}>
        <h2  className='text-xl font-bold mb-6 text-center text-gray-700'>Register</h2>
        <form className="row cols-2" onSubmit={onSubmit}>
            <Input type="text" placeholder='name' value={form.name} onChange={e=>set('name', e.target.value)} required />
            <Input type="text" placeholder='surname' value={form.surname} onChange={e=>set('surname', e.target.value)} required />
            <Input type="text" placeholder='phone'value={form.phone} onChange={e=>set('phone', e.target.value)} required />
            <Input type="email" placeholder='email' value={form.email} onChange={e=>set('email', e.target.value)} required />
            <Input type="password" placeholder='password' value={form.password} onChange={e=>set('password', e.target.value)} required />
                
          <div style={{alignSelf:'end'}}>
            <Button disabled={status==='loading'}>{status==='loading'?'Creating...':'Create Account'}</Button>
          </div>
        </form>
        {error && <div style={{marginTop:8, fontSize:14, color:'var(--muted)'}}>{error}</div>}
        <p style={{marginTop:12}}>Already have an account? <Link to="/login" className="text-blue-700 m-2">Login</Link></p>
      </div>
    </div>
  )
}