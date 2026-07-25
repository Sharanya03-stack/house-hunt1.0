import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Star, Eye, AlertCircle } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [rejectionModal, setRejectionModal] = useState(null);
  const [reason, setReason] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        tab === 'pending' ? '/admin/properties/pending' : `/properties?status=${tab}&limit=20`
      );
      setProperties(data.data?.properties || []);
    } catch { toast.error('Failed to load properties'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProperties(); }, [tab]);

  const updateStatus = async (id, status, rejection_reason) => {
    try {
      await api.put(`/admin/properties/${id}/status`, { status, rejection_reason });
      setProperties((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Property ${status}`);
    } catch { toast.error('Failed to update'); }
    finally { setRejectionModal(null); setReason(''); }
  };

  const toggleFeatured = async (id) => {
    try {
      const { data } = await api.put(`/admin/properties/${id}/featured`);
      setProperties((prev) => prev.map((p) => p.id === id ? { ...p, is_featured: !p.is_featured } : p));
      toast.success(data.message);
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Properties</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Review and manage all property listings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-gray-900 rounded-xl p-1.5 border border-gray-100 dark:border-gray-800 w-fit">
        {['pending', 'approved', 'rejected'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
              ${tab === t ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
        ) : properties.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-900 dark:text-white">No {tab} properties</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {properties.map((p, i) => {
              const img = p.property_images?.[0]?.url;
              const owner = p.users;
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <div className="flex gap-4 flex-1 min-w-0">
                    <img src={img || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=80'} alt=""
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{p.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize">{p.property_type} · {p.city} · ₹{p.price?.toLocaleString('en-IN')}</p>
                      {owner && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <img src={owner.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.name)}&background=3b82f6&color=fff&size=24`} alt="" className="w-4 h-4 rounded-full" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">{owner.name} · {owner.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                    <a href={`/properties/${p.id}`} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                      <Eye className="w-4 h-4" />
                    </a>
                    <button onClick={() => toggleFeatured(p.id)}
                      className={`p-1.5 rounded-lg transition-colors ${p.is_featured ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400'}`}>
                      <Star className={`w-4 h-4 ${p.is_featured ? 'fill-current' : ''}`} />
                    </button>

                    {tab === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(p.id, 'approved')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button onClick={() => setRejectionModal(p.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors">
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectionModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Reject Property</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Provide a reason for rejection (will be sent to owner).</p>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)}
              rows={3} placeholder="e.g. Insufficient property photos, misleading description..."
              className="input-field resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => { setRejectionModal(null); setReason(''); }} className="btn-secondary flex-1">Cancel</button>
              <button
                onClick={() => updateStatus(rejectionModal, 'rejected', reason)}
                disabled={!reason.trim()}
                className="btn-danger flex-1 disabled:opacity-40"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
