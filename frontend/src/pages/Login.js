import React, { useState } from 'react';
import { login, register } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ nom: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = isRegister ? await register(form) : await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
      navigate('/reservations');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isRegister ? 'Créer un compte' : 'Connexion'}
        </h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <input name="nom" placeholder="Nom complet"
              value={form.nom} onChange={handleChange}
              required style={styles.input} />
          )}
          <input name="email" type="email" placeholder="Email"
            value={form.email} onChange={handleChange}
            required style={styles.input} />
          <input name="password" type="password" placeholder="Mot de passe"
            value={form.password} onChange={handleChange}
            required style={styles.input} />
          <button type="submit" style={styles.button}>
            {isRegister ? "S'inscrire" : 'Se connecter'}
          </button>
        </form>
        <p style={styles.toggle}>
          {isRegister ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}
          <span style={styles.link} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Se connecter' : "S'inscrire"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '80vh',
  },
  card: {
    backgroundColor: 'white', padding: '2rem',
    borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%', maxWidth: '400px',
  },
  title: { textAlign: 'center', color: '#1a56db', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: {
    padding: '0.75rem', borderRadius: '6px',
    border: '1px solid #cbd5e1', fontSize: '0.95rem',
  },
  button: {
    padding: '0.75rem', backgroundColor: '#1a56db',
    color: 'white', border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
  },
  error: { color: '#dc2626', textAlign: 'center' },
  toggle: { textAlign: 'center', marginTop: '1rem', color: '#475569' },
  link: { color: '#1a56db', cursor: 'pointer', fontWeight: 'bold' },
};

export default Login;