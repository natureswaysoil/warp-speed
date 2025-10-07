"use client"
import Link from 'next/link'
import { useCart } from './CartProvider'

export default function Header() {
  const { items } = useCart()
  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">Nature&apos;s Way Soil</Link>
        <nav className="nav">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart ({count})</Link>
          <a href="mailto:hello@natureswaysoil.com">Contact</a>
        </nav>
      </div>
      <div className="announcement">🚚 Free Shipping on Orders Over $50 | ✨ 15% OFF First Order | 🌱 100% Organic & Safe</div>
    </header>
  )
}
