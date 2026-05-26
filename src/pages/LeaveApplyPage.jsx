import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveApi } from '../api/leaveApi.js';
import { getApiErrorMessage } from '../api/axiosClient.js';
import AppButton from '../components/AppButton.jsx';
import AppCard from '../components/AppCard.jsx';
import AppHeader from '../components/AppHeader.jsx';
import AppInput from '../components/AppInput.jsx';

export default function LeaveApplyPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ leave_type: '', from_date: '', to_date: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function validateForm() {
    if (!form.leave_type || !form.from_date || !form.to_date || !form.reason.trim()) {
      return 'Please fill leave type, dates, and reason.';
    }
    if (form.to_date < form.from_date) {
      return 'To date cannot be before from date.';
    }
    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await leaveApi.applyLeave(form);
      await leaveApi.getMyLeaves();
      navigate('/leave', { replace: true, state: { success: 'Leave request submitted successfully.' } });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AppHeader title="Apply Leave" back />
      <AppCard>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Leave type</span>
            <select className="input" value={form.leave_type} onChange={(event) => setForm((next) => ({ ...next, leave_type: event.target.value }))} required>
              <option value="">Select leave type</option>
              <option value="CASUAL">Casual</option>
              <option value="SICK">Sick</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </label>
          <AppInput label="From date" type="date" value={form.from_date} onChange={(event) => setForm((next) => ({ ...next, from_date: event.target.value }))} required />
          <AppInput label="To date" type="date" value={form.to_date} onChange={(event) => setForm((next) => ({ ...next, to_date: event.target.value }))} required />
          <label className="field">
            <span>Reason</span>
            <textarea className="input textarea" value={form.reason} onChange={(event) => setForm((next) => ({ ...next, reason: event.target.value }))} required />
          </label>
          {error ? <p className="alert alert--error">{error}</p> : null}
          <AppButton type="submit" loading={loading}>Submit request</AppButton>
        </form>
      </AppCard>
    </>
  );
}
