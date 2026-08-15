const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword } = require('../controllers/authContro');
const protect = require('../middlewares/authMiddle');

// Route publique : inscription
router.post('/register', register);

// Route publique : connexion
router.post('/login', login);

// Route protégée : profil de l'utilisateur connecté
router.get('/me', protect, getProfile);
router.put('/modif', protect, updateProfile);
router.put('/changePassword', protect, changePassword);

module.exports = router;