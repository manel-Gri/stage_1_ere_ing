const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getDocuments,
  deleteDocument,
  downloadDocument,
  getStats,
  rechercherDocuments,
} = require('../controllers/documentController');
const protect = require('../middlewares/authMiddle');
const upload = require('../config/multerConfig');

// Toutes les routes sont protégées (utilisateur connecté requis)
router.post('/', protect, upload.single('document'), uploadDocument);
router.get('/', protect, getDocuments);
router.get('/stats', protect, getStats);
router.get('/recherche', protect, rechercherDocuments);
router.delete('/:id', protect, deleteDocument);
router.get('/:id/download', protect, downloadDocument);

module.exports = router;