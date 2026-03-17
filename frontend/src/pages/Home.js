import React, { useState } from 'react';
import { createReservation } from '../services/api';

const SERVICES = ['Massage', 'Soin visage', 'Manucure', 'Hammam', 'Yoga'];

function Home() {
  const [form, setForm] = useState({ nom: '', service: '', date: '', heure: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createReservation(form);
      setForm({ nom: '', service: '', date: '', heure: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError('Erreur lors de la réservation, réessayez.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📅 Réserver un créneau</h1>
        <p style={styles.subtitle}>Remplissez le formulaire, nous confirmerons votre réservation.</p>

        {success && (
          <div style={styles.success}>
            ✅ Réservation envoyée ! Vous serez contacté pour confirmation.
          </div>
        )}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Nom complet</label>
          <input name="nom" placeholder="ex: Marie Dupont"
            value={form.nom} onChange={handleChange}
            required style={styles.input} />

          <label style={styles.label}>Service</label>
          <select name="service" value={form.service}
            onChange={handleChange} required style={styles.input}>
            <option value="">-- Choisir un service --</option>
            {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <label style={styles.label}>Date</label>
          <input name="date" type="date"
            value={form.date} onChange={handleChange}
            required style={styles.input} />

          <label style={styles.label}>Heure</label>
          <input name="heure" type="time"
            value={form.heure} onChange={handleChange}
            required style={styles.input} />

          <button type="submit" style={styles.button}>
            Envoyer ma réservation
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', minHeight: '85vh',
    padding: '2rem',
  },
  card: {
    backgroundColor: 'white', padding: '2.5rem',
    borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%', maxWidth: '480px',
  },
  title: { color: '#1a56db', marginBottom: '0.5rem' },
  subtitle: { color: '#475569', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontWeight: 'bold', color: '#1e293b', fontSize: '0.9rem' },
  input: {
    padding: '0.75rem', borderRadius: '6px',
    border: '1px solid #cbd5e1', fontSize: '0.95rem',
    marginBottom: '0.5rem',
  },
  button: {
    marginTop: '0.5rem', padding: '0.85rem',
    backgroundColor: '#1a56db', color: 'white',
    border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
  },
  success: {
    backgroundColor: '#dcfce7', color: '#16a34a',
    padding: '0.75rem', borderRadius: '8px',
    marginBottom: '1rem', fontWeight: 'bold',
  },
  error: {
    backgroundColor: '#fee2e2', color: '#dc2626',
    padding: '0.75rem', borderRadius: '8px',
    marginBottom: '1rem',
  },
};

export default Home;