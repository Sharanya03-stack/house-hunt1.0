import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  pending: 'badge-warning',
  confirmed: 'badge-success',
  cancelled: 'badge-danger',
  completed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export default function SeekerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/bookings')
      .then(({ data }) => setBookings(data.data?.bookings || []))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const cancelBooking = async (id) => {
    try {
      await api.put(`/user/bookings/${id}/status`, { status: 'cancelled' });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
      toast.success('Booking cancelled');
    } catch { toast.error('Failed to cancel'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Visit Bookings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{bookings.length} bookings total</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 py-16 text-center">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 dark:text-white">No bookings yet</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Find a property and book a visit to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking, i) => {
            const property = booking.properties;
            return (
              <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-5">
                <div className="flex gap-4">
                  <img
                    src={property?.property_images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=80'}
                    alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{property?.title}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <MapPin className="w-3 h-3" />{property?.city}
                        </div>
                      </div>
                      <span className={`badge ${STATUS_STYLES[booking.status]} flex-shrink-0 capitalize`}>{booking.status}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{booking.visit_date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.visit_time}</span>
                    </div>
                    {booking.status === 'pending' && (
                      <button onClick={() => cancelBooking(booking.id)}
                        className="mt-2 text-xs text-red-500 hover:text-red-600 font-medium transition-colors">
                        Cancel booking
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
