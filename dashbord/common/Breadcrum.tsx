'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItemType {
  label: string
  href: string
  isActive: boolean
}

// Function to format the path segment into a readable label
const formatLabel = (segment: string): string => {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Map of specific route patterns to custom labels (optional)
const labelOverrides: Record<string, string> = {
  'admin': 'Dashboard',
  'users': 'Users',
  'gallery': 'Gallery',
  'contact': 'Notifications',
  'faq': 'FAQs',
  'events-types': 'Event Types',
  'service-types': 'Service Types',
  'book': 'Book Now',
  'mission': 'About',
  'portfolio': 'Portfolio',
  'profile': 'Profile',
  'settings': 'Settings',
  'eventsdashbord': 'Event Dashboard',
  'service': 'Service Details',
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()

  // Split the pathname and filter out empty strings
  const segments = pathname
    .split('/')
    .filter(segment => segment.length > 0)

  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbItemType[] = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const isActive = index === segments.length - 1
    
    // Use label override or format the segment
    const label = labelOverrides[segment] || formatLabel(segment)

    return {
      label,
      href,
      isActive,
    }
  })

  // Don't show breadcrumb if we're on the root or admin page only
  if (segments.length === 0 || (segments.length === 1 && segments[0] === 'admin')) {
    return null
  }

  // Filter out 'admin' from breadcrumb items if dashboard is available
  const filteredItems = breadcrumbItems.filter(item => {
    const segment = item.href.split('/').filter(Boolean).pop()
    return segment !== 'admin'
  })

  return (
    <Breadcrumb className="mb-1"    >
      <BreadcrumbList>
        {/* Home link */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Dynamic breadcrumb items */}
        {filteredItems.map((item, index) => (
          <div key={item.href} className="flex items-center gap-1.5">
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {item.isActive ? (
                <BreadcrumbPage className="font-semibold text-foreground">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href} className="transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default DynamicBreadcrumb