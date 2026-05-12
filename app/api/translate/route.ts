// app/api/translate/route.ts
// Server-side proxy for Google Cloud Translation API.
// The API key stays on the server — never exposed to the browser.

import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY

export async function POST(req: NextRequest) {
  try {
    const { texts, targetLang } = await req.json()

    // Validate inputs
    if (!Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ error: 'texts must be a non-empty array' }, { status: 400 })
    }
    if (!targetLang || typeof targetLang !== 'string') {
      return NextResponse.json({ error: 'targetLang is required' }, { status: 400 })
    }

    // If no API key configured, return originals (graceful fallback)
    if (!GOOGLE_API_KEY) {
      console.warn('[translate] GOOGLE_TRANSLATE_API_KEY not set — returning originals')
      return NextResponse.json({ translations: texts })
    }

    // Call Google Cloud Translation API v2
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: texts,
        target: targetLang,
        source: 'en',
        format: 'text',
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('[translate] Google API error:', err)
      return NextResponse.json({ error: 'Translation API failed', details: err }, { status: 502 })
    }

    const data = await response.json()
    const translations: string[] = data.data.translations.map(
      (t: { translatedText: string }) => t.translatedText
    )

    return NextResponse.json({ translations })
  } catch (err) {
    console.error('[translate] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
