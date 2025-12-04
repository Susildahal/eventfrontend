import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url, title, id } = body

    if (!url || !title) return NextResponse.json({ error: 'url and title required' }, { status: 400 })

    const auth = req.headers.get('authorization')

    // Fetch the remote image on the server (avoids CORS issues)
    const fetched = await fetch(url)
    if (!fetched.ok) return NextResponse.json({ error: `Failed to fetch image: ${fetched.status}` }, { status: 502 })

    const arrayBuffer = await fetched.arrayBuffer()
    const contentType = fetched.headers.get('content-type') || 'application/octet-stream'
    const filename = String(url).split('/').pop()?.split('?')[0] || 'image'

    // Build FormData and attach the fetched image as a blob
    const form = new FormData()
    form.append('title', title)
    const blob = new Blob([arrayBuffer], { type: contentType })
    // third param sets filename
    form.append('image', blob as any, filename)

    const target = id ? `/gallery/${id}` : '/gallery'

    const headers: Record<string, string> = {}
    if (auth) headers['authorization'] = auth

    const forward = await fetch(`${API_URL}${target}`, {
      method: id ? 'PUT' : 'POST',
      headers,
      body: form,
    })

    const text = await forward.text()
    const ct = forward.headers.get('content-type') || ''
    if (ct.includes('application/json')) return NextResponse.json(JSON.parse(text), { status: forward.status })
    return new NextResponse(text, { status: forward.status })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
