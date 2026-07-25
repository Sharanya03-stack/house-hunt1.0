import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Home, CheckCircle } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">HouseHunt</span>
          </Link>

          {sent ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                If <strong>{email}</strong> is associated with an account, you'll receive a reset link shortly.
              </p>
              <Link to="/login" className="btn-primary">
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password?</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                No worries! Enter your registered email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="input-label">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}

          <Link to="/login" className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
