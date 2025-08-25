import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { createItemThunk, updateItemThunk, deleteItemThunk, fetchItemsThunk, selectFilters, selectItems, setFilters } from '../store/itemsSlice'
import type { Category, ShoppingItem } from '../types'

const categories: Category[] = ['Groceries', 'Household', 'Personal', 'Electronics', 'Other']

function ItemCard({ item, onEdit, onDelete, onShare }: { 
  item: ShoppingItem; 
  onEdit: (item: ShoppingItem)=>void; 
  onDelete: (id: number)=>void; 
  onShare: (id: number)=>void 
}) {
  return ( 
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col">
      {item.images?.[0] && (
        <img className="w-full h-40 object-cover rounded-lg mb-3" src={item.images[0]} alt={item.name} />
      )}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <span className="inline-block px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
          {item.category}
        </span>
      </div>
      <div className="text-sm text-gray-500">
        Qty: {item.quantity} • Added {new Date(item.createdAt).toLocaleDateString()}
      </div>
      {item.notes && <p className="mt-2 text-gray-700">{item.notes}</p>}
      <div className="flex gap-2 mt-4">
        <button className="px-3 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={()=>onEdit(item)}>Edit</button>
        <button className="px-3 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={()=>onShare(item.id)}>Share</button>
        <button className="px-3 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700" onClick={()=>onDelete(item.id)}>Delete</button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector(s => s.auth)
  const items = useAppSelector(selectItems)
  const filters = useAppSelector(selectFilters)
  const [searchParams, setSearchParams] = useSearchParams()

  const [draft, setDraft] = useState({
    name: '', quantity: 1, notes: '', category: 'Groceries' as Category, images: ''
  })
  const [editing, setEditing] = useState<ShoppingItem | null>(null)

  // Sync URL -> Redux filters
  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    const sort = (searchParams.get('sort') as 'name'|'category'|'date') ?? 'name'
    const order = (searchParams.get('order') as 'asc'|'desc') ?? 'asc'
    if (q !== filters.q || sort !== filters.sort || order !== filters.order) {
      dispatch(setFilters({ q, sort, order }))
    }
  }, [searchParams, dispatch, filters.q, filters.sort, filters.order])

  // Sync Redux filters -> URL
  useEffect(() => {
    const current = Object.fromEntries(searchParams.entries())
    const desired = { q: filters.q, sort: filters.sort, order: filters.order }
    const changed = current.q !== desired.q || current.sort !== desired.sort || current.order !== desired.order
    if (changed) setSearchParams(desired, { replace: true })
  }, [filters, searchParams, setSearchParams])

  useEffect(() => {
    if (user) dispatch(fetchItemsThunk(user.id))
  }, [user, dispatch])

  const filtered = useMemo(() => {
    const q = filters.q.toLowerCase()
    const base = items.filter(i => i.name.toLowerCase().includes(q))
    const sorted = [...base].sort((a, b) => {
      if (filters.sort === 'name') return a.name.localeCompare(b.name)
      if (filters.sort === 'category') return a.category.localeCompare(b.category)
      const da = new Date(a.createdAt).getTime()
      const db = new Date(b.createdAt).getTime()
      return da - db
    })
    return filters.order === 'asc' ? sorted : sorted.reverse()
  }, [items, filters])

  function resetDraft() {
    setDraft({ name:'', quantity:1, notes:'', category:'Groceries', images:'' })
    setEditing(null)
  }

  async function onCreate() {
    if (!user) return
    if (!draft.name.trim()) return alert('Name is required')

    const images = draft.images
      ? draft.images.split(',').map(s=>s.trim()).filter(Boolean)
      : []

    const res = await dispatch(createItemThunk({
      userId: user.id,
      name: draft.name.trim(),
      quantity: draft.quantity? Number(draft.quantity) : 1,
      notes: draft.notes.trim() || undefined,
      category: draft.category,
      images
    }))
    if (createItemThunk.fulfilled.match(res)) {
      resetDraft()
    } else {
    console.error('Failed to create item:', res)
    alert('Could not save item. Please try again.')
    } 
  }

  async function onSaveEdit() {
    if (!editing) return
    const images = draft.images.split(',').map(s=>s.trim()).filter(Boolean)
    const res = await dispatch(updateItemThunk({ id: editing.id, updates: {
      name: draft.name.trim(),
      quantity: Number(draft.quantity),
      notes: draft.notes.trim() || undefined,
      category: draft.category,
      images
    }}))
    if (updateItemThunk.fulfilled.match(res)) resetDraft()
  }

  function startEdit(item: ShoppingItem) {
    setEditing(item)
    setDraft({ 
      name: item.name, 
      quantity: item.quantity, 
      notes: item.notes ?? '', 
      category: item.category, 
      images: item.images.join(', ') 
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function onDelete(id: number) {
    await dispatch(deleteItemThunk(id))
  }

  function onShare(id: number) { navigate(`/share/${id}`) }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Add/Edit Form */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Item' : 'Add Item'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              className="w-full rounded-xl border border-gray-300 px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={draft.name}
              onChange={e=>setDraft(p=>({ ...p, name: e.target.value }))}
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input 
              type="number" min={1}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={draft.quantity}
              onChange={e=>setDraft(p=>({ ...p, quantity: Number(e.target.value) }))}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              className="w-full rounded-xl border border-gray-300 px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={draft.category}
              onChange={e=>setDraft(p=>({ ...p, category: e.target.value as Category }))}
            >
              {categories.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Images */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Image URLs</label>
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://.."
              value={draft.images}
              onChange={e=>setDraft(p=>({ ...p, images: e.target.value }))}
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={draft.notes}
              onChange={e=>setDraft(p=>({ ...p, notes: e.target.value }))}
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-3 flex gap-3">
            {editing ? (
              <>
                <button className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700" onClick={onSaveEdit}>Save Changes</button>
                <button className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={resetDraft}>Cancel</button>
              </>
            ) : (
              <button className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700" onClick={onCreate}>Add Item</button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name"
              value={filters.q}
              onChange={(e)=>dispatch(setFilters({ ...filters, q: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sort</label>
            <select
              className="w-full rounded-xl border border-gray-300 px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.sort}
              onChange={e=>dispatch(setFilters({ ...filters, sort: e.target.value as 'name'|'category'|'date' }))}
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="date">Date added</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Order</label>
            <select
              className="w-full rounded-xl border border-gray-300 px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.order}
              onChange={e=>dispatch(setFilters({ ...filters, order: e.target.value as 'asc'|'desc' }))}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          URL reflects search & sort: <code className="bg-gray-100 px-1 rounded">?q=...&sort=...</code>
        </p>
      </div>

      {/* Items List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(item => (
          <ItemCard key={item.id} item={item} onEdit={startEdit} onDelete={onDelete} onShare={onShare} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 col-span-full">No items match your filters.</div>
        )}
      </div>
    </div>
  )  
}
