import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NAV_LINKS = [
  { to: '/', label: 'Scanner' },
  { to: '/scan-log', label: 'Scan Log' },
];

const NavBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <span className="navbar-brand">Serial Verifier</span>

      <button
        className="navbar-hamburger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle navigation"
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Desktop links */}
      <ul className="navbar-links desktop">
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            <NavLink to={to} end className={({ isActive }) => isActive ? 'active' : ''}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Mobile dropdown */}
      {open && (
        <>
          <div className="navbar-backdrop" onClick={() => setOpen(false)} />
          <ul className="navbar-links mobile">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </>
      )}
    </nav>
  );
};

export default NavBar;
