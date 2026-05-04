# Omni Tracker — Frontend Dashboard

React dashboard สำหรับ Omni Tracker API

## วิธีรัน

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. รัน development server
npm start
# → เปิดที่ http://localhost:3000
```

> ต้องรัน Django backend ที่ `http://localhost:8000` ก่อน

## Features
- 🌡️ Card แสดงอุณหภูมิล่าสุด Bangkok
- 💱 Card แสดง USD/THB ล่าสุด
- 📈 Chart อุณหภูมิย้อนหลัง
- 📈 Chart USD/THB ย้อนหลัง
- 🔄 Auto-refresh ทุก 1 / 5 / 15 นาที
- 🌙 Dark / Light theme toggle

## Folder Structure
```
src/
├── hooks/
│   └── useOmniData.js   ← fetch + state logic
├── components/
│   ├── StatCard.jsx      ← card แสดงค่าล่าสุด
│   └── ChartCard.jsx     ← area chart wrapper
└── App.jsx               ← main dashboard layout
```
