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
  //Save in DB
  const res = await http.post<User>(USERS, newUser)
  return res.data
}

//Login function
export async function loginUser(payload: LoginPayload): Promise<User> {
  const email = payload.email.trim().toLowerCase()
  const res = await http.get<User[]>(`${USERS}?email=${encodeURIComponent(email)}`)

  if (res.data.length === 0) {
    throw new Error('User not found')
  }
  const user = res.data[0]
  const ok = await bcrypt.compare(payload.password, user.passwordHash)

  if (!ok) {
    throw new Error('Invalid credentials')
  }
  return user
}

export async function updateUser(
  userId: number,
  updates: Partial<Omit<User, 'id'>> & { password?: string }
): Promise<User> {
  const toUpdate: Partial<User> = { ...updates }

  // If password is provided → hash it
  if (updates.password && updates.password.length > 0) {
    const saltRounds = 10
    toUpdate.passwordHash = await bcrypt.hash(updates.password, saltRounds)
  }

  // Remove plain password field from request
  delete (toUpdate as { password?: string }).password

  const res = await http.patch<User>(`${USERS}/${userId}`, toUpdate)
  return res.data
}