import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Save, Phone, Mail, FileText } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function OwnerProfile() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar_url || null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (avatar) formData.append('avatar', avatar);

      const { data } = await api.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data.data.user);
      toast.success('Profile updated! ✓');
    } catch { toast.error('Failed to update profile'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account information.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-6">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <img
              src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=3b82f6&color=fff&size=80`}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-100 dark:border-gray-800"
            />
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors shadow-md">
              <Camera className="w-3.5 h-3.5 text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">{user?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.role} · {user?.email}</p>
            <div className={`badge mt-1.5 ${user?.is_verified ? 'badge-success' : 'badge-warning'}`}>
              {user?.is_verified ? '✓ Verified' : '⚠ Unverified'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="input-label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field pl-10" required />
            </div>
          </div>
          <div>
            <label className="input-label">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210" className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="input-label">Email <span className="text-gray-400 font-normal">(cannot be changed)</span></label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" value={user?.email} disabled className="input-field pl-10 opacity-60 cursor-not-allowed" />
            </div>
          </div>
          <div>
            <label className="input-label">Bio</label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell renters/buyers a bit about yourself..." rows={3}
                className="input-field pl-10 resize-none" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
