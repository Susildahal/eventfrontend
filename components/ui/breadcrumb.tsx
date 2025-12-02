"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type BreadcrumbItem = {
  title: string
  href?: string
}

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav className={cn("flex items-center text-sm text-muted-foreground", className)} aria-label="Breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        return (
          <span key={idx} className="inline-flex items-center">
            {item.href && !isLast ? (
              <Link href={item.href} className="text-muted-foreground hover:text-foreground">
                {item.title}
              </Link>
            ) : (
              <span className={cn(isLast ? "text-foreground font-medium" : "text-muted-foreground")}>{item.title}</span>
            )}
            {!isLast && <ChevronRight className="mx-2 h-3 w-3 text-muted-foreground" />}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
