"use client"
import { useEffect, useMemo, useRef, useState } from 'react'

const styles = {
  button: {
    position: 'fixed', right: '20px', bottom: '20px', zIndex: 50,
    background: '#16a34a', color: '#fff', border: 'none', borderRadius: '9999px',
    padding: '0.8rem 1.1rem', boxShadow: '0 10px 20px rgba(0,0,0,0.12)', cursor: 'pointer'
  },
  panel: {
    position: 'fixed', right: '20px', bottom: '90px', width: '340px', maxWidth: 'calc(100% - 40px)',
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)', zIndex: 50
  },
  header: { padding: '0.8rem 1rem', background: '#f0fdf4', borderBottom: '1px solid #e5e7eb', fontWeight: 600 },
  body: { padding: '0.75rem', maxHeight: '360px', overflowY: 'auto', display: 'grid', gap: '0.5rem' },
  msgUser: { justifySelf: 'end', background: '#16a34a', color: '#fff', padding: '0.5rem 0.7rem', borderRadius: '0.6rem' },
  msgBot: { justifySelf: 'start', background: '#f3f4f6', color: '#111827', padding: '0.5rem 0.7rem', borderRadius: '0.6rem' },
  inputRow: { display: 'flex', gap: '0.5rem', padding: '0.75rem', borderTop: '1px solid #e5e7eb' },
  input: { flex: 1, padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' },
  suggestions: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem', padding: '0.4rem 0.75rem' },
  chip: { border: '1px solid #d1d5db', borderRadius: '9999px', padding: '0.25rem 0.6rem', cursor: 'pointer', background: '#fff' }
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem('nws_ai_chat_v1') || '[]') } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bodyRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('nws_ai_chat_v1', JSON.stringify(messages.slice(-20))) } catch {}
    }
  }, [messages])

  useEffect(() => {
    if (open && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [open, messages])

  const suggestions = useMemo(() => ([
    'How do I improve clay soil?',
    'When should I fertilize my lawn?',
    'Best watering schedule for tomatoes?',
    'Composting tips for beginners'
  ]), [])

  async function send(text) {
    const userText = (text ?? input).trim()
    if (!userText) return
    setInput('')
    const next = [...messages, { role: 'user', content: userText }]
    setMessages(next)
    setLoading(true)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-10) })
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(m => [...m, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(m => [...m, { role: 'assistant', content: 'Sorry, I could not generate a reply.' }])
      }
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'Network error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(e) { e.preventDefault(); if (!loading) send() }

  return (
    <>
      <button style={styles.button} onClick={() => setOpen(o => !o)}>
        {open ? 'Close Assistant' : 'Ask our AI'}
      </button>
      {open && (
        <div style={styles.panel}>
          <div style={styles.header}>Soil Helper — Gardening Q&A</div>
          <div ref={bodyRef} style={styles.body}>
            {messages.length === 0 && (
              <div style={{ color: '#6b7280' }}>Ask anything about gardening, soil health, composting, lawns, and more.</div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} style={m.role === 'user' ? styles.msgUser : styles.msgBot}>{m.content}</div>
            ))}
          </div>
          <div style={styles.suggestions}>
            {suggestions.map((s, i) => (
              <span key={i} style={styles.chip} onClick={() => send(s)}>{s}</span>
            ))}
          </div>
          <form onSubmit={onSubmit} style={styles.inputRow}>
            <input
              style={styles.input}
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Thinking…' : 'Send'}</button>
          </form>
        </div>
      )}
    </>
  )
}
