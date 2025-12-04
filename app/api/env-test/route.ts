import { NextResponse } from 'next/server'

export async function GET() {
  // Safe: only returns NEXT_PUBLIC_* keys and NODE_ENV for debugging
  return NextResponse.json({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? null,
    NODE_ENV: process.env.NODE_ENV ?? null,
  })
}
