import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import { FullPageLoader } from './components/Loader';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/expenses': 'Expenses',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

function AuthGate({ children }) {
  const { loading } = useAuth();
  if (loading) return <FullPageLoader />;
  return children;
}

function LayoutWithTitle() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'ExpensePro';
  return <AppLayout title={title} />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<LayoutWithTitle />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthGate>
            <AppRoutes />
          </AuthGate>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(26, 11, 46, 0.9)',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
              },
              success: { iconTheme: { primary: '#34d8b5', secondary: '#0e0620' } },
              error: { iconTheme: { primary: '#fb7185', secondary: '#0e0620' } },
            }}
          />
        </CurrencyProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
