import { useState } from 'react';
import Field from './Field.jsx';
import { errorMessage } from '../api.js';
import { todayInput, toDateInput } from '../utils.js';

const EXERCISES = ['Push-ups', 'Squats', 'Pull-ups', 'Lunges', 'Burpees', 'Plank', 'Jumping Jacks', 'Running', 'Cycling', 'Skipping'];

const emptyForm = () => ({ exercise: '', sets: '', reps: '', duration: '', calories: '', date: todayInput() });

const fromWorkout = (w) => ({
  exercise: w.exercise,
  sets: String(w.sets),
  reps: String(w.reps),
  duration: String(w.duration),
  calories: String(w.calories),
  date: toDateInput(w.date),
});

// Used for both adding and editing. onSubmit receives the cleaned data and may throw.
export default function WorkoutForm({ initial, submitLabel, onSubmit, resetOnSuccess = false }) {
  const [form, setForm] = useState(initial ? fromWorkout(initial) : emptyForm());
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSubmit({
        exercise: form.exercise.trim(),
        sets: Number(form.sets),
        reps: Number(form.reps),
        duration: Number(form.duration),
        calories: Number(form.calories),
        date: form.date,
      });
      if (resetOnSuccess) setForm(emptyForm());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit}>
      {error && <p className="alert error" role="alert">{error}</p>}
      <Field label="Exercise">
        <input name="exercise" list="exercise-options" value={form.exercise} onChange={change} maxLength={80} required />
        <datalist id="exercise-options">
          {EXERCISES.map((name) => <option key={name} value={name} />)}
        </datalist>
      </Field>
      <div className="row">
        <Field label="Sets">
          <input name="sets" type="number" min="1" value={form.sets} onChange={change} required />
        </Field>
        <Field label="Reps">
          <input name="reps" type="number" min="1" value={form.reps} onChange={change} required />
        </Field>
      </div>
      <div className="row">
        <Field label="Duration (minutes)">
          <input name="duration" type="number" min="1" value={form.duration} onChange={change} required />
        </Field>
        <Field label="Calories burned">
          <input name="calories" type="number" min="0" value={form.calories} onChange={change} required />
        </Field>
      </div>
      <Field label="Date">
        <input name="date" type="date" value={form.date} onChange={change} required />
      </Field>
      <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving…' : submitLabel}</button>
    </form>
  );
}
