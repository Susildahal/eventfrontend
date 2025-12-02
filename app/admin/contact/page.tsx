"use client"
import React from 'react'
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
 import { useEffect, useState } from 'react'
 import { Trash2 } from 'lucide-react'
import DeleteModel from '@/dashbord/common/DeleteModel'
const page = () => {
    const [contacts, setContacts] = useState([])

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axiosInstance.get('/contactus')
                setContacts(response.data.data)
            }
            catch (error) {
                console.error('Error fetching contacts:', error)
            }
        }

        fetchContacts()
    }, [])
    console.log(contacts)
    return (

        <div className='space-y-4'>
            <Header title="Contact Management" titledesc="Manage your contact messages here." />
            <Table>
                <TableHeader>
                    <TableRow>  
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>         
                </TableHeader>
                <TableBody>
                    </TableBody>
                    {contacts.map((contact: any) => (
                        <TableRow key={contact._id}>
                            <TableCell>{contact.name}</TableCell>   
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>{contact.message}</TableCell>
                            <TableCell>{contact.subject}</TableCell>
                            <TableCell>{contact.phone}</TableCell>
                            <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell> 
                                <Trash2
                                
                                    className="cursor-pointer hover:text-red-600 h-6 w-6 text-red-700"
                                    onClick={async () => {          
                                        try {
                                            await axiosInstance.delete(`/contactus/${contact._id}`)
                                            setContacts(contacts.filter((c: any) => c._id !== contact._id))
                                        }
                                        catch (error) {
                                            console.error('Error deleting contact:', error)
                                        }
                                    }}
                                />
                              
                            </TableCell>
                        </TableRow>
                    ))}
            </Table>

            {/* <DeleteModel /> */}
        </div>
    )
}

export default page
