import { useQuery } from '@apollo/client';
import { GET_MEMBERS } from '../graphql/queries';

interface Member {
  id: number;
  name: string;
  role: string;
  grade: number;
  bio?: string;
  imageUrl?: string;
  github?: string;
  twitter?: string;
}

export function MembersPage() {
  const { data, loading, error } = useQuery<{ members: Member[] }>(GET_MEMBERS);

  if (loading) return <div style={styles.center}>読み込み中...</div>;
  if (error) return <div style={styles.center}>エラーが発生しました。</div>;

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>メンバー紹介</h1>
      <div style={styles.grid}>
        {data?.members.map((m) => (
          <div key={m.id} style={styles.card}>
            <div style={styles.avatar}>
              {m.imageUrl ? (
                <img src={m.imageUrl} alt={m.name} style={styles.img} />
              ) : (
                <div style={styles.avatarFallback}>{m.name[0]}</div>
              )}
            </div>
            <h2 style={styles.name}>{m.name}</h2>
            <p style={styles.role}>{m.role}</p>
            <p style={styles.grade}>{m.grade}回生</p>
            {m.bio && <p style={styles.bio}>{m.bio}</p>}
            <div style={styles.socials}>
              {m.github && (
                <a href={`https://github.com/${m.github}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                  GitHub
                </a>
              )}
              {m.twitter && (
                <a href={`https://twitter.com/${m.twitter}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                  Twitter
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: { maxWidth: '960px', margin: '0 auto', padding: '3rem 2rem' },
  title: { fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: '#111827' },
  center: { textAlign: 'center', padding: '4rem', color: '#6b7280' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    transition: 'box-shadow 0.2s',
  },
  avatar: { marginBottom: '1rem' },
  img: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' },
  avatarFallback: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#dbeafe',
    color: '#1d4ed8',
    fontSize: '2rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
  name: { fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem', color: '#111827' },
  role: { color: '#1d4ed8', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' },
  grade: { color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.75rem' },
  bio: { color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1rem' },
  socials: { display: 'flex', gap: '0.75rem', justifyContent: 'center' },
  socialLink: { color: '#1d4ed8', fontSize: '0.85rem', textDecoration: 'none' },
};
