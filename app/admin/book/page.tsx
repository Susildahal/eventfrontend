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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalCancelled: 0,
    totalPending: 0,
    totalCompleted: 0,
    totalConfirmed: 0
  });
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10
  });
  const [deleting, setDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // mark this as performing delete via DeleteModel modal
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(deleteId);
      await axiosInstance.delete(`/bookings/${deleteId}`);
      // Refresh list and stats after delete
      await fetchBookings(pagination.page, statusFilter);
      setDeleteId(null);
      alert('Booking deleted successfully');
    } catch (error) {
      console.error('Failed to delete booking:', error);
      alert('Failed to delete booking. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdate = (id: string, updates: BookingFormData) => {
    setBookings(prev =>
      prev.map(b => (b._id === id ? { ...b, ...updates } : b))
    );
    setEditBooking(null);
  };

  const getStatusBadge = (status: string) => {
    const baseClass = 'px-3 py-1 rounded text-sm font-medium';
    if (status === 'Confirmed') return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
    if (status === 'Pending') return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
    if (status === 'Completed') return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`;
    if (status === 'Cancelled') return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
    return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
  };
  const fetchBookings = async (page: number = 1, status: string = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (status) {
        params.append('status', status);
      }
      
      const response = await axiosInstance.get(`/bookings?${params.toString()}`);
      const serverResponse: ServerResponse = response.data;
      setBookings(serverResponse.data);
      setStats(serverResponse.stats);
      setPagination(serverResponse.pagination);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchBookings(page, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
    fetchBookings(1, status);
  };

  const clearFilter = () => {
    setStatusFilter('');
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchBookings(1, '');
  };

  useEffect(() => {
    fetchBookings(1, statusFilter);
  }, []);

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
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase">Event</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase">Guests</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase">Budget</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
                {bookings.map((booking, idx) => (
                <tr key={booking._id} className={`border-b border-gray-100 dark:border-slate-800 ${idx % 2 === 0 ? 'bg-white dark:bg-slate-900/50' : 'bg-gray-50 dark:bg-slate-800/50'}`}>
                  <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 dark:text-white">{booking.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{booking.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{booking.eventtype}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{new Date(booking.eventdate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{booking.numberofpeople}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{booking.budget}</td>
                  <td className="px-6 py-4">
                  <span className={getStatusBadge(booking.status)}>{booking.status}</span>
                  </td>
                  <td className="px-6 py-4">
                  <div className="flex items-center justify-end">
                    {/* Dropdown actions using native <details> so no extra hooks are needed */}
                    <details className="relative">
                    <summary className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer">
                      <MoreVertical className="w-4 h-4 rotate-90 text-gray-600 dark:text-gray-400" />
                    </summary>

                    <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded shadow-md z-20 overflow-hidden">
                      <button
                      onClick={(e) => {
                        e.preventDefault();
                        setViewBooking(booking);
                        const d = (e.currentTarget as HTMLElement).closest('details') as HTMLDetailsElement | null;
                        if (d) d.open = false;
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                      >
                      <Eye className="w-4 h-4 cursor-pointer" /> View
                      </button>

                      <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditBooking(booking);
                        const d = (e.currentTarget as HTMLElement).closest('details') as HTMLDetailsElement | null;
                        if (d) d.open = false;
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                      >
                      <Edit2 className="w-4 h-4 " /> Edit
                      </button>

                      <button
                      onClick={(e) => {
                        e.preventDefault();
                        // open delete confirmation modal
                        setDeleteId(booking._id);

                        const d = (e.currentTarget as HTMLElement).closest('details') as HTMLDetailsElement | null;
                        if (d) {
                          // Add a one-time "click outside" listener so the menu closes when user clicks outside
                          const handleOutsideClick = (ev: MouseEvent) => {
                            const handleOutsideClick = (ev: MouseEvent) => {
                            if (!d) return;
                            const target = ev.target as Node | null;
                            if (!target || !d.contains(target)) {
                              d.open = false;
                              document.removeEventListener('click', handleOutsideClick);
                            }
                            };
                          };
                          // Ensure the listener is attached after the current click, otherwise it'll close immediately
                          setTimeout(() => document.addEventListener('click', handleOutsideClick), 0);
                        }
                        if (d) d.open = false;
                      }}
                      disabled={deleting === booking._id}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer disabled:opacity-50"
                      >
                      <Trash2 className="w-4 h-4" /> {deleting === booking._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                    </details>
                  </div>
                  </td>
                </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Modal */}
      <Dialog open={!!viewBooking} onOpenChange={() => setViewBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Complete information for this booking</DialogDescription>
          </DialogHeader>
          {viewBooking && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</p>
                <p className="text-lg text-gray-900 dark:text-white mt-1">{viewBooking.name}</p>
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

              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Event Type</p>
                <p className="text-lg text-gray-900 dark:text-white mt-1">{viewBooking.eventtype}</p>
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

              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Needs</p>
                <p className="text-gray-900 dark:text-white mt-1">{viewBooking.needs.join(', ')}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contact Method</p>
                <p className="text-gray-900 dark:text-white mt-1">{viewBooking.contactMethod.join(', ')}</p>
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
  const [eventDate, setEventDate] = useState(booking.eventdate);

  const handleSubmit = () => {
    onSave(booking._id, { status, numberofpeople: numberOfPeople, eventdate: eventDate });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
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
        <Button variant="outline" onClick={onCancel} >
          Cancel
        </Button>
        <div>
        <Button
          onClick={async () => {
        try {
          const updates: BookingFormData = {
            status,
            numberofpeople: numberOfPeople,
            eventdate: new Date(eventDate).toISOString(),
          };
          await axiosInstance.put(`/bookings/${booking._id}`, updates);
          onSave(booking._id, updates);
         
        } catch (error) {
       
        }
          }}
          className="w-full "
        >
          Update Booking
        </Button>
      </div>
      </div>
      
    </div>
  );
}