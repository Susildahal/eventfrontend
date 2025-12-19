'use client'
import React, { useState, useEffect } from 'react'
import { X, Trash2, Pencil, Upload, ArrowLeft } from 'lucide-react'
import axiosInstance from '../../config/axiosInstance'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Newdeletemodel from '@/dashbord/common/Newdeletemodel'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import NewPagination from '@/dashbord/common/Newpagination'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
const PortfolioForm = () => {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subtitle: '',
        image: null as Blob | null,
        date: new Date(),
    })
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
const [date, setDate] = useState<Date | undefined>(new Date());
// Log the date for debugging
    const router = useRouter()
    const [portfolioItems, setPortfolioItems] = useState<Array<{
        id: string
        title: string
        description: string
        image: string
        createdAt?: string
        _id?: string
        status?: boolean
        subtitle?: string
        date?: Date

    }>>([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [limit] = useState(10)  
    const [click , setClick] = useState<string | boolean>(false);
    const [editingItem, setEditingItem] = useState<{
        id?: string
        _id?: string
        title: string
        description: string
        image?: string
        subtitle?: string
        date?: Date
    } | null>(null)

    useEffect(() => {
        fetchPortfolioItems(currentPage)
    }, [currentPage])

    const fetchPortfolioItems = async (page: number = 1) => {
        try {
            setLoading(true)
            // Replace with your actual axiosInstance call
            const res = await axiosInstance.get(`/portfolio?page=${page}&limit=${limit}`)
            setPortfolioItems(res?.data?.data || [])
            setTotalItems(res?.data?.pagination?.total || 0)
            setCurrentPage(res?.data?.pagination?.page || 1)
        } catch (err) {
            console.error('Failed to fetch portfolio items', err)
        } finally {
            setLoading(false)
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required'
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required'
        }
        if (!editingItem && !formData.image) {
            newErrors.image = 'Image is required'
        }
        if (!formData.subtitle.trim()) {
            newErrors.subtitle = 'Subtitle is required'
        }
        if (!formData.date) {
            newErrors.date = 'Date is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (touched[name] && errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleBlur = (field: string) => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }))
    }

    const handleImageUpload = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const result = event.target?.result as string
                setImagePreview(result)
                setFormData(prev => ({
                    ...prev,
                    image: file
                }))
                if (errors.image) {
                    setErrors(prev => ({
                        ...prev,
                        image: ''
                    }))
                }
            }
            setLoading(true) // Add submitting stage
            reader.onloadend = () => {
                setLoading(false)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setImagePreview(null)
        setFormData(prev => ({
            ...prev,
            image: null
        }))
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (validateForm()) {
            try {
                // Prepare FormData for multipart/form-data
                setLoading(true)
                const formDataToSend = new FormData()
                formDataToSend.append('title', formData.title)
                formDataToSend.append('description', formData.description)
                formDataToSend.append('subtitle', formData.subtitle)
                formDataToSend.append('date', date ? date.toISOString() : new Date().toISOString());
                if (formData.image) {
                    // Image is sent as binary in FormData
                    formDataToSend.append('image', formData.image)
                }

                // Replace with your actual axiosInstance call
                let res
                if (editingItem) {
                    res = await axiosInstance.put(`/portfolio/${editingItem._id || editingItem.id}`, formDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                } else {
                    res = await axiosInstance.post('/portfolio', formDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                }

                // Demo: Add to local state
                // For reflect changes in UI we can re-fetch from server or update locally
                await fetchPortfolioItems()

                // Reset form
                setFormData({ title: '', description: '', image: null , subtitle: '' , date: new Date()})
                setImagePreview(null)
                setTouched({})
                setErrors({})
                setEditingItem(null)
                closeModal()
            } catch (err) {
                console.error('Failed to save portfolio', err)
            } finally {
                setLoading(false)
            }
        }
    }



    const closeModal = () => {
        setOpen(false)
        setEditingItem(null)
        setFormData({ title: '', description: '', image: null , subtitle: '' , date: new Date()})
        setImagePreview(null)
        setTouched({})
        setErrors({})
    }
    const [deleteId, setDeleteId] = useState<string | null>(null);

    if (loading && portfolioItems.length === 0) {
        return <div className='h-screen justify-center items-center flex '><Spinner /></div>
    }

    return (
        <div className="min-h-screen">
          {
            click && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-white/50" onClick={() => { setClick(false); }}>
                <div className="relative max-w-3xl max-h-full bg-transparent border-2 rounded-2xl border-white" onClick={e => e.stopPropagation()}>
                  {/* Close (X) Button */}
                  <button 
                    aria-label="Close"
                    className="absolute top-4 right-5 text-white bg-black/60 hover:bg-black/80 rounded-full p-2 z-10"
                    onClick={() => { setClick(false); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <img src={click as string} alt="Full Size" className="max-w-full max-h-[80vh] rounded-lg shadow-lg" />
                </div>
              </div>
            )

          }
            <div className=" mx-auto ">
                {/* Header */}
                <div className=" flex   pb-3  gap-4 items-center justify-between">

                    <div className=' flex  justify-center items-center gap-4' >
                        <ArrowLeft className="h-6 w-6 cursor-pointer text-[#7A5E39]" onClick={() => router.back()} />
                        <div className=' flex flex-col '>
                            <h1 className="text-2xl font-bold text-black dark:text-white">Portfolio</h1>
                            <h2 className="text-sm text-gray-500 dark:text-gray-400">Manage your portfolio items here</h2>
                        </div></div>

                    <Button
                        onClick={() => { setEditingItem(null); setFormData({ title: '', description: '', image: null  , subtitle: '' , date: new Date()}); setImagePreview(null); setOpen(true) }}
                        className=""
                    >
                        Add Portfolio Item
                    </Button>
                </div>

                {/* Modal */}
            {open && (
  <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-black rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-neutral-700">

      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-black p-5 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {editingItem ? "Edit Portfolio Item" : "Add Portfolio Item"}
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Title
          </label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            onBlur={() => handleBlur("title")}
            placeholder="Enter portfolio title"
            className=""
          />
          {errors.title && touched.title && (
            <p className="text-red-500 text-xs">{errors.title}</p>
          )}
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Subtitle
          </label>
          <Textarea
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            onBlur={() => handleBlur("subtitle")}
            placeholder="Enter portfolio subtitle"
            rows={3}
            className=""
          />
          {errors.subtitle && touched.subtitle && (
            <p className="text-red-500 text-xs">{errors.subtitle}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Description
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            onBlur={() => handleBlur("description")}
            placeholder="Enter portfolio description"
            rows={4}
            className=""
          />
          {errors.description && touched.description && (
            <p className="text-red-500 text-xs">{errors.description}</p>
          )}
        </div>
        {/* Date Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Date
          </label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm"
            captionLayout="dropdown"
          />

        </div>
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Image
          </label>

          {imagePreview ? (
            <div className="relative">
              <div className="rounded-lg border border-gray-300 dark:border-neutral-700 overflow-hidden shadow-md">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                Click the X to remove and upload a new image
              </p>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-2 px-6 py-12 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-neutral-800"
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                handleImageUpload(file);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500" />
              <label className="cursor-pointer font-medium text-black dark:text-white">
                Upload a file
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF (max 10MB)
              </p>
            </div>
          )}

          {errors.image && touched.image && (
            <p className="text-red-500 text-xs">{errors.image}</p>
          )}
        </div>

      </div>

      {/* Footer */}
      <div className="sticky bottom-0 p-5 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700 flex justify-end gap-3">
        <Button
          onClick={() => setOpen(false)}
          className=""
          variant={"outline"}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className={` hover:opacity-90 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (editingItem ? "Updating..." : "Saving...") : editingItem ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  </div>
)}


                {/* Portfolio Table */}
           <div className=" rounded-lg shadow ">

  <div className="">
    {loading ? (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>
    ) : portfolioItems.length === 0 ? (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No portfolio items yet. Add one to get started!
      </div>
    ) : (
    <div className=" mx-auto overflow-x-auto">
    <Table className="w-full">
        <TableHeader>
            <TableRow className=" border-b border-gray-300 dark:border-gray-700">
                <TableHead className="px-4 py-3 text-left">Image</TableHead>
                <TableHead className="px-4 py-3 text-left">Title</TableHead>
                <TableHead className="px-4 py-3 text-left">Subtitle</TableHead>
                <TableHead className="px-4 py-3 text-left">Description</TableHead>
                <TableHead className="px-4 py-3 text-center">Preview</TableHead>
                <TableHead className="px-4 py-3 text-center">Images</TableHead>
                <TableHead className="px-4 py-3 text-center">Status</TableHead>
                <TableHead className="px-4 py-3 text-left">Date</TableHead>
                <TableHead className="px-4 py-3 text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {portfolioItems.map((item) => (
                <TableRow
                    key={item._id}
                    className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <TableCell className="">
                        <img
                        onClick={ ()=>{ setClick(item.image)}}
                            src={item.image}
                            alt={item.title}
                            className="h-16 w-16 rounded object-cover cursor-pointer"
                        />
                    </TableCell>
                    <TableCell className="max-w-xs text-sm text-gray-600 dark:text-gray-400 truncate">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    {item.title.slice(0, 20)} ...
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className='max-w-xs'>
                                {item.title}
                            </TooltipContent>
                        </Tooltip>
                    </TableCell>
                    <TableCell className=" max-w-xs text-sm text-gray-600 dark:text-gray-400 truncate">
                        <Tooltip>
                            <TooltipTrigger>
                                <span>
                                    {item.subtitle ?.slice(0, 20)} ...
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className='max-w-xs'>
                                {item.subtitle}
                            </TooltipContent>
                        </Tooltip>
                    </TableCell>
                    <TableCell className=" max-w-xs text-sm text-gray-600 dark:text-gray-400 truncate">
                        <Tooltip>
                            <TooltipTrigger>
                                <span>
                                    {item.description ?.slice(0, 20)} ...
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className='max-w-xs'>
                                {item.description}
                            </TooltipContent>
                        </Tooltip>
                    </TableCell>
                    <TableCell className=" text-center">
                        <Link
                            href={`/admin/preview/${item._id}`}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            See Preview
                        </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                        <Link
                            href={`/admin/portfolio-image/${item._id}`}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                           See Gallery
                        </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                        <Switch
                            checked={item.status === true  }
                            onCheckedChange={async (checked) => {
                                try {
                                    await axiosInstance.patch(`/portfolio/${item._id}`, {
                                        status: checked ? true : false
                                    });
                                    fetchPortfolioItems();
                                } catch (error) {
                                    console.error('Error updating status:', error);
                                }
                            }}
                        />
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {item.date
                            ? new Date(item.date).toLocaleDateString()
                            : "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4 rotate-90 cursor-pointer" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem asChild>
                                    <Dialog>
                                        <DialogTrigger>
                                            <p className='pl-1.5  text-sm'>View Full Details</p>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-lg">
                                            <DialogHeader>
                                                <DialogTitle>Portfolio Details</DialogTitle>
                                            </DialogHeader>
                                            <DialogDescription>
                                                <div className="space-y-4">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-black dark:text-white">Title</h3>
                                                        <p className="text-gray-600 dark:text-gray-400">{item.title}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium text-black dark:text-white">Description</h3>
                                                        <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium text-black dark:text-white">Subtitle</h3>
                                                        <p className="text-gray-600 dark:text-gray-400">{item.subtitle}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium text-black dark:text-white">Image</h3>
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="w-full h-64 object-cover rounded mt-2"
                                                        />
                                                    </div>
                                                </div>
                                            </DialogDescription>
                                        </DialogContent>
                                    </Dialog>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setEditingItem(item)
                                        setFormData({
                                            title: item.title,
                                            description: item.description,
                                            subtitle: item.subtitle || '',
                                            image: null,
                                            date: item.date || new Date(),
                                        })
                                        setImagePreview(item.image)
                                        setOpen(true)
                                    }}
                                >
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setDeleteId(item._id ?? null)}
                                    className="text-red-600 dark:text-red-400"
                                >
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

    )}
  </div>
</div>

            </div>
            <Newdeletemodel endpoint='/portfolio' deleteId={deleteId} setDeleteId={setDeleteId} onSuccess={() => fetchPortfolioItems(currentPage)} />
            <NewPagination
                total={totalItems}
                limit={limit}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default PortfolioForm

