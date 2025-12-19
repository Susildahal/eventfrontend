"use client"

import React, { useState, useRef, useEffect } from 'react'
import Header from '@/dashbord/common/Header'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trash2, Edit, Plus, ArrowLeft, RefreshCcw  ,MoreVertical} from 'lucide-react'
import axiosInstance from '@/app/config/axiosInstance'
import Newdeletemodel from '@/dashbord/common/Newdeletemodel'
import NewPagination from '@/dashbord/common/Newpagination'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from '@/components/ui/spinner'


interface GalleryItem {
  _id: string
  title: string
  image: string
  status: boolean
}

export default function Page() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
  const [title, setTitle] = useState('')
  const [click, setClick] = useState<string | boolean>(false)
  // Track current image index for modal navigation
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<{ title: string; image: string; fileName: string; customTitle?: string; file?: File | null }>({ title: '', image: '', fileName: '', file: null })
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const TITLE_OPTIONS = ['Anniversary', 'Birthday', 'Conference']

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openAdd = () => {
    setEditingId(null)
    setForm({ title: '', image: '', fileName: '', customTitle: '', file: null })
    setIsOpen(true)
  }

  const openEdit = (item: GalleryItem) => {
    setEditingId(item._id)
    setForm({ title: TITLE_OPTIONS.includes(item.title) ? item.title : 'Custom', image: item.image, fileName: '', file: null })
    setIsOpen(true)
  }

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      setSubmitting(true)
      const res = await axiosInstance.get(`/gallery?page=${pagination.page}&limit=${pagination.limit}&title=${title}`)
      setItems(res.data.data || [])
      setPagination(prev => ({ ...prev, total: res.data?.pagination?.total || 0 }))
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch gallery')
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [pagination.page, title])

  const handleSave = async () => {
    if (!form.title) return

    const finalTitle = form.title === 'Custom' ? (form.customTitle && form.customTitle.trim()) || 'Untitled' : form.title

    try {
      setLoading(true)
      // If a file was chosen, use FormData
      if (form.file) {
        const fd = new FormData()
        fd.append('title', finalTitle)
        fd.append('image', form.file)

        if (editingId) {
          setSubmitting(true)
          await axiosInstance.put(`/gallery/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
          setSubmitting(false)
        } else {
          setSubmitting(true)
          await axiosInstance.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
          setSubmitting(false)
        }
      } else {
        // No file: send JSON with image URL
        const payload = { title: finalTitle, image: form.image }
        if (editingId) {
          setSubmitting(true)
          await axiosInstance.put(`/gallery/${editingId}`, payload)
          setSubmitting(false)
        } else {
          setSubmitting(true)
          await axiosInstance.post('/gallery', payload)
          setSubmitting(false)
        }
        setSubmitting(false)
      }

      await fetchItems()
      setIsOpen(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setForm(prev => ({ ...prev, image: url, fileName: file.name, file }))
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files && e.dataTransfer.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setForm(prev => ({ ...prev, image: url, fileName: file.name, file }))
  }

  const triggerFileBrowse = () => {
    fileInputRef.current?.click()
  }
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleStatusChange = async (id: string, status: boolean) => {
    try {
      await axiosInstance.patch(`/gallery/${id}`, { status })
      setItems(prevItems =>
        prevItems.map(item =>
          item._id === id ? { ...item, status } : item
        )
      )
    }
    catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (loading && items.length === 0) {
    return <div className='h-screen justify-center items-center flex '><Spinner /></div>
  }

  return (
    <div>
{click && modalIndex !== null && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
    onClick={() => {
      setClick(false);
      setModalIndex(null);
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-6xl mx-4 rounded-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden animate-fadeIn"
    >
      {/* Close Button */}
      <button
        aria-label="Close"
        onClick={() => {
          setClick(false);
          setModalIndex(null);
        }}
        className="absolute top-3 right-3 z-20 rounded-full bg-black/60 hover:bg-black/80 p-2 text-white transition"
      >
        ✕
      </button>

      {/* Main Image */}
      <div className="flex items-center justify-center p-4 bg-black">
        <img
          src={items[modalIndex]?.image}
          alt="Preview"
          className="max-h-[70vh] w-auto object-contain rounded-lg"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/70">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setModalIndex((prev) => {
              const index = prev ?? 0;
              return index === 0 ? items.length - 1 : index - 1;
            });
          }}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
        >
          ← Previous
        </button>

        <span className="text-sm text-white/80">
          {modalIndex + 1} / {items.length}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setModalIndex((prev) => {
              const index = prev ?? 0;
              return index === items.length - 1 ? 0 : index + 1;
            });
          }}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
        >
          Next →
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="bg-black/80 px-4 py-3">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setModalIndex(index);
              }}
              className={`relative flex-shrink-0 rounded-md overflow-hidden border-2 transition
                ${
                  modalIndex === index
                    ? "border-white"
                    : "border-transparent opacity-60 hover:opacity-100"
                }
              `}
            >
              <img
                src={item.image}
                alt={`Thumbnail ${index}`}
                className="h-16 w-24 object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
)}




      <div className=" max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className='flex gap-4  items-center justify-center'>
            <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => router.back()} />
            <div className=' flex flex-col'>
              <h2 className="text-2xl font-semibold">Gallery</h2>
              <p className="text-sm text-gray-500">Add, edit or remove gallery images </p>
            </div>
          </div>
          <div>
            <div className=' flex gap-3  flex justify-center items-center'>
              {title !== '' && <p className="cursor-pointer flex gap-1 p-2 border-[1px] rounded "> clear filters {title}
                < RefreshCcw className='h-5 w-5 cursor-pointer' onClick={() => setTitle('')}  />
              </p>}


              <Select
                onValueChange={(value) => { setTitle(value); }
                }
                value={title}
              >

                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Gallery title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Birthday">Birthday</SelectItem>
                  <SelectItem value="Anniversary	">Anniversary </SelectItem>
                  <SelectItem value="Conference">Conference</SelectItem>
                </SelectContent>
              </Select>

              <div>

                <Button onClick={openAdd} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Image
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className=' shadow-none  border-0'>

          <div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Index</TableHead>
                    <TableHead className="w-24">Preview</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-36">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-400 dark:text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              No Gallery Images Found
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {title 
                                ? `No ${title} gallery images available. Try a different category or add a new image.`
                                : 'No gallery images available at the moment. Start by adding your first image.'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {title && (
                              <Button
                                variant="outline"
                                onClick={() => setTitle('')}
                                className="mt-2"
                              >
                                Clear Filter
                              </Button>
                            )}
                            <Button
                              onClick={openAdd}
                              className="mt-2 flex items-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add Image
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map(item => (
                      <TableRow key={item._id}>
                        <TableCell>
                          {items.findIndex(i => i._id === item._id) + 1 + (pagination.page - 1) * pagination.limit}
                        </TableCell>
                        <TableCell>
                          <div className="h-10 w-10 object-cover rounded bg-gray-100 rounded overflow-hidden">
                            <img  onClick={() => {
                              setClick(item.image);
                              setModalIndex(items.findIndex(i => i._id === item._id));
                            }}  src={item.image} alt={item.title} className="h-full w-full object-cover" />
                          </div>
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>
                          <Switch checked={item.status} onCheckedChange={(checked) => handleStatusChange(item._id, checked)} />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <MoreVertical className="cursor-pointer h-6 w-6  rotate-90 text-[#7A5e39]" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEdit(item)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteId(item._id)}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Simple modal (no navigation) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-xl mx-4">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Image' : 'Add Image'}</CardTitle>
                <CardDescription>{editingId ? 'Update the gallery item' : 'Add a new gallery item'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <select
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-800 border rounded"
                    >
                      <option value="">Select a title</option>
                      {TITLE_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {form.title === 'Custom' && (
                      <div className="mt-2">
                        <Input value={form.customTitle || ''} onChange={(e) => setForm(prev => ({ ...prev, customTitle: e.target.value }))} placeholder="Custom title" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Image (browse or drag & drop)</label>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className="mt-2 border-2 border-dashed border-gray-300 rounded p-4 text-center bg-white dark:bg-slate-800"
                    >
                      <p className="text-sm text-gray-600">Drag & drop an image here, or</p>
                      <div className="mt-2">
                        <Button onClick={triggerFileBrowse} className="inline-flex items-center">
                          Browse files
                        </Button>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">{form.fileName || 'No file selected'}</div>

                    </div>
                  </div>

                  {form.image && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Preview</label>
                      <div className="h-48 w-full bg-gray-100 rounded overflow-hidden">
                        <img src={form.image} alt="preview" className="h-full w-full object-cover" />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button disabled={submitting} onClick={handleSave} className={`${submitting ? "opacity-50 cursor-not-allowed" : ""}`}> {submitting ? 'Saving...' : (editingId ? 'Update' : 'Save')}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Newdeletemodel
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        endpoint="/gallery"
        onSuccess={fetchItems}
      />

      <NewPagination
        total={pagination.total}
        limit={pagination.limit}
        currentPage={pagination.page}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
