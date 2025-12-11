import React  ,{Suspense} from 'react'
import ClientCompoetns from './forgotpasswordclientcompoetns'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center">Loading...</div>}>
        <ClientCompoetns />
      </Suspense>
    </div>
  )
}

export default page
