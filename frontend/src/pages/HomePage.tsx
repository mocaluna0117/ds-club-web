import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <main>
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>DS Club へようこそ</h1>
          <p style={styles.heroSub}>
            データサイエンスを学び、実践し、共に成長するコミュニティ
          </p>
          <div style={styles.heroActions}>
            <Link to="/members" style={styles.btnPrimary}>メンバーを見る</Link>
            <Link to="/blog" style={styles.btnSecondary}>ブログを読む</Link>
          </div>
        </div>
      </section>

      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>活動内容</h2>
        <div style={styles.cards}>
          {FEATURES.map((f) => (
            <div key={f.title} style={styles.card}>
              <div style={styles.cardIcon}>{f.icon}</div>
              <h3 style={styles.cardTitle}>{f.title}</h3>
              <p style={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const FEATURES = [
  { icon: '📊', title: 'データ分析', desc: '実データを使った分析プロジェクトを定期開催' },
  { icon: '🤖', title: '機械学習', desc: 'ML/DLの理論から実装まで勉強会で学習' },
  { icon: '🏆', title: 'コンペ参加', desc: 'Kaggle等のコンペにチームで挑戦' },
];

const styles: Record<string, React.CSSProperties> = {
  hero: {
    background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)',
    padding: '6rem 2rem',
    textAlign: 'center',
  },
  heroInner: { maxWidth: '640px', margin: '0 auto' },
  heroTitle: { fontSize: '3rem', fontWeight: '800', color: '#fff', marginBottom: '1rem' },
  heroSub: { fontSize: '1.2rem', color: '#bfdbfe', marginBottom: '2rem' },
  heroActions: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: {
    background: '#fff',
    color: '#1d4ed8',
    padding: '0.75rem 2rem',
    borderRadius: '9999px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1rem',
  },
  btnSecondary: {
    background: 'transparent',
    color: '#fff',
    padding: '0.75rem 2rem',
    borderRadius: '9999px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1rem',
    border: '2px solid rgba(255,255,255,0.5)',
  },
  features: { padding: '4rem 2rem', maxWidth: '960px', margin: '0 auto' },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '2.5rem',
    color: '#111827',
  },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' },
  card: {
    padding: '2rem',
    background: '#f9fafb',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    textAlign: 'center',
  },
  cardIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
  cardTitle: { fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111827' },
  cardDesc: { color: '#6b7280', lineHeight: '1.6' },
};
