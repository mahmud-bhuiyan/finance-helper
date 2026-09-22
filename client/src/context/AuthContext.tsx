import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  canView: (moduleKey: string) => boolean;
  canEdit: (moduleKey: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api<{ user: User }>('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const data = await api<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  function canView(moduleKey: string) {
    if (!user) return false;
    if (user.isSuperAdmin) return true;
    return user.permissions?.some((p) => p.moduleKey === moduleKey && p.canView) ?? false;
  }

  function canEdit(moduleKey: string) {
    if (!user) return false;
    if (user.isSuperAdmin) return true;
    return user.permissions?.some((p) => p.moduleKey === moduleKey && p.canEdit) ?? false;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, canView, canEdit }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
