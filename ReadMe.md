<div align="center">

<img src="./icon/icon.svg" alt="KlazAssist" width="96" height="96">

# KlazAssist

**Simplify Teaching. Empower Learning.**

An offline-first classroom management toolkit built for Filipino teachers.

[![Version](https://img.shields.io/badge/version-2.0.0-0038A8?style=flat-square)](https://github.com/pydjian/klazassist)
[![License](https://img.shields.io/badge/license-Proprietary-F7C948?style=flat-square)](#-license)
[![Platform](https://img.shields.io/badge/platform-Web-0891B2?style=flat-square)](#-browser-support)
[![Offline](https://img.shields.io/badge/offline-first-198754?style=flat-square)](#-privacy--security)

</div>

---

## 📖 What is KlazAssist?

KlazAssist is a **single-file, offline-first classroom management toolkit** designed for teachers in the Philippine Department of Education (DepEd). It runs entirely in the browser, stores all data locally on the device, and works with **no internet connection required**.

It brings together the day-to-day tools a teacher needs — attendance, grading, learner records, seating plans, lesson planning, official DepEd forms, and AI-assisted content generation — into one private, fast, and reliable workspace.

> **KlazAssist is not an official DepEd system** unless officially authorized. It is a teacher's personal productivity tool.

---

## ✨ Features

### 🎓 My Class
- **Learner management** — full SF1-aligned profile (LRN, address, family, guardian, learning modality, medical notes, photo)
- **Class profile dashboard** — attendance trends, grade distribution, health score, KPI cards
- **Seating arrangement** — drag-and-drop chair grid, group tables, orientation toggle, blocked seats
- **Saved groupings** — reusable group sets for lab work, projects, reading circles
- **Class schedule** — weekly timetable with custom time slots

### ✅ Attendance
- **Daily attendance** with Present / Absent / Late / Excused status
- **Bulk marking** — Mark All Present / Absent in one click
- **Floating Save button** with unsaved-changes indicator
- **Attendance history** and per-day views
- **Analytics** — status distribution, per-learner rates, trend sparklines
- **Printable reports** — CSV, JSON, and formatted printouts

### 📊 Grading & Assessment
- **Gradebook** — sheet-style layout with sticky headers, category tints, adjustable column widths
- **Term Summary Sheet** — multi-subject grid with auto-computed MAPEH, average, and rank
- **Assessment Builder** — multiple choice, true/false, identification, short answer
- **Quiz Manager** — with learner-facing presenter view and countdown timer
- **Item Analysis** — difficulty index per question
- **Class Performance** — score distribution, mean, median, highest, lowest
- **Grade Summary** — per-subject view and GWA view across all subjects
- **Two grading policies supported:**
  - DepEd Order No. 015, s. 2026 (three-term, WW/PT/EX, adjusted transmutation)
  - DepEd Order No. 8, s. 2015 (legacy quarterly, preserved for historical classes)

### 🤖 AI Tools (Gemini-powered)
- **Lesson Planner** — generates weekly ILAW matrix lesson plans unpacked across sessions
- **TOS & Exam Generator** — builds a Table of Specifications and full exam with answer key
- **PowerPoint Generator** — converts lesson plans into classroom-ready slide decks with images
- **Bring your own API key** — your key is stored locally and never transmitted to any KlazAssist server

### 📋 Official DepEd Forms
- **SF1** — School Register (`.xlsx` and PDF export, males-first ordering, auto totals)
- **SF2** — Daily Attendance Report
- **SF9** — Learner's Performance Report Card (A5 back-to-back or A4 landscape)

### 📚 Documents & Reports
- Class List, Masterlist, Learner Profile cards
- Grade Summary, Printable Reports hub, Export Center
- **Full JSON backup and restore** with account hint file

### 🧰 Teaching Tools
- Random Student Picker (with presenter view)
- Timer & Stopwatch
- Randomizer (numbers, dice, coins, yes/no)
- Wheel of Names (with auto-remove, recitation timer, sound alerts)
- Noise Meter (mic-driven bouncy balls or classic meter)
- Classroom Signal (silent / quiet / normal / discussion / group work)

### 🗓️ Planning
- Weekly Planner (Mon–Sat grid)
- Calendar (with DepEd School Calendar import)
- Lesson Planner (manual + AI)
- Teaching Load with per-period notifications

### 🔐 Security & Privacy
- **Local application lock** — PBKDF2-SHA256 with adaptive iterations
- **Recovery key** for password reset (no email required)
- **Auto-lock** after configurable inactivity
- **Session warnings** before auto-lock
- **Activity log** for security auditing
- **Optional**: Web3Forms and Telegram for outgoing reports

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript (compiled by Vite) |
| Build tool | Vite |
| Runtime | Vanilla ES modules — no framework |
| Storage | IndexedDB (`DepEdTeacherToolkitDB` v7) |
| Cryptography | Web Crypto API (PBKDF2-SHA256, Ed25519) |
| PDF parsing | PDF.js (CDN) |
| `.xlsx` parsing | Custom ZIP + DecompressionStream reader, SheetJS fallback |
| `.xlsx` writing | Custom OOXML generator (no dependencies) |
| Slides | PptxGenJS (CDN) |
| AI | Google Gemini API (`generativelanguage.googleapis.com`) |
| Images | Gemini image models → Pollinations → Kavel (fallback chain) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** or **pnpm**
- A modern browser (see [Browser Support](#-browser-support))

### Install & run locally

```bash
# Clone the repository
git clone https://github.com/pydjian/klazassist.git
cd klazassist

# Install dependencies
npm install

# Start the dev server
npm run dev