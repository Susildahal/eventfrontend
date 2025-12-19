'use client';
import { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/dashbord/common/Header';
import Pagination from '@/dashbord/common/Pagination';
import axiosInstance from '@/app/config/axiosInstance';
import { MoreVertical } from 'lucide-react';
import DeleteModel from '@/dashbord/common/DeleteModel';
import {Spinner} from '@/components/ui/spinner'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { fetchBookings, updateBooking, deleteBooking } from '@/app/redux/slices/bookingsSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table ,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventtype: string;
  numberofpeople: string;
  eventdate: string;
  numberofguests: string;
  budget: string;
  budgetrange: string;
  needs: string[];
  contactMethod: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  message?: string;
}

interface BookingFormData {
  status: string;
  numberofpeople: string;
  eventdate: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
}

interface StatsData {
  totalCancelled: number;
  totalPending: number;
  totalCompleted: number;
  totalConfirmed: number;
}

interface ServerResponse {
  data: Booking[];
  stats: StatsData;
  pagination: PaginationData;
}

export default function BookingsDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: bookings, stats, pagination, loading } = useSelector((state: RootState) => state.bookings);
  
  const [deleting, setDeleting] = useState<string | null>(null);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  

  // mark this as performing delete via DeleteModel modal
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(deleteId);
      await dispatch(deleteBooking(deleteId)).unwrap();
      setDeleteId(null);
      // Refetch bookings to update pagination
      await dispatch(fetchBookings({ page: currentPage, limit: pagination.limit, status: statusFilter }));
    } catch (error) {
      console.error('Failed to delete booking:', error);
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdate = async (id: string, updates: BookingFormData) => {
    try {
      setUpdatingStatus(id);
      await dispatch(updateBooking({ id, updates })).unwrap();
      setEditBooking(null);
      // Refetch bookings to update stats and pagination if needed
      await dispatch(fetchBookings({ page: currentPage, limit: pagination.limit, status: statusFilter }));
    } catch (error) {
      console.error('Failed to update booking:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClass = 'px-3 py-1 rounded text-sm font-medium';
    if (status === 'Confirmed') return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
    if (status === 'Pending') return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
    if (status === 'Completed') return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`;
    if (status === 'Cancelled') return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
    return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dispatch(fetchBookings({ page, limit: pagination.limit, status: statusFilter }));
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    dispatch(fetchBookings({ page: 1, limit: pagination.limit, status }));
  };

  const clearFilter = () => {
    setStatusFilter('');
    setCurrentPage(1);
    dispatch(fetchBookings({ page: 1, limit: pagination.limit }));
  };

  useEffect(() => {
    dispatch(fetchBookings({ page: 1, limit: 10 }));
  }, [dispatch]);


  if (loading && bookings.length === 0) {
    return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  }


  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 space-y-3">
      {/* Header */}
     <Header title="Bookings Dashboard" titledesc="Manage and review event bookings" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card 
          className={`h-16 cursor-pointer transition-all hover:shadow-md ${statusFilter === 'Pending' ? 'ring-2 ring-yellow-500' : ''}`}
          onClick={() => handleStatusFilter('Pending')}
        >
          <CardHeader className="py-1 px-3">
            <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Pending <span className='font-bold text-xs'>{stats.totalPending}</span>
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card 
          className={`h-16 cursor-pointer transition-all hover:shadow-md ${statusFilter === 'Confirmed' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => handleStatusFilter('Confirmed')}
        >
          <CardHeader className="py-1 px-3">
            <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Confirmed <span>{stats.totalConfirmed}</span>
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card 
          className={`h-16 cursor-pointer transition-all hover:shadow-md ${statusFilter === 'Cancelled' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => handleStatusFilter('Cancelled')}
        >
          <CardHeader className="py-1 px-3">
            <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Cancelled <span>{stats.totalCancelled}</span>
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card 
          className={`h-16 cursor-pointer transition-all hover:shadow-md ${statusFilter === 'Completed' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => handleStatusFilter('Completed')}
        >
          <CardHeader className="py-1 px-3">
            <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Completed <span>{stats.totalCompleted}</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filter Status Display */}
      {statusFilter && (
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Filtering by: <span className="font-medium">{statusFilter}</span>
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilter}
            className="text-xs"
          >
            Clear Filter
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead> Index</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead> Change Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-96 text-center">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        No Bookings Found
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {statusFilter 
                          ? `No ${statusFilter.toLowerCase()} bookings available at the moment.`
                          : 'No bookings available at the moment.'}
                      </p>
                    </div>
                    {statusFilter && (
                      <Button
                        variant="outline"
                        onClick={clearFilter}
                        className="mt-2"
                      >
                        Clear Filter
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking, index) => (
                <TableRow key={booking._id}>
                  <TableCell>{index + 1 + (pagination.page - 1) * pagination.limit}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.name}</p>
                      <p className="text-sm text-muted-foreground">{booking.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{booking.eventtype}</TableCell>
                  <TableCell>{new Date(booking.eventdate).toLocaleDateString()}</TableCell>
                  <TableCell>{booking.phone}</TableCell>
                  <TableCell>{booking.numberofpeople}</TableCell>
                  <TableCell>{booking.budget}</TableCell>
                  <TableCell>
                    <div className="relative">
                      <Select
                        disabled={updatingStatus === booking._id}
                        value={booking.status}
                        onValueChange={async (value) => { 
                          await handleUpdate(booking._id, {
                            status: value,
                            numberofpeople: booking.numberofpeople,
                            eventdate: booking.eventdate
                          });
                        }}
                      >
                        <SelectTrigger className="w-full border-0 bg-transparent p-0 hover:bg-transparent focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className='w-full'>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      {updatingStatus === booking._id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded">
                          <Spinner />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className=" h-4 w-4  rotate-90" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewBooking(booking)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditBooking(booking)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(booking._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
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

      {/* View Modal */}
      <Dialog open={!!viewBooking} onOpenChange={() => setViewBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Complete information for this booking</DialogDescription>
          </DialogHeader>
          {viewBooking && (
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</p>
                <p className="text-lg text-gray-900 dark:text-white mt-1">{viewBooking.name}</p>
              </div>
               <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Event Type</p>
                <p className="text-lg text-gray-900 dark:text-white mt-1">{viewBooking.eventtype}</p>
              </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-white mt-1">{viewBooking.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-white mt-1">{viewBooking.phone}</p>
                </div>
              </div>

             

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Guests</p>
                  <p className="text-gray-900 dark:text-white mt-1">{viewBooking.numberofpeople}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</p>
                  <p className="text-gray-900 dark:text-white mt-1">{new Date(viewBooking.eventdate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget</p>
                  <p className="text-gray-900 dark:text-white mt-1">{viewBooking.budget}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                  <p className="text-gray-900 dark:text-white mt-1">{viewBooking.status}</p>
                </div>
              </div>
 <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Needs</p>
                <p className="text-gray-900 dark:text-white mt-1">{viewBooking.needs.join(', ')}</p>
              </div>
 <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contact Method</p>
                <p className="text-gray-900 dark:text-white mt-1">{viewBooking.contactMethod.join(', ')}</p>
              </div>
             
              </div>

             
  <div className='max-h-[100px] overflow-x-hidden '>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Message</p>
                <p className="text-gray-900 dark:text-white mt-1">{viewBooking.message}</p>
              </div>
              <Button onClick={() => setViewBooking(null)} className="w-full">Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editBooking} onOpenChange={() => setEditBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>Update booking details</DialogDescription>
          </DialogHeader>
          {editBooking && (
            <EditForm
              booking={editBooking}
              onCancel={() => setEditBooking(null)}
              onSave={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={Math.ceil(pagination.total / pagination.limit)}
        totalItems={pagination.total}
        itemsPerPage={pagination.limit}
        onPageChange={handlePageChange}
      />
      <DeleteModel
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        deleting={deleting === deleteId}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

interface EditFormProps {
  booking: Booking;
  onCancel: () => void;
  onSave: (id: string, updates: BookingFormData) => void;
}

function EditForm({ booking, onCancel, onSave }: EditFormProps) {
  const [status, setStatus] = useState(booking.status);
  const [numberOfPeople, setNumberOfPeople] = useState(booking.numberofpeople);
  // Format date to YYYY-MM-DD for input field
  const [eventDate, setEventDate] = useState(() => {
    const date = new Date(booking.eventdate);
    return date.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const updates: BookingFormData = {
        status,
        numberofpeople: numberOfPeople,
        eventdate: new Date(eventDate).toISOString(),
      };
      await onSave(booking._id, updates);
    } catch (error) {
      console.error('Failed to update booking:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="mt-2 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='w-full'>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
               <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="people">Number of People</Label>
        <Input
          id="people"
          type="number"
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(e.target.value)}
          className="mt-2"
        />
      </div>
     

      <div>
        <Label htmlFor="date">Event Date</Label>
        <Input
          id="date"
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="mt-2"
        />
      </div>

      <div className="flex  gap-3 justify-center items-center">
        <Button variant="outline" className='w-[50%]' onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="w-[50%]"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Booking'}
        </Button>
      </div>
      
    </div>
  );
}


