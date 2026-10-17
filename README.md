# 🕌 Prayer Reminder & Tracker App (নামাজ রিমাইন্ডার ও ট্র্যাকার)

React Native (Expo), NativeWind (Tailwind CSS), Adhan Engine, এবং Node.js + Express + MongoDB দিয়ে তৈরি একটি প্রিমিয়াম ইসলামিক মোবাইল অ্যাপ ও ব্যাকএন্ড সিস্টেম।

---

## 🌟 ক্লায়েন্টের সকল রিকয়ারমেন্টস যেভাবে পূরণ করা হয়েছে:

1. **লোকেশন অনুযায়ী অ্যালার্ম ও আজান (Location-based Prayer Times):**
   * কোনো এক্সটার্নাল এপিআই ছাড়া ওপেন-সোর্স `adhan` লাইব্রেরি দিয়ে জিপিএস কোঅর্ডিনেট ব্যবহার করে সেকেন্ডের মধ্যে নির্ভুল ওয়াক্ত হিসাব হয় (১০০% অফলাইনে চলে)।
2. **দৈনিক ট্র্যাকিং (Everyday Tracker):**
   * আজকের ৫ ওয়াক্তের চেকলিস্ট ও রাকাত কাউন্টার।
3. **বাৎসরিক ও মাসিক হিসাব (Yearly Analytics):**
   * পুরো বছরে কত ওয়াক্ত নামাজ পড়া হয়েছে এবং কত ওয়াক্ত কাজা বা বাদ গেছে তার পাই-চার্ট, প্রোগ্রেস বার এবং গিটহাব স্টাইল অ্যাক্টিভিটি হিটম্যাপ।
4. **ফরজ নামাজ কয় রাকাত পড়েছি (Faraj Rakat Counter):**
   * প্রতিটি ওয়াক্তের ফরজ নামাজের বিস্তারিত হিসাব (যেমন: ৪/৪ পড়েছি অথবা বাদ গেছে)।
5. **সুন্নত নামাজ কয় রাকাত বাদ দিয়েছি (Sunnat Rakat Counter):**
   * সুন্নতে মোয়াক্কাদা ও নফল নামাজের আলাদা হিসাব ও স্টেপার কন্ট্রোল।
6. **ফোনে অ্যালার্ম ও ৫ মিনিট স্নুজ (Alarm & 5-min Snooze):**
   * প্রতিটি নামাজের ওয়াক্তে অডিও অ্যালার্ম এবং সরাসরি নোটিফিকেশনে "Prayed", "Snooze 5 Min", ও "Dismiss" ইন্টারঅ্যাক্টিভ বাটন।

---

## 🚀 অতিরিক্ত প্রিমিয়াম ফিচারসমূহ (Extra Features Included):

* **ক্বাযা ট্র্যাকার (Qaza Manager):** জীবনের বাদ পড়া ফরজ ও বিতর নামাজের হিসাব রাখা এবং আদায়ের সাথে সাথে কাউন্টার কমানোর সুবিধা।
* **ক্বিবলা কম্পাস (Qibla Compass):** পবিত্র কাবা শরীফের দিকে নিখুঁত ডিগ্রি ও ডিরেকশন।
* **ডিজিটাল তাসবীহ (Digital Tasbih):** ভাইব্রেশন ও হ্যাপটিক ফিডব্যাক সহ সুবহানাল্লাহ, আলহামদুলিল্লাহ, আল্লাহু আকবার ও ইস্তিগফার কাউন্টার।
* **লুক্সুরি ইসলামিক UI:** এমারেল্ড গ্রিন, ইসলামিক গোল্ড ও মিডনাইট ব্লু থিম এবং প্রিমিয়াম আর্টওয়ার্ক।
* **MongoDB ক্লাউড ব্যাকআপ:** অফলাইনে ডেটা জমিয়ে রেখে ইন্টারনেট পেলে ব্যাকগ্রাউন্ডে ক্লাউডে সিঙ্ক করার সুবিধা।

---

## 📁 প্রজেক্ট স্ট্রাকচার:

```text
Prayer Reminder App/
├── client/                     # Expo React Native মোবাইল অ্যাপ
│   ├── assets/images/          # প্রিমিয়াম মসজিদ ব্যানার ও কাবার আর্টওয়ার্ক
│   ├── src/
│   │   ├── components/         # HeroNextPrayer, DailyPrayerCard, RakatModal, YearlyStatsCard, QazaManager, QiblaCompass, TasbihCounter
│   │   ├── services/           # prayerTimeService (Adhan), notificationService (Expo Notifications + Snooze), apiService
│   │   ├── store/              # Zustand + AsyncStorage offline-first store
│   │   └── theme/              # Luxury Islamic color palette
│   └── App.tsx                 # মেইন ৫-ট্যাব নেভিগেশন স্ক্রিন
└── server/                     # Node.js + Express + MongoDB ব্যাকএন্ড
    ├── src/
    │   ├── config/             # MongoDB connection
    │   ├── models/             # User, DailyPrayerLog, QazaLog
    │   ├── controllers/        # auth, prayer (yearly aggregation), qaza
    │   └── routes/             # REST API routes
    └── package.json
```

---

## 🛠️ রান করার নিয়ম (How to Run):

### ১. মোবাইল অ্যাপ চালানো:
```bash
cd client
npm start
```
* **অ্যান্ড্রয়েড ফোনে দেখতে:** ফোনে `Expo Go` অ্যাপ নামিয়ে কিউআর কোড স্ক্যান করুন, অথবা টার্মিনালে `a` চাপুন (অ্যান্ড্রয়েড এমুলেটর থাকলে)।
* **ওয়েব ব্রাউজারে দেখতে:** টার্মিনালে `w` চাপুন।

### ২. ব্যাকএন্ড সার্ভার চালানো:
```bash
cd server
npm start
```
* সার্ভার ডিফল্টভাবে `http://localhost:5000`-এ চালু হবে।
# Prayer-Reminder-App
