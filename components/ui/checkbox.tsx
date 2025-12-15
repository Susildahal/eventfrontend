"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // base
        "peer size-4 shrink-0 rounded-[2px] border shadow-xs transition-shadow outline-none",

        // unchecked
        "border-input dark:bg-input/30",

        // 🔥 checked = THEME COLOR
        "data-[state=checked]:bg-[#7A5E39] data-[state=checked]:border-[#7A5E39] data-[state=checked]:text-white",

        // focus & accessibility
        "focus-visible:ring-[3px] focus-visible:ring-[#7A5E39]/30 focus-visible:border-[#7A5E39]",

        // error
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

        // disabled
        "disabled:cursor-not-allowed disabled:opacity-50",

        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
