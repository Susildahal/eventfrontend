'use client'
import React, { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import axiosInstance from '@/app/config/axiosInstance'


const PortfolioForm = () => {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: ''
    })
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required'
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required'
        }
        if (!formData.image) {
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
                    image: result
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
            image: ''
        }))
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (validateForm()) {
            try {
                // Optionally send data to backend
                const payload = { ...formData }
                const res = await axiosInstance.post('/portfolio', payload)
                console.log('Server response', res?.data)
            } catch (err) {
                console.error('Failed to save portfolio', err)
            }
            // Reset form after successful submission
            setFormData({ title: '', description: '', image: '' })
            setImagePreview(null)
            setTouched({})
            // Close modal after successful validation
            closeModal()
        }
    }

    const closeModal = () => setOpen(false)

    return (
        <>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Portfolio</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Portfolio Item</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Portfolio Item</DialogTitle>
                        </DialogHeader>
             
           

            <Card className="h-[60vh] overflow-y-auto">
                <CardHeader>
                    <CardTitle>Add New Portfolio Item</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6  pr-2">
                        {/* Title Field */}
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('title')}
                                placeholder="Enter portfolio title"
                                className="mt-2"
                            />
                            {errors.title && touched.title && (
                                <div className="text-red-500 text-sm mt-2">{errors.title}</div>
                            )}
                        </div>

                        {/* Description Field */}
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('description')}
                                placeholder="Enter portfolio description"
                                className="mt-2 min-h-32"
                            />
                            {errors.description && touched.description && (
                                <div className="text-red-500 text-sm mt-2">{errors.description}</div>
                            )}
                        </div>

                        {/* Image Upload Field */}
                        <div>
                            <Label>Image</Label>
                            
                            {imagePreview ? (
                                <div className="mt-2 relative">
                                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-64 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Click the X button to remove and upload a different image</p>
                                </div>
                            ) : (
                                <div
                                    className="mt-2 flex justify-center px-6 py-10 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg hover:border-gray-400 dark:hover:border-slate-600 transition cursor-pointer bg-gray-50 dark:bg-slate-900/50"
                                    onDrop={(e) => {
                                        e.preventDefault()
                                        const file = e.dataTransfer.files[0]
                                        handleImageUpload(file)
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    <div className="space-y-2 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center gap-1">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
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
                                        <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            )}
                            {errors.image && touched.image && (
                                <div className="text-red-500 text-sm mt-2">{errors.image}</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button
                                onClick={handleSubmit}
                                className="w-full"
                            >
                                Add Portfolio Item
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
                        <DialogFooter>
                            <div className="flex w-full justify-end gap-2">
                                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button onClick={(e) => handleSubmit(e)}>Save</Button>
                            </div>
                        </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    )
}

export default PortfolioForm