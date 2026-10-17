// Storage service for shifts, disputes, notices, worker profile, and settings

const STORAGE_KEYS = {
  SHIFTS: 'gigsaathi_shifts_v1',
  DISPUTES: 'gigsaathi_disputes_v1',
  NOTICES: 'gigsaathi_notices_v1',
  PROFILE: 'gigsaathi_profile_v1',
  LANGUAGE: 'gigsaathi_lang_v1',
  SUNLIGHT: 'gigsaathi_sunlight_v1',
  API_KEY: 'gigsaathi_gemini_key_v1',
  ACTIVE_SHIFT: 'gigsaathi_active_shift_v1'
};

// 4 realistic pre-loaded shifts
const INITIAL_SHIFTS = [
  {
    id: 'shift-101',
    date: '2026-10-16',
    platform: 'Swiggy',
    grossEarnings: 1450,
    platformFee: 220,
    fuelCost: 280,
    tips: 90,
    incentives: 150,
    deductions: 0,
    hoursWorked: 6.5,
    kmDriven: 62,
    tripCount: 14,
    notes: 'Dinner rush around Indiranagar & Koramangala. High demand surge applied.',
    deductionReason: '',
    disputeStatus: 'none', // none, pending, resolved
    tripId: 'SWG-984210'
  },
  {
    id: 'shift-102',
    date: '2026-10-15',
    platform: 'Zomato',
    grossEarnings: 1180,
    platformFee: 190,
    fuelCost: 240,
    tips: 50,
    incentives: 0,
    deductions: 120, // Mystery deduction!
    hoursWorked: 5.5,
    kmDriven: 48,
    tripCount: 11,
    notes: 'Afternoon rain shift. Noticed unexpected ₹120 deduction titled "Late Pickup Penalty" even though restaurant delayed dispatch.',
    deductionReason: 'Unfair Late Pickup Penalty (Restaurant delay)',
    disputeStatus: 'can_dispute',
    tripId: 'ZOM-441928'
  },
  {
    id: 'shift-103',
    date: '2026-10-14',
    platform: 'Uber',
    grossEarnings: 3100,
    platformFee: 620,
    fuelCost: 750, // CNG
    tips: 140,
    incentives: 200,
    deductions: 0,
    hoursWorked: 9.0,
    kmDriven: 142,
    tripCount: 8,
    notes: 'Night airport runs. Good tolls & return fares. Heavy traffic on return leg.',
    deductionReason: '',
    disputeStatus: 'none',
    tripId: 'UBR-889102'
  },
  {
    id: 'shift-104',
    date: '2026-10-13',
    platform: 'Blinkit',
    grossEarnings: 920,
    platformFee: 140,
    fuelCost: 110, // EV battery swap
    tips: 40,
    incentives: 80,
    deductions: 0,
    hoursWorked: 5.0,
    kmDriven: 35,
    tripCount: 16,
    notes: 'Morning quick grocery slots. 2 battery swaps at Yulu station. Smooth deliveries.',
    deductionReason: '',
    disputeStatus: 'none',
    tripId: 'BLK-339182'
  }
];

// Realistic sample penalty notices
export const SAMPLE_NOTICES = [
  {
    id: 'notice-sample-1',
    title: 'Order #849201 Damaged Item Penalty (₹320)',
    platform: 'Swiggy',
    penaltyAmount: 320,
    date: '2026-10-16',
    rawText: `Dear Partner (ID: DL-88419),
We have received a customer escalation for Order #849201. The beverage package was reported spilled upon delivery. Under the Partner Code of Conduct Section 4.2 (Damaged Goods Handling), an operational recovery fee of ₹320 has been deducted from your weekly payout cycle ending 19th Oct.
If you believe this penalty was incorrectly levied due to restaurant packaging failure, you may file an appeal in the partner app within 48 hours of this notice. Failure to appeal within 48 hours will finalize this deduction.
- Operations Team`
  },
  {
    id: 'notice-sample-2',
    title: 'Platform ID Temporarily Blocked - High Cancellation Rate',
    platform: 'Uber',
    penaltyAmount: 0,
    date: '2026-10-15',
    rawText: `URGENT: Partner Account Alert - ID Block Notice
Partner ID: UBR-992104 | Driver: Ramesh Kumar
Your vehicle access to the rider dispatch network has been temporarily blocked for 48 hours effective 15-Oct 14:00.
Reason: Your driver-initiated cancellation rate over the last 7 days reached 14.8%, which exceeds the platform quality threshold of 8.0%.
To request an account review and appeal this suspension under special traffic/safety circumstances, submit your appeal documentation before 17-Oct 14:00 via the Partner Grievance Redressal desk.
- Partner Safety & Compliance Board`
  },
  {
    id: 'notice-sample-3',
    title: 'TDS & Platform Service Fee Deduction Discrepancy Notice',
    platform: 'Zomato',
    penaltyAmount: 450,
    date: '2026-10-12',
    rawText: `Payout Adjustment Statement - Week 41
Delivery Partner ID: ZOM-441928
Gross Accrued: ₹6,840 | Net Disbursed: ₹5,120
Adjustments Applied:
1. Section 194C/194M TDS withholding: ₹68.40
2. Platform Tech Fee retroactive adjustment: ₹450.00
3. Rain Surge Recalibration: -₹180.00
Note: If your PAN card is updated, TDS will reflect in Form 26AS. For platform fee discrepancies, appeals must be submitted within 7 working days with shift order logs attached.`
  }
];

