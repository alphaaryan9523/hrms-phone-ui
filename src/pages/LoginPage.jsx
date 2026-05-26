import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AppButton from '../components/AppButton.jsx';
import AppInput from '../components/AppInput.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiErrorMessage } from '../api/axiosClient.js';

export default function LoginPage() {
  const { login, isAuthenticated, tokenReady, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (tokenReady && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login({ identifier: form.identifier.trim(), password: form.password });
      if (result.mustChangePassword) {
        navigate('/change-password', { replace: true });
        return;
      }
      const target = location.state?.from?.pathname || '/dashboard';
      navigate(target, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <section className="login-panel">
        <div>
          <p className="eyebrow">HRMS Employee</p>
          <h1>Sign in</h1>
          <p className="muted">Use your username, employee code, or email.</p>
        </div>
        <form className="form-stack" onSubmit={handleSubmit}>
          <AppInput
            label="Username / Employee Code / Email"
            type="text"
            autoComplete="username"
            placeholder="Enter username, employee code, or email"
            value={form.identifier}
            onChange={(event) => setForm((next) => ({ ...next, identifier: event.target.value }))}
            required
          />
          <AppInput
            label="Password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(event) => setForm((next) => ({ ...next, password: event.target.value }))}
            required
          />
          {(error || authError) ? <p className="alert alert--error">{error || authError}</p> : null}
          <AppButton type="submit" loading={loading}>Login</AppButton>
        </form>
      </section>
    </main>
  );
}
