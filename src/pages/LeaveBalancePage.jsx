import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { leaveApi } from '../api/leaveApi.js';
import { getApiErrorMessage } from '../api/axiosClient.js';
import AppButton from '../components/AppButton.jsx';
import AppCard from '../components/AppCard.jsx';
import AppHeader from '../components/AppHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { normalizeList } from '../utils/statusMapper.js';

export default function LeaveBalancePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function loadBalance() {
    setLoading(true);
    setError('');
    leaveApi.getLeaveBalance()
      .then((data) => setItems(normalizeList(data)))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadBalance();
  }, []);

  return (
    <>
      <AppHeader title="Leave Balance" back />
      <div className="tab-links">
        <Link to="/leave">Requests</Link>
        <Link to="/leave/balance" className="active">Balance</Link>
      </div>
      {loading ? <LoadingSpinner /> : null}
      {error ? <p className="alert alert--error">{error}</p> : null}
      {error ? <AppButton variant="secondary" onClick={loadBalance}>Retry</AppButton> : null}
      {!loading && !error && !items.length ? <EmptyState title="No balance found" message="Leave balances will appear after HR configures leave policies." /> : null}
      <div className="balance-grid">
        {items.map((item) => (
          <AppCard key={item.id || item.leave_type || item.type}>
            <p className="eyebrow">{item.leave_type || item.type}</p>
            <strong className="balance-number">{item.remaining ?? item.balance ?? 0}</strong>
            <div className="mini-stats">
              <span>Total <strong>{item.total ?? 0}</strong></span>
              <span>Used <strong>{item.used ?? 0}</strong></span>
              <span>Remaining <strong>{item.remaining ?? item.balance ?? 0}</strong></span>
            </div>
          </AppCard>
        ))}
      </div>
    </>
  );
}
