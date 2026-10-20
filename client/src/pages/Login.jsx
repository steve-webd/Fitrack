import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Field from '../components/Field.jsx';
import { errorMessage } from '../api.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.status === 401 ? 'Email or password is incorrect.' : errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card form-card">
      <h1>Welcome back</h1>
      <p className="muted">Log in to see your workouts and progress.</p>
      <form onSubmit={submit}>
        {error && <p className="alert error" role="alert">{error}</p>}
        <Field label="Email">
          <input name="email" type="email" autoComplete="email" value={form.email} onChange={change} required />
        </Field>
        <Field label="Password">
          <input name="password" type="password" autoComplete="current-password" value={form.password} onChange={change} required />
        </Field>
        <button className="btn block" type="submit" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      </form>
      <p className="muted center-text">New to FitTrack? <Link to="/register">Create an account</Link></p>
    </div>
  );
}
