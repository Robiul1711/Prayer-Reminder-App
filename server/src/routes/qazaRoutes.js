const express = require('express');
const router = express.Router();
const { getQazaCounts, updateQazaCounts } = require('../controllers/qazaController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getQazaCounts);
router.put('/', protect, updateQazaCounts);

module.exports = router;
