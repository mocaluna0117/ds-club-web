import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_CONTACT } from '../graphql/queries';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sendContact, { loading, error }] = useMutation(SEND_CONTACT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendContact({ variables: { input: form } });
    setSent(true);
  };

  if (sent) {
    return (
      <main style={styles.main}>
        <div style={styles.success}>
          <p style={styles.successIcon}>✓</p>
          <h2>送信完了</h2>
          <p>お問い合わせを受け付けました。後ほどご連絡いたします。</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>お問い合わせ</h1>
      <p style={styles.desc}>DS Clubへのご質問・ご相談はこちらから</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          お名前
          <input
            style={styles.input}
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label style={styles.label}>
          メールアドレス
          <input
            style={styles.input}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label style={styles.label}>
          メッセージ
          <textarea
            style={{ ...styles.input, height: '140px', resize: 'vertical' }}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            minLength={10}
          />
        </label>
        {error && <p style={styles.error}>送信に失敗しました。もう一度お試しください。</p>}
        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? '送信中...' : '送信する'}
        </button>
      </form>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: { maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem' },
  title: { fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111827' },
  desc: { color: '#6b7280', marginBottom: '2rem' },
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
  success: { textAlign: 'center', padding: '4rem 2rem', color: '#374151' },
  successIcon: { fontSize: '4rem', color: '#16a34a' },
};
