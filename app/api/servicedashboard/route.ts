import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

async function proxyFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, init)
  const data = await res.text()
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return NextResponse.json(JSON.parse(data), { status: res.status })
  }
  return new NextResponse(data, { status: res.status })
}

// allow forwarding incoming request headers (Authorization, etc.)
async function proxyFetchWithReq(path: string, req?: NextRequest, init?: RequestInit) {
  const headers: Record<string, string> = {}
  // copy any headers from init first
  if (init && init.headers) {
    const h = init.headers as Record<string, string>
    Object.assign(headers, h)
  }
  // forward Authorization and any content-type from the incoming client request
  if (req) {
    const auth = req.headers.get('authorization')
    const ct = req.headers.get('content-type')
    if (auth) headers['authorization'] = auth
    if (ct && !headers['Content-Type'] && !headers['content-type']) headers['Content-Type'] = ct
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers })
  const data = await res.text()
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return NextResponse.json(JSON.parse(data), { status: res.status })
  }
  return new NextResponse(data, { status: res.status })
}

export async function GET(req: NextRequest) {
  // GET /api/servicedashboard -> proxy to backend /servicedashboard
  // forward any query string from the incoming request to the backend
  const url = new URL(req.url)
  const search = url.search || ''
  return proxyFetchWithReq(`/servicedashboard${search}`, req)
}

export async function POST(req: NextRequest) {
  // Create new servicedashboard record
  const body = await req.json()
  return proxyFetchWithReq('/servicedashboard', req, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function PUT(req: NextRequest) {
  // Update servicedashboard - expects id either in body.id or query ?id=...
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  const body = await req.json()

  const target = id ? `/servicedashboard/${id}` : (body.id ? `/servicedashboard/${body.id}` : '/servicedashboard')

  return proxyFetchWithReq(target, req, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
