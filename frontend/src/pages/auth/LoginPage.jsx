import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Home, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'owner') navigate('/dashboard');
      else navigate('/properties');
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      if (error.response?.data?.setup_required) {
        toast.error('⚠️ Database not set up. Run schema.sql in Supabase first.', { duration: 6000 });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/70 to-accent-900/80" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">HouseHunt</span>
          </Link>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                Your Dream Home<br />
                Is Just a Search Away
              </h2>
              <p className="text-white/70 text-lg max-w-sm">
                Discover thousands of verified properties across India. Find the perfect home that fits your lifestyle and budget.
              </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { value: '50K+', label: 'Properties' },
                { value: '200+', label: 'Cities' },
                { value: '2M+', label: 'Happy Users' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/60 text-sm mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-8 bg-white dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">HouseHunt</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="input-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />{errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="input-label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />{errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs text-gray-400 font-medium">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* Google Login */}
          <GoogleLoginButton />

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function GoogleLoginButton() {
  const { googleLogin } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    // In production, use Google OAuth. Here we simulate with demo creds for preview.
    setLoading(true);
    try {
      toast.error('Configure VITE_GOOGLE_CLIENT_ID to enable Google login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-300 shadow-sm"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      {loading ? 'Connecting...' : 'Continue with Google'}
    </button>
  );
}
