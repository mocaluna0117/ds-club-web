import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdminPage() {
  const { token, adminName } = useAuth();
  if (!token) return <Navigate to="/login" replace />;

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>管理者ダッシュボード</h1>
      <p style={styles.welcome}>ようこそ、{adminName} さん</p>
      <div style={styles.cards}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>メンバー管理</h2>
          <p style={styles.cardDesc}>メンバーの追加・編集・削除</p>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>記事管理</h2>
          <p style={styles.cardDesc}>ブログ記事の作成・編集・公開</p>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>お問い合わせ</h2>
          <p style={styles.cardDesc}>受信したお問い合わせの確認</p>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: { maxWidth: '960px', margin: '0 auto', padding: '3rem 2rem' },
  title: { fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' },
  welcome: { color: '#6b7280', marginBottom: '2rem' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' },
  card: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1.5rem',
    cursor: 'pointer',
  },
  cardTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' },
  cardDesc: { color: '#6b7280', fontSize: '0.9rem' },
};
