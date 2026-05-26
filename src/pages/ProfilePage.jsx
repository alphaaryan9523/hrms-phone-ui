import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { employeeApi } from '../api/employeeApi.js';
import { getApiErrorMessage } from '../api/axiosClient.js';
import AppCard from '../components/AppCard.jsx';
import AppHeader from '../components/AppHeader.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import AppButton from '../components/AppButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate } from '../utils/formatDate.js';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [employee, setEmployee] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    employeeApi.me()
      .then(setEmployee)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const rows = [
    ['Employee code', employee?.employee_code || employee?.code],
    ['Email', employee?.email],
    ['Phone', employee?.phone || employee?.mobile],
    ['Branch', employee?.branch?.name || employee?.branch],
    ['Department', employee?.department?.name || employee?.department],
    ['Designation', employee?.designation?.name || employee?.designation],
    ['Joining date', formatDate(employee?.joining_date || employee?.date_joined)],
    ['Manager', employee?.manager?.name || employee?.manager]
  ];

  return (
    <>
      <AppHeader title="My Profile" action={<Link className="icon-button" to="/settings" aria-label="Settings"><Settings size={21} /></Link>} />
      {loading ? <LoadingSpinner /> : null}
      {error ? <p className="alert alert--error">{error}</p> : null}
      <AppCard className="profile-hero">
        <div className="avatar">{(employee?.name || employee?.first_name || 'E').charAt(0)}</div>
        <h2>{employee?.name || `${employee?.first_name || ''} ${employee?.last_name || ''}`.trim() || 'Employee'}</h2>
        <p>{employee?.designation?.name || employee?.designation || 'Team member'}</p>
      </AppCard>
      <AppCard>
        {rows.map(([label, value]) => (
          <div className="detail-row" key={label}>
            <span>{label}</span>
            <strong>{value || '-'}</strong>
          </div>
        ))}
      </AppCard>
      <AppCard>
        <AppButton variant="danger" onClick={logout}>Logout</AppButton>
      </AppCard>
    </>
  );
}
