import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchItemById } from '../api/itemsApi'
import type { ShoppingItem } from '../types'

export default function ShareView() {
  const { itemId } = useParams()
  const [item, setItem] = useState<ShoppingItem | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function run() {
      if (!itemId) return
      if (itemId === 'guide') return
      try { setItem(await fetchItemById(Number(itemId))) }
      catch { setError('Item not found') }
    }
    run()
  }, [itemId])

  if (itemId === 'guide') {
    return (
      <div className="container">
        <div className="card">
          <h2>Sharing Lists</h2>
          <p>Open any item card and click <strong>Share</strong>. Copy the URL and send it to anyone. They can view it without logging in.</p>
          <p className="help">Example URL: <code>/share/123</code></p>
        </div>
      </div>
    )
  }

  if (error) return <div className="container"><div className="card">{error}</div></div>
  if (!item) return <div className="container"><div className="card">Loading...</div></div>

  return (
    <div className="container">
      <div className="card" style={{maxWidth:720, margin:'0 auto'}}>
        {item.images[0] && <img className="thumb" src={item.images[0]} alt={item.name} />}
        <h2>{item.name}</h2>
        <p className="help">Qty: {item.quantity} • Category: {item.category} • Added: {new Date(item.createdAt).toLocaleString()}</p>
        {item.notes && <p>{item.notes}</p>}
        {item.images.length > 1 && (
          <div className="row cols-3" style={{marginTop:12}}>
            {item.images.slice(1).map((src, i) => <img key={i} className="thumb" src={src} alt={`img-${i}`} />)}
          </div>
        )}
      </div>
    </div>
  )
}