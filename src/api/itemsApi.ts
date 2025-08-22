import { http } from './http'
import type { ShoppingItem } from '../types'

const ITEMS = '/shoppingLists'

export async function createItem(item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShoppingItem> {
  const now = new Date().toISOString()
  const payload = { ...item, createdAt: now, updatedAt: now }
  const res = await http.post<ShoppingItem>(ITEMS, payload)
  return res.data
}

export async function fetchItemsByUser(userId: number): Promise<ShoppingItem[]> {
  const res = await http.get<ShoppingItem[]>(`${ITEMS}?userId=${userId}`)
  return res.data
}

export async function updateItem(id: number, updates: Partial<ShoppingItem>): Promise<ShoppingItem> {
  const res = await http.patch<ShoppingItem>(`${ITEMS}/${id}`, { ...updates, updatedAt: new Date().toISOString() })
  return res.data
}

export async function deleteItem(id: number): Promise<void> {
  await http.delete(`${ITEMS}/${id}`)
}

export async function fetchItemById(id: number): Promise<ShoppingItem> {
  const res = await http.get<ShoppingItem>(`${ITEMS}/${id}`)
  return res.data
}