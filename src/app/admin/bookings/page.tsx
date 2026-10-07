'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getBookings, updateBookingStatus, Booking } from '@/actions/bookings';

const STATUS_STYLES: Record<Booking['status'], string> = {
  scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  'no-show': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

function formatDate(dateISO: string) {
  const [y, m, d] = dateISO.split('-').map(Number);
  return new Intl.DateTimeFormat('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(y, m - 1, d));
}

function formatTime(dateISO: string, time: string) {
  const instant = new Date(`${dateISO}T${time}:00+10:00`);
  return new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Brisbane', hour: 'numeric', minute: '2-digit', hour12: true }).format(instant);
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'upcoming' | 'all'>('upcoming');

  useEffect(() => {
    loadBookings();
  }, [view]);

  const loadBookings = async () => {
    setLoading(true);
    const res = await getBookings(view === 'upcoming' ? { upcoming: true } : undefined);
    if (res.success) setBookings(res.bookings as Booking[]);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    await updateBookingStatus(id, status);
    if (view === 'upcoming') loadBookings();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background text-white p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            Discovery Call Bookings
          </h1>
          <p className="text-white/50">Calls booked through the public website.</p>
        </div>
        <div className="bg-black/40 border border-white/10 p-1 rounded-lg flex">
          <button
            onClick={() => setView('upcoming')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'upcoming' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setView('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'all' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
          >
            All
          </button>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white/50 uppercase bg-black/20 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32 bg-white/5" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40 bg-white/5" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-white/5" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full bg-white/5" /></td>
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-white/40">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No {view === 'upcoming' ? 'upcoming' : ''} bookings found.</p>
                  </td>
                </tr>
              ) : (
                bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{formatDate(booking.dateISO)}</div>
                      <div className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {formatTime(booking.dateISO, booking.startTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{booking.name}</div>
                      <div className="text-white/40 text-xs flex items-center gap-3 mt-0.5">
                        <a href={`mailto:${booking.email}`} className="flex items-center gap-1 hover:text-primary">
                          <Mail className="w-3 h-3" /> {booking.email}
                        </a>
                        {booking.phone && (
                          <a href={`tel:${booking.phone}`} className="flex items-center gap-1 hover:text-primary">
                            <Phone className="w-3 h-3" /> {booking.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70 capitalize">{booking.service || 'General'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={e => handleStatusChange(booking.id!, e.target.value as Booking['status'])}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-transparent focus:outline-none cursor-pointer ${STATUS_STYLES[booking.status]}`}
                      >
                        <option value="scheduled" className="bg-zinc-900 text-white">Scheduled</option>
                        <option value="completed" className="bg-zinc-900 text-white">Completed</option>
                        <option value="cancelled" className="bg-zinc-900 text-white">Cancelled</option>
                        <option value="no-show" className="bg-zinc-900 text-white">No-show</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
