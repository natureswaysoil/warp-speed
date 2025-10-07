"use client"
import { useEffect } from 'react'

export default function ChatWidget() {
  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID
    if (!websiteId || typeof window === 'undefined') return
    window.$crisp = window.$crisp || []
    window.CRISP_WEBSITE_ID = websiteId
    const d = document
    const s = d.createElement('script')
    s.src = 'https://client.crisp.chat/l.js'
    s.async = 1
    d.getElementsByTagName('head')[0].appendChild(s)
  }, [])
  return null
}
