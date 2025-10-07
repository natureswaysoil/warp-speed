"use client"
import { useCart } from '../../../components/CartProvider'

export function AddToCart({ id }) {
  const { addItem } = useCart()
  return (
    <button className="btn" onClick={() => addItem(id, 1)}>Add to Cart</button>
  )
}
