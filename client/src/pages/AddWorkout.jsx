import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import WorkoutForm from '../components/WorkoutForm.jsx';

export default function AddWorkout() {
  const [notice, setNotice] = useState('');

  const save = async (data) => {
    setNotice('');
    await api.post('/workouts', data);
    setNotice('Workout saved.');
  };

  return (
    <div className="card form-card wide">
      <h1>Add workout</h1>
      <p className="muted">Record what you did today. You can edit it later from your <Link to="/workouts">history</Link>.</p>
      {notice && <p className="alert success" role="status">{notice}</p>}
      <WorkoutForm submitLabel="Save workout" onSubmit={save} resetOnSuccess />
    </div>
  );
}
