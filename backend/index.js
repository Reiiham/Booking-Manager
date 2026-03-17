const express = require('express');
const cors = require('cors');
require('dotenv').config();

const reservationsRouter = require('./routes/reservations');
const authRouter = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/reservations', reservationsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Booking Manager API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});