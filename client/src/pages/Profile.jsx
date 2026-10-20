import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Field from '../components/Field.jsx';
import { errorMessage } from '../api.js';
import { bmiCategory, calculateBmi, numberOrUndefined } from '../utils.js';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    age: user.age ?? '',
    height: user.height ?? '',
    weight: user.weight ?? '',
    goal: user.goal || 'maintain',
  });
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => {
    setNotice('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      await updateProfile({
        name: form.name.trim(),
        age: form.age === '' ? '' : Number(form.age),
        height: form.height === '' ? '' : Number(form.height),
        weight: form.weight === '' ? '' : Number(form.weight),
        goal: form.goal,
      });
      setNotice('Profile saved.');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const bmi = calculateBmi(numberOrUndefined(form.weight), numberOrUndefined(form.height));

  return (
    <div className="card form-card wide">
      <h1>Your profile</h1>
      <p className="muted">Signed in as {user.email}</p>
      {notice && <p className="alert success" role="status">{notice}</p>}
      {error && <p className="alert error" role="alert">{error}</p>}
      <form onSubmit={submit}>
        <Field label="Full name">
          <input name="name" value={form.name} onChange={change} maxLength={60} required />
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
        <p className="muted small">
          {bmi ? `With these numbers your BMI is ${bmi} (${bmiCategory(bmi)}).` : 'Enter your height and weight to see your BMI.'}
        </p>
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</button>
      </form>
    </div>
  );
}
