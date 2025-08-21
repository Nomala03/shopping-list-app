import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { createItemThunk, deleteItemThunk, fetchItemsThunk, selectFilters, selectItems, setFilters } from '../store/itemsSlice'
import { Category, ShoppingItem } from '../types'

const categories: Category[] = ['Groceries', 'Household', 'Personal', 'Electronics', 'Other']

function ItemCard({ item, onEdit, onDelete, onShare }: { item: ShoppingItem; onEdit: (item: ShoppingItem)=>void; onDelete: (id: number)=>void; onShare: (id: number)=>void }) {
  return (
    <div className="card">
      {item.images[0] && <img className="thumb" src={item.images[0]} alt={item.name} />}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3>{item.name}</h3>
        <span className="badge">{item.category}</span>
      </div>
      <div className="help">Qty: {item.quantity} • Added {new Date(item.createdAt).toLocaleDateString()}</div>
      {item.notes && <p style={{marginTop:8}}>{item.notes}</p>}
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button className="btn secondary" onClick={()=>onEdit(item)}>Edit</button>
        <button className="btn secondary" onClick={()=>onShare(item.id)}>Share</button>
        <button className="btn" onClick={()=>onDelete(item.id)}>Delete</button>
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
  }, [searchParams])

  // Sync Redux filters -> URL
  useEffect(() => {
    const current = Object.fromEntries(searchParams.entries())
    const desired = { q: filters.q, sort: filters.sort, order: filters.order }
    const changed = current.q !== desired.q || current.sort !== desired.sort || current.order !== desired.order
    if (changed) setSearchParams(desired, { replace: true })
  }, [filters])

  useEffect(() => {
    if (user) dispatch(fetchItemsThunk(user.id))
  }, [user, dispatch])

  const filtered = useMemo(() => {
    const q = filters.q.toLowerCase()
    const base = items.filter(i => i.name.toLowerCase().includes(q))
    const sorted = [...base].sort((a, b) => {
      if (filters.sort === 'name') return a.name.localeCompare(b.name)
      if (filters.sort === 'category') return a.category.localeCompare(b.category)
      // date
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
    const images = draft.images.split(',').map(s=>s.trim()).filter(Boolean)
    const res = await dispatch(createItemThunk({
      userId: user.id,
      name: draft.name.trim(),
      quantity: Number(draft.quantity),
      notes: draft.notes.trim() || undefined,
      category: draft.category,
      images
    }))
    if (createItemThunk.fulfilled.match(res)) resetDraft()
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
    setDraft({ name: item.name, quantity: item.quantity, notes: item.notes ?? '', category: item.category, images: item.images.join(', ') })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function onDelete(id: number) {
    await dispatch(deleteItemThunk(id))
  }

  function onShare(id: number) { navigate(`/share/${id}`) }

  return (
    <div className="container">
      <div className="card" style={{marginBottom:16}}>
        <h2>{editing? 'Edit Item' : 'Add Item'}</h2>
        <div className="row cols-3">
          <div>
            <label>Name</label>
            <input className="input" value={draft.name} onChange={e=>setDraft(p=>({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label>Quantity</label>
            <input className="input" type="number" min={1} value={draft.quantity} onChange={e=>setDraft(p=>({ ...p, quantity: Number(e.target.value) }))} />
          </div>
          <div>
            <label>Category</label>
            <select value={draft.category} onChange={e=>setDraft(p=>({ ...p, category: e.target.value as Category }))}>
              {categories.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="row" style={{gridColumn:'1 / -1'}}>
            <label>Image URLs (comma-separated)</label>
            <input className="input" placeholder="https://... , https://..." value={draft.images} onChange={e=>setDraft(p=>({ ...p, images: e.target.value }))} />
          </div>
          <div className="row" style={{gridColumn:'1 / -1'}}>
            <label>Notes (optional)</label>
            <textarea className="input" rows={3} value={draft.notes} onChange={e=>setDraft(p=>({ ...p, notes: e.target.value }))} />
          </div>
          <div style={{gridColumn:'1 / -1'}}>
            {editing ? (
              <div style={{display:'flex', gap:8}}>
                <button className="btn" onClick={onSaveEdit}>Save Changes</button>
                <button className="btn secondary" onClick={resetDraft}>Cancel</button>
              </div>
            ) : (
              <button className="btn" onClick={onCreate}>Add Item</button>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <div className="row cols-3">
          <div>
            <label>Search</label>
            <input
              className="input"
              placeholder="Search by name"
              value={filters.q}
              onChange={(e)=>dispatch(setFilters({ ...filters, q: e.target.value }))}
            />
          </div>
          <div>
            <label>Sort</label>
            <select value={filters.sort} onChange={e=>dispatch(setFilters({ ...filters, sort: e.target.value as 'name'|'category'|'date' }))}>
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="date">Date added</option>
            </select>
          </div>
          <div>
            <label>Order</label>
            <select value={filters.order} onChange={e=>dispatch(setFilters({ ...filters, order: e.target.value as 'asc'|'desc' }))}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <p className="help">URL reflects search & sort: <code>?q=...&sort=...</code>. Editing URL updates the page.</p>
      </div>

      <div className="list-grid">
        {filtered.map(item => (
          <ItemCard key={item.id} item={item} onEdit={startEdit} onDelete={onDelete} onShare={onShare} />
        ))}
        {filtered.length === 0 && <div className="help">No items match your filters.</div>}
      </div>
    </div>
  )
}