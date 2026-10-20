import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import BmiGauge from '../components/BmiGauge.jsx';
import WorkoutList from '../components/WorkoutList.jsx';
import { GOAL_LABELS, bmiCategory, calculateBmi, formatMinutes } from '../utils.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/workouts')
      .then((res) => setWorkouts(res.data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const totals = useMemo(
    () => ({
      count: workouts.length,
      calories: workouts.reduce((sum, w) => sum + (w.calories || 0), 0),
      minutes: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
    }),
    [workouts]
  );

  const bmi = calculateBmi(user.weight, user.height);
  const category = bmi ? bmiCategory(bmi) : '';

  return (
    <>
      <h1>Hello, {user.name.split(' ')[0]}</h1>
      <p className="muted">Goal: {GOAL_LABELS[user.goal]}</p>

      {error && <p className="alert error" role="alert">{error}</p>}

      <section className="overview">
        <div className="card bmi-card">
          <h2>Body mass index</h2>
          {bmi ? (
            <>
              <p className="bmi-value">{bmi} <span>{category}</span></p>
              <BmiGauge bmi={bmi} category={category} />
              <p className="muted small">Based on {user.weight} kg at {user.height} cm.</p>
            </>
          ) : (
            <p className="muted">
              Add your height and weight on your <Link to="/profile">profile</Link> to see your BMI.
            </p>
          )}
        </div>

        <div className="card totals">
          <h2>Your progress</h2>
          <dl>
            <div><dt>Workouts logged</dt><dd>{totals.count}</dd></div>
            <div><dt>Calories burned</dt><dd>{totals.calories} <small>kcal</small></dd></div>
            <div><dt>Time trained</dt><dd>{formatMinutes(totals.minutes)}</dd></div>
          </dl>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Recent workouts</h2>
          {workouts.length > 0 && <Link to="/workouts">View all workouts</Link>}
        </div>
        {loading ? (
          <p className="muted">Loading your workouts…</p>
        ) : workouts.length === 0 ? (
          <p className="empty">
            You haven’t logged a workout yet. <Link to="/add-workout">Add your first workout</Link> and it will show up here.
          </p>
        ) : (
          <WorkoutList workouts={workouts.slice(0, 5)} />
        )}
      </section>
    </>
  );
}
