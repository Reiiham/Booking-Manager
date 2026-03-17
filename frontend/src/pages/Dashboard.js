import React, { useEffect, useState } from 'react';
import ReservationCard from '../components/ReservationCard';
import { getReservations } from '../services/api';

function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState({ service: '', statut: '', date: '' });

  const fetchReservations = async () => {
    try {
      const res = await getReservations();
      setReservations(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchReservations(); }, []);

  const filtered = reservations.filter(r => {
    return (
      (filtre.service === '' || r.service === filtre.service) &&
      (filtre.statut === '' || r.statut === filtre.statut) &&
      (filtre.date === '' || r.date.startsWith(filtre.date))
    );
  });

  const stats = {
    total: reservations.length,
    confirme: reservations.filter(r => r.statut === 'confirmé').length,
    annule: reservations.filter(r => r.statut === 'annulé').length,
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🗂️ Dashboard Admin</h2>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={{ ...styles.statCard, borderColor: '#1a56db' }}>
          <p style={styles.statNum}>{stats.total}</p>
          <p style={styles.statLabel}>Total</p>
        </div>
        <div style={{ ...styles.statCard, borderColor: '#16a34a' }}>
          <p style={styles.statNum}>{stats.confirme}</p>
          <p style={styles.statLabel}>Confirmées</p>
        </div>
        <div style={{ ...styles.statCard, borderColor: '#dc2626' }}>
          <p style={styles.statNum}>{stats.annule}</p>
          <p style={styles.statLabel}>Annulées</p>
        </div>
      </div>

      {/* Filtres */}
      <div style={styles.filtres}>
        <select value={filtre.service}
          onChange={e => setFiltre({ ...filtre, service: e.target.value })}
          style={styles.select}>
          <option value="">Tous les services</option>
          {['Massage', 'Soin visage', 'Manucure', 'Hammam', 'Yoga'].map(s =>
            <option key={s} value={s}>{s}</option>
          )}
        </select>
        <select value={filtre.statut}
          onChange={e => setFiltre({ ...filtre, statut: e.target.value })}
          style={styles.select}>
          <option value="">Tous les statuts</option>
          <option value="confirmé">Confirmé</option>
          <option value="annulé">Annulé</option>
        </select>
        <input type="date" value={filtre.date}
          onChange={e => setFiltre({ ...filtre, date: e.target.value })}
          style={styles.select} />
        <button onClick={() => setFiltre({ service: '', statut: '', date: '' })}
          style={styles.btnReset}>
          Réinitialiser
        </button>
      </div>

      {/* Liste */}
      {loading ? (
        <p>Chargement...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>Aucune réservation trouvée.</p>
      ) : (
        <div style={styles.grid}>
          {filtered.map(r => (
            <ReservationCard key={r.id} reservation={r} onRefresh={fetchReservations} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  title: { color: '#1e293b', marginBottom: '1.5rem' },
  statsRow: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
  statCard: {
    flex: 1, backgroundColor: 'white', padding: '1.5rem',
    borderRadius: '10px', textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    borderTop: '4px solid',
  },
  statNum: { fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: '#1e293b' },
  statLabel: { color: '#475569', margin: '0.25rem 0 0' },
  filtres: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  select: {
    padding: '0.6rem', borderRadius: '6px',
    border: '1px solid #cbd5e1', fontSize: '0.9rem',
    backgroundColor: 'white',
  },
  btnReset: {
    padding: '0.6rem 1rem', backgroundColor: '#e2e8f0',
    border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontWeight: 'bold',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  },
};

export default Dashboard;