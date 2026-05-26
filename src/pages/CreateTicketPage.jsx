import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi.js';
import { getApiErrorMessage } from '../api/axiosClient.js';
import AppButton from '../components/AppButton.jsx';
import AppCard from '../components/AppCard.jsx';
import AppHeader from '../components/AppHeader.jsx';
import AppInput from '../components/AppInput.jsx';

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ category: '', subject: '', description: '', priority: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function validateForm() {
    if (!form.category || !form.priority || !form.subject.trim() || !form.description.trim()) {
      return 'Please fill category, priority, subject, and description.';
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
      await ticketApi.createTicket(form);
      navigate('/tickets', { replace: true, state: { success: 'Ticket created successfully.' } });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AppHeader title="Create Ticket" back />
      <AppCard>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Category</span>
            <select className="input" value={form.category} onChange={(event) => setForm((next) => ({ ...next, category: event.target.value }))} required>
              <option value="">Select category</option>
              <option value="HR">HR</option>
              <option value="PAYROLL">Payroll</option>
              <option value="ATTENDANCE">Attendance</option>
              <option value="LEAVE">Leave</option>
              <option value="IT">IT</option>
              <option value="DOCUMENT">Document</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
          <AppInput label="Subject" value={form.subject} onChange={(event) => setForm((next) => ({ ...next, subject: event.target.value }))} required />
          <label className="field">
            <span>Priority</span>
            <select className="input" value={form.priority} onChange={(event) => setForm((next) => ({ ...next, priority: event.target.value }))}>
              <option value="">Select priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </label>
          <label className="field">
            <span>Description</span>
            <textarea className="input textarea" value={form.description} onChange={(event) => setForm((next) => ({ ...next, description: event.target.value }))} required />
          </label>
          {error ? <p className="alert alert--error">{error}</p> : null}
          <AppButton type="submit" loading={loading}>Create ticket</AppButton>
        </form>
      </AppCard>
    </>
  );
}
