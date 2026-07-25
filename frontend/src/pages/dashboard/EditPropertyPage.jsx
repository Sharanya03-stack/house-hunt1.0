// Placeholder — EditPropertyPage reuses AddPropertyPage logic
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', price: '', bedrooms: '', bathrooms: '',
    area: '', address: '', city: '', state: '', furnished: false, parking: false, pet_friendly: false,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then(({ data }) => {
        const p = data.data.property;
        setForm({
          title: p.title || '',
          description: p.description || '',
          price: p.price || '',
          bedrooms: p.bedrooms || '',
          bathrooms: p.bathrooms || '',
          area: p.area || '',
          address: p.address || '',
          city: p.city || '',
          state: p.state || '',
          furnished: p.furnished || false,
          parking: p.parking || false,
          pet_friendly: p.pet_friendly || false,
        });
      })
      .catch(() => { toast.error('Failed to load property'); navigate('/dashboard/listings'); })
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/properties/${id}`, form);
      toast.success('Property updated!');
      navigate('/dashboard/listings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Property</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Update your property details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-6 space-y-5">
        <div>
          <label className="input-label">Title</label>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" required />
        </div>
        <div>
          <label className="input-label">Description</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="input-field resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Price (₹)</label>
            <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="input-label">Area (sqft)</label>
            <input type="number" value={form.area} onChange={e => setForm({...form, area: e.target.value})} className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Bedrooms</label>
            <input type="number" value={form.bedrooms} onChange={e => setForm({...form, bedrooms: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="input-label">Bathrooms</label>
            <input type="number" value={form.bathrooms} onChange={e => setForm({...form, bathrooms: e.target.value})} className="input-field" />
          </div>
        </div>
        <div>
          <label className="input-label">Address</label>
          <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">City</label>
            <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="input-label">State</label>
            <input value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="input-field" />
          </div>
        </div>
        <div className="flex gap-4">
          {[{n:'furnished',l:'Furnished'},{n:'parking',l:'Parking'},{n:'pet_friendly',l:'Pet Friendly'}].map(({n,l}) => (
            <label key={n} className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl border-2 transition-all ${form[n] ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
              <input type="checkbox" checked={form[n]} onChange={e => setForm({...form, [n]: e.target.checked})} className="hidden" />
              <div className={`w-4 h-4 rounded-full border-2 ${form[n] ? 'bg-primary-600 border-primary-600' : 'border-gray-300'}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{l}</span>
            </label>
          ))}
        </div>
        <button type="submit" disabled={loading} className="btn-primary gap-2 w-full sm:w-auto">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
