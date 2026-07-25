import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, ShieldOff, User, UserCheck } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (role) params.set('role', role);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.data?.users || []);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [search, role]);

  const toggleStatus = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/status`);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_active: data.data.user.is_active } : u)));
      toast.success(data.message);
    } catch { toast.error('Failed to update user'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{users.length} users found</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field w-auto">
          <option value="">All Roles</option>
          <option value="seeker">Seekers</option>
          <option value="owner">Owners</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {users.map((u) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=3b82f6&color=fff&size=40`}
                          alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{u.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className={`badge capitalize ${u.role === 'admin' ? 'badge-danger' : u.role === 'owner' ? 'badge-primary' : 'badge-success'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {new Date(u.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`badge ${u.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`flex items-center gap-1.5 text-xs font-medium ml-auto px-3 py-1.5 rounded-lg transition-all
                          ${u.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'}`}
                      >
                        {u.is_active ? <><ShieldOff className="w-3.5 h-3.5" />Deactivate</> : <><Shield className="w-3.5 h-3.5" />Activate</>}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
