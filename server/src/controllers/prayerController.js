const mongoose = require('mongoose');
const DailyPrayerLog = require('../models/PrayerLog');

// Helper to compute daily summary from prayers array
const calculateDaySummary = (prayers) => {
  let totalWaktsPrayed = 0;
  let totalWaktsMissed = 0;
  let totalFardRakatsPrayed = 0;
  let totalFardRakatsMissed = 0;
  let totalSunnatRakatsPrayed = 0;
  let totalSunnatRakatsMissed = 0;

  prayers.forEach((p) => {
    if (p.status === 'prayed' || p.status === 'qaza_completed') {
      totalWaktsPrayed += 1;
    } else if (p.status === 'missed') {
      totalWaktsMissed += 1;
    }

    if (p.fard) {
      totalFardRakatsPrayed += p.fard.performed || 0;
      totalFardRakatsMissed += p.fard.missed || 0;
    }
    if (p.sunnat) {
      totalSunnatRakatsPrayed += p.sunnat.performed || 0;
      totalSunnatRakatsMissed += p.sunnat.missed || 0;
    }
  });

  return {
    totalWaktsPrayed,
    totalWaktsMissed,
    totalFardRakatsPrayed,
    totalFardRakatsMissed,
    totalSunnatRakatsPrayed,
    totalSunnatRakatsMissed
  };
};

// @desc    Save or update daily prayer log
// @route   POST /api/prayers/daily
const saveDailyLog = async (req, res) => {
  try {
    const { date, prayers } = req.body;
    if (!date || !prayers || !Array.isArray(prayers)) {
      return res.status(400).json({ success: false, message: 'Invalid payload: date and prayers array required' });
    }

    const dateParts = date.split('-'); // YYYY-MM-DD
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const day = parseInt(dateParts[2], 10);

    const summary = calculateDaySummary(prayers);

    const log = await DailyPrayerLog.findOneAndUpdate(
      { userId: req.user._id, date },
      {
        userId: req.user._id,
        date,
        year,
        month,
        day,
        prayers,
        summary
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get daily prayer log for a specific date
// @route   GET /api/prayers/daily/:date
const getDailyLog = async (req, res) => {
  try {
    const { date } = req.params;
    const log = await DailyPrayerLog.findOne({ userId: req.user._id, date });

    if (!log) {
      return res.json({ success: true, data: null, message: 'No log found for this date' });
    }

    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get yearly summary analytics
// @route   GET /api/prayers/yearly/:year
const getYearlyStats = async (req, res) => {
  try {
    const year = parseInt(req.params.year || new Date().getFullYear(), 10);
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // 1. Overall Aggregation for the year
    const yearlyAggregation = await DailyPrayerLog.aggregate([
      { $match: { userId, year } },
      {
        $group: {
          _id: '$year',
          totalDaysRecorded: { $sum: 1 },
          totalWaktsPrayed: { $sum: '$summary.totalWaktsPrayed' },
          totalWaktsMissed: { $sum: '$summary.totalWaktsMissed' },
          totalFardRakatsPrayed: { $sum: '$summary.totalFardRakatsPrayed' },
          totalFardRakatsMissed: { $sum: '$summary.totalFardRakatsMissed' },
          totalSunnatRakatsPrayed: { $sum: '$summary.totalSunnatRakatsPrayed' },
          totalSunnatRakatsMissed: { $sum: '$summary.totalSunnatRakatsMissed' }
        }
      }
    ]);

    // 2. Prayer-wise breakdown (Fajr, Dhuhr, Asr, Maghrib, Isha)
    const prayerBreakdown = await DailyPrayerLog.aggregate([
      { $match: { userId, year } },
      { $unwind: '$prayers' },
      {
        $group: {
          _id: '$prayers.name',
          prayedCount: {
            $sum: {
              $cond: [{ $in: ['$prayers.status', ['prayed', 'qaza_completed']] }, 1, 0]
            }
          },
          missedCount: {
            $sum: {
              $cond: [{ $eq: ['$prayers.status', 'missed'] }, 1, 0]
            }
          },
          fardPerformed: { $sum: '$prayers.fard.performed' },
          fardMissed: { $sum: '$prayers.fard.missed' },
          sunnatPerformed: { $sum: '$prayers.sunnat.performed' },
          sunnatMissed: { $sum: '$prayers.sunnat.missed' }
        }
      }
    ]);

    // 3. Monthly trends (Jan - Dec)
    const monthlyTrends = await DailyPrayerLog.aggregate([
      { $match: { userId, year } },
      {
        $group: {
          _id: '$month',
          waktsPrayed: { $sum: '$summary.totalWaktsPrayed' },
          waktsMissed: { $sum: '$summary.totalWaktsMissed' },
          fardPrayed: { $sum: '$summary.totalFardRakatsPrayed' },
          fardMissed: { $sum: '$summary.totalFardRakatsMissed' },
          sunnatMissed: { $sum: '$summary.totalSunnatRakatsMissed' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const summary = yearlyAggregation[0] || {
      _id: year,
      totalDaysRecorded: 0,
      totalWaktsPrayed: 0,
      totalWaktsMissed: 0,
      totalFardRakatsPrayed: 0,
      totalFardRakatsMissed: 0,
      totalSunnatRakatsPrayed: 0,
      totalSunnatRakatsMissed: 0
    };

    res.json({
      success: true,
      data: {
        year,
        summary,
        prayerBreakdown,
        monthlyTrends
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Batch sync offline prayer logs
// @route   POST /api/prayers/batch-sync
const batchSyncLogs = async (req, res) => {
  try {
    const { logs } = req.body;
    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({ success: false, message: 'Logs array is required' });
    }

    const bulkOps = logs.map((log) => {
      const dateParts = log.date.split('-');
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      const day = parseInt(dateParts[2], 10);
      const summary = calculateDaySummary(log.prayers || []);

      return {
        updateOne: {
          filter: { userId: req.user._id, date: log.date },
          update: {
            $set: {
              userId: req.user._id,
              date: log.date,
              year,
              month,
              day,
              prayers: log.prayers,
              summary
            }
          },
          upsert: true
        }
      };
    });

    const result = await DailyPrayerLog.bulkWrite(bulkOps);
    res.json({ success: true, message: 'Batch sync complete', result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  saveDailyLog,
  getDailyLog,
  getYearlyStats,
  batchSyncLogs
};
