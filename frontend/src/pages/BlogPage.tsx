import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_POSTS } from '../graphql/queries';

interface Post {
  id: number;
  title: string;
  excerpt?: string;
  coverImage?: string;
  createdAt: string;
  author: { name: string };
}

export function BlogPage() {
  const { data, loading, error } = useQuery<{ posts: Post[] }>(GET_POSTS);

  if (loading) return <div style={styles.center}>読み込み中...</div>;
  if (error) return <div style={styles.center}>エラーが発生しました。</div>;

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>ブログ・活動記録</h1>
      <div style={styles.list}>
        {data?.posts.length === 0 && (
          <p style={styles.empty}>まだ記事がありません。</p>
        )}
        {data?.posts.map((post) => (
          <Link to={`/blog/${post.id}`} key={post.id} style={styles.card}>
            {post.coverImage && (
              <img src={post.coverImage} alt={post.title} style={styles.cover} />
            )}
            <div style={styles.body}>
              <h2 style={styles.postTitle}>{post.title}</h2>
              {post.excerpt && <p style={styles.excerpt}>{post.excerpt}</p>}
              <div style={styles.meta}>
                <span>{post.author.name}</span>
                <span>{new Date(post.createdAt).toLocaleDateString('ja-JP')}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: { maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' },
  title: { fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: '#111827' },
  center: { textAlign: 'center', padding: '4rem', color: '#6b7280' },
  empty: { textAlign: 'center', color: '#9ca3af', padding: '2rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  card: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'box-shadow 0.2s',
  },
  cover: { width: '100%', height: '200px', objectFit: 'cover' },
  body: { padding: '1.5rem' },
  postTitle: { fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111827' },
  excerpt: { color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' },
  meta: { display: 'flex', gap: '1rem', color: '#9ca3af', fontSize: '0.85rem' },
};
