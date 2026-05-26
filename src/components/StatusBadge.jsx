export default function StatusBadge({ status = 'unknown' }) {
  const label = String(status || 'unknown').replace(/_/g, ' ');
  const normalized = label.toLowerCase().replace(/\s+/g, '-');
  return <span className={`status-badge status-badge--${normalized}`}>{label}</span>;
}
