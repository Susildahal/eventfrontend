"use client"

import React from "react"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div
        className="
          bg-background
          border border-border
          rounded-2xl
          p-10
          flex flex-col items-center
          max-w-sm w-full
          shadow-lg
        "
      >
        {/* Spinner */}
        <Spinner
          className="
            w-14 h-14
            text-[rgb(190,149,69)]
            mb-6
          "
        />

        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Loading...
        </h2>

        {/* Subtitle */}
        <p className="text-muted-foreground mb-6 text-center text-sm">
          Please wait while we prepare your experience.
        </p>

        {/* Skeletons */}
        <div className="flex flex-col gap-4 w-full">
          <Skeleton className="h-8 w-3/4 rounded-xl mx-auto bg-muted" />
          <Skeleton className="h-6 w-full rounded-lg bg-muted" />
          <Skeleton className="h-6 w-5/6 rounded-lg mx-auto bg-muted" />
          <Skeleton className="h-6 w-2/3 rounded-lg mx-auto bg-muted" />
        </div>
      </div>
    </div>
  )
}

export default Loading
