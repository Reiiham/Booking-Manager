const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// POST — public (client crée une réservation)
router.post('/', async (req, res) => {
  const { nom, service, date, heure } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reservations (nom, service, date, heure) VALUES ($1, $2, $3, $4) RETURNING *',
      [nom, service, date, heure]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — admin seulement
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM reservations ORDER BY date, heure'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT — admin seulement
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nom, service, date, heure, statut } = req.body;
  try {
    const result = await pool.query(
      'UPDATE reservations SET nom=$1, service=$2, date=$3, heure=$4, statut=$5 WHERE id=$6 RETURNING *',
      [nom, service, date, heure, statut, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — admin seulement
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM reservations WHERE id=$1', [id]);
    res.json({ message: 'Réservation supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;