"use client"
import React, { useEffect, useState } from 'react'
import Header from '@/dashbord/common/Header'
import { AppDispatch, RootState } from '@/app/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Trash2, Eye, MoreVertical } from 'lucide-react'
import Newdeletemodel from '@/dashbord/common/Newdeletemodel'
import { Spinner } from '@/components/ui/spinner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import NewPagination from '@/dashbord/common/Newpagination'
import { fetchContacts, updateContactStatus, setPage, deleteContactsBulk } from '@/app/redux/slices/contactSlice'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button'

const page = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { items: contacts, loading, pagination } = useSelector((state: RootState) => state.contacts)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [viewData, setViewData] = useState<any | null>(null)
    const [arraydelete, setArrayDelete] = useState<string[]>([])
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

    const handlePageChange = (newPage: number) => {
        dispatch(setPage(newPage))
    }

    useEffect(() => {
        dispatch(fetchContacts({ page: pagination.page, limit: pagination.limit }))
    }, [dispatch, pagination.page, pagination.limit])

    if (loading) {
        return <div className='h-screen justify-center items-center flex '><Spinner /></div>
    }

    if (contacts.length === 0) {
        return <div className='text-center'>No contact was found.</div>
    }

    return (
        <div className='space-y-4'>

            <Header title="Contact Management" titledesc="Manage your contact messages here."
                addionaldelete={
                    arraydelete && arraydelete.length > 1 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setBulkDeleteOpen(true)}
                        >
                            <Trash2 className='mr-2 h-4 w-4' />Delete Selected ({arraydelete.length})
                        </Button>
                    )
                }
            />
            {/* ---- Bulk Delete Confirmation Dialog ---- */}
            <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Bulk Delete</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Are you sure you want to delete <b>{arraydelete.length}</b> selected contact(s)? This action cannot be undone.</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                try {
                                    await dispatch(deleteContactsBulk(arraydelete)).unwrap()
                                    setArrayDelete([])
                                    setBulkDeleteOpen(false)
                                    dispatch(fetchContacts({ page: pagination.page, limit: pagination.limit }))
                                } catch (error) {
                                    setBulkDeleteOpen(false)
                                    console.error('Failed to delete contacts:', error)
                                }
                            }}
                        >
                            Yes, Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Table>
                <TableHeader>
                    <TableRow>
                             <TableHead className='text-sm'>
                            {/* <div className='flex flex-col'>
                                <span>Select to</span>
                                <span>delete</span>

                            </div> */}
                        </TableHead>
                        <TableHead>Index</TableHead>
                   
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Mark as read </TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {contacts.map((contact: any, index) => (
                        <TableRow key={contact._id}>
                        
                            <TableCell>
                                <Checkbox
                                    checked={arraydelete?.includes(contact._id) || false}
                                    onCheckedChange={(checked) => {
                                        setArrayDelete(checked ? [...arraydelete, contact._id] : arraydelete.filter(id => id !== contact._id))
                                    }}
                                />

                            </TableCell>
    <TableCell>{(pagination.page - 1) * pagination.limit + index + 1}</TableCell>
                            <TableCell>{contact.name}</TableCell>
                            <TableCell>{contact.email}</TableCell>

                            {/* Truncated Subject */}
                            <TableCell>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <span>
                                            {contact.subject.length > 20
                                                ? contact.subject.substring(0, 20) + "..."
                                                : contact.subject}
                                        </span>
                                    </TooltipTrigger >
                                    <TooltipContent className='max-w-xs'>
                                        {contact.subject}
                                    </TooltipContent>
                                </Tooltip>
                            </TableCell>

                            {/* Truncated Message */}
                            <TableCell>
                                <Tooltip>
                                    <TooltipTrigger >
                                        <span>
                                            {contact.message.length > 30
                                                ? contact.message.substring(0, 30) + "..."
                                                : contact.message}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-xs'>
                                        {contact.message}
                                    </TooltipContent>
                                </Tooltip>
                            </TableCell>

                            <TableCell>{contact.phone}</TableCell>
                            <TableCell>
                                <Checkbox
                                    checked={contact.status === true || contact.status === 'true'}
                                    onCheckedChange={(checked) => {
                                        dispatch(updateContactStatus({
                                            id: contact._id,
                                            status: checked ? 'true' : 'false'
                                        }))
                                    }}
                                />
                            </TableCell>
                            <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>

                            <TableCell className='flex gap-3'>
                                {/* View Full Details */}

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <MoreVertical className="cursor-pointer h-6 w-6  rotate-90 text-[#7A5E39]" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setViewData(contact)}>
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem

                                            onClick={() => setDeleteId(contact._id)}
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

            <Newdeletemodel
                deleteId={deleteId}
                endpoint="/contactus"
                setDeleteId={setDeleteId}
                onSuccess={() => dispatch(fetchContacts({ page: pagination.page, limit: pagination.limit }))}
            />

            {/* ---- View Contact Modal ---- */}
            {viewData && (
                <Dialog open={!!viewData} onOpenChange={() => setViewData(null)}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Contact Details</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-3 mt-2">
                            <p><strong>Name:</strong> {viewData.name}</p>
                            <p><strong>Email:</strong> {viewData.email}</p>
                            <p><strong>Phone:</strong> {viewData.phone}</p>
                            <p><strong>Subject:</strong> {viewData.subject}</p>
                            <p><strong>Message:</strong> {viewData.message}</p>
                            <p><strong>Status:</strong> {viewData.status === true || viewData.status === 'true' ? 'Read' : 'Unread'}</p>
                            <p><strong>Date:</strong> {new Date(viewData.createdAt).toLocaleString()}</p>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            <NewPagination
                total={pagination.total}
                limit={pagination.limit}
                currentPage={pagination.page}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

export default page
