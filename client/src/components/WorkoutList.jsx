import { Link } from 'react-router-dom';
import { formatDate } from '../utils.js';

// Shows workouts in a table. Pass onDelete to also show the Edit and Delete actions.
export default function WorkoutList({ workouts, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Sets × reps</th>
            <th>Duration</th>
            <th>Calories</th>
            <th>Date</th>
            {onDelete && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {workouts.map((w) => (
            <tr key={w._id}>
              <td className="strong">{w.exercise}</td>
              <td>{w.sets} × {w.reps}</td>
              <td>{w.duration} min</td>
              <td>{w.calories} kcal</td>
              <td>{formatDate(w.date)}</td>
              {onDelete && (
                <td className="actions">
                  <Link to={`/edit-workout/${w._id}`}>Edit</Link>
                  <button type="button" className="link-button danger" onClick={() => onDelete(w)}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
