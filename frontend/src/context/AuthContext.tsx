import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  adminName: string | null;
  login: (token: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('ds_club_token'),
  );
  const [adminName, setAdminName] = useState<string | null>(
    localStorage.getItem('ds_club_admin'),
  );

  const login = (newToken: string, name: string) => {
    localStorage.setItem('ds_club_token', newToken);
    localStorage.setItem('ds_club_admin', name);
    setToken(newToken);
    setAdminName(name);
  };

  const logout = () => {
    localStorage.removeItem('ds_club_token');
    localStorage.removeItem('ds_club_admin');
    setToken(null);
    setAdminName(null);
  };

  return (
    <AuthContext.Provider value={{ token, adminName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
