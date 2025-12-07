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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trash2, Edit, Plus ,ArrowLeft } from 'lucide-react'
import axiosInstance from '@/app/config/axiosInstance'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from 'next/navigation'

interface GalleryItem {
  _id: number
  title: string
  image: string
}

export default function Page() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<{ title: string; image: string; fileName: string; customTitle?: string; file?: File | null }>({ title: '', image: '', fileName: '', customTitle: '', file: null })
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
    setForm({
      title: item.title,
      customTitle: '',
      image: item.image,
      fileName: '',
      file: null,
    })
    setIsOpen(true)
    return
  
  }

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      setSubmitting(true)
      const res = await axiosInstance.get('/aboutimage')
      setItems(res.data.data || [])
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch gallery')
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }
 
  useEffect(() => {
    fetchItems()
  }, [])

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
          await axiosInstance.put(`/aboutimage/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
          setSubmitting(false)
        } else {
          setSubmitting(true)
          await axiosInstance.post('/aboutimage', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
          setSubmitting(false)
        }
      } else {
        // No file: send JSON with image URL
        const payload = { title: finalTitle, image: form.image }
        if (editingId) {
          setSubmitting(true)
          await axiosInstance.put(`/aboutimage/${editingId}`, payload)
          setSubmitting(false)
        } else {
          setSubmitting(true)
          await axiosInstance.post('/aboutimage', payload)
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

  const handleDelete = (id: number) => {
    // optimistic UI: remove then call API
    const previous = items
    setItems(prev => prev.filter(i => i._id !== id))
    axiosInstance.delete(`/aboutimage/${id}`).catch(() => {
      setSubmitting(false)
      setItems(previous)
    })
    setSubmitting(false)
  }

  if(loading){
    return <div className='h-screen justify-center items-center flex '><Spinner /></div>
  }

 

  return (
    <div>

      <div className=" max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
            
          <div className=' flex gap-4 items-center justify-center'> 
            <ArrowLeft className="h-6 w-6 cursor-pointer mb-2" onClick={() => router.back()} />
            <div className=' flex flex-col'>
            <h2 className="text-2xl font-semibold">About Images</h2>
            <p className="text-sm text-gray-500">Add, edit or remove about images </p>
            </div>
          </div>
          <div>
            <Button onClick={openAdd} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Image
            </Button>
          </div>

        </div>

        <Card>
         
          <CardContent>
      
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Preview</TableHead>
                    <TableHead>Title</TableHead>
                    
                    <TableHead className="w-36">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item._id}>
                        
                      <TableCell>
                        <div className="h-10 w-10 object-cover rounded bg-gray-100 rounded overflow-hidden">
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" onClick={() => openEdit(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" onClick={() => handleDelete(item._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simple modal (no navigation) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-xl mx-4">
            <Card>
                
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      list="title-options"
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Select or enter title"
                    />

                
                    {editingId && form.image && !form.file && (form.image.startsWith('http') || form.image.includes('://')) && (
                      <div className="mt-2 flex items-center gap-2">
                       
                        
                      </div>
                    )}

                    {form.file && (
                      <div className="mt-2 text-xs text-green-600">
                        File prepared to upload: {form.fileName}
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
                      <div className="mt-3">
                        <label className="block text-sm font-medium mb-1">Or paste image URL</label>
                        <Input value={form.image} onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))} placeholder="https://..." />
                      </div>
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
                    <Button   variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={submitting}>
                      {submitting ? 'Submitting...' : (editingId ? 'Update' : 'Save')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
