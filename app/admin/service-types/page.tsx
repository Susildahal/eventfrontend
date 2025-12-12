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
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '@/app/redux/store'
import { fetchServiceTypes, addServiceType, updateServiceType, deleteServiceType } from '@/app/redux/slices/serviceTypesSlice'
import DeleteModel from '@/dashbord/common/DeleteModel'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface EventType {
  _id?: string
  id?: string | number
  name: string
  createdAt?: Date
}

const PRESET_SERVICE_TYPES = ['Venue', 'Catering','Entertainment', 'Audio & Visual' , 'Style & Design' ,'Photographs','Floral']

export default function servicetypesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector((state: { serviceTypes: { items: EventType[]; loading: boolean; error: string | null } }) => state.serviceTypes)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<{ name: string }>({ name: '' })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchServiceTypes())
  }, [dispatch])

  // Get already added service types
  const addedServiceNames = items.map(item => item.name)
  
  // Get available presets (not yet added)
  const availablePresets = PRESET_SERVICE_TYPES.filter(preset => !addedServiceNames.includes(preset))

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
    if (editingId) {
      dispatch(updateServiceType({ id: editingId, name: form.name }))
    } else {
      dispatch(addServiceType(form.name))
    }
    setIsOpen(false)
  }

  const handleDelete = (id: string | number) => {
    dispatch(deleteServiceType(String(id)))
  }

  return (
    <>
      <div>
        <div className="mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <ArrowLeft className="h-5 w-5 cursor-pointer" onClick={() => window.history.back()} />
              <div>
                <h2 className="text-2xl font-semibold">Service Types</h2>
                <p className="text-sm text-gray-500">Manage service types</p>
              </div>
            </div>
            <div>
              <Button onClick={openAdd} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Service Type
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
                    {items.map((item: EventType, idx: number) => (
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
                              {/* <DropdownMenuItem onClick={() => openEdit(item)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem> */}
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
                  <CardTitle>{editingId ? 'Edit Service Type' : 'Add Service Type'}</CardTitle>
                  <CardDescription>
                    {editingId ? 'Update the service type name' : 'Add a new service type or select from presets'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!editingId && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Select from Presets</label>
                        <Select value="" onValueChange={(value) => setForm(prev => ({ ...prev, name: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a service type..." />
                          </SelectTrigger>
                          <SelectContent>
                            {PRESET_SERVICE_TYPES.map(preset => (
                              <SelectItem key={preset} value={preset} disabled={addedServiceNames.includes(preset)}>
                                <span className={addedServiceNames.includes(preset) ? 'text-gray-400' : ''}>
                                  {preset}
                                  {addedServiceNames.includes(preset) ? ' (Already added)' : ''}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      {/* <label className="block text-sm font-medium mb-1">
                        {!editingId ? 'Or Enter Custom Name' : 'Service Type Name'}
                      </label> */}
                      {/* <Input
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="E.g., Photography, Videography, Catering"
                      /> */}

                      
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