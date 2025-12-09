"use client"
import React, { useEffect, useState } from 'react'
import Header from '@/dashbord/common/Header'
import axiosInstance from '@/app/config/axiosInstance'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Trash2, Eye } from 'lucide-react'
import Newdeletemodel from '@/dashbord/common/Newdeletemodel'
import { Spinner } from '@/components/ui/spinner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

const page = () => {
    const [contacts, setContacts] = useState([])
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [viewData, setViewData] = useState<any | null>(null)

    const fetchContacts = async () => {
        try {
            const response = await axiosInstance.get('/contactus')
            setContacts(response.data.data)
        } catch (error) {
            console.error('Error fetching contacts:', error)
        }
    }

    useEffect(() => {
        fetchContacts()
    }, [])

    if (!contacts) {
        return <div className='h-screen justify-center items-center flex '><Spinner /></div>
    }
    if (contacts.length === 0) {
        return <div className='text-center'>No contact was found.</div>
    }

    return (
        <div className='space-y-4'>
            <Header title="Contact Management" titledesc="Manage your contact messages here." />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {contacts.map((contact: any) => (
                        <TableRow key={contact._id}>
                            <TableCell>{contact.name}</TableCell>
                            <TableCell>{contact.email}</TableCell>

                            {/* Truncated Subject */}
                            <TableCell>
                                {contact.subject.length > 20
                                    ? contact.subject.substring(0, 20) + "..."
                                    : contact.subject}
                            </TableCell>

                            {/* Truncated Message */}
                            <TableCell>
                                {contact.message.length > 30
                                    ? contact.message.substring(0, 30) + "..."
                                    : contact.message}
                            </TableCell>

                            <TableCell>{contact.phone}</TableCell>
                            <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>

                            <TableCell className='flex gap-3'>
                                {/* View Full Details */}
                                <Eye
                                    className="cursor-pointer hover:text-blue-600 h-6 w-6 text-blue-700"
                                    onClick={() => setViewData(contact)}
                                />

                                {/* Delete */}
                                <Trash2
                                    className="cursor-pointer hover:text-red-600 h-6 w-6 text-red-700"
                                    onClick={() => setDeleteId(contact._id)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Newdeletemodel
                deleteId={deleteId}
                endpoint="/contactus"
                setDeleteId={setDeleteId}
                onSuccess={fetchContacts}
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
                            <p><strong>Date:</strong> {new Date(viewData.createdAt).toLocaleString()}</p>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default page
