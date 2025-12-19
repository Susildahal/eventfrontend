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
  SidebarSeparator,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/app/redux/store"
import { fetchServiceTypes } from '@/app/redux/slices/serviceTypesSlice'
import { fetchEventTypes } from '@/app/redux/slices/eventTypesSlice'
import { fetchProfile } from '@/app/redux/slices/profileSlicer'
import { fetchContacts } from '@/app/redux/slices/contactSlice'
import { fetchBookings } from '@/app/redux/slices/bookingsSlice'
import { fetchSiteSettings } from '@/app/redux/slices/siteSettingsSlice'
import { RootState } from "@/app/redux/store"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

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
  Settings,
  LogOut,
  Sun,
  Moon,

  Search,
  User,
  UserCog,
  Loader2,
  ChevronsUpDown,
  Sparkles,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react"

import { useTheme } from "next-themes"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const navigationItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin/dashbord" },
  { title: "Users", icon: Users, href: "/admin/users" },
  { title: "Bookings", icon: CalendarCheck, href: "/admin/book" },
  { title: "Event Types", icon: CalendarCog, href: "/admin/events-types" },
  { title: "Service Types", icon: ClipboardList, href: "/admin/service-types" },
  { title: "Gallery", icon: Images, href: "/admin/gallery" },
  { title: "Portfolio", icon: FolderKanban, href: "/admin/portfolio" },
  { title: "Notifications", icon: Bell, href: "/admin/contact" },
  { title: "FAQs", icon: HelpCircle, href: "/admin/faq" },
  { title: "About", icon: Info, href: "/admin/mission" },
  { title: "Profile", icon: UserCog, href: "/admin/profile" },
]

function UserProfile() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const serviceTypesState = useSelector((state: { serviceTypes: { items: any[] } }) => state.serviceTypes)
  
  const { data: user, loading: reduxLoading } = useSelector((state: RootState) => state.profile)
  const [serviceTypes, setServiceTypes] = useState<any[]>([])

  React.useEffect(() => {
    setServiceTypes(serviceTypesState.items)
  }, [serviceTypesState.items])

  React.useEffect(() => {
    setMounted(true)
  }, [])

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

  if (!user || reduxLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="animate-spin h-5 w-5" />
      </div>
    )
  }

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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={getProfilePicture()} alt={user.name} />
                <AvatarFallback className="rounded-lg">{user.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={getProfilePicture()} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{user.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Site Settings</span>
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
      </SidebarMenuItem>
    </SidebarMenu>
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

  if (item.title === "Event Types" && eventTypes.length > 0) {
    return (
      <Collapsible asChild defaultOpen={pathname.includes("/events-types")} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              <Icon />
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <Link href="/admin/events-types">
                    <span>Add New Event</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              {eventTypes.map((et: EventType) => (
                <SidebarMenuSubItem key={et._id || et.id || et.name}>
                  <SidebarMenuSubButton asChild isActive={pathname.includes((et._id || et.id || '').toString())}>
                    <Link href={`/admin/eventsdashbord?id=${et._id || et.id}`}>
                      <span>{et.name}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  if (item.title === "Service Types" && serviceTypesList.length > 0) {
    return (
      <Collapsible asChild defaultOpen={pathname.includes("/service")} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              <Icon />
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <Link href="/admin/service-types">
                    <span>Add new service</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              {serviceTypesList.map((st: any) => (
                <SidebarMenuSubItem key={st._id || st.id || st.name}>
                  <SidebarMenuSubButton asChild isActive={pathname.includes((st._id || st.id || '').toString())}>
                    <Link href={`/admin/service?id=${st._id || st.id}`}>
                      <span>{st.name}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
      <Link href={item.href}>
        <Icon />
        <span className={isActive ? "text-[#be9545] font-semibold" : undefined}>{item.title}</span>
        {item.title === "Notifications" && unreadCount > 0 && (
          <span className="ml-auto flex h-5 w-5 items-center justify-center  rounded-full bg-[#7A5E39] text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {item.title === "Bookings" && pendingBookings > 0 && (
          <span className="ml-auto flex h-5 w-5 items-center justify-center  rounded-full bg-[#7A5E39] text-[10px] font-bold text-white">
            {pendingBookings > 99 ? '99+' : pendingBookings}
          </span>
        )}
      </Link>
    </SidebarMenuButton>
  )
}

export function AppSidebar({ children }: { children?: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filteredItems, setFilteredItems] = React.useState(navigationItems)
  const [eventTypesList, setEventTypes] = useState<EventType[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const eventTypesState = useSelector((state: { eventTypes: { items: EventType[] } }) => state.eventTypes)
  const pathname = usePathname()
  
  const unreadCount = useSelector((state: RootState) => state.contacts?.unreadCount || 0)
  const pendingBookings = useSelector((state: RootState) => state.bookings?.stats?.totalPending || 0)
  const siteSettings = useSelector((state: RootState) => state.siteSettings?.data)
  const siteName = siteSettings?.siteName || 'EventHub'

  React.useEffect(() => {
    if (eventTypesState.items.length === 0) {
      dispatch(fetchEventTypes())
    }
    setEventTypes(eventTypesState.items)
  }, [dispatch, eventTypesState.items.length])
  
  React.useEffect(() => {
    dispatch(fetchContacts({ page: 1, limit: 1 }))
  }, [dispatch])
  
  React.useEffect(() => {
    dispatch(fetchBookings({ page: 1, limit: 1 }))
  }, [dispatch])
  
  React.useEffect(() => {
    dispatch(fetchSiteSettings())
  }, [dispatch])
  
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
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent">
                <Link href="/admin/dashbord">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary/10 shadow-sm">
                    <img src="/logo.png" alt="Logo" className="size-7" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold text-base">{siteName}</span>
                    <span className="truncate text-xs text-muted-foreground">Admin Dashboard</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <div className="px-2 pb-2 pt-3 group-data-[state=collapsed]:hidden">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <SidebarInput
                placeholder="Search menu..."
                className="pl-8 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <NavItem
                    key={item.title}
                    item={item}
                    isActive={isActive}
                    eventTypes={eventTypesList}
                    serviceTypesList={serviceTypesListRedux}
                    unreadCount={unreadCount}
                    pendingBookings={pendingBookings}
                  />
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Site Settings" isActive={pathname === "/admin/settings"}>
                  <Link href="/admin/settings">
                    <Settings />
                    <span>Site Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <UserProfile />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between pr-4 border-b border-border">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/dashbord" >Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                {pathname !== "/admin/dashbord" && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize">
                        {pathname.split("/").pop()?.replace(/-/g, " ")}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}



export type EventType = {
  _id?: string
  id?: string | number
  name: string
  createdAt?: Date
}

function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}