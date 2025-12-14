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
import {  useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/app/redux/store"
import { fetchServiceTypes } from '@/app/redux/slices/serviceTypesSlice'
import { fetchEventTypes } from '@/app/redux/slices/eventTypesSlice'
import { fetchProfile } from '@/app/redux/slices/profileSlicer'
import { fetchContacts } from '@/app/redux/slices/contactSlice'
import { fetchBookings } from '@/app/redux/slices/bookingsSlice'
import { RootState } from "@/app/redux/store"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Users,
  Images,
  Bell,
  HelpCircle,
  CalendarCog,
  ClipboardList,

  CalendarCheck,
  Info,
  FolderKanban,
  ChevronDown,
  Settings,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Search,
  Menu,
  X,
 User,
 UserCog,
  Loader2,


} from "lucide-react";


import { useTheme } from "next-themes"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const navigationItems = [
  { title: "Users", icon: Users, href: "/admin/users" },
  { title: "Gallery", icon: Images, href: "/admin/gallery" },
  { title: "Notifications", icon: Bell, href: "/admin/contact" },
  { title: "FAQs", icon: HelpCircle, href: "/admin/faq" },
  { title: "Event Types", icon: CalendarCog, href: "/admin/events-types" },
  { title: "Service Types", icon: ClipboardList, href: "/admin/service-types" },
  { title: "Book Now", icon: CalendarCheck, href: "/admin/book" },
  { title: "About", icon: Info, href: "/admin/mission" },
  { title: "Portfolio", icon: FolderKanban, href: "/admin/portfolio" },
    { title: "Profile Setting", icon: UserCog, href: "/admin/profile" },
];



