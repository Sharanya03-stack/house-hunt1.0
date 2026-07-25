import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Edit2, Trash2, Plus, Search, Filter, MoreVertical } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const STATUS_CLASSES = {
  approved: 'badge-success',
  pending: 'badge-warning',
  rejected: 'badge-danger',
};

export default function OwnerListings() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchListings = async (status = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/properties/owner/listings${status ? `?status=${status}` : ''}`);
      setProperties(data.data?.properties || []);
    } catch { toast.error('Failed to load listings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchListings(filter); }, [filter]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/properties/${id}`);
      toast.success('Property deleted.');
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch { toast.error('Failed to delete.'); }
    finally { setDeleteId(null); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Listings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{properties.length} properties found</p>
        </div>
        <Link to="/dashboard/add-property" className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Add Property
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-white dark:bg-gray-900 rounded-xl p-1.5 border border-gray-100 dark:border-gray-800 w-fit">
        {[
          { label: 'All', value: '' },
          { label: 'Approved', value: 'approved' },
          { label: 'Pending', value: 'pending' },
          { label: 'Rejected', value: 'rejected' },
        ].map(({ label, value }) => (
          <button key={value} onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${filter === value ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl mb-3">🏠</div>
            <p className="font-semibold text-gray-900 dark:text-white">No listings found</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Add a property to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Property</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Views</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {properties.map((property) => {
                  const img = property.property_images?.[0]?.url;
                  return (
                    <motion.tr
                      key={property.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100'}
                            alt={property.title}
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate max-w-xs">{property.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{property.property_type} · {property.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">₹{property.price?.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-gray-400 ml-1">/{property.price_period || 'mo'}</span>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Eye className="w-3.5 h-3.5 text-gray-400" />
                          {property.views || 0}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`badge ${STATUS_CLASSES[property.status] || 'badge-primary'} capitalize`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/properties/${property.id}`}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/dashboard/edit-property/${property.id}`}
                            className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          {deleteId === property.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(property.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg">Confirm</button>
                              <button onClick={() => setDeleteId(null)} className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-lg">Cancel</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteId(property.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
