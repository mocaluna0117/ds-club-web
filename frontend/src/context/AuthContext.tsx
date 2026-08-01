import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  UNAUTHENTICATED_EVENT,
  clearAuth,
  readAdminName,
  readToken,
  saveAuth,
} from '../lib/authToken';

interface AuthContextType {
  token: string | null;
  adminName: string | null;
  login: (token: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // readToken() は期限切れのトークンを破棄して null を返すので、
  // 期限切れの状態で管理画面を開いてしまうことがない
  const [token, setToken] = useState<string | null>(() => readToken());
  const [adminName, setAdminName] = useState<string | null>(() =>
    readToken() ? readAdminName() : null,
  );

  // サーバーに認証を拒否されたらログイン状態を捨てる。
  // 管理画面は token が無ければ /login へリダイレクトするので、そのまま案内される
  useEffect(() => {
    const handleUnauthenticated = () => {
      clearAuth();
      setToken(null);
      setAdminName(null);
    };
    window.addEventListener(UNAUTHENTICATED_EVENT, handleUnauthenticated);
    return () => window.removeEventListener(UNAUTHENTICATED_EVENT, handleUnauthenticated);
  }, []);

  const login = (newToken: string, name: string) => {
    saveAuth(newToken, name);
    setToken(newToken);
    setAdminName(name);
  };

  const logout = () => {
    clearAuth();
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
