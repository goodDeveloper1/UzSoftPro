import { NextResponse } from 'next/server'

type RequestBody = {
  name?: string
  email?: string
  phone?: string
  company?: string
  message?: string
  telegram?: string
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_ADMIN_IDS = process.env.TELEGRAM_ADMIN_IDS || '' // comma separated ids

async function sendMessageToAdmins(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_IDS) {
    throw new Error('Telegram bot token or admin ids not configured')
  }

  const admins = TELEGRAM_ADMIN_IDS.split(',').map((s) => s.trim()).filter(Boolean)

  const base = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  for (const adminId of admins) {
    const url = `${base}?chat_id=${encodeURIComponent(adminId)}&text=${encodeURIComponent(text)}`
    // Fire and await each so we rate-limit slightly
    const res = await fetch(url, { method: 'GET' })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Telegram API error: ${res.status} ${body}`)
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody

    const text = `Yangi mijoz bog'lanishi:\nIsm: ${body.name || ''}\nEmail: ${body.email || ''}\nTelegram: ${body.telegram || ''}\nTelefon: ${body.phone || ''}\nKompaniya: ${body.company || ''}\nXabar: ${body.message || ''}`

    await sendMessageToAdmins(text)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Error in /api/contact', err)
    return NextResponse.json({ ok: false, error: err.message || String(err) }, { status: 500 })
  }
}
