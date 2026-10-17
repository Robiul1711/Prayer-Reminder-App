const mongoose = require('mongoose');

const qazaLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    counts: {
      fajr: { type: Number, default: 0 },
      dhuhr: { type: Number, default: 0 },
      asr: { type: Number, default: 0 },
      maghrib: { type: Number, default: 0 },
      isha: { type: Number, default: 0 },
      witr: { type: Number, default: 0 }
    },
    totalCompleted: {
      type: Number,
      default: 0
    },
    history: [
      {
        prayerName: String,
        action: { type: String, enum: ['added', 'completed'] },
        count: Number,
        date: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('QazaLog', qazaLogSchema);
