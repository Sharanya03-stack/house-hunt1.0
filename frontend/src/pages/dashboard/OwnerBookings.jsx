import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  pending: { class: 'badge-warning', icon: Clock, label: 'Pending' },
  confirmed: { class: 'badge-success', icon: CheckCircle, label: 'Confirmed' },
  cancelled: { class: 'badge-danger', icon: XCircle, label: 'Cancelled' },
  completed: { class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', icon: CheckCircle, label: 'Completed' },
};

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/user/bookings');
        setBookings(data.data?.bookings || []);
      } catch { toast.error('Failed to load bookings'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/user/bookings/${id}/status`, { status });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      toast.success(`Booking ${status}`);
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Visit Requests</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{bookings.length} total bookings</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 py-16 text-center">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 dark:text-white">No bookings yet</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Bookings will appear here when someone schedules a visit.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking, i) => {
            const s = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;
            const seeker = booking.users;
            const property = booking.properties;
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-4">
                    {/* Property thumb */}
                    <img
                      src={property?.property_images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=80'}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{property?.title}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {property?.city}
                      </div>
                      {/* Seeker info */}
                      {seeker && (
                        <div className="flex items-center gap-2 mt-2">
                          <img
                            src={seeker.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(seeker.name)}&background=3b82f6&color=fff&size=32`}
                            alt=""
                            className="w-5 h-5 rounded-full"
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{seeker.name} · {seeker.phone || seeker.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`badge ${s.class}`}>
                      <s.icon className="w-3 h-3" />
                      {s.label}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      📅 {booking.visit_date} at {booking.visit_time}
                    </p>
                    {booking.status === 'pending' && (
                      <div className="flex gap-2 mt-1">
                        <button onClick={() => updateStatus(booking.id, 'confirmed')} className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors">
                          Confirm
                        </button>
                        <button onClick={() => updateStatus(booking.id, 'cancelled')} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {booking.message && (
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 border-l-2 border-primary-400">
                    💬 "{booking.message}"
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
