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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trash2, Edit, Plus, ArrowLeft, MoreVertical } from 'lucide-react'
import DeleteModel from '@/dashbord/common/DeleteModel'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AppDispatch } from '@/app/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEventTypes, deleteEventType, createEventType, updateEventType, fetchEventTypeById } from '@/app/redux/slices/eventTypesSlice'

interface EventType {
  _id?: string
  id?: string | number
  name: string
  createdAt?: Date
}

const PRESET_EVENT_TYPES = ['Birthday', 'Beach and pool', 'Branch Launch', 'Night Music', 'Custom']

export default function EventTypesPage() {
  const [items, setItems] = useState<EventType[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<{ name: string }>({ name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const eventTypesState = useSelector((state: { eventTypes: { items: EventType[] } }) => state.eventTypes)

  useEffect(() => {
    if (eventTypesState.items.length === 0) {
      dispatch(fetchEventTypes())
    }
  }, [dispatch, eventTypesState.items.length])

  useEffect(() => {
    setItems(eventTypesState.items)
  }, [eventTypesState.items])

  // Get already added event types
  const addedEventNames = items.map(item => item.name)
  
  // Get available presets (not yet added)
  const availablePresets = PRESET_EVENT_TYPES.filter(preset => !addedEventNames.includes(preset))

  const openAdd = () => {
    setEditingId(null)
    setForm({ name: '' })
    setIsOpen(true)
  }

  const openEdit = (item: EventType) => {
    setEditingId(item._id || (item.id as string) || null)
    setForm({ name: item.name })
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    try {
      setLoading(true)
      const payload = { name: form.name }
      if (editingId) {
        dispatch(updateEventType({ ...payload, _id: editingId }))
      } else {
        dispatch(createEventType(payload))
      }

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
      dispatch(deleteEventType(id as string))
      setDeleteId(null)
    } catch {
      setItems(previous)
      setError('Delete failed')
    }
  }

  return (
    <>
      <div>
        <div className="mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <ArrowLeft className="h-5 w-5 cursor-pointer" onClick={() => window.history.back()} />
              <div>
                <h2 className="text-2xl font-semibold">Event Types</h2>
                <p className="text-sm text-gray-500">Manage event types</p>
              </div>
            </div>
            <div>
              <Button onClick={openAdd} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Event Type
              </Button>
            </div>
          </div>

          <Card>
            <CardContent>
              {loading && !items.length && <div className="p-4 text-sm text-gray-500">Loading...</div>}
              {error && <div className="p-4 text-sm text-red-500">{error}</div>}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Index</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-36">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, idx) => (
                      <TableRow key={(item._id ?? item.id) as string}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="truncate max-w-xs">
                          {item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4 rotate-90" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEdit(item)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setDeleteId((item._id ?? item.id) as string)
                                  setEditingId((item._id ?? item.id) as string)
                                }}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
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
            </CardContent>
          </Card>
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
            <div className="relative w-full max-w-xl mx-4">
              <Card>
                <CardHeader>
                  <CardTitle>{editingId ? 'Edit Event Type' : 'Add Event Type'}</CardTitle>
                  <CardDescription>
                    {editingId ? 'Update the event type name' : 'Add a new event type or select from presets'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!editingId && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Select from Presets</label>
                        <Select value="" onValueChange={(value) => setForm(prev => ({ ...prev, name: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose an event type..." />
                          </SelectTrigger>
                          <SelectContent>
                            {PRESET_EVENT_TYPES.map(preset => (
                              <SelectItem key={preset} value={preset} disabled={addedEventNames.includes(preset)}>
                                <span className={addedEventNames.includes(preset) ? 'text-gray-400' : ''}>
                                  {preset}
                                  {addedEventNames.includes(preset) ? ' (Already added)' : ''}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {!editingId ? 'Or Enter Custom Name' : 'Event Type Name'}
                      </label>
                      <Input
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="E.g., Wedding, Corporate, Birthday"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={loading || !form.name.trim()}>
                        {editingId ? 'Update' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <DeleteModel
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        deleting={loading}
        onConfirm={async () => {
          if (deleteId) {
            await handleDelete(deleteId)
            setEditingId(null)
          }
        }}
      />
    </>
  )
}