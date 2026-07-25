import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Public Pages
import LandingPage from './pages/LandingPage';
import PropertiesPage from './pages/properties/PropertiesPage';
import PropertyDetailPage from './pages/properties/PropertyDetailPage';

// Owner Dashboard
import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import AddPropertyPage from './pages/dashboard/AddPropertyPage';
import EditPropertyPage from './pages/dashboard/EditPropertyPage';
import OwnerListings from './pages/dashboard/OwnerListings';
import OwnerBookings from './pages/dashboard/OwnerBookings';
import OwnerProfile from './pages/dashboard/OwnerProfile';

// Seeker Pages
import SeekerFavorites from './pages/seeker/SeekerFavorites';
import SeekerBookings from './pages/seeker/SeekerBookings';
import SeekerProfile from './pages/seeker/SeekerProfile';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProperties from './pages/admin/AdminProperties';

// Guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';

function App() {
  const { initialize, isLoading } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.classList.toggle('dark', theme === 'dark');
    initialize();
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#fff',
            color: theme === 'dark' ? '#f9fafb' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* ── Public Routes ────────────────────────────────────── */}
        <Route element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />
        </Route>

        {/* ── Auth Routes ──────────────────────────────────────── */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />

        {/* ── Owner Dashboard ──────────────────────────────────── */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={['owner', 'admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OwnerDashboard />} />
          <Route path="add-property" element={<AddPropertyPage />} />
          <Route path="edit-property/:id" element={<EditPropertyPage />} />
          <Route path="listings" element={<OwnerListings />} />
          <Route path="bookings" element={<OwnerBookings />} />
          <Route path="profile" element={<OwnerProfile />} />
        </Route>

        {/* ── Seeker Routes ────────────────────────────────────── */}
        <Route
          path="my"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="favorites" element={<SeekerFavorites />} />
          <Route path="bookings" element={<SeekerBookings />} />
          <Route path="profile" element={<SeekerProfile />} />
        </Route>

        {/* ── Admin Panel ──────────────────────────────────────── */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="properties" element={<AdminProperties />} />
        </Route>

        {/* ── Fallback ─────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
