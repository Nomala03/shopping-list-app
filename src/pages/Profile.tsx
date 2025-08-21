import { FormEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { updateProfileThunk } from '../store/authSlice'

export default function Profile() {
  const { user } = useAppSelector(s => s.auth)
  const dispatch = useAppDispatch()
  if (!user) return null

  const [form, setForm] = useState({
    name: user.name,
    surname: user.surname,
    phone: user.phone,
    email: user.email,
    password: '' // optional change
  })
  function set<K extends keyof typeof form>(k: K, v: string) { setForm(prev => ({ ...prev, [k]: v })) }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const updates: { [k: string]: string } = { name: form.name, surname: form.surname, phone: form.phone, email: form.email }
    if (form.password.trim().length > 0) updates.password = form.password
    await dispatch(updateProfileThunk({ userId: user.id, updates }))
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:600, margin:'0 auto'}}>
        <h2>Profile</h2>
        <form className="row cols-2" onSubmit={onSubmit}>
          <div>
            <label>Name</label>
            <input className="input" value={form.name} onChange={e=>set('name', e.target.value)} />
          </div>
          <div>
            <label>Surname</label>
            <input className="input" value={form.surname} onChange={e=>set('surname', e.target.value)} />
          </div>
          <div>
            <label>Cellphone</label>
            <input className="input" value={form.phone} onChange={e=>set('phone', e.target.value)} />
          </div>
          <div>
            <label>Email</label>
            <input className="input" type="email" value={form.email} onChange={e=>set('email', e.target.value)} />
          </div>
          <div style={{gridColumn:'1 / -1'}}>
            <label>Change Password (optional)</label>
            <input className="input" type="password" value={form.password} onChange={e=>set('password', e.target.value)} />
            <p className="help">Password is securely hashed before saving.</p>
          </div>
          <div style={{gridColumn:'1 / -1'}}>
            <button className="btn">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  )
}