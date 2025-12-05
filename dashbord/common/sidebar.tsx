"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarInput,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Home,
  Calendar,
  Users,
  Settings,
  BarChart3,
  FileText,
  Mail,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Moon,
  Sun,
  Monitor,
  MenuIcon,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"
import Breadcrumb from "@/components/ui/breadcrumb"
import Link from "next/link"
import axiosInstance from "@/app/config/axiosInstance"

const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/admin/dashboard",
  },
  {
    title: "Events",
    icon: Calendar,
    href: "/admin/events",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Gallery",
    icon: BarChart3,
    href: "/admin/gallery",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/admin/contact",
  },
  {
    title: "FAQs",
    icon: FileText,
    href: "/admin/faq",
  },
  {
    title: "Events Dashboard",
    icon: BarChart3,
    href: "/admin/eventsdashbord",
  },
  {
    title: "Event Types",
    icon: Calendar,
    href: "/admin/events-types",
    children: [
      { title: "Add New Event Type", href: "/admin/events-types" },
      { title: "Dummy Item", href: "/admin/events-types/dummy" },
    ],
  },
  {
    title: "Service Types",
    icon: Settings,
    href: "/admin/service-types",
    children: [
      { title: "Add New Service Type", href: "/admin/service-types" },
      { title: "Dummy Item", href: "/admin/service-types/dummy" },
    ],
  },
  {
    title: "Service",
    icon: Mail,
    href: "/admin/service",
  },
  {
    title: "Create Account",
    icon: Users,
    href: "/admin/register",
  },
  {
    title: "Book Now",
    icon: Calendar,
    href: "/admin/book",
  },
  {
    title: "About",
    icon: FileText,
    href: "/admin/mission",
  },
  {
    title: "About Image",
    icon: BarChart3,
    href: "/admin/aboutimage",
  },
]

function UserProfile() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [data, setData] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  })
  const router = useRouter()

  const handlelogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      router.push("/login")
    }
  }

  React.useEffect(() => {
    setMounted(true)
    const fetchUserData = async () => {
      try {
        const userRes = await axiosInstance.get("/users/me")
        setData(userRes.data.user)
      } catch (error: any) {
        console.error("Error fetching user profile:", error)
        if (error?.response?.status === 401) {
          localStorage.removeItem("authToken")
          router.push("/login")
        }
      }
    }
    fetchUserData()
  }, [router])

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-sidebar-accent transition-colors">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>{data.name?.charAt(0) || ""}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col items-start text-sm group-data-[state=collapsed]:hidden">
            <span className="font-semibold">{data.name}</span>
            <span className="text-xs text-muted-foreground">{data.email}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=collapsed]:hidden" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="top">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center justify-between">
          <div className="flex items-center">
            {theme === "dark" ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : (
              <Sun className="mr-2 h-4 w-4" />
            )}
            <span>Dark Mode</span>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={handlelogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NavItem({
  item,
  isCollapsed,
  eventTypesList,
  serviceTypesList,
}: {
  item: any
  isCollapsed: boolean
  eventTypesList: any[]
  serviceTypesList: any[]
}) {
  const Icon = item.icon

  if (item.title === "Event Types" && eventTypesList.length > 0) {
    return (
      <SidebarMenuButton asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 px-0">
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">{item.title}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right">
            {eventTypesList.map((et: any) => (
              <DropdownMenuItem key={et._id || et.id || et.name} asChild>
                <Link href={`/admin/eventsdashbord?id=${et._id || et.id}`}>
                  {et.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuButton>
    )
  }

  if (item.title === "Service Types" && serviceTypesList.length > 0) {
    return (
      <SidebarMenuButton asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 px-0">
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">{item.title}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right">
            <DropdownMenuItem asChild>
              <Link href="/admin/service-types">Add new service</Link>
            </DropdownMenuItem>
            {serviceTypesList.map((st: any) => (
              <DropdownMenuItem key={st._id || st.id || st.name} asChild>
                <Link href={`/admin/service?id=${st._id || st.id}`}>
                  {st.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuButton>
    )
  }

  if (item.children && item.children.length > 0) {
    return (
      <SidebarMenuButton asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 px-0">
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">{item.title}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right">
            {item.children.map((child: any) => (
              <DropdownMenuItem key={child.title} asChild>
                <Link href={child.href}>{child.title}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuButton>
    )
  }

  return (
    <SidebarMenuButton asChild>
      <Link href={item.href}>
        <Icon className="h-4 w-4" />
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  )
}

export function AppSidebar({ children }: { children?: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filteredItems, setFilteredItems] = React.useState(navigationItems)
  const [serviceTypesList, setServiceTypesList] = React.useState<any[]>([])
  const [eventTypesList, setEventTypesList] = React.useState<any[]>([])
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(navigationItems)
    } else {
      const filtered = navigationItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredItems(filtered)
    }
  }, [searchQuery])

  React.useEffect(() => {
    let mounted = true
    const fetchLists = async () => {
      try {
        const [svcRes, evtRes] = await Promise.allSettled([
          axiosInstance.get("/servicetypes"),
          axiosInstance.get("/eventtypes"),
        ])

        if (!mounted) return

        if (svcRes.status === "fulfilled") {
          setServiceTypesList(svcRes.value.data?.data ?? svcRes.value.data ?? [])
        }

        if (evtRes.status === "fulfilled") {
          setEventTypesList(evtRes.value.data?.data ?? evtRes.value.data ?? [])
        }
      } catch (e) {
        console.error("Unexpected error fetching sidebar lists", e)
      }
    }

    fetchLists()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-3 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex flex-col group-data-[state=collapsed]:hidden">
              <span className="text-lg font-semibold">EventHub</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <div className="px-3 py-2 group-data-[state=collapsed]:hidden">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <SidebarInput
                  type="search"
                  placeholder="Search..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[state=collapsed]:hidden">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <NavItem
                        item={item}
                        isCollapsed={isCollapsed}
                        eventTypesList={eventTypesList}
                        serviceTypesList={serviceTypesList}
                      />
                    </SidebarMenuItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground group-data-[state=collapsed]:hidden">
                    No results found
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[state=collapsed]:hidden">
              Settings
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/settings">
                      <Settings className="h-4 w-4" />
                      <span className="group-data-[state=collapsed]:hidden">Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <UserProfile />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <SidebarTrigger className="hover:bg-sidebar-accent" />
          <div className="flex flex-1 items-center justify-between">
            <Breadcrumb
              items={[
                { title: "Home", href: "/" },
                { title: "Dashboard" },
              ]}
            />
            <div className="flex items-center gap-2">
              <ThemeDropdown />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function ThemeDropdown() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center rounded-md px-2 py-1 hover:bg-sidebar-accent transition-colors">
          {theme === "dark" ? (
            <Moon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Sun className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}