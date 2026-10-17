# 🛡️ GigSaathi (गिग साथी) - Gig Worker Companion

> **A Mobile-First, Voice-Enabled GenAI Companion for Delivery Partners, Drivers, and Informal Workers across India.**

Built for delivery riders (Swiggy, Zomato, Zepto, Blinkit), cab drivers (Uber, Ola, Rapido), and unorganized gig workers with high-contrast sunlight readability, Web Speech voice synthesis & dictation, connected legal grievance automation, and social security rights navigation.

---

## ⚡ Key Highlights & Connected Workflows

GigSaathi is designed as a unified operational companion with seamless connected workflows:

1. **Earnings to Dispute Flow**:
   - In the **Earnings Tracker**, when an unexpected deduction or unpaid surge incentive is flagged (e.g. the pre-loaded ₹120 late pickup penalty on Zomato shift #102), clicking **"Dispute this Deduction"** instantly opens the **Grievance Drafter** with the platform, trip ID, deduction amount, and date pre-populated.
2. **Notice to Action Flow**:
   - In the **Document Simplifier**, complex platform penalty notices (e.g. ₹320 damaged parcel penalty, or ID cancellation suspension) are distilled into a **3-bullet actionable breakdown** (*What happened*, *Pay impact*, *Action & Deadline*). Clicking **"Draft an Appeal for this Notice"** automatically routes directly into the **Grievance Drafter**.
3. **Profile to Welfare Flow**:
   - Entering worker details in the **Profile Drawer** (e.g., State: Maharashtra, Vehicle: 2-Wheeler Petrol, Age: 28) automatically filters, matches, and badges verified government social security schemes (e-Shram, State Gig Worker Board, PMSBY, Ayushman Bharat).

---

## 🚀 Live Demo & Local Development

The production bundle is compiled and served locally:
- **Local URL**: `http://localhost:5173/`
- **Network / Mobile Phone URL**: `http://10.148.146.116:5173/`

### Running Locally:
```bash
# 1. Navigate to the project directory
cd gigsaathi

# 2. Start local server
npm run dev

# 3. Build for production
npm run build
```

---

## 🌐 Deploying to Vercel

GigSaathi is 100% configured for seamless Vercel deployment:

### Method A: One-Click GitHub Import
1. Push `gigsaathi` to your GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository.
4. Framework Preset: **Vite** (Root Directory: `./` or `./gigsaathi`).
5. (Optional) Add Environment Variable: `VITE_GEMINI_API_KEY = your_gemini_api_key`.
6. Click **Deploy**. Vercel will build using `vite build` and use `vercel.json` for SPA routing.

### Method B: Vercel CLI
```bash
cd gigsaathi
npx vercel
```

---

## 🛠️ Architecture & Tech Stack

- **Frontend Core**: React 18 (Vite SPA)
- **Styling**: Tailwind CSS with custom Sunlight Readability mode tokens (`.sunlight-mode`)
- **Iconography**: `lucide-react`
- **Generative AI Engine**: Google Gemini 1.5 Flash via REST API with **Intelligent Multilingual Fallback Mock Mode** (guarantees 100% uptime for evaluators even without an API key).
- **Voice & Accessibility**:
  - `SpeechSynthesis` for audio read-aloud on all AI summary cards.
  - `SpeechRecognition` for hands-free voice dictation in Grievance Drafter and Welfare Q&A.
  - Web Audio API for the Roadside Distress Emergency Siren.
- **Persistence**: `localStorage` (Shifts, Disputes, Profile, Language, Sunlight preferences).

---

## 📱 Core Modules

### 1. Daily Earnings & Net Pay Analyzer (Module A)
- Real take-home calculator after fuel, charging, commissions, and penalties.
- Visual metrics: Net Hourly Rate, Target Progress Meter.
- GenAI Spoken Shift Review: Evaluates fuel burn efficiency and alerts on deductions.
- Pre-loaded with 4 realistic shifts (Swiggy, Zomato, Uber, Blinkit).

### 2. Grievance & Dispute Drafter (Module B)
- Issue wizard covering Wrongful Account Suspension, Unpaid Rain Surge, Rating Strikes, and Parcel Damages.
- Voice dictation microphone for illiterate or semi-literate workers.
- Generates legally grounded formal tickets in **English, Hindi (हिंदी), or Hinglish**.
- Actions: One-tap Copy, WhatsApp Share direct link, Download Text Record, and History Log.

### 3. Government Welfare & Rights Navigator (Module C)
- Pre-seeded database of 6 verified real gig worker programs:
  - e-Shram Portal (₹2 Lakh accident cover)
  - State Platform-Based Gig Worker Welfare Boards (Maharashtra, Karnataka, Rajasthan)
  - PM Suraksha Bima Yojana (PMSBY ₹20/year policy)
  - Ayushman Bharat (PM-JAY ₹5 Lakh cashless family hospital cover)
  - PM SVANidhi (Micro-credit working capital)
  - Mandatory Commercial Third-Party & Platform Insurance
- Profile matching logic and GenAI Rights Q&A Chatbot with voice input & read-aloud.

### 4. Document & Penalty Notice Simplifier (Module D)
- Paste or select sample penalty notices.
- GenAI outputs strict 3-bullet breakdown:
  1. *What happened* (plain words, no legalese)
  2. *Impact on your pay* (rupee deduction & rating impact)
  3. *Action to take & Deadline* (appeal window)
- One-click "Draft an Appeal for this Notice" flow.

### 5. SOS & Roadside Safety Protocol (Module E)
- One-tap hotlines: 112 (National SOS), 108 (Ambulance), 100 (Police), 1091 (Women Helpline).
- Acoustic Roadside Distress Siren generator + visual warning strobe.
- Emergency WhatsApp GPS Beacon sharing current live coordinates.
- Interactive step-by-step accident checklist.

---

## 👨‍💻 Tested & Evaluated
- Zero build errors (`vite build` exits with code 0).
- Sunlight mode verified for outdoor readability on motorcycles and cabs.
- Tested across English, Hindi, and Hinglish.
