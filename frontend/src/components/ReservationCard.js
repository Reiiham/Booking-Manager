import React from 'react';
import { deleteReservation, updateReservation } from '../services/api';

function ReservationCard({ reservation, onRefresh }) {
  const { id, nom, service, date, heure, statut } = reservation;

  const handleDelete = async () => {
    if (window.confirm(`Supprimer la réservation de ${nom} ?`)) {
      await deleteReservation(id);
      onRefresh();
    }
  };

  const handleToggleStatut = async () => {
    const newStatut = statut === 'confirmé' ? 'annulé' : 'confirmé';
    await updateReservation(id, { nom, service, date, heure, statut: newStatut });
    onRefresh();
  };

  const statutColor = statut === 'confirmé' ? '#16a34a' : '#dc2626';

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h4 style={styles.nom}>{nom}</h4>
        <span style={{ ...styles.statut, backgroundColor: statutColor }}>
          {statut}
        </span>
      </div>
      <p style={styles.info}>🧖 {service}</p>
      <p style={styles.info}>📅 {new Date(date).toLocaleDateString('fr-FR')}</p>
      <p style={styles.info}>🕐 {heure}</p>
      <div style={styles.actions}>
        <button onClick={handleToggleStatut} style={styles.btnToggle}>
          {statut === 'confirmé' ? 'Annuler' : 'Confirmer'}
        </button>
        <button onClick={handleDelete} style={styles.btnDelete}>
          Supprimer
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    borderLeft: '4px solid #1a56db',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  nom: { margin: 0, color: '#1e293b' },
  statut: {
    padding: '0.2rem 0.6rem', borderRadius: '999px',
    color: 'white', fontSize: '0.8rem', fontWeight: 'bold',
  },
  info: { margin: '0.3rem 0', color: '#475569', fontSize: '0.9rem' },
  actions: { display: 'flex', gap: '0.5rem', marginTop: '0.75rem' },
  btnToggle: {
    flex: 1, padding: '0.4rem', backgroundColor: '#e2e8f0',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold',
  },
  btnDelete: {
    flex: 1, padding: '0.4rem', backgroundColor: '#fee2e2',
    color: '#dc2626', border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontWeight: 'bold',
  },
};

export default ReservationCard;