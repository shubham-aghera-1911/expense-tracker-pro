import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('etp_token');
    if (!token) {
      setLoading(false);
      return;
    }
    const attempt = async (retriesLeft) => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.data.user);
      } catch (err) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          // Token is genuinely invalid/expired - clear it
          localStorage.removeItem('etp_token');
          localStorage.removeItem('etp_user');
          return;
        }
        if (retriesLeft > 0) {
          // No response likely means the backend is cold-starting (Render free tier).
          // Wait and retry instead of wiping a perfectly valid session.
          await new Promise((resolve) => setTimeout(resolve, 3000));
          return attempt(retriesLeft - 1);
        }
        // Network still failing after retries - keep the token, just show cached user
        // so the person isn't booted out; they'll get a fresh check next load.
        const cachedUser = localStorage.getItem('etp_user');
        if (cachedUser) {
          try { setUser(JSON.parse(cachedUser)); } catch { /* ignore parse error */ }
        }
      }
    };
    await attempt(3);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('etp_token', data.data.token);
    localStorage.setItem('etp_user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('etp_token', data.data.token);
    localStorage.setItem('etp_user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = () => {
    localStorage.removeItem('etp_token');
    localStorage.removeItem('etp_user');
    setUser(null);
  };

  const updateUser = (patch) => {
    setUser((prev) => {
      const updated = { ...prev, ...patch };
      localStorage.setItem('etp_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
