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
import { useEffect ,useState } from "react"
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
    title: "Contracts",
    icon: FileText,
    href: "/admin/contact",
  },
  {
    title: "FAQs",
    icon: Mail,
    href: "/admin/faq",
  },
   {
    title: "Events Dashboard",
    icon: Bell,
    href: "/admin/eventsdashbord",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/admin/notifications",
  },
  {
    title: "Service",
    icon: Bell,
    href: "/admin/service",
  },
   {
    title: "Create Account",
    icon: Bell,
    href: "/admin/register",
  },
   {
    title: "Book Now",
    icon: Bell,
    href: "/admin/book",
  },

]

function UserProfile() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [data, setData] = useState<{ name: string; email: string }>({ name: '', email: '' })
  const router = useRouter()

  React.useEffect(() => {
    setMounted(true)
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/users/me") 
        console.log("User profile data:", response.data.user)
        setData(response.data.user)
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setMounted(true)
      }
    }
    fetchUserData()
  }, [])

  if (!mounted) {
    return null
  }
console.log("User data in sidebar:", data)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className=  "flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-sidebar-accent transition-colors">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>{data.name?.charAt(0) || ""}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col items-start text-sm">
            <span className="font-semibold">{data.name}</span>
            <span className="text-xs text-muted-foreground"></span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="top">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span onClick={() => router.push("/admin/profile")}>Profile</span>
          </DropdownMenuItem>
       
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4"onClick={() => router.push("/admin/settings")} />
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
        <DropdownMenuItem className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppSidebar({ children }: { children?: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filteredItems, setFilteredItems] = React.useState(navigationItems)

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

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold">EventHub</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <div className="px-3 py-2">
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
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No results found
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/settings">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
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
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-between">
            <Breadcrumb items={[{ title: "Home", href: "/" }, { title: "Dashboard" }]} />
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