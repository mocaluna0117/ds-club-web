export function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© {new Date().getFullYear()} DS Club. All rights reserved.</p>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    padding: '2rem',
    textAlign: 'center',
    borderTop: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  text: {
    color: '#9ca3af',
    fontSize: '0.875rem',
  },
};
