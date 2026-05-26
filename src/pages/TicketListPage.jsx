import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ticketApi } from '../api/ticketApi.js';
import { getApiErrorMessage } from '../api/axiosClient.js';
import AppButton from '../components/AppButton.jsx';
import AppCard from '../components/AppCard.jsx';
import AppHeader from '../components/AppHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatDate } from '../utils/formatDate.js';
import { normalizeList } from '../utils/statusMapper.js';

export default function TicketListPage() {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.success || '');

  function loadTickets() {
    setLoading(true);
    setError('');
    ticketApi.getMyTickets()
      .then((data) => setItems(normalizeList(data)))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <>
      <AppHeader title="Tickets" action={<Link className="icon-button" to="/tickets/create" aria-label="Create ticket"><Plus size={21} /></Link>} />
      {loading ? <LoadingSpinner /> : null}
      {success ? <p className="alert alert--success">{success}</p> : null}
      {error ? <p className="alert alert--error">{error}</p> : null}
      {error ? <AppButton variant="secondary" onClick={loadTickets}>Retry</AppButton> : null}
      {!loading && !error && !items.length ? <EmptyState title="No tickets" message="Create a ticket when you need HR support." /> : null}
      {items.map((item) => (
        <AppCard key={item.id}>
          <div className="card-heading">
            <h2>{item.subject}</h2>
            <StatusBadge status={String(item.status || 'OPEN').toUpperCase()} />
          </div>
          <div className="ticket-meta">
            <span>{String(item.category || 'OTHER').toUpperCase()}</span>
            <span>{String(item.priority || 'MEDIUM').toUpperCase()}</span>
            <span>{formatDate(item.created_at || item.created_date || item.date)}</span>
          </div>
          {item.description ? <p>{item.description}</p> : null}
        </AppCard>
      ))}
    </>
  );
}
