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
import { Checkbox } from "@/components/ui/checkbox"
import NewPagination from '@/dashbord/common/Newpagination'
const page = () => {
    const [contacts, setContacts] = useState([])
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [viewData, setViewData] = useState<any | null>(null)
const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
});
const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
        ...prev,
        page: newPage,
    }));
};
    const fetchContacts = async () => {
        try {
            const response = await axiosInstance.get('/contactus', {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                },
            });
            setContacts(response.data.data);
            setPagination((prev) => ({
                ...prev,
                total: response.data.pagination.total,
            }));
        } catch (error) {
            console.error('Error fetching contacts:', error)
        }
    }

    useEffect(() => {
        fetchContacts();
    }, [pagination.page, pagination.limit]);

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
                            <TableCell>{index + 1}</TableCell>
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
                            <TableCell>
                                <Checkbox 
                                    checked={contact.status === true || contact.status === 'true'}
                                    onCheckedChange={async (checked) => {
                                        try {
                                            await axiosInstance.patch(`/contactus/${contact._id}`, {
                                                status: checked ? 'true' : 'false'
                                            });
                                            fetchContacts(); // Refresh the list after updating status
                                        } catch (error) {
                                            console.error('Error updating status:', error);
                                        }
                                    }}
                                />
                            </TableCell>
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
