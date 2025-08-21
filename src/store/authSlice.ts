import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { loginUser, registerUser, updateUser } from '../api/authApi'
import { LoginPayload, RegisterPayload, User } from '../types'

export interface AuthState {
  user: User | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const saved = localStorage.getItem('auth:user')
const initialState: AuthState = {
  user: saved ? (JSON.parse(saved) as User) : null,
  status: 'idle',
  error: null
}

export const registerThunk = createAsyncThunk('auth/register', async (payload: RegisterPayload) => {
  const user = await registerUser(payload)
  return user
})

export const loginThunk = createAsyncThunk('auth/login', async (payload: LoginPayload) => {
  const user = await loginUser(payload)
  return user
})

export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, updates }: { userId: number; updates: Partial<Omit<User, 'id'>> & { password?: string } }) => {
    const updated = await updateUser(userId, updates)
    return updated
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      localStorage.removeItem('auth:user')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(registerThunk.fulfilled, (s, a: PayloadAction<User>) => {
        s.status = 'succeeded'; s.user = a.payload; localStorage.setItem('auth:user', JSON.stringify(a.payload))
      })
      .addCase(registerThunk.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message ?? 'Registration failed' })
      .addCase(loginThunk.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(loginThunk.fulfilled, (s, a: PayloadAction<User>) => {
        s.status = 'succeeded'; s.user = a.payload; localStorage.setItem('auth:user', JSON.stringify(a.payload))
      })
      .addCase(loginThunk.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message ?? 'Login failed' })
      .addCase(updateProfileThunk.fulfilled, (s, a: PayloadAction<User>) => {
        s.user = a.payload
        localStorage.setItem('auth:user', JSON.stringify(a.payload))
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer