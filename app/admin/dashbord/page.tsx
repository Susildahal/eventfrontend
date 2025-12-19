"use client"

import React from "react"
import Link from "next/link"
import { useSelector } from "react-redux"
import {
  Users,
  CalendarCheck,
  Bell,
  Images,
  FolderKanban,
  TrendingUp,
  Activity,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RootState } from "@/app/redux/store"
import Header from "@/dashbord/common/Header"

const DashboardPage = () => {
  const bookings = useSelector((state: RootState) => state.bookings)
  const contacts = useSelector((state: RootState) => state.contacts)

  const stats = [
    {
      title: "Total Bookings",
      value: bookings?.pagination?.total || 0,
      description: `${bookings?.stats?.totalPending || 0} pending`,
      icon: CalendarCheck,
      link: "/admin/book",
    },
    {
      title: "Pending Bookings",
      value: bookings?.stats?.totalPending || 0,
      description: "Awaiting approval",
      icon: Activity,
      link: "/admin/book",
    },
    {
      title: "Notifications",
      value: contacts?.unreadCount || 0,
      description: "Unread messages",
      icon: Bell,
      link: "/admin/contact",
    },
    {
      title: "Total Users",
      value: "All Users",
      description: "Active users",
      icon: Users,
      link: "/admin/users",
    },
  ]

  const quickActions = [
    {
      title: "Gallery",
      description: "Manage images",
      icon: Images,
      link: "/admin/gallery",
    },
    {
      title: "Portfolio",
      description: "Showcase work",
      icon: FolderKanban,
      link: "/admin/portfolio",
    },
    {
      title: "Bookings",
      description: "View insights",
      icon: TrendingUp,
      link: "/admin/book",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
     
        <Header title="Dashboard" titledesc="Overview of key metrics and actions" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon

          return (
            <Link key={index} href={stat.link}>
              <Card
                className="
                  bg-background
                  border border-border
                  hover:border-[rgb(190,149,69)]
                  transition-all
                "
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>

                  <div
                    className="
                      p-2 rounded-lg
                      bg-[rgba(190,149,69,0.15)]
                    "
                  >
                    <Icon
                      className="h-4 w-4 text-[rgb(190,149,69)]"
                    />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="bg-background border border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            {quickActions.map((item, index) => {
              const Icon = item.icon

              return (
                <Link
                  key={index}
                  href={item.link}
                  className="
                    flex items-center gap-3 p-3 rounded-lg
                    border border-transparent
                    hover:border-[rgb(190,149,69)]
                    hover:bg-[rgba(190,149,69,0.15)]
                    transition
                  "
                >
                  <Icon
                    className="h-5 w-5 text-[rgb(190,149,69)]"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-background border border-border">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Platform health
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {["API", "Database", "Storage"].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{item}</span>
                <span
                  className="
                    text-xs px-2 py-1 rounded-full
                    bg-[rgba(190,149,69,0.15)]
                    text-[rgb(190,149,69)]
                  "
                >
                  Healthy
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
