const express = require('express');
const router = express.Router();
const {
  saveDailyLog,
  getDailyLog,
  getYearlyStats,
  batchSyncLogs
} = require('../controllers/prayerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/daily', protect, saveDailyLog);
router.get('/daily/:date', protect, getDailyLog);
router.get('/yearly/:year', protect, getYearlyStats);
router.post('/batch-sync', protect, batchSyncLogs);

module.exports = router;
