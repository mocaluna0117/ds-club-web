import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { adminName, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>DS Club</Link>
      <div style={styles.links}>
        <NavLink to="/" end style={navStyle}>ホーム</NavLink>
        <NavLink to="/members" style={navStyle}>メンバー</NavLink>
        <NavLink to="/blog" style={navStyle}>ブログ</NavLink>
        <NavLink to="/contact" style={navStyle}>お問い合わせ</NavLink>
        {adminName ? (
          <>
            <NavLink to="/admin" style={navStyle}>管理</NavLink>
            <button onClick={logout} style={styles.logoutBtn}>ログアウト</button>
          </>
        ) : (
          <NavLink to="/login" style={navStyle}>管理者ログイン</NavLink>
        )}
      </div>
    </nav>
  );
}

const navStyle = ({ isActive }: { isActive: boolean }) => ({
  ...styles.link,
  fontWeight: isActive ? '700' : '400',
  color: isActive ? '#2563eb' : '#374151',
});

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    background: '#fff',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#1d4ed8',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '0.25rem 0.75rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#6b7280',
  },
};
