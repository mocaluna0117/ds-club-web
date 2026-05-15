import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { GET_POST } from '../graphql/queries';

interface Post {
  id: number;
  title: string;
  content: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  author: { name: string };
}

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<{ post: Post }>(GET_POST, {
    variables: { id: Number(id) },
  });

  if (loading) return <div style={styles.center}>読み込み中...</div>;
  if (error) return <div style={styles.center}>記事が見つかりませんでした。</div>;

  const post = data!.post;

  return (
    <main style={styles.main}>
      <Link to="/blog" style={styles.back}>← ブログ一覧へ</Link>
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} style={styles.cover} />
      )}
      <h1 style={styles.title}>{post.title}</h1>
      <div style={styles.meta}>
        <span>{post.author.name}</span>
        <span>{new Date(post.createdAt).toLocaleDateString('ja-JP')}</span>
      </div>
      <div
        style={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
      />
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: { maxWidth: '760px', margin: '0 auto', padding: '3rem 2rem' },
  center: { textAlign: 'center', padding: '4rem', color: '#6b7280' },
  back: { color: '#1d4ed8', textDecoration: 'none', fontSize: '0.9rem', display: 'block', marginBottom: '1.5rem' },
  cover: { width: '100%', borderRadius: '12px', marginBottom: '2rem', maxHeight: '400px', objectFit: 'cover' },
  title: { fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '0.75rem' },
  meta: { display: 'flex', gap: '1rem', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '2rem' },
  content: { lineHeight: '1.8', color: '#374151', fontSize: '1rem' },
};
