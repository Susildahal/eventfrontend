import React, { Suspense } from 'react'
import EventsdashbordClient from './EventsdashbordClient'

export default function Page(){
  return (
    <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center">Loading...</div>}>
      <EventsdashbordClient />
    </Suspense>
  )
}