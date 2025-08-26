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
        try {
          const fetched = await fetchItemById(itemId)
        setItem(fetched)
        } catch {
        setError('Item not found')
        }
      }
      run()
  }, [itemId])  


  if (itemId === 'guide') {  
    return (
      <div className="max-w-[1000px] mx-auto p-6">
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <h2>Sharing Lists</h2>
          <p>Open any item card and click <strong>Share</strong>. Copy the URL and send it to anyone. They can view it without logging in.</p>
          <p className="text-xs text-gray-700">Example URL: <code>/share/123</code></p>
        </div>
      </div>
    )
  }

  if (error) return <div className="max-w-[1000px] mx-auto p-6"><div className="bg-white border border-gray-300 rounded-lg p-4">{error}</div></div>
  if (!item) return <div className="max-w-[1000px] mx-auto p-6"><div className="bg-white border border-gray-300 rounded-lg p-4">No Items Added</div></div>

  return (
    <div className="w-80 mx-auto p-6">
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        {item.images?.length > 0 && ( <img className="w-50 h-40 object-cover rounded-[10px] border border-gray-300" src={item.images[0]} alt={item.name} />)}
        <h2>{item.name}</h2>
        <p className="text-xs text-gray-700">Qty: {item.quantity} • Category: {item.category} • Added: {new Date(item.createdAt).toLocaleString()}</p>
        {item.notes && <p>{item.notes}</p>}
        {item.images?.length > 1 && (
          <div className="grid grid-cols-3 gap-3">
            {item.images.slice(1).map((src, i) => <img key={i} className="w-50 h-40 object-cover rounded-[10px] border border-gray-300" src={src} alt={`img-${i}`} />)}
          </div>
        )}
      </div>
    </div>
  )
}