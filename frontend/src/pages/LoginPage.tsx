import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [doLogin, { loading, error }] = useMutation<{
    login: { accessToken: string; adminName: string };
  }>(LOGIN);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await doLogin({ variables: { input: form } });
    if (data) {
      login(data.login.accessToken, data.login.adminName);
      navigate('/admin');
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>管理者ログイン</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            メールアドレス
            <input
              style={styles.input}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />
          </label>
          <label style={styles.label}>
            パスワード
            <input
              style={styles.input}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
              autoComplete="current-password"
            />
          </label>
          {error && <p style={styles.error}>メールアドレスまたはパスワードが違います。</p>}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    padding: '2rem',
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
  },
  title: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', color: '#111827', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: '600', fontSize: '0.9rem', color: '#374151' },
  input: {
    padding: '0.6rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  error: { color: '#dc2626', fontSize: '0.875rem' },
  btn: {
    background: '#1d4ed8',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
};
