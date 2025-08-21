export type ID = number

export type Category = 'Groceries' | 'Household' | 'Personal' | 'Electronics' | 'Other'

export interface User {
  id: ID
  email: string
  passwordHash: string
  name: string
  surname: string
  phone: string
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
  surname: string
  phone: string
}

export interface LoginPayload { email: string; password: string }

export interface ShoppingItem {
  id: ID
  userId: ID
  name: string
  quantity: number
  notes?: string
  category: Category
  images: string[] // URLs
  createdAt: string // ISO date
  updatedAt: string // ISO date
}

export interface Filters {
  q: string
  sort: 'name' | 'category' | 'date'
  order: 'asc' | 'desc'
}