import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // base
        "h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] md:text-sm",

        // text & placeholder
        "file:text-foreground placeholder:text-muted-foreground",

        // 🔥 text selection (theme)
        "selection:bg-[#7A5E39] selection:text-white",

        // background
        "border-input dark:bg-input/30",

        // 🔥 focus (theme)
        "focus-visible:border-[#7A5E39] focus-visible:ring-[3px] focus-visible:ring-[#7A5E39]/30",

        // error state
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

        // file input
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",

        // disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

        className
      )}
      {...props}
    />
  )
}

export { Input }
