import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Brand from './Brand.jsx';

export default function Layout() {
  const { logout } = useAuth();
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Brand />
          <nav aria-label="Main">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/add-workout">Add workout</NavLink>
            <NavLink to="/workouts">History</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <button type="button" className="link-button" onClick={logout}>Log out</button>
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
