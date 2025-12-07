'use client'
import React, { useState, useEffect } from 'react'
import { X, Trash2, Pencil, Upload } from 'lucide-react'
import axiosInstance from '../../config/axiosInstance'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Newdeletemodel from '@/dashbord/common/Newdeletemodel'
const PortfolioForm = () => {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null as Blob | null
    })
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [portfolioItems, setPortfolioItems] = useState<Array<{
        id: string
        title: string
        description: string
        image: string
        createdAt?: string
        _id?: string
    }>>([])
    const [loading, setLoading] = useState(false)
    const [editingItem, setEditingItem] = useState<{
        id?: string
        _id?: string
        title: string
        description: string
        image?: string
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
                const formDataToSend = new FormData()
                formDataToSend.append('title', formData.title)
                formDataToSend.append('description', formData.description)
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
                setFormData({ title: '', description: '', image: null })
                setImagePreview(null)
                setTouched({})
                setErrors({})
                setEditingItem(null)
                closeModal()
            } catch (err) {
                console.error('Failed to save portfolio', err)
            }
        }
    }

  

    const closeModal = () => {
        setOpen(false)
        setEditingItem(null)
        setFormData({ title: '', description: '', image: null })
        setImagePreview(null)
        setTouched({})
        setErrors({})
    }
const [deleteId, setDeleteId] = useState<string | null>(null);
    return (
        <div className="min-h-screen bg-white dark:bg-black p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-black dark:text-white">Portfolio</h1>
                    <button
                        onClick={() => { setEditingItem(null); setFormData({ title: '', description: '', image: null }); setImagePreview(null); setOpen(true) }}
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
                                    className="px-4 py-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg font-medium transition"
                                >
                                    {editingItem ? 'Update' : 'Save'}
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
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className=" border-gray-300 dark:border-gray-700">
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-black dark:text-white w-24">Image</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-black dark:text-white">Title</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-black dark:text-white">Description</th>
                                              <th className="px-4 py-3 text-left text-sm font-semibold text-black dark:text-white">Date</th>
                                                  <th className="px-4 py-3 text-left text-sm font-semibold text-black dark:text-white">Add Image</th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-black dark:text-white">See Preview</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-black dark:text-white w-20">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {portfolioItems.map((item, idx) => (
                                            <tr
                                                key={item._id ?? item.id ?? idx}
                                                className={`border-b border-gray-300 dark:border-gray-700 ${
                                                    idx % 2 === 0
                                                        ? 'bg-gray-50 dark:bg-gray-900'
                                                        : 'bg-white dark:bg-black'
                                                } hover:bg-gray-100 dark:hover:bg-gray-800 transition`}
                                            >
                                                <td className="px-4 py-3">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="h-16 w-16 object-cover rounded"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-medium text-black dark:text-white">
                                                    {item.title}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                                    {item.description}
                                                </td>
                                                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                 <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                                     <Link href={`${"/admin/portfolio-image/" + item._id}`}><Button variant="outline" size="sm" >Add Image or View existing image </Button></Link>
                                                </td>

                                                   <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                                     <Link href={`${"/admin/preview/" + item._id}`}><Button variant="outline" size="sm" >See Preview</Button></Link>
                                                </td>
                                                <td className=" ">
                                                    <button
                                                        onClick={() => {
                                                            setEditingItem(item)
                                                            setFormData({
                                                                title: item.title,
                                                                description: item.description,
                                                                image: null // or handle image if needed
                                                            })
                                                            setImagePreview(item.image)
                                                            setOpen(true)
                                                        }}
                                                        className="inline-flex cursor-pointer items-center justify-center p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30 rounded transition mr-2"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteId(item._id || item.id)}
                                                        
                                                        className="inline-flex items-center cursor-pointer justify-center p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 rounded transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Newdeletemodel  endpoint='/portfolio' deleteId={deleteId} setDeleteId={setDeleteId}  onSuccess={fetchPortfolioItems}/>
        </div>
    )
}

export default PortfolioForm