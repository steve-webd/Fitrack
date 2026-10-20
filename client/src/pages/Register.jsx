import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Field from '../components/Field.jsx';
import { errorMessage } from '../api.js';
import { numberOrUndefined } from '../utils.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', height: '', weight: '', goal: 'maintain' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        age: numberOrUndefined(form.age),
        height: numberOrUndefined(form.height),
        weight: numberOrUndefined(form.weight),
        goal: form.goal,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card form-card">
      <h1>Create your account</h1>
      <p className="muted">Your height and weight are used to work out your BMI.</p>
      <form onSubmit={submit}>
        {error && <p className="alert error" role="alert">{error}</p>}
        <Field label="Full name">
          <input name="name" autoComplete="name" value={form.name} onChange={change} maxLength={60} required />
        </Field>
        <Field label="Email">
          <input name="email" type="email" autoComplete="email" value={form.email} onChange={change} required />
        </Field>
        <Field label="Password" hint="At least 6 characters.">
          <input name="password" type="password" autoComplete="new-password" minLength={6} value={form.password} onChange={change} required />
        </Field>
        <div className="row three">
          <Field label="Age">
            <input name="age" type="number" min="5" max="120" value={form.age} onChange={change} />
          </Field>
          <Field label="Height (cm)">
            <input name="height" type="number" min="50" max="260" step="0.1" value={form.height} onChange={change} />
          </Field>
          <Field label="Weight (kg)">
            <input name="weight" type="number" min="20" max="400" step="0.1" value={form.weight} onChange={change} />
          </Field>
        </div>
        <Field label="Fitness goal">
          <select name="goal" value={form.goal} onChange={change}>
            <option value="lose">Lose weight</option>
            <option value="maintain">Maintain current weight</option>
            <option value="gain">Gain weight or muscle</option>
          </select>
        </Field>
        <button className="btn block" type="submit" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      </form>
      <p className="muted center-text">Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
