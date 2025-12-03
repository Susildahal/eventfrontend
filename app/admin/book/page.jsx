"use client"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Header from "../../../dashbord/common/Header"
import axiosInstance from "../../config/axiosInstance";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '../../../components/ui/dropdown-menu'
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from '../../../components/ui/sheet'
import { MoreVertical } from 'lucide-react'
import DeleteModel from '../../../dashbord/common/DeleteModel';


export default function Page() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch bookings from the API with loading and error handling
        const fetchBookings = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get('/bookings');
                const raw = response.data?.data ?? response.data ?? [];

                const normalize = (b) => {
                    const id = b._id ?? b.id ?? b.invoice ?? Date.now();
                    const name = b.name ?? '';
                    const email = b.email ?? '';
                    const phone = b.phone ?? '';
                    const eventtype = b.eventtype ?? b.eventType ?? '';
                    const numberofpeople = b.numberofpeople ?? b.numberOfPeople ?? b.number ?? '';
                    const eventDateRaw = b.eventdate ?? b.eventDate ?? b.eventDateTime ?? b.eventDateString ?? '';
                    const eventDate = eventDateRaw ? new Date(eventDateRaw).toLocaleDateString() : '';
                    const budget = b.budget ?? '';
                    const budgetRange = b.budgetrange ?? b.budgetRange ?? b.budget_range ?? '';
                    const need = Array.isArray(b.needs) ? b.needs.join(', ') : (Array.isArray(b.need) ? b.need.join(', ') : (b.needs ?? b.need ?? ''));
                    const contactmethod = Array.isArray(b.contactMethod) ? b.contactMethod.join(', ') : (Array.isArray(b.contactmethod) ? b.contactmethod.join(', ') : (b.contactMethod ?? b.contactmethod ?? ''));
                    const status = b.status ?? '';
                    return { id, _id: id, name, email, phone, eventtype, numberofpeople, eventDate, budget, budgetRange, need, contactmethod, status };
                }

                setBookings(raw.map(normalize));

            }
            catch (err) {
                console.error('Error fetching bookings:', err);
                setError(err?.response?.data?.message ?? err.message ?? 'Failed to load bookings');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleDelete = async (id) => {
        // Open delete confirmation modal instead of browser confirm
        setDeleteId(id)
    }

    const [deleteId, setDeleteId] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const handleConfirmDelete = async () => {
        const id = deleteId
        if (!id) return
        setDeleting(true)
        setError(null)
        const previous = bookings
        setBookings(prev => prev.filter(b => (b._id ?? b.id) !== id))
        try {
            await axiosInstance.delete(`/bookings/${id}`)
            setDeleteId(null)
        } catch (err) {
            console.error('Delete failed', err)
            setError(err?.response?.data?.message ?? 'Failed to delete booking')
            setBookings(previous)
        } finally {
            setDeleting(false)
        }
    }

    const [viewBooking, setViewBooking] = useState(null)
    const [editBooking, setEditBooking] = useState(null)
    const [updating, setUpdating] = useState(false)

    const openView = (b) => setViewBooking(b)
    const closeView = () => setViewBooking(null)

    const openEdit = (b) => setEditBooking(b)
    const closeEdit = () => setEditBooking(null)

    const handleUpdate = async (id, updates) => {
        setUpdating(true)
        setError(null)
        try {
            const res = await axiosInstance.put(`/bookings/${id}`, updates)
            const updated = res.data?.data ?? res.data ?? null
            setBookings(prev => prev.map(b => ((b._id ?? b.id) === id ? { ...b, ...updated } : b)))
            closeEdit()
        } catch (err) {
            console.error('Update failed', err)
            setError(err?.response?.data?.message ?? 'Failed to update booking')
        } finally {
            setUpdating(false)
        }
    }


    console.log(bookings)
    return (
        <>
            <Header title=" Book Now" titledesc=" You can manage the all booking details " />
            <Table className=' max-w-7xl mx-auto '>

                <TableHeader>
                    <TableRow>
                        <TableHead >Index</TableHead>


                        <TableHead >Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead >Event Type</TableHead>
                        <TableHead >Number of People</TableHead>
                        <TableHead > Events Date</TableHead>
                        <TableHead > Budget</TableHead>
                        <TableHead > Budget Range</TableHead>
                        <TableHead > Need </TableHead>
                        <TableHead > Contract Method </TableHead>
                        <TableHead > Status </TableHead>
                        <TableHead > Action </TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                            <TableCell >{bookings.indexOf(booking) + 1}</TableCell>
                            <TableCell className="font-medium">{booking.name}</TableCell>
                            <TableCell>{booking.email}</TableCell>
                            <TableCell>{booking.phone}</TableCell>
                            <TableCell >{booking.eventtype}</TableCell>
                            <TableCell >{booking.numberofpeople}</TableCell>
                            <TableCell >{booking.eventDate}</TableCell>
                            <TableCell >{booking.budget}</TableCell>
                            <TableCell >{booking.budgetRange}</TableCell>
                            <TableCell >{booking.need}</TableCell>
                            <TableCell >{booking.contactmethod}</TableCell>
                            <TableCell >{booking.status}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="p-0">
                                            <MoreVertical className="size-4 rotate-90" />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onSelect={() => openView(booking)}>View</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => openEdit(booking)}>Update</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleDelete(booking._id ?? booking.id)} data-variant="destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                </TableFooter>
            </Table>

            {/* View Sheet */}
            <Sheet open={Boolean(viewBooking)} onOpenChange={(v) => { if (!v) closeView() }}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Booking Details</SheetTitle>
                        <SheetDescription>View details for the selected booking.</SheetDescription>
                    </SheetHeader>
                    <div className="p-4">
                        {viewBooking ? (
                            <div className="space-y-2">
                                <div><strong>Name:</strong> {viewBooking.name}</div>
                                <div><strong>Email:</strong> {viewBooking.email}</div>
                                <div><strong>Phone:</strong> {viewBooking.phone}</div>
                                <div><strong>Event Type:</strong> {viewBooking.eventtype}</div>
                                <div><strong>People:</strong> {viewBooking.numberofpeople}</div>
                                <div><strong>Event Date:</strong> {viewBooking.eventDate}</div>
                                <div><strong>Budget:</strong> {viewBooking.budget}</div>
                                <div><strong>Need:</strong> {viewBooking.need}</div>
                                <div><strong>Contact:</strong> {viewBooking.contactmethod}</div>
                                <div><strong>Status:</strong> {viewBooking.status}</div>
                            </div>
                        ) : null}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Edit Sheet */}
            <Sheet open={Boolean(editBooking)} onOpenChange={(v) => { if (!v) closeEdit() }}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Edit Booking</SheetTitle>
                        <SheetDescription>Update basic booking fields.</SheetDescription>
                    </SheetHeader>
                    <div className="p-4">
                        {editBooking ? (
                            <EditForm booking={editBooking} onCancel={closeEdit} onSave={handleUpdate} loading={updating} />
                        ) : null}
                    </div>
                </SheetContent>
            </Sheet>
            <DeleteModel deleteId={deleteId} setDeleteId={setDeleteId} deleting={deleting} onConfirm={handleConfirmDelete} />
        </>
    )
}

function EditForm({ booking, onCancel, onSave, loading }) {
    const [status, setStatus] = useState(booking.status ?? '')
    const [numberOfPeople, setNumberOfPeople] = useState(booking.numberofpeople ?? '')
    const [eventDate, setEventDate] = useState(booking.eventDate ? new Date(booking.eventDate).toISOString().slice(0, 10) : '')

    const submit = (e) => {
        e.preventDefault()
        const id = booking._id ?? booking.id
        const payload = {
            status,
            numberofpeople: numberOfPeople,
            eventDate,
        }
        onSave(id, payload)
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Status</label>
                <select className="mt-1 block w-full rounded-md border p-2" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Select New status</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium">Number of People</label>
                <input type="number" className="mt-1 block w-full rounded-md border p-2" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium">Event Date</label>
                <input type="date" className="mt-1 block w-full rounded-md border p-2" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>
            <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            </div>
        </form>

    )
}
