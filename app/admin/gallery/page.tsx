"use client"

import React, { useState, useRef } from 'react'
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
import { Trash2, Edit, Plus } from 'lucide-react'

interface GalleryItem {
  id: number
  title: string
  image: string
}

export default function Page() {
  const [items, setItems] = useState<GalleryItem[]>([
    { id: 1, title: 'Anniversary', image: 'https://images.unsplash.com/photo-1508873699372-7ae81f5f3f7a?w=800&q=80' },
    { id: 2, title: 'Birthday', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=800&q=80' },
    { id: 3, title: 'Conference', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80' },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<{ title: string; image: string; fileName: string; customTitle?: string }>({ title: '', image: '', fileName: '' })
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const TITLE_OPTIONS = ['Anniversary', 'Birthday', 'Conference', 'Custom']

  const openAdd = () => {
    setEditingId(null)
    setForm({ title: '', image: '', fileName: '', customTitle: '' })
    setIsOpen(true)
  }

  const openEdit = (item: GalleryItem) => {
    setEditingId(item.id)
    setForm({ title: TITLE_OPTIONS.includes(item.title) ? item.title : 'Custom', image: item.image, fileName: '' })
    setIsOpen(true)
  }

  const handleSave = () => {
    if (!form.title || !form.image) return

    const finalTitle = form.title === 'Custom' ? (form.customTitle && form.customTitle.trim()) || 'Untitled' : form.title

    if (editingId) {
      setItems(prev => prev.map(it => (it.id === editingId ? { ...it, title: finalTitle, image: form.image } : it)))
    } else {
      const newItem: GalleryItem = { id: Date.now(), title: finalTitle, image: form.image }
      setItems(prev => [newItem, ...prev])
    }

    setIsOpen(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setForm(prev => ({ ...prev, image: url, fileName: file.name }))
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files && e.dataTransfer.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setForm(prev => ({ ...prev, image: url, fileName: file.name }))
  }

  const triggerFileBrowse = () => {
    fileInputRef.current?.click()
  }

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div>

      <div className=" max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">Gallery</h2>
            <p className="text-sm text-gray-500">Add, edit or remove gallery images (admin only)</p>
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
                    <TableHead className="w-48">Image URL</TableHead>
                    <TableHead className="w-36">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="h-16 w-24 bg-gray-100 rounded overflow-hidden">
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell className="truncate max-w-xs">{item.image}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" onClick={() => openEdit(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" onClick={() => handleDelete(item.id)}>
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
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>{editingId ? 'Update' : 'Save'}</Button>
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
