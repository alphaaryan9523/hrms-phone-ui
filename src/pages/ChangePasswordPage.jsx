import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi.js';
import { getApiErrorMessage } from '../api/axiosClient.js';
import AppButton from '../components/AppButton.jsx';
import AppCard from '../components/AppCard.jsx';
import AppHeader from '../components/AppHeader.jsx';
import AppInput from '../components/AppInput.jsx';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.old_password || !form.new_password || !form.confirm_password) {
      setError('Please fill all password fields.');
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword({
        old_password: form.old_password,
        new_password: form.new_password,
        confirm_password: form.confirm_password
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AppHeader title="Change Password" />
      <AppCard>
        <form className="form-stack" onSubmit={handleSubmit}>
          <AppInput
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={form.old_password}
            onChange={(event) => setForm((next) => ({ ...next, old_password: event.target.value }))}
            required
          />
          <AppInput
            label="New password"
            type="password"
            autoComplete="new-password"
            value={form.new_password}
            onChange={(event) => setForm((next) => ({ ...next, new_password: event.target.value }))}
            required
          />
          <AppInput
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            value={form.confirm_password}
            onChange={(event) => setForm((next) => ({ ...next, confirm_password: event.target.value }))}
            required
          />
          {error ? <p className="alert alert--error">{error}</p> : null}
          <AppButton type="submit" loading={loading}>Update Password</AppButton>
        </form>
      </AppCard>
    </>
  );
}
