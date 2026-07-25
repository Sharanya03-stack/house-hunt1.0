import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Home, CheckCircle } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password: form.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8"
      >
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-white">HouseHunt</span>
        </Link>

        {success ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h2>
            <p className="text-gray-500 text-sm">Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Set New Password</h1>
            <p className="text-gray-500 text-sm mb-6">Choose a strong password for your account.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="input-field pl-10 pr-10"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="input-label">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    placeholder="Re-enter password"
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
