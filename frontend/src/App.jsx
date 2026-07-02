import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import { FullPageLoader } from "./components/Loader";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/expenses": "Expenses",
  "/reports": "Reports",
  "/settings": "Settings",
};

function AuthGate({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  return children;
}

function LayoutWithTitle() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "ExpensePro";

  return <AppLayout title={title} />;
}

function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Landing />
  );
}

function LoginRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Login />
  );
}

function RegisterRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Register />
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/register" element={<RegisterRoute />} />

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

          <Toaster position="top-right" />
        </CurrencyProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}