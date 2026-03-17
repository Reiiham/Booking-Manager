import React, { useState } from 'react';
import { createReservation } from '../services/api';

const SERVICES = ['Massage', 'Soin visage', 'Manucure', 'Hammam', 'Yoga'];

function ReservationForm({ onAdded }) {
  const [form, setForm] = useState({
    nom: '', service: '', date: '', heure: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createReservation(form);
      setForm({ nom: '', service: '', date: '', heure: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onAdded();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h3>Nouvelle réservation</h3>
      {success && <p style={styles.success}>✅ Réservation ajoutée !</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="nom" placeholder="Nom du client"
          value={form.nom} onChange={handleChange}
          required style={styles.input}
        />
        <select
          name="service" value={form.service}
          onChange={handleChange} required style={styles.input}
        >
          <option value="">-- Choisir un service --</option>
          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          name="date" type="date"
          value={form.date} onChange={handleChange}
          required style={styles.input}
        />
        <input
          name="heure" type="time"
          value={form.heure} onChange={handleChange}
          required style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Envoi...' : 'Réserver'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: {
    padding: '0.6rem', borderRadius: '6px',
    border: '1px solid #cbd5e1', fontSize: '0.95rem',
  },
  button: {
    padding: '0.75rem', backgroundColor: '#1a56db',
    color: 'white', border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
  },
  success: { color: 'green', fontWeight: 'bold' },
};

export default ReservationForm;