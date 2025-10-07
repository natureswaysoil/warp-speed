"use client"
import Link from 'next/link'
import { useCart } from './CartProvider'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const handleAdd = () => addItem(product.id, 1)
  return (
    <div className="card">
      <Link href={`/products/${product.slug}`}>
        <img src={product.image} alt={product.name} className="card-image" />
        <h3 className="card-title">{product.name}</h3>
      </Link>
      <p className="card-price">${(product.price / 100).toFixed(2)}</p>
      <button className="btn" onClick={handleAdd}>Add to Cart</button>
    </div>
  )
}
