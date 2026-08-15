const express = require('express');
const router = express.Router();
const { poserQuestion, getHistorique } = require('../controllers/chatController');
const protect = require('../middlewares/authMiddle');

router.post('/', protect, poserQuestion);
router.get('/historique', protect, getHistorique);

module.exports = router;