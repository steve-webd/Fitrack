import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="container narrow">
      <div className="card form-card">
        <h1>Page not found</h1>
        <p className="muted">The page you opened doesn’t exist.</p>
        <Link className="btn" to="/dashboard">Go to dashboard</Link>
      </div>
    </main>
  );
}
