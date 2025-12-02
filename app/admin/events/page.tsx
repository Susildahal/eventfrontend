"use client"

import React, { useEffect, useState, useCallback } from 'react'
import Header from '@/dashbord/common/Header'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import axiosInstance from '@/app/config/axiosInstance'
import { MoreHorizontal, Eye, Pencil, Trash2, RefreshCw, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Pagination from '@/dashbord/common/Pagination'
import DeleteModel from '@/dashbord/common/DeleteModel'

interface EventItem {
  _id: string
  id?: number
  title: string
  eventypes: string
  location: string
  shortSummary: string
  detailDescription: string
  coverImage: string
  slug: string
  date: string
  status?: boolean
  isFeatured?: boolean
  reviewsText?: string

}

export default function Page() {
  const router = useRouter()
  const [data, setData] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get('/events')
      const events = response.data?.data || response.data || []
      setData(Array.isArray(events) ? events : [])
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to fetch events'
      setError(message)
      toast.error('Error', { description: message })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleView = (event: EventItem) => {
    router.push(`/admin/events/${event._id || event.id}`)
  }

  const handleEdit = (event: EventItem) => {
    router.push(`/admin/add-events/${event._id || event.id}`)
  }

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await axiosInstance.delete(`/events/${deleteId}`)
      setData((prev) => prev.filter((item) => (item._id || item.id?.toString()) !== deleteId))
      toast.success('Deleted', { description: 'Event has been deleted successfully.' })
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to delete event'
      toast.error('Error', { description: message })
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const handleUpdateStatus = async (id: string) => {
   try {

    const response = await axiosInstance.patch(`/events/${id}`)
    const updatedEvent = response.data

    // Update local state using the returned updated event status if provided,
    // otherwise toggle the current status locally.
    setData((prev) =>
      prev.map((ev) =>
        ev._id === id || ev.id?.toString() === id
          ? {
              ...ev,
              status:
                typeof updatedEvent?.status === "boolean"
                  ? updatedEvent.status
                  : !ev.status,
            }
          : ev
      )
    )

    toast.success('Updated', { description: 'Event status updated.' })
  
   } catch (error) {
    toast.error('Error', { description: 'Failed to update event status' })
    
   }
  }

  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return '-'
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
  }

  // Loading skeleton
  if (loading) {
    return (
      <>
        <Header title="Events" titledesc="Manage your events here" linkname="Add Event" link="/admin/add-events" />
        <div className="border rounded-lg mt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-16 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-10 w-10 bg-gray-200 rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-8 bg-gray-200 rounded animate-pulse mx-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <>
        <Header title="Events" titledesc="Manage your events here" linkname="Add Event" link="/admin/add-events" />
        <div className="border rounded-lg mt-2 p-8 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load events</h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </>
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <>
        <Header title="Events" titledesc="Manage your events here" linkname="Add Event" link="/admin/add-events" />
        <div className="border rounded-lg mt-2 p-8 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-sm text-gray-500 mb-4">Get started by creating your first event.</p>
          <Button onClick={() => router.push('/admin/add-events')} size="sm">
            Add Event
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="Events" titledesc="Manage your events here" linkname="Add Event" link="/admin/add-events" />
      
      <div className="border rounded-lg mt-2 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-16 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((event) => (
              <TableRow key={event._id || event.id} className="hover:bg-gray-50/50">
                <TableCell>
                  {event.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="h-10 w-10 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x40?text=No+Image'
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                      N/A
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{truncateText(event.title, 25)}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {event.eventypes || '-'}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600">{truncateText(event.location, 20)}</TableCell>
                <TableCell className="text-gray-500 text-sm">{truncateText(event.shortSummary, 30)}</TableCell>
                <TableCell>
                  <Switch
                  onClick={() => handleUpdateStatus(event._id || event.id?.toString() || '')}
                    checked={event.status || false}
                  />
                </TableCell>
                <TableCell className="text-gray-600">
                  {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : '-'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => handleView(event)} className="cursor-pointer">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(event)} className="cursor-pointer">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(event._id || event.id?.toString() || '')}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between px-2 py-3 text-sm text-gray-500">
        <span>Showing {data.length} event{data.length !== 1 ? 's' : ''}</span>
        <Button variant="ghost" size="sm" onClick={fetchData} className="h-8">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      {/* Delete confirmation dialog (uses reusable component) */}
      <DeleteModel
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        deleting={deleting}
        onConfirm={handleDeleteConfirm}
      />
      <Pagination />
    </>
  )
}