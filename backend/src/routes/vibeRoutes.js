const express = require('express');
const router = express.Router();
const { generateVibe, getVibes } = require('../controllers/vibeController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, generateVibe);
router.get('/', protect, getVibes);

module.exports = router;