// Initial drafted grievance
const INITIAL_DISPUTES = [
  {
    id: 'disp-201',
    platform: 'Zomato',
    category: 'Unpaid Rain & Peak Surge Incentive',
    amount: 180,
    tripId: 'ZOM-TRIP-9821',
    date: '2026-10-15',
    status: 'Submitted',
    subject: 'Urgent Dispute: Non-credit of Monsoon Surge Incentive (Order #ZOM-TRIP-9821)',
    body: `To The Partner Grievance Redressal Desk, Zomato India,

I am writing to formally dispute the non-credit of the promised Monsoon Peak Surge incentive of ₹180 for deliveries completed during heavy rainfall on 15-Oct-2026 (Order ID: ZOM-TRIP-9821).

As per platform terms communicated in the partner app, active riders during red-alert weather conditions are entitled to the designated weather surge bonus. Despite completing all assigned orders safely and on time during severe downpours, the payout statement reflected only the base fare.

Under fair gig labor practices and the Platform Partner Agreement, I request you to investigate the GPS trip logs and credit the outstanding amount of ₹180 to my linked bank account immediately.

Partner ID: ZOM-441928
Name: Ramesh Kumar
Contact: +91 98765 43210`,
    createdAt: '2026-10-15T18:30:00.000Z'
  }
];

// Default profile
const DEFAULT_PROFILE = {
  name: 'Ramesh Kumar',
  age: 28,
  phone: '+91 98765 43210',
  city: 'Mumbai',
  state: 'Maharashtra',
  primaryPlatform: 'Swiggy',
  vehicleType: 'Petrol 2-Wheeler', // 'Petrol 2-Wheeler', 'EV Bike', 'Auto Rickshaw', 'Cab / 4-Wheeler', 'Bicycle'
  dailyEarningsTarget: 1200,
  hasEshram: false,
  hasHealthCover: false,
  emergencyContactName: 'Sunita Kumar (Wife)',
  emergencyContactPhone: '+91 98123 45678'
};

export const storageService = {
  // Shifts
  getShifts: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHIFTS);
      return data ? JSON.parse(data) : INITIAL_SHIFTS;
    } catch {
      return INITIAL_SHIFTS;
    }
  },
  saveShifts: (shifts) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },
  addShift: (shift) => {
    const current = storageService.getShifts();
    const updated = [shift, ...current];
    storageService.saveShifts(updated);
    return updated;
  },

  // Disputes
  getDisputes: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISPUTES);
      return data ? JSON.parse(data) : INITIAL_DISPUTES;
    } catch {
      return INITIAL_DISPUTES;
    }
  },
  saveDisputes: (disputes) => {
    try {
      localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify(disputes));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },
  addDispute: (dispute) => {
    const current = storageService.getDisputes();
    const updated = [dispute, ...current];
    storageService.saveDisputes(updated);
    return updated;
  },

  // Profile
  getProfile: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },
  saveProfile: (profile) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },

  // Language & Sunlight Mode
  getLanguage: () => {
    if (typeof window === 'undefined') return 'en';
    try {
      return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
    } catch {
      return 'en';
    }
  },
  setLanguage: (lang) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },
  getSunlightMode: () => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(STORAGE_KEYS.SUNLIGHT) === 'true';
    } catch {
      return false;
    }
  },
  setSunlightMode: (val) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SUNLIGHT, String(val));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },

  // Gemini API Key
  getApiKey: () => {
    if (typeof window === 'undefined') return '';
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.API_KEY);
      if (stored) return stored;
    } catch {}
    if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GEMINI_API_KEY) {
      return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    }
    return '';
  },
  setApiKey: (key) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },

  // Active shift state
  getActiveShift: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_SHIFT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setActiveShift: (shift) => {
    if (!shift) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SHIFT);
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SHIFT, JSON.stringify(shift));
    }
  }
};
