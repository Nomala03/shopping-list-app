import { http } from './http'
import * as bcrypt from 'bcryptjs'
import type { LoginPayload, RegisterPayload, User } from '../types'

const USERS = '/users'

export async function registerUser(payload: RegisterPayload): Promise<User> {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(payload.password, saltRounds)
  const newUser: Omit<User, 'id'> = {
    email: payload.email.trim().toLowerCase(),
    passwordHash,
    name: payload.name.trim(),
    surname: payload.surname.trim(),
    phone: payload.phone.trim()
  }
  const res = await http.post<User>(USERS, newUser)
  return res.data
}

export async function loginUser(payload: LoginPayload): Promise<User> {
  const res = await http.get<User[]>(`${USERS}?email=${encodeURIComponent(payload.email.trim().toLowerCase())}`)
  if (res.data.length === 0) throw new Error('User not found')
  const user = res.data[0]
  const ok = await bcrypt.compare(payload.password, user.passwordHash)
  if (!ok) throw new Error('Invalid credentials')
  return user
}

export async function updateUser(userId: number, updates: Partial<Omit<User, 'id'>> & { password?: string }): Promise<User> {
  const toUpdate: Partial<User> = { ...updates }
  if (typeof updates.password === 'string' && updates.password.length > 0) {
    const saltRounds = 10
    toUpdate.passwordHash = await bcrypt.hash(updates.password, saltRounds)
  }
  delete (toUpdate as { password?: string }).password
  const res = await http.patch<User>(`${USERS}/${userId}`, toUpdate)
  return res.data
}