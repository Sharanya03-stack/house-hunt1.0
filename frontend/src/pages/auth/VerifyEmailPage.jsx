import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader, Home } from 'lucide-react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState('loading');
  const [searchParams] = useSearchParams();
  const { updateUser } = useAuthStore();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        const { data } = await api.get(`/auth/verify-email?token=${token}`);
        if (data.data?.accessToken) {
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          updateUser(data.data.user);
        }
        setStatus('success');
        toast.success('Email verified successfully!');
        setTimeout(() => navigate('/'), 3000);
      } catch {
        setStatus('error');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 text-center"
      >
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-white">HouseHunt</span>
        </Link>

        {status === 'loading' && (
          <>
            <Loader className="w-12 h-12 text-primary-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Verifying your email...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email Verified! 🎉</h2>
            <p className="text-gray-500 text-sm mb-6">Your account is active. Redirecting you to the homepage...</p>
            <Link to="/" className="btn-primary">Go to Home</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-9 h-9 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Failed</h2>
            <p className="text-gray-500 text-sm mb-6">The link may have expired or already been used.</p>
            <Link to="/login" className="btn-primary">Back to Login</Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
