"use client"
import Link from 'next/link'
import { useCart } from '../../components/CartProvider'
import { useEffect, useMemo, useState } from 'react'

export default function CartPage() {
  const { items, setQuantity, removeItem } = useCart()
  const [loading, setLoading] = useState(false)
  const [catalog, setCatalog] = useState(null)
  const [catalogLoading, setCatalogLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (mounted) setCatalog(data.products)
      } catch {
        if (mounted) setCatalog([])
      } finally {
        if (mounted) setCatalogLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const lines = useMemo(() => {
    if (!catalog) return []
    return items.map(i => {
      const p = catalog.find(x => x.id === i.id)
      if (!p) return null
      return { ...p, quantity: i.quantity, lineTotal: p.price * i.quantity }
    }).filter(Boolean)
  }, [items, catalog])

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0)

  async function checkout() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Checkout not configured yet.')
      }
    } catch (e) {
      alert('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (catalogLoading) {
    return <div>Loading cart…</div>
  }

  if (lines.length === 0) {
    return (
      <div>
        <h1>Your cart is empty</h1>
        <Link className="btn" href="/products">Shop Products</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Your Cart</h1>
      <div className="cart">
        {lines.map(l => (
          <div className="cart-item" key={l.id}>
            <img src={l.image} alt={l.name} />
            <div className="cart-info">
              <h3>{l.name}</h3>
              <p>${(l.price / 100).toFixed(2)}</p>
              <div className="qty">
                <label>Qty</label>
                <input type="number" min="1" value={l.quantity} onChange={e => setQuantity(l.id, Math.max(1, Number(e.target.value) || 1))} />
                <button className="link" onClick={() => removeItem(l.id)}>Remove</button>
              </div>
            </div>
            <div className="cart-line">${(l.lineTotal / 100).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div>Subtotal: <strong>${(subtotal / 100).toFixed(2)}</strong></div>
        <button className="btn" onClick={checkout} disabled={loading}>{loading ? 'Redirecting...' : 'Checkout'}</button>
      </div>
    </div>
  )
}
