const express = require('express');
const router = express.Router();
const { generateVibe, getVibes } = require('../controllers/vibeController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/generate', protect, generateVibe);
router.get('/history', protect, getVibes);

module.exports = router;
