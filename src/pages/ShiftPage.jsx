import { useEffect, useState } from 'react';
import { shiftApi } from '../api/shiftApi.js';
import { getApiErrorMessage } from '../api/axiosClient.js';
import AppCard from '../components/AppCard.jsx';
import AppHeader from '../components/AppHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatDate } from '../utils/formatDate.js';
import { normalizeList } from '../utils/statusMapper.js';

export default function ShiftPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    shiftApi.getMyShifts()
      .then((data) => setItems(normalizeList(data)))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AppHeader title="My Shifts" back />
      {loading ? <LoadingSpinner /> : null}
      {error ? <p className="alert alert--error">{error}</p> : null}
      {!loading && !items.length ? <EmptyState title="No shifts assigned" /> : null}
      {items.map((item) => (
        <AppCard key={item.id || item.date}>
          <div className="card-heading">
            <h2>{item.name || item.shift_name || 'Shift'}</h2>
            <span>{formatDate(item.date || item.start_date)}</span>
          </div>
          <div className="time-row">
            <span>{item.start_time || '-'}</span>
            <span>{item.end_time || '-'}</span>
          </div>
          <div className="detail-row">
            <span>Grace period</span>
            <strong>{item.grace_period || item.grace_minutes || '-'}</strong>
          </div>
          <div className="detail-row">
            <span>Weekly off</span>
            <strong>{item.weekly_off || item.week_off || '-'}</strong>
          </div>
        </AppCard>
      ))}
    </>
  );
}
