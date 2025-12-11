import React, { Suspense } from 'react'
import ResetOtpClient from './ResetOtpClient'

export default function Page() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetOtpClient />
    </Suspense>
  )
}