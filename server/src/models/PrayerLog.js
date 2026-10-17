const mongoose = require('mongoose');

const singlePrayerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'],
      required: true
    },
    // status: 'prayed', 'missed', 'qaza_completed', 'pending'
    status: {
      type: String,
      enum: ['prayed', 'missed', 'qaza_completed', 'pending'],
      default: 'pending'
    },
    scheduledTime: {
      type: String // e.g. "05:15 AM"
    },
    completedAt: {
      type: Date
    },
    // Faraj (Fard) Rakats breakdown
    fard: {
      total: { type: Number, default: 0 }, // e.g. 2 for Fajr, 4 for Dhuhr
      performed: { type: Number, default: 0 },
      missed: { type: Number, default: 0 }
    },
    // Sunnat (Muakkadah & Ghair Muakkadah) Rakats breakdown
    sunnat: {
      total: { type: Number, default: 0 }, // e.g. 2 for Fajr, 4+2 for Dhuhr
      performed: { type: Number, default: 0 },
      missed: { type: Number, default: 0 }
    },
    // Witr / Nafl / Tahajjud
    witrNafl: {
      witrPerformed: { type: Number, default: 0 },
      witrMissed: { type: Number, default: 0 },
      naflPerformed: { type: Number, default: 0 }
    },
    // In Jama'ah (congregration at mosque) or Alone
    withJamaah: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const dailyPrayerLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true
    },
    year: {
      type: Number, // e.g. 2026
      required: true
    },
    month: {
      type: Number, // 1 - 12
      required: true
    },
    day: {
      type: Number, // 1 - 31
      required: true
    },
    prayers: [singlePrayerSchema],
    // Quick summary for this day
    summary: {
      totalWaktsPrayed: { type: Number, default: 0 },
      totalWaktsMissed: { type: Number, default: 0 },
      totalFardRakatsPrayed: { type: Number, default: 0 },
      totalFardRakatsMissed: { type: Number, default: 0 },
      totalSunnatRakatsPrayed: { type: Number, default: 0 },
      totalSunnatRakatsMissed: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

// Compound index for fast queries: by user & date, or user & year
dailyPrayerLogSchema.index({ userId: 1, date: 1 }, { unique: true });
dailyPrayerLogSchema.index({ userId: 1, year: 1 });
dailyPrayerLogSchema.index({ userId: 1, year: 1, month: 1 });

module.exports = mongoose.model('DailyPrayerLog', dailyPrayerLogSchema);
