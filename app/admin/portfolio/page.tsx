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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const PortfolioForm = () => {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subtitle: '',
        image: null as Blob | null
    })
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

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
    }>>([])
    const [loading, setLoading] = useState(false)
    const [editingItem, setEditingItem] = useState<{
        id?: string
        _id?: string
        title: string
        description: string
        image?: string
        subtitle?: string
    } | null>(null)

    useEffect(() => {
        fetchPortfolioItems()
    }, [])

    const fetchPortfolioItems = async () => {
        try {
            setLoading(true)
            // Replace with your actual axiosInstance call
            const res = await axiosInstance.get('/portfolio')
            setPortfolioItems(res?.data?.data || [])
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
                setFormData({ title: '', description: '', image: null , subtitle: ''})
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
        setFormData({ title: '', description: '', image: null , subtitle: ''})
        setImagePreview(null)
        setTouched({})
        setErrors({})
    }
    const [deleteId, setDeleteId] = useState<string | null>(null);
    return (
        <div className="min-h-screen bg-white dark:bg-black ">
            <div className=" max-w-7xl mx-auto ">
                {/* Header */}
                <div className=" flex    gap-4 items-center justify-between">

                    <div className=' flex  justify-center items-center gap-4' >
                        <ArrowLeft className="h-6 w-6 cursor-pointer " onClick={() => router.back()} />
                        <div className=' flex flex-col '>
                            <h1 className="text-2xl font-bold text-black dark:text-white">Portfolio</h1>
                            <h2 className="text-sm text-gray-500 dark:text-gray-400">Manage your portfolio items here</h2>
                        </div></div>

                    <button
                        onClick={() => { setEditingItem(null); setFormData({ title: '', description: '', image: null  , subtitle: ''}); setImagePreview(null); setOpen(true) }}
                        className="px-4 py-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg font-medium transition"
                    >
                        Add Portfolio Item
                    </button>
                </div>

                {/* Modal */}
                {open && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-black rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-300 dark:border-gray-700">
                            <div className="sticky top-0    bg-white dark:bg-black p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-black dark:text-white">{editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h2>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {editingItem ? 'Update' : 'Save'}
                                {/* Title Field */}
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur('title')}
                                        placeholder="Enter portfolio title"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                                    />
                                    {errors.title && touched.title && (
                                        <div className="text-red-600 dark:text-red-400 text-sm mt-2">{errors.title}</div>
                                    )}
                                </div>
                                  <div>
                                    {/* Subtitle Field */}
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                        Subtitle
                                    </label>
                                    <textarea
                                        name="subtitle"
                                        value={formData.subtitle}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur('subtitle')}
                                        placeholder="Enter portfolio subtitle"
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                                    />
                                    {errors.subtitle && touched.subtitle && (
                                        <div className="text-red-600 dark:text-red-400 text-sm mt-2">{errors.subtitle}</div>
                                    )}
                                </div>

                                {/* Description Field */}
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur('description')}
                                        placeholder="Enter portfolio description"
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                                    />
                                    {errors.description && touched.description && (
                                        <div className="text-red-600 dark:text-red-400 text-sm mt-2">{errors.description}</div>
                                    )}
                                </div>

                                {/* Image Upload Field */}
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                        Image
                                    </label>

                                    {imagePreview ? (
                                        <div className="relative">
                                            <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-64 object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Click the X button to remove and upload a different image</p>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex justify-center px-6 py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition cursor-pointer bg-gray-50 dark:bg-gray-900"
                                            onDrop={(e) => {
                                                e.preventDefault()
                                                const file = e.dataTransfer.files[0]
                                                handleImageUpload(file)
                                            }}
                                            onDragOver={(e) => e.preventDefault()}
                                        >
                                            <div className="space-y-2 text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                                                <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center gap-1">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer font-medium text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
                                                    >
                                                        <span>Upload a file</span>
                                                        <input
                                                            id="file-upload"
                                                            name="image"
                                                            type="file"
                                                            accept="image/*"
                                                            className="sr-only"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0]
                                                                if (file) {
                                                                    handleImageUpload(file)
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                    <p>or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        </div>
                                    )}
                                    {errors.image && touched.image && (
                                        <div className="text-red-600 dark:text-red-400 text-sm mt-2">{errors.image}</div>
                                    )}
                                </div>
                            </div>

                            <div className="sticky bottom-0  dark:border-gray-700 bg-white dark:bg-black p-6 flex justify-end gap-2">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition font-medium"
                                >
                                    Cancel
                                </button>
                            <button
                                onClick={(e) => handleSubmit(e)}
                                disabled={loading}
                                className={`px-4 py-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg font-medium transition${loading ? ' opacity-50 cursor-not-allowed' : ''}`}
                            >
                               {loading ? (editingItem ? 'Updating...' : 'Saving...') : (editingItem ? 'Update' : 'Save')}
                            </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Portfolio Table */}
           <div className="bg-white dark:bg-black rounded-lg shadow border border-gray-300 dark:border-gray-700">
  <div className="p-6 border-b border-gray-300 dark:border-gray-700">
    <h2 className="text-lg font-bold text-black dark:text-white">Portfolio Items</h2>
  </div>

  <div className="p-6">
    {loading ? (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>
    ) : portfolioItems.length === 0 ? (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No portfolio items yet. Add one to get started!
      </div>
    ) : (
    <div className=" max-w-6xl mx-auto overflow-x-auto">
    <Table className="w-full">
        <TableHeader>
            <TableRow className="border-gray-300 dark:border-gray-700">
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
                    <TableCell className="px-4 py-3">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="h-16 w-16 rounded object-cover"
                        />
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium">{item.title}</TableCell>
                    <TableCell className="px-4 py-3 max-w-xs text-sm text-gray-600 dark:text-gray-400 truncate">{item.subtitle}</TableCell>
                    <TableCell className="px-4 py-3 max-w-xs text-sm text-gray-600 dark:text-gray-400 truncate">{item.description}</TableCell>
                    <TableCell className="px-4 py-3 text-center">
                        <Link
                            href={`/admin/preview/${item._id}`}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            Preview
                        </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                        <Link
                            href={`/admin/portfolio-image/${item._id}`}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            Gallery
                        </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                        <Switch
                            checked={item.status === true || item.status === 'true'}
                            onCheckedChange={async (checked) => {
                                try {
                                    await axiosInstance.patch(`/portfolio/${item._id}`, {
                                        status: checked ? 'true' : 'false'
                                    });
                                    fetchPortfolioItems();
                                } catch (error) {
                                    console.error('Error updating status:', error);
                                }
                            }}
                        />
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4 rotate-90" />
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
                                        })
                                        setImagePreview(item.image)
                                        setOpen(true)
                                    }}
                                >
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setDeleteId(item._id)}
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
            <Newdeletemodel endpoint='/portfolio' deleteId={deleteId} setDeleteId={setDeleteId} onSuccess={fetchPortfolioItems} />
        </div>
    )
}

export default PortfolioForm