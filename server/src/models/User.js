const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'Muslim Servant'
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    location: {
      city: { type: String, default: 'Dhaka' },
      country: { type: String, default: 'Bangladesh' },
      latitude: { type: Number, default: 23.8103 },
      longitude: { type: Number, default: 90.4125 },
      timezone: { type: String, default: 'Asia/Dhaka' }
    },
    preferences: {
      calculationMethod: {
        type: String,
        enum: ['Karachi', 'Islamic_Foundation_BD', 'MWL', 'ISNA', 'Egypt', 'Makkah'],
        default: 'Karachi'
      },
      madhab: {
        type: String,
        enum: ['Hanafi', 'Shafi'],
        default: 'Hanafi'
      },
      snoozeMinutes: {
        type: Number,
        default: 5
      },
      alarmSounds: {
        fajr: { type: String, default: 'makkah_fajr' },
        dhuhr: { type: String, default: 'madina' },
        asr: { type: String, default: 'makkah' },
        maghrib: { type: String, default: 'al_aqsa' },
        isha: { type: String, default: 'makkah' }
      },
      notificationsEnabled: {
        type: Boolean,
        default: true
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
