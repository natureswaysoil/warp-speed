"use client"
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const CartContext = createContext()

const initialState = { items: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload || initialState
    case 'ADD': {
      const { id, quantity } = action.payload
      const existing = state.items.find(i => i.id === id)
      let items
      if (existing) {
        items = state.items.map(i => i.id === id ? { ...i, quantity: i.quantity + quantity } : i)
      } else {
        items = [...state.items, { id, quantity }]
      }
      return { ...state, items }
    }
    case 'REMOVE': {
      const { id } = action.payload
      return { ...state, items: state.items.filter(i => i.id !== id) }
    }
    case 'SET_QTY': {
      const { id, quantity } = action.payload
      return { ...state, items: state.items.map(i => i.id === id ? { ...i, quantity } : i) }
    }
    case 'CLEAR':
      return initialState
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nws_cart_v1')
      if (saved) dispatch({ type: 'INIT', payload: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('nws_cart_v1', JSON.stringify(state)) } catch {}
  }, [state])

  const value = useMemo(() => ({
    items: state.items,
    addItem: (id, quantity = 1) => dispatch({ type: 'ADD', payload: { id, quantity } }),
    removeItem: (id) => dispatch({ type: 'REMOVE', payload: { id } }),
    setQuantity: (id, quantity) => dispatch({ type: 'SET_QTY', payload: { id, quantity } }),
    clear: () => dispatch({ type: 'CLEAR' })
  }), [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
