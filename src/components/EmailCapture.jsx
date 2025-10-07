"use client"
import { useState } from 'react'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  async function onSubmit(e) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' })
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <input
        type="email"
        placeholder="Enter your email for tips and offers"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ padding: '.6rem', border: '1px solid #d1d5db', borderRadius: '.5rem', minWidth: '260px' }}
      />
      <button className="btn" type="submit" disabled={status==='loading'}>
        {status==='loading' ? 'Joining…' : 'Join Newsletter'}
      </button>
      {status==='success' && <span style={{ color: '#16a34a' }}>Thanks! You’re in.</span>}
      {status==='error' && <span style={{ color: '#ef4444' }}>Something went wrong. Please try again.</span>}
    </form>
  )
}
