import { NavLink, Outlet } from 'react-router-dom';
import Brand from './Brand.jsx';

export default function PublicLayout() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Brand />
          <nav aria-label="Account">
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/register">Register</NavLink>
          </nav>
        </div>
      </header>
      <main className="container narrow">
        <Outlet />
      </main>
    </>
  );
}
