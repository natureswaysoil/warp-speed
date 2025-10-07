import { NextResponse } from 'next/server'

export async function POST(req) {
  const { messages = [] } = await req.json().catch(() => ({ messages: [] }))
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI not configured. Set OPENAI_API_KEY.' }, { status: 400 })
  }

  const system = {
    role: 'system',
    content: [
      "You are 'Soil Helper', an AI assistant for Nature's Way Soil.",
      'Provide friendly, concise, practical gardening advice (soil health, compost, lawns, vegetables, trees, pests, watering, fertilizing).',
      'Do not push products. If a Nature\'s Way Soil product is clearly relevant, you may mention it briefly and neutrally.',
      'Avoid unsafe or illegal guidance. When recommending fertilizers or amendments, include safe, general ranges and prompt the user to check local conditions.',
    ].join(' ')
  }

  const userMessages = Array.isArray(messages) ? messages.filter(m => typeof m?.content === 'string' && m?.role) : []
  const payload = {
    model,
    temperature: 0.7,
    max_tokens: 600,
    messages: [system, ...userMessages]
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const err = await res.text().catch(() => '')
      return NextResponse.json({ error: 'OpenAI request failed', details: err }, { status: 500 })
    }

    const data = await res.json()
    const reply = data?.choices?.[0]?.message?.content?.trim() || ''
    return NextResponse.json({ reply })
  } catch (e) {
    return NextResponse.json({ error: 'Network error' }, { status: 500 })
  }
}
