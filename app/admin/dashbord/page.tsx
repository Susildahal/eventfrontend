"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CalendarCheck, Bell, Images, FolderKanban, TrendingUp, Activity } from "lucide-react"
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import Link from 'next/link'

const DashboardPage = () => {
  const bookings = useSelector((state: RootState) => state.bookings)
  const contacts = useSelector((state: RootState) => state.contacts)
  
  const stats = [
    {
      title: "Total Bookings",
      value: bookings?.pagination?.total || 0,
      description: `${bookings?.stats?.totalPending || 0} pending`,
      icon: CalendarCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      link: "/admin/book"
    },
    {
      title: "Pending Bookings",
      value: bookings?.stats?.totalPending || 0,
      description: "Awaiting approval",
      icon: Activity,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      link: "/admin/book"
    },
    {
      title: "Notifications",
      value: contacts?.unreadCount || 0,
      description: "Unread messages",
      icon: Bell,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      link: "/admin/contacts"
    },
    {
      title: "Total Users",
      value: "All Users",
      description: "Active users",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      link: "/admin/users"
    },
  ]

  const recentActivity = [
    { title: "Gallery", count: "Manage images", icon: Images, link: "/admin/gallery" },
    { title: "Portfolio", count: "Showcase work", icon: FolderKanban , link: "/admin/portfolio" },
    { title: "Booking", count: "View insights", icon: TrendingUp, link: "/admin/book" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}  
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your events {new Date().toLocaleDateString()}.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
    return (
      <Card key={index} className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          {stat.link ? (
            <Link href={stat.link}>
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </Link>
          ) : (
            <>
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stat.value}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stat.description}
          </p>
        </CardContent>
      </Card>
    )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentActivity.map((item, index) => {
              const Icon = item.icon
              return (
                <Link
                  key={index}
                  href={item.link}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.count}</p>
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        {/* <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New booking received</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-600 mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Event updated</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-600 mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New message</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Status</span>
                <span className="text-xs bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="text-xs bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
             Healthy
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
