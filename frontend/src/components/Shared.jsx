export function StatusBadge({ status }) {
  if (!status) return null;
  return (
    <span className={`badge badge-${status.toLowerCase()}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export function LoadingSpinner({ text }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
      <p>{text || 'Loading...'}</p>
    </div>
  );
}

export function ErrorBox({ message }) {
  return (
    <div style={{
      background: 'rgba(224,90,58,0.1)',
      border: '1px solid rgba(224,90,58,0.3)',
      borderRadius: 10, padding: 16,
      color: 'var(--red)', fontSize: 14,
    }}>
      ⚠️ {message}
    </div>
  );
}