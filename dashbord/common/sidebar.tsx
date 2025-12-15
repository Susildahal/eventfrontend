"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
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
import { Input } from "@/components/ui/input"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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
} from "lucide-react"

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
            <Link href="/admin/events-types">Add New Event</Link>
          </DropdownMenuItem>
          {eventTypes.map((et: EventType, index) => (
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
          {serviceTypesList.map((st: any, index) => (
            <DropdownMenuItem key={st._id || st.id || st.name} asChild>
              <Link href={`/admin/service?id=${st._id || st.id}`}>
                <span>{index + 1}.</span> {st.name}
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
            ? "text-[#7A5E39] dark:font-extrabold font-semibold "
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const router = useRouter()
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
    <SidebarProvider defaultOpen={true}>
      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 md:hidden">
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <img src="/logo.png" alt={`${siteName} Logo`} className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <SheetTitle className="text-lg font-semibold text-[#7A5E39]">{siteName}</SheetTitle>
                  <span className="text-xs text-muted-foreground text-[#7A5E39]">Admin Panel</span>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">Navigation</p>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    const Icon = item.icon
                    
                    if (item.title === "Event Types" && eventTypesList.length > 0) {
                      return (
                        <DropdownMenu key={item.title}>
                          <DropdownMenuTrigger asChild>
                            <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent ${
                              pathname.includes("/events-types") ? "bg-accent text-accent-foreground font-semibold" : ""
                            }`}>
                              <Icon className="h-4 w-4" />
                              <span className="flex-1 text-left">{item.title}</span>
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem asChild>
                              <Link href="/admin/events-types" onClick={() => setIsMobileMenuOpen(false)}>
                                Add New Event
                              </Link>
                            </DropdownMenuItem>
                            {eventTypesList.map((et: EventType, idx) => (
                              <DropdownMenuItem key={et._id || et.id || et.name} asChild>
                                <Link href={`/admin/eventsdashbord?id=${et._id || et.id}`} onClick={() => setIsMobileMenuOpen(false)}>
                                  <span>{idx + 1}.</span> {et.name}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                    }

                    if (item.title === "Service Types" && serviceTypesListRedux.length > 0) {
                      return (
                        <DropdownMenu key={item.title}>
                          <DropdownMenuTrigger asChild>
                            <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent ${
                              pathname.includes("/service") ? "bg-accent text-accent-foreground font-semibold" : ""
                            }`}>
                              <Icon className="h-4 w-4" />
                              <span className="flex-1 text-left">{item.title}</span>
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem asChild>
                              <Link href="/admin/service-types" onClick={() => setIsMobileMenuOpen(false)}>
                                Add new service
                              </Link>
                            </DropdownMenuItem>
                            {serviceTypesListRedux.map((st: any, idx) => (
                              <DropdownMenuItem key={st._id || st.id || st.name} asChild>
                                <Link href={`/admin/service?id=${st._id || st.id}`} onClick={() => setIsMobileMenuOpen(false)}>
                                  <span>{idx + 1}.</span> {st.name}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                    }

                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent ${
                          isActive ? "bg-accent text-[#7A5E39] font-semibold" : ""
                        }`}
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
                    )
                  })
                ) : (
                  <p className="px-3 py-2 text-sm text-muted-foreground">No results found</p>
                )}
              </div>

              {/* Settings */}
              <div className="mt-6 space-y-1">
                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">Settings</p>
                <Link
                  href="/admin/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent ${
                    pathname === "/admin/settings" ? "bg-accent text-accent-foreground font-semibold" : ""
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Site Settings</span>
                </Link>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="border-t p-4">
              <UserProfile />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isSidebarOpen ? "auto" : "auto" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:block"
      >
        <Sidebar collapsible="icon">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <SidebarHeader className="flex items-center justify-center group-data-[state=collapsed]:px-2">
              <div className="flex w-full items-center gap-2 px-4 py-3 hover:opacity-80 transition-opacity group-data-[state=collapsed]:px-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
                  <img src="/logo.png" alt={`${siteName} Logo`} className="h-5 w-5" />
                </div>
                <motion.div
                  className="flex flex-col hidden group-data-[state=expanded]:flex"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-lg font-semibold text-[#7A5E39]">{siteName}</span>
                  <span className="text-xs  text-[#7A5E39]">Admin Panel</span>
                </motion.div>
              </div>
            </SidebarHeader>
          </motion.div>

          <SidebarContent>
            <SidebarGroup>
              <motion.div
                className="hidden group-data-[state=expanded]:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
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
              </motion.div>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="hidden group-data-[state=expanded]:block">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <AnimatePresence mode="wait">
                    {filteredItems.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {filteredItems.map((item, index) => {
                          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                            return (
                            <motion.div
                              key={item.title}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                              <SidebarMenuItem>
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
                            </motion.div>
                            )
                        })}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-3 py-2 text-sm text-muted-foreground hidden group-data-[state=expanded]:block"
                      >
                        No results found
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="hidden group-data-[state=expanded]:block">
                Settings
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/admin/settings" className={pathname === "/admin/settings" ? "text-primary font-semibold" : ""}>
                          <Settings className="h-4 w-4" />
                          <span className="hidden group-data-[state=expanded]:inline">Site Settings</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <SidebarFooter>
              <UserProfile />
            </SidebarFooter>
          </motion.div>
        </Sidebar>
      </motion.div>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop Sidebar Toggle */}
          <div className="hidden md:block">
            <SidebarTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                asChild
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSidebarOpen ? <X /> : <Menu />}
                </motion.button>
              </Button>
            </SidebarTrigger>
          </div>

          {/* Mobile Logo */}
          <div className="flex md:hidden items-center gap-2 flex-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <img src="/logo.png" alt={`${siteName} Logo`} className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold">{siteName}</span>
          </div>

          {/* Desktop: Right side with theme and profile */}
          <div className="flex flex-1 items-center justify-end">
            <div className="flex items-center gap-2">
              <ThemeDropdown />
            </div>
          </div>
        </header>
        <motion.div
          className="flex flex-1 flex-col gap-4 p-4 md:p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function ThemeDropdown() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  
  const { data: user, loading: reduxLoading } = useSelector((state: RootState) => state.profile)

  React.useEffect(() => setMounted(true), [])
  
  React.useEffect(() => {
    if (mounted && !user && !reduxLoading) {
      dispatch(fetchProfile())
    }
  }, [mounted, user, reduxLoading, dispatch])

  if (!mounted) return null

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
          <motion.button
            className="flex items-center rounded-md px-2 py-1 hover:bg-sidebar-accent transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-muted-foreground" />
            )}
          </motion.button>
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

      {user && !reduxLoading && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-sidebar-accent transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={getProfilePicture()} alt="User" />
                <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </motion.button>
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

export type EventType = {
  _id?: string
  id?: string | number
  name: string
  createdAt?: Date
}