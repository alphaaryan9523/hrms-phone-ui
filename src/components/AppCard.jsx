export default function AppCard({ children, className = '' }) {
  return <section className={`app-card ${className}`}>{children}</section>;
}
