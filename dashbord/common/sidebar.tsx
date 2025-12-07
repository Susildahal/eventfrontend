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
import { useRouter, usePathname } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/app/redux/store"
import { fetchServiceTypes } from '@/app/redux/slices/serviceTypesSlice'

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
  },
  {
    title: "Service Types",
    icon: Settings,
    href: "/admin/service-types",
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
  {
    title: "Portfolio",
    icon: BarChart3,
    href: "/admin/portfolio",
  },
]

function UserProfile() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [data, setData] = useState<{ name: string; email: string }>({ name: "", email: "" })
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const serviceTypesState = useSelector((state: { serviceTypes: { items: any[] } }) => state.serviceTypes)

  const [serviceTypes, setServiceTypes] = useState<any[]>([])

  React.useEffect(() => {
    setServiceTypes(serviceTypesState.items)
  }, [serviceTypesState.items])

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

  React.useEffect(() => {
    if (serviceTypesState.items.length === 0) {
      dispatch(fetchServiceTypes())
    }
  }, [dispatch, serviceTypesState.items.length])

  if (!mounted) {
    return null
  }

  const handlelogout = async () => {
    try {
      await axiosInstance.post('/auth/logout')
      localStorage.removeItem('authToken')
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
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
  isActive,
  eventTypesList,
  serviceTypesList,
}: {
  item: any
  isActive: boolean
  eventTypesList: any[]
  serviceTypesList: any[]
}) {
  const Icon = item.icon
  const pathname = usePathname()

  // Check if Event Types dropdown item is active
  if (item.title === "Event Types" && eventTypesList.length > 0) {
    return (
      <DropdownMenu>
        <SidebarMenuButton asChild>
          <DropdownMenuTrigger asChild>
            <button className={`flex w-full items-center gap-2 ${
              pathname.includes("/events-types") ? "text-primary font-semibold" : ""
            }`}>
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.title}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground ml-auto" />
            </button>
          </DropdownMenuTrigger>
        </SidebarMenuButton>
        <DropdownMenuContent align="start" side="right" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/admin/events-types">Manage Event Types</Link>
          </DropdownMenuItem>
          {eventTypesList.map((et: any) => (
            <DropdownMenuItem key={et._id || et.id || et.name} asChild>
              <Link href={`/admin/eventsdashbord?id=${et._id || et.id}`}>
                {et.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Check if Service Types dropdown item is active
  if (item.title === "Service Types" && serviceTypesList.length > 0) {
    return (
      <DropdownMenu>
        <SidebarMenuButton asChild>
          <DropdownMenuTrigger asChild>
            <button className={`flex w-full items-center gap-2 ${
              pathname.includes("/service") ? "text-primary font-semibold" : ""
            }`}>
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.title}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground ml-auto" />
            </button>
          </DropdownMenuTrigger>
        </SidebarMenuButton>
        <DropdownMenuContent align="start" side="right" className="w-56">
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
    )
  }

  return (
    <SidebarMenuButton asChild>
      <Link href={item.href} className={isActive ? "text-primary font-semibold" : ""}>
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
  const pathname = usePathname()

  // Get service types from Redux state
  const serviceTypesListRedux = useSelector((state: { serviceTypes: { items: any[] } }) => state.serviceTypes.items)

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
          const svcData = svcRes.value.data?.data ?? svcRes.value.data ?? []
          setServiceTypesList(Array.isArray(svcData) ? svcData : [])
        }

        if (evtRes.status === "fulfilled") {
          const evtData = evtRes.value.data?.data ?? evtRes.value.data ?? []
          setEventTypesList(Array.isArray(evtData) ? evtData : [])
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
                  filteredItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    return (
                      <SidebarMenuItem key={item.title}>
                        <NavItem
                          item={item}
                          isActive={isActive}
                          eventTypesList={eventTypesList}
                          serviceTypesList={serviceTypesListRedux}
                        />
                      </SidebarMenuItem>
                    )
                  })
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
                    <Link href="/admin/settings" className={pathname === "/admin/settings" ? "text-primary font-semibold" : ""}>
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