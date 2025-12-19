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
import { Trash2, Edit, ViewIcon as Plus, RefreshCcw, MoreVertical } from 'lucide-react'
import axiosInstance from '@/app/config/axiosInstance'
import DeleteModel from '@/dashbord/common/DeleteModel'
import NewPagination from '@/dashbord/common/Newpagination'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'

interface FaqItem {
  _id?: string
  id?: string | number
  title: string
  question: string
  answer: string
  createdAt?: Date
  status?: boolean
}

const TITLE_OPTIONS = ['General', 'Cancellation', 'Premits', 'Catering']

const truncateWords = (text: string, limit: number = 80) => {
  const words = text.split(' ')
  if (words.length <= limit) return text
  return words.slice(0, limit).join(' ') + '...'
}

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [viewingFaq, setViewingFaq] = useState<FaqItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<FaqItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
  // Separate filter state from form state
  const [filter, setFilter] = useState<{ title: string }>({ title: '' })
  const [form, setForm] = useState<{ title: string; question: string; answer: string }>({
    title: '',
    question: '',
    answer: ''
  })

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    setSubmitting(true)
    try {
      const res = await axiosInstance.get(`/faqs?page=${pagination.page}&limit=${pagination.limit}&title=${filter.title}`)
      const data = res.data?.data ?? []
      setItems(data)
      setPagination(prev => ({ ...prev, total: res.data?.pagination?.total || 0 }))
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch faqs')
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [pagination.page, filter.title])

  const clearFilters = () => {
    setFilter({ title: '' })
    setPagination(prev => ({ ...prev, page: 1 }))
    setError(null)
    fetchItems()
  }

  const clearTitleFilter = () => {
    setFilter(prev => ({ ...prev, title: '' }))
    setPagination(prev => ({ ...prev, page: 1 }))
    setError(null)
  }

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

  const handlestatuschange = async (id: string | number, status: boolean) => {
    try {
      setLoading(true)
      await axiosInstance.patch(`/faqs/${id}`, { status })
      setItems(prevItems =>
        prevItems.map(item =>
          item._id === id ? { ...item, status } : item
        )
      )
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Status update failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading && items.length === 0) {
    return <div className='h-screen justify-center items-center flex'><Spinner /></div>
  }

  return (
    <TooltipProvider>
      <div>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className='flex items-center gap-4'>
              <ArrowLeft className='h-5 w-5 cursor-pointer text-[#7A5E39]' onClick={() => window.history.back()} />
              <div>
                <h2 className="text-2xl font-semibold">FAQ</h2>
                <p className="text-sm text-gray-500">Add, edit or remove frequently asked questions</p>
              </div>
            </div>
            <div>
              <div className='flex justify-center items-center gap-5'>
                {pagination.page !== 1 || form.title && (
                  <p className="cursor-pointer flex gap-1 p-2 border-[1px] rounded">
                    Clear filters {form.title}
                    <RefreshCcw className='h-5 w-5 cursor-pointer' onClick={clearTitleFilter} />
                  </p>
                )}

                <Select
                  onValueChange={(value) => { setFilter(prev => ({ ...prev, title: value })) }}
                  value={filter.title}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a FAQ category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TITLE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Button onClick={openAdd} className="flex items-center gap-2">
                  {/* <Plus className="w-4 h-4" /> */}
                  Add FAQ
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div>
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
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead >Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-64 text-center">
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
                                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                No FAQs Found
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {form.title
                                  ? `No ${form.title} FAQs available. Try a different category or add a new FAQ.`
                                  : 'No FAQs available at the moment. Start by adding your first FAQ.'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {form.title && (
                                <Button
                                  variant="outline"
                                  onClick={clearTitleFilter}
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
                                Add FAQ
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, idx) => (
                        <TableRow key={String(item._id ?? item.id ?? idx)}>
                          <TableCell>{items.findIndex(i => i._id === item._id) + 1 + (pagination.page - 1) * pagination.limit}</TableCell>
                          <TableCell>{item.title}</TableCell>

                          <TableCell className="truncate max-w-xs">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">{truncateWords(item.question)}</span>
                              </TooltipTrigger>
                              <TooltipContent className=' max-w-xs'>
                                {item.question}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>

                          <TableCell className="truncate max-w-xs">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">{truncateWords(item.answer)}</span>
                              </TooltipTrigger>
                              <TooltipContent className=' max-w-xs'>
                                {item.answer}
                              </TooltipContent>
                            </Tooltip>

                            
                          </TableCell>

                          <TableCell>
                            <Switch
                              checked={item.status === true}
                              onClick={() => handlestatuschange(item._id ?? item.id ?? '', !item.status)}
                            />
                          </TableCell>

                          <TableCell className="truncate max-w-xs">{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</TableCell>

                          <TableCell className=' flex justify-center '>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <MoreVertical className="cursor-pointer h-6 w-6 rotate-90 text-[#7A5E39]" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEdit(item)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => setViewingFaq(item)}>
                                  <Plus className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => setDeleteId(String(item._id ?? item.id ?? ''))}
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
                      <Button onClick={handleSave} disabled={submitting}> {submitting ? 'Saving...' : (editingId ? 'Update' : 'Save')}</Button>
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

        {/* View Modal */}
        <Dialog open={!!viewingFaq} onOpenChange={() => setViewingFaq(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{viewingFaq?.title}</DialogTitle>
              <DialogDescription>
                <p><strong>Question:</strong> {viewingFaq?.question}</p>
                <p className="mt-2"><strong>Answer:</strong> {viewingFaq?.answer}</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <NewPagination
          total={pagination.total}
          limit={pagination.limit}
          currentPage={pagination.page}
          onPageChange={handlePageChange}
        />
         
      </div>
       </TooltipProvider>
    
  )
}
