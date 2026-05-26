import { useEffect, useState } from 'react';
import { attendanceApi } from '../api/attendanceApi.js';
import { getApiErrorMessage } from '../api/axiosClient.js';
import AppCard from '../components/AppCard.jsx';
import AppHeader from '../components/AppHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatDate, formatTime } from '../utils/formatDate.js';
import { normalizeList } from '../utils/statusMapper.js';

export default function AttendanceHistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    attendanceApi.getMyAttendance()
      .then((data) => setItems(normalizeList(data)))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AppHeader title="Attendance History" back />
      {loading ? <LoadingSpinner /> : null}
      {error ? <p className="alert alert--error">{error}</p> : null}
      {!loading && !items.length ? <EmptyState title="No attendance records yet." /> : null}
      {items.map((item) => (
        <AppCard key={item.id || item.date}>
          <div className="card-heading">
            <h2>{formatDate(item.date)}</h2>
            <StatusBadge status={item.status || 'Present'} />
          </div>
          <div className="time-row">
            <span>In: {formatTime(item.clock_in)}</span>
            <span>Out: {formatTime(item.clock_out)}</span>
          </div>
          <div className="time-row">
            <span>Total hours</span>
            <strong>{item.total_hours || '-'}</strong>
          </div>
        </AppCard>
      ))}
    </>
  );
}
