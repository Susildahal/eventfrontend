// import { NextRequest, NextResponse } from 'next/server'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// // Proxy helper that returns JSON or raw text depending on content-type
// async function proxyFetchWithReq(path: string, req?: NextRequest, init?: RequestInit) {
//   const headers: Record<string, string> = {}
//   if (init && init.headers) {
//     const h = init.headers as Record<string, string>
//     Object.assign(headers, h)
//   }
//   if (req) {
//     const auth = req.headers.get('authorization')
//     const ct = req.headers.get('content-type')
//     if (auth) headers['authorization'] = auth
//     if (ct && !headers['Content-Type'] && !headers['content-type']) headers['Content-Type'] = ct
//   }

//   const res = await fetch(`${API_URL}${path}`, { ...init, headers })
//   const data = await res.text()
//   const contentType = res.headers.get('content-type') || ''
//   if (contentType.includes('application/json')) {
//     return NextResponse.json(JSON.parse(data), { status: res.status })
//   }
//   return new NextResponse(data, { status: res.status })
// }

// export async function GET(req: NextRequest) {
//   const url = new URL(req.url)
//   const search = url.search || ''
//   // Proxy GET /api/about -> backend /about
//   return proxyFetchWithReq(`/about${search}`, req)
// }

// export async function POST(req: NextRequest) {
//   const body = await req.json()
//   return proxyFetchWithReq('/about', req, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   })
// }

// export async function PUT(req: NextRequest) {
//   const url = new URL(req.url)
//   const id = url.searchParams.get('id')
//   const body = await req.json()
//   const target = id ? `/about/${id}` : (body.id ? `/about/${body.id}` : '/about')

//   return proxyFetchWithReq(target, req, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   })
// }
