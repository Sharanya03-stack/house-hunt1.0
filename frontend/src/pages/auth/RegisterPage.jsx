import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Home, Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const roles = [
  {
    value: 'seeker',
    label: 'Property Seeker',
    desc: 'Looking for a home to rent or buy',
    icon: '🔍',
  },
  {
    value: 'owner',
    label: 'Property Owner',
    desc: 'I want to list my property',
    icon: '🏠',
  },
];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seeker', phone: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email) errs.email = 'Email is required';
    if (!form.password || form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    return errs;
  };

  const strengthLevel = () => {
    const p = form.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const result = await register(form);
      // If auto-logged in (email disabled), redirect to dashboard
      if (result.data?.accessToken) {
        toast.success(`Welcome to HouseHunt, ${form.name.split(' ')[0]}! 🎉`);
        navigate(form.role === 'owner' ? '/dashboard' : '/properties');
      } else {
        toast.success('Account created! Please check your email to verify.');
        navigate('/login');
      }
    } catch (error) {
      if (error.response?.data?.setup_required) {
        toast.error('⚠️ Database not set up. Run schema.sql in Supabase first.', { duration: 6000 });
      } else {
        toast.error(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = strengthLevel();
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-accent-900/90 via-primary-900/70 to-primary-800/80" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">HouseHunt</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Join India's Largest<br />Property Community
            </h2>
            <p className="text-white/70 text-lg max-w-sm">
              Connect with verified owners, explore premium listings, and find your perfect home.
            </p>
            <div className="mt-8 space-y-3">
              {['Zero brokerage fee', 'Verified property listings', '24/7 customer support', 'Secure transactions'].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/80 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-8 bg-white dark:bg-gray-950 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">HouseHunt</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create your account</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Start exploring properties for free</p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setForm({ ...form, role: role.value })}
                className={`p-3 rounded-xl border-2 text-left transition-all duration-200
                  ${form.role === role.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                <span className="text-xl">{role.icon}</span>
                <p className={`font-semibold text-sm mt-1 ${form.role === role.value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                  {role.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{role.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="input-label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="John Doe" className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`} />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="input-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="input-label">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" className="input-field pl-10" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder="Min. 8 characters" className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-gray-200 dark:bg-gray-700'}`} />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${strength >= 3 ? 'text-green-600' : strength >= 2 ? 'text-yellow-600' : 'text-red-500'}`}>
                    {strengthLabels[strength]} password
                  </p>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">Terms</Link> and{' '}
              <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</Link>.
            </p>

            <button type="submit" disabled={loading} className="btn-primary w-full group">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
