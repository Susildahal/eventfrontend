import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // base
        "flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] md:text-sm",

        // text & placeholder
        "placeholder:text-muted-foreground",

        // 🔥 text selection (theme)
        "selection:bg-[#7A5E39] selection:text-white",

        // background
        "border-input dark:bg-input/30",

        // 🔥 focus (theme)
        "focus-visible:border-[#7A5E39] focus-visible:ring-[3px] focus-visible:ring-[#7A5E39]/30",

        // error
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

        // disabled
        "disabled:cursor-not-allowed disabled:opacity-50",

        className
      )}
      {...props}
    />
  )
}

export { Textarea }
