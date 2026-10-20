import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { errorMessage } from '../api.js';
import WorkoutList from '../components/WorkoutList.jsx';

export default function History() {
  const location = useLocation();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(location.state?.notice || '');

  useEffect(() => {
    api
      .get('/workouts')
      .then((res) => setWorkouts(res.data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (workout) => {
    if (!window.confirm(`Delete ${workout.exercise}? This cannot be undone.`)) return;
    setError('');
    try {
      await api.delete(`/workouts/${workout._id}`);
      setWorkouts((list) => list.filter((w) => w._id !== workout._id));
      setNotice('Workout deleted.');
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Workout history</h1>
          <p className="muted">{workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'} logged, newest first.</p>
        </div>
        <Link className="btn" to="/add-workout">Add workout</Link>
      </div>
      {notice && <p className="alert success" role="status">{notice}</p>}
      {error && <p className="alert error" role="alert">{error}</p>}
      <section className="card flush">
        {loading ? (
          <p className="muted pad">Loading your workouts…</p>
        ) : workouts.length === 0 ? (
          <p className="empty pad">Nothing here yet. <Link to="/add-workout">Log your first workout</Link> to start your history.</p>
        ) : (
          <WorkoutList workouts={workouts} onDelete={remove} />
        )}
      </section>
    </>
  );
}
