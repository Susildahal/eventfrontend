"use client"

import React, { useEffect, useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trash2, Edit, Plus } from 'lucide-react'
import axiosInstance from '@/app/config/axiosInstance'
import DeleteModel from '@/dashbord/common/DeleteModel'
import NewPagination from '@/dashbord/common/Newpagination'
interface FaqItem {
  _id?: string
  id?: string | number
  title: string
  question: string
  answer: string
  createdAt?: Date
}
import {ArrowLeft} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TITLE_OPTIONS = ['General', 'Cancellation', 'Premits', 'Catering']

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<FaqItem[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
  const [form, setForm] = useState<{ title: string; question: string; answer: string }>({
    title: '',
    question: '',
    answer: ''
  })

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.get(`/faqs?page=${pagination.page}&limit=${pagination.limit}&title=${form.title}`)
      const data = res.data?.data ?? []
      setItems(data)
      setPagination(prev => ({ ...prev, total: res.data?.pagination?.total || 0 }))
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch faqs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [pagination.page, form.title])

  const openAdd = () => {
    setEditingId(null)
    setForm({ title: '', question: '', answer: '' })
    setIsOpen(true)
  }

  const openEdit = (item: FaqItem) => {
    setEditingId(item._id || (item.id as string) || null)
    setForm({ title: item.title, question: item.question, answer: item.answer })
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.question || !form.answer) return
    try {
      setLoading(true)
      const payload = { title: form.title, question: form.question, answer: form.answer }
      if (editingId) {
        await axiosInstance.put(`/faqs/${editingId}`, payload)
      } else {
        await axiosInstance.post('/faqs', payload)
      }
      await fetchItems()
      setIsOpen(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string | number) => {
    const previous = items
    setItems(prev => prev.filter(i => (i._id ?? i.id) !== id))
    try {
      await axiosInstance.delete(`/faqs/${id}`)
    } catch {
      setItems(previous)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  return (
    <>
    
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className=' flex items-center gap-4'>
            <ArrowLeft className='h-5 w-5 cursor-pointer' onClick={() => window.history.back()} />
            <div>
              <h2 className="text-2xl font-semibold">FAQ</h2>
              <p className="text-sm text-gray-500">Add, edit or remove frequently asked questions</p>
            </div>
          </div>
          <div>
            <div className=' flex gap-2'>
              <Select
              onValueChange={(value) => { setForm(prev => ({ ...prev, title: value })); }
              }
              value={form.title}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a FAQ category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Cancellation">Cancellation</SelectItem>
                <SelectItem value="Catering">Catering</SelectItem>
                 <SelectItem value="Premits">Premits</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={openAdd} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add FAQ
            </Button>
          </div>
          </div>
        </div>

        <Card>
          <CardContent>
            {loading && <div className="p-4 text-sm text-gray-500">Loading...</div>}
            {error && <div className="p-4 text-sm text-red-500">{error}</div>}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                     <TableHead>Index</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Answer</TableHead>
                      <TableHead>Date</TableHead>
                    <TableHead className="w-36">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={(item._id ?? item.id) as string}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell className="truncate max-w-xs">{item.question}</TableCell>
                      <TableCell className="truncate max-w-xs">{item.answer}</TableCell>
                      <TableCell className="truncate max-w-xs">{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" onClick={() => openEdit(item as FaqItem)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" onClick={() => setDeleteId(String(item._id ?? item.id))}>
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

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-xl mx-4">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Edit FAQ' : 'Add FAQ'}</CardTitle>
                <CardDescription>{editingId ? 'Update the FAQ item' : 'Add a new FAQ item'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-800 border rounded"
                    >
                      <option value="">Select category</option>
                      {TITLE_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Question</label>
                    <Input value={form.question} onChange={(e) => setForm(prev => ({ ...prev, question: e.target.value }))} placeholder="Question" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Answer</label>
                    <Textarea value={form.answer} onChange={(e) => setForm(prev => ({ ...prev, answer: e.target.value }))} placeholder="Answer" />
                  </div>

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

      <DeleteModel
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        deleting={loading}
        onConfirm={async () => {
          if (deleteId) {
            await handleDelete(deleteId)
            setDeleteId(null)
          }
        }}
      />
    </div>
 <NewPagination
      total={pagination.total}
      limit={pagination.limit}
      currentPage={pagination.page}
      onPageChange={handlePageChange}

     
    />
    </>
  )
}