function UserProfile() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const serviceTypesState = useSelector((state: { serviceTypes: { items: any[] } }) => state.serviceTypes)
  
  // Get user from Redux instead of local state
  const { data: user, loading: reduxLoading } = useSelector((state: RootState) => state.profile)

  const [serviceTypes, setServiceTypes] = useState<any[]>([])

  React.useEffect(() => {
    setServiceTypes(serviceTypesState.items)
  }, [serviceTypesState.items])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch profile from Redux if not loaded
  React.useEffect(() => {
    if (mounted && !user && !reduxLoading) {
      dispatch(fetchProfile())
    }
  }, [mounted, user, reduxLoading, dispatch])

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
      localStorage.removeItem('authToken')
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Show loading state
  if (!user || reduxLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="animate-spin h-5 w-5" />
      </div>
    )
  }

  // Format profile picture
  const getProfilePicture = () => {
    if (!user.profilePicture) return undefined
    if (user.profilePicture.startsWith('data:')) {
      return user.profilePicture
    } else if (user.profilePicture.startsWith('http')) {
      return user.profilePicture
    } else {
      return `data:image/jpeg;base64,${user.profilePicture}`
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2 hover:bg-sidebar-accent transition-colors group-data-[state=collapsed]:justify-center">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage src={getProfilePicture()} alt="User" />
            <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col items-start text-sm hidden group-data-[state=expanded]:flex">
            <span className="font-semibold capitalize">{user.name}</span>
            <span className="text-xs text-muted-foreground italic">{user.email}</span>
            <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden group-data-[state=expanded]:block" />
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
            <span> Site Settings</span>
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
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem 
              className="text-red-600 cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log out</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out {user.name}?
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline">Cancel</Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handlelogout}
              >
                Log out
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NavItem({
  item,
  isActive,
  eventTypes = [],
  serviceTypesList = [],
  unreadCount = 0,
  pendingBookings = 0,
}: {
  item: any
  isActive: boolean
  eventTypes?: any[]
  serviceTypesList?: any[]
  unreadCount?: number
  pendingBookings?: number
}) {
  const Icon = item.icon
  const pathname = usePathname()

  // Check if Event Types dropdown item is active
  if (item.title === "Event Types" && eventTypes.length > 0) {
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
            <Link href="/admin/events-types">Add  New Event</Link>
          </DropdownMenuItem>
          {eventTypes.map((et: EventType ,index) => (
            <DropdownMenuItem key={et._id || et.id || et.name} asChild>
              <Link href={`/admin/eventsdashbord?id=${et._id || et.id}`}>
                <span>{index + 1}.</span> {et.name}
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
          {serviceTypesList.map((st: any ,index) => (
            <DropdownMenuItem key={st._id || st.id || st.name} asChild>
              <Link href={`/admin/service?id=${st._id || st.id}`}>
               <span>{index + 1}.</span>  {st.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <SidebarMenuButton asChild>
      <Link
        href={item.href}
        className={
          isActive
            ? "text-primary dark:font-extrabold font-semibold"
            : ""
        }
      >
        <Icon className="h-4 w-4" />
        <span className="flex items-center gap-2">
          {item.title}
          {item.title === "Notifications" && unreadCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          {item.title === "Book Now" && pendingBookings > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-white">
              {pendingBookings > 99 ? '99+' : pendingBookings}
            </span>
          )}
        </span>
      </Link>
    </SidebarMenuButton>
  )
}

export function AppSidebar({ children }: { children?: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filteredItems, setFilteredItems] = React.useState(navigationItems)
  const [eventTypesList, setEventTypes] = useState<EventType[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const eventTypesState = useSelector((state: { eventTypes: { items: EventType[] } }) => state.eventTypes);
  const pathname = usePathname()
  
  // Get unread count from contacts
  const unreadCount = useSelector((state: RootState) => state.contacts?.unreadCount || 0)
  
  // Get pending bookings count
  const pendingBookings = useSelector((state: RootState) => state.bookings?.stats?.totalPending || 0)
  
  React.useEffect(() => {
    if (eventTypesState.items.length === 0) {
      dispatch(fetchEventTypes())
    }
    setEventTypes(eventTypesState.items)
  }, [dispatch, eventTypesState.items.length])
  
  // Fetch contacts to get unread count
  React.useEffect(() => {
    dispatch(fetchContacts({ page: 1, limit: 1 }))
  }, [dispatch])
  
  // Fetch bookings to get pending count
  React.useEffect(() => {
    dispatch(fetchBookings({ page: 1, limit: 1 }))
  }, [dispatch])
  
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

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex items-center justify-center group-data-[state=collapsed]:px-2">
          <div className="flex w-full items-center gap-2 px-4 py-3 hover:opacity-80 transition-opacity group-data-[state=collapsed]:px-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
              <img src="/logo.png" alt="EventHub Logo" className="h-5 w-5" />
            </div>
            <div className="flex flex-col hidden group-data-[state=expanded]:flex">
              <span className="text-lg font-semibold">EventHub</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <div className=" hidden group-data-[state=expanded]:block">
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
            <SidebarGroupLabel className="hidden group-data-[state=expanded]:block">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    return (
                      <SidebarMenuItem key={item.title}>
                        <div className='flex items-center gap-2'>
                          <NavItem
                            item={item}
                            isActive={isActive}
                            eventTypes={eventTypesList}
                            serviceTypesList={serviceTypesListRedux}
                            unreadCount={unreadCount}
                            pendingBookings={pendingBookings}
                          />
                        </div>
                      </SidebarMenuItem>
                    )
                  })
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground hidden group-data-[state=expanded]:block">
                    No results found
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="hidden group-data-[state=expanded]:block">
              Settings
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/settings" className={pathname === "/admin/settings" ? "text-primary font-semibold" : ""}>
                      <Settings className="h-4 w-4" />
                      <span className="hidden group-data-[state=expanded]:inline"> Site Settings</span>
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
          <SidebarTrigger >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </Button>
          </SidebarTrigger>

          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center  absolute right-2 justify-end gap-2">
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
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  
  // Get user from Redux
  const { data: user, loading: reduxLoading } = useSelector((state: RootState) => state.profile)

  React.useEffect(() => setMounted(true), [])
  
  // Fetch profile if not loaded
  React.useEffect(() => {
    if (mounted && !user && !reduxLoading) {
      dispatch(fetchProfile())
    }
  }, [mounted, user, reduxLoading, dispatch])

  if (!mounted) return null

  // Format profile picture
  const getProfilePicture = () => {
    if (!user?.profilePicture) return undefined
    if (user.profilePicture.startsWith('data:')) {
      return user.profilePicture
    } else if (user.profilePicture.startsWith('http')) {
      return user.profilePicture
    } else {
      return `data:image/jpeg;base64,${user.profilePicture}`
    }
  }

  return (
    <>
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

      {/* User Profile Dropdown in Header */}
      {user && !reduxLoading && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-sidebar-accent transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={getProfilePicture()} alt="User" />
                <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium capitalize">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}

// Type for event types
export type EventType = {
  _id?: string;
  id?: string | number;
  name: string;
  createdAt?: Date;
};