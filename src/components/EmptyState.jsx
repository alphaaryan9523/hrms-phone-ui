export default function EmptyState({ title = 'No records found', message, action }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      {message ? <p>{message}</p> : null}
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  );
}
