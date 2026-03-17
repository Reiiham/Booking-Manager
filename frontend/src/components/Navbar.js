import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>📅 Booking Manager</h2>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Réservation</Link>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/calendar" style={styles.link}>Calendrier</Link>
            <span style={styles.userName}>👤 {user.nom}</span>
            <button onClick={handleLogout} style={styles.btnLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>Admin</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '1rem 2rem',
    backgroundColor: '#1a56db',
  },
  logo: { margin: 0, color: 'white' },
  links: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  link: { color: 'white', textDecoration: 'none', fontWeight: 'bold' },
  userName: { color: '#bfdbfe', fontSize: '0.9rem' },
  btnLogout: {
    padding: '0.4rem 0.9rem', backgroundColor: 'transparent',
    color: 'white', border: '1px solid white',
    borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold',
  },
};

export default Navbar;