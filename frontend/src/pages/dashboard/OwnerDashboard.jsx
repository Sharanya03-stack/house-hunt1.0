import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, Eye, Calendar, Heart, TrendingUp, Plus, ArrowRight,
  CheckCircle, Clock, XCircle, AlertCircle,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const viewsData = [
  { name: 'Mon', views: 42 }, { name: 'Tue', views: 68 },
  { name: 'Wed', views: 55 }, { name: 'Thu', views: 80 },
  { name: 'Fri', views: 95 }, { name: 'Sat', views: 110 },
  { name: 'Sun', views: 78 },
];

export default function OwnerDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/properties/owner/analytics');
        setAnalytics(data.data);
      } catch { /* use mock data */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const stats = [
    { label: 'Total Listings', value: analytics?.totalProperties ?? 0, icon: Building2, color: 'bg-blue-500', change: '+2 this month' },
    { label: 'Total Views', value: analytics?.totalViews ?? 0, icon: Eye, color: 'bg-emerald-500', change: '+15% vs last week' },
    { label: 'Visit Bookings', value: analytics?.totalBookings ?? 0, icon: Calendar, color: 'bg-purple-500', change: '+4 this week' },
    { label: 'Saved by Users', value: analytics?.totalFavorites ?? 0, icon: Heart, color: 'bg-rose-500', change: '↑ Growing' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening with your properties today.
          </p>
        </div>
        <Link to="/dashboard/add-property" className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Add Property
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? <div className="skeleton h-7 w-12 rounded" /> : stat.value.toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Views Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white">Weekly Views</h2>
            <span className="badge badge-primary">Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={viewsData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '10px', color: '#f9fafb', fontSize: '12px' }}
                cursor={{ fill: 'rgba(59,130,246,0.08)' }}
              />
              <Bar dataKey="views" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Property Status */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Property Status</h2>
          <div className="space-y-3">
            {[
              { label: 'Approved', count: analytics?.activeListings ?? 3, icon: CheckCircle, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
              { label: 'Pending Review', count: analytics?.pendingListings ?? 1, icon: Clock, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
              { label: 'Rejected', count: 0, icon: XCircle, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
            ].map(({ label, count, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
          <Link to="/dashboard/listings" className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline mt-4">
            View all listings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Listings */}
      {analytics?.properties?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-white">Recent Listings</h2>
            <Link to="/dashboard/listings" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {analytics.properties.slice(0, 4).map((property) => (
              <div key={property.id} className="flex items-center justify-between px-6 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{property.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">₹{property.price?.toLocaleString('en-IN')}/mo</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="w-3.5 h-3.5" />
                    {property.views || 0}
                  </div>
                  <span className={`badge text-xs
                    ${property.status === 'approved' ? 'badge-success'
                    : property.status === 'pending' ? 'badge-warning'
                    : 'badge-danger'}`}>
                    {property.status}
                  </span>
                  <Link to={`/dashboard/edit-property/${property.id}`} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {(!analytics?.properties || analytics.properties.length === 0) && (
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/10 dark:to-accent-900/10 rounded-2xl p-8 text-center border border-primary-100 dark:border-primary-800">
          <div className="text-5xl mb-4">🏠</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">List Your First Property</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-5 max-w-sm mx-auto">
            Reach thousands of verified buyers and renters. Get started in just a few minutes.
          </p>
          <Link to="/dashboard/add-property" className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Add Your First Property
          </Link>
        </div>
      )}
    </div>
  );
}
