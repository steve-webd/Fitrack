import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api.js';
import WorkoutForm from '../components/WorkoutForm.jsx';

export default function EditWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/workouts')
      .then((res) => {
        const found = res.data.find((w) => w._id === id);
        if (found) setWorkout(found);
        else setError('That workout no longer exists.');
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  const save = async (data) => {
    await api.put(`/workouts/${id}`, data);
    navigate('/workouts', { state: { notice: 'Workout updated.' } });
  };

  return (
    <div className="card form-card wide">
      <h1>Edit workout</h1>
      {error && (
        <p className="alert error" role="alert">
          {error} <Link to="/workouts">Back to history</Link>
        </p>
      )}
      {workout && <WorkoutForm initial={workout} submitLabel="Save changes" onSubmit={save} />}
      {!workout && !error && <p className="muted">Loading workout…</p>}
    </div>
  );
}
