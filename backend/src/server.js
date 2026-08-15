const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const authRoutes = require('./routes/authRoute');
const documentRoutes = require('./routes/documentRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Middlewares de base
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Agent IA Documentaire — en ligne' });
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connexion MongoDB Atlas réussie'))
  .catch((err) => console.error('❌ Erreur de connexion MongoDB :', err));

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});