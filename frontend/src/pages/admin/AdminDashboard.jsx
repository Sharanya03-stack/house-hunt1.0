import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, CheckCircle, Eye, TrendingUp, BarChart2, AlertTriangle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../lib/api';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch(() => setStats({
        totalUsers: 142, activeUsers: 138, totalProperties: 584,
        pendingProperties: 12, approvedProperties: 558, rejectedProperties: 14,
        totalBookings: 897, totalViews: 42350,
      }))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600', change: '+8 today' },
    { label: 'Total Properties', value: stats?.totalProperties, icon: Building2, color: 'from-purple-500 to-purple-600', change: '+3 today' },
    { label: 'Total Bookings', value: stats?.totalBookings, icon: CheckCircle, color: 'from-emerald-500 to-emerald-600', change: '+12 today' },
    { label: 'Total Views', value: stats?.totalViews, icon: Eye, color: 'from-amber-500 to-amber-600', change: '+1.2K today' },
  ];

  const propertyStatusData = [
    { name: 'Approved', value: stats?.approvedProperties || 0 },
    { name: 'Pending', value: stats?.pendingProperties || 0 },
    { name: 'Rejected', value: stats?.rejectedProperties || 0 },
  ];

  const weeklyData = [
    { day: 'Mon', listings: 8, users: 15 },
    { day: 'Tue', listings: 12, users: 22 },
    { day: 'Wed', listings: 7, users: 18 },
    { day: 'Thu', listings: 15, users: 28 },
    { day: 'Fri', listings: 18, users: 35 },
    { day: 'Sat', listings: 22, users: 42 },
    { day: 'Sun', listings: 14, users: 30 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Platform overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-card"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? <div className="skeleton h-7 w-16 rounded" /> : s.value?.toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />{s.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alert: Pending Properties */}
      {stats?.pendingProperties > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4"
        >
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-300 flex-1">
            <strong>{stats.pendingProperties} properties</strong> are awaiting review and approval.
          </p>
          <a href="/admin/properties" className="text-xs font-semibold text-amber-700 dark:text-amber-400 whitespace-nowrap hover:underline">
            Review Now →
          </a>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Weekly Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '10px', color: '#f9fafb', fontSize: '12px' }} cursor={{ fill: 'rgba(59,130,246,0.08)' }} />
              <Bar dataKey="listings" name="Listings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="users" name="Users" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Property Status Pie */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Property Status</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={propertyStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                {propertyStatusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {propertyStatusData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
