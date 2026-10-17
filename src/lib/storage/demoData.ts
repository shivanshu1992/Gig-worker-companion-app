// Realistic Sample Data for Demo Mode

import { UserProfile, EarningRecord, GrievanceDraft, DocumentDraft } from '@/types';

export const DEMO_PROFILE: UserProfile = {
  id: 'demo-worker-001',
  fullName: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  email: 'ramesh.kumar.demo@gigsaathi.in',
  preferredLanguage: 'en',
  workCategory: 'delivery',
  state: 'Delhi',
  district: 'South Delhi',
  primaryPlatform: 'Swiggy & Zomato',
  monthlyIncomeGoal: 28000,
  dailyIncomeGoal: 1100,
  onboardingCompleted: true,
  notificationPreferences: {
    dailySummary: true,
    safetyAlerts: true,
    schemeUpdates: true
  },
  createdAt: '2026-09-01T08:00:00Z',
  updatedAt: '2026-10-17T09:00:00Z'
};

export const DEMO_EARNINGS: EarningRecord[] = [
  {
    id: 'shift-101',
    userId: 'demo-worker-001',
    date: '2026-10-17', // Today
    workCategory: 'delivery',
    platformOrEmployer: 'Swiggy',
    tripOrOrderId: 'SWG-984210',
    grossEarnings: 1250,
    bonuses: 150,
    tips: 90,
    deductions: 0,
    expenses: 280, // Fuel
    netEarnings: 1210, // 1250 + 150 + 90 - 0 - 280
    hoursWorked: 6.5,
    distanceKm: 64,
    paymentMode: 'digital',
    notes: 'Dinner rush around Saket & Hauz Khas. High demand surge incentives applied.',
    disputeStatus: 'none',
    createdAt: '2026-10-17T05:30:00Z'
  },
  {
    id: 'shift-102',
    userId: 'demo-worker-001',
    date: '2026-10-16', // Yesterday
    workCategory: 'delivery',
    platformOrEmployer: 'Zomato',
    tripOrOrderId: 'ZOM-441928',
    grossEarnings: 980,
    bonuses: 0,
    tips: 50,
    deductions: 120, // Mystery deduction!
    deductionReason: 'Unfair Late Dispatch Penalty (Kitchen was delayed 20 min)',
    expenses: 210, // Fuel
    netEarnings: 700, // 980 + 0 + 50 - 120 - 210
    hoursWorked: 5.5,
    distanceKm: 46,
    paymentMode: 'digital',
    notes: 'Afternoon rain shift. Restaurant delayed food dispatch by 20 mins, but platform wrongly penalized partner for late delivery.',
    disputeStatus: 'can_dispute',
    createdAt: '2026-10-16T18:00:00Z'
  },
  {
    id: 'shift-103',
    userId: 'demo-worker-001',
    date: '2026-10-15',
    workCategory: 'delivery',
    platformOrEmployer: 'Blinkit',
    tripOrOrderId: 'BLK-339182',
    grossEarnings: 1100,
    bonuses: 100,
    tips: 40,
    deductions: 0,
    expenses: 120, // EV battery swap
    netEarnings: 1120, // 1100 + 100 + 40 - 0 - 120
    hoursWorked: 6.0,
    distanceKm: 38,
    paymentMode: 'mixed',
    notes: 'Morning quick grocery slots. 2 battery swaps at Yulu station. Smooth fast orders.',
    disputeStatus: 'none',
    createdAt: '2026-10-15T15:00:00Z'
  },
  {
    id: 'shift-104',
    userId: 'demo-worker-001',
    date: '2026-10-14',
    workCategory: 'delivery',
    platformOrEmployer: 'Uber Moto',
    tripOrOrderId: 'UBR-771239',
    grossEarnings: 1420,
    bonuses: 200,
    tips: 80,
    deductions: 0,
    expenses: 320, // Fuel
    netEarnings: 1380, // 1420 + 200 + 80 - 0 - 320
    hoursWorked: 7.5,
    distanceKm: 82,
    paymentMode: 'digital',
    notes: 'Peak morning and evening office commutes from Noida to South Ex.',
    disputeStatus: 'none',
    createdAt: '2026-10-14T20:30:00Z'
  },
  {
    id: 'shift-105',
    userId: 'demo-worker-001',
    date: '2026-10-13',
    workCategory: 'delivery',
    platformOrEmployer: 'Zepto',
    tripOrOrderId: 'ZPT-112093',
    grossEarnings: 850,
    bonuses: 50,
    tips: 30,
    deductions: 0,
    expenses: 150,
    netEarnings: 780, // 850 + 50 + 30 - 0 - 150
    hoursWorked: 4.5,
    distanceKm: 28,
    paymentMode: 'digital',
    notes: 'Light evening shift. Smooth delivery radius within 3 km of dark store.',
    disputeStatus: 'none',
    createdAt: '2026-10-13T19:00:00Z'
  },
  {
    id: 'shift-106',
    userId: 'demo-worker-001',
    date: '2026-10-11',
    workCategory: 'delivery',
    platformOrEmployer: 'Swiggy',
    tripOrOrderId: 'SWG-840192',
    grossEarnings: 1380,
    bonuses: 250,
    tips: 110,
    deductions: 0,
    expenses: 290,
    netEarnings: 1450,
    hoursWorked: 8.0,
    distanceKm: 76,
    paymentMode: 'digital',
    notes: 'Sunday weekend festival surge. Met 8-hour target with extra incentive.',
    disputeStatus: 'none',
    createdAt: '2026-10-11T21:30:00Z'
  }
];

export const DEMO_GRIEVANCES: GrievanceDraft[] = [
  {
    id: 'grievance-sample-1',
    userId: 'demo-worker-001',
    category: 'unfair_deduction',
    platformOrEmployer: 'Zomato',
    disputedAmount: 120,
    incidentDate: '2026-10-16',
    referenceIds: 'Order #ZOM-441928 / Partner ID: DL-88419',
    language: 'en',
    tone: 'formal_assertive',
    subjectLine: 'Formal Dispute: Unjustified Late Pickup Deduction of ₹120 on Order #ZOM-441928',
    recipientChannel: 'partner-support@zomato.com / Grievance Officer',
    draftContent: `To:
Grievance Redressal Officer / Delivery Partner Operations
Zomato Media Private Limited

Subject: Formal Dispute: Unjustified Late Pickup Deduction of ₹120 on Order #ZOM-441928

Dear Sir/Madam,

I am writing to formally appeal a deduction of ₹120 levied against my partner earnings on 16th October 2026 for Order #ZOM-441928 (Partner ID: DL-88419).

Factual Summary of the Incident:
1. I arrived at the restaurant location (Spice Hub, Green Park) within 8 minutes of dispatch acceptance at 13:42 hrs, as confirmed by my GPS telemetry.
2. The merchant kitchen experienced severe delay and did not hand over the sealed package until 14:04 hrs (a merchant wait time of 22 minutes).
3. I immediately marked "Food Not Ready" in the partner application at 13:45 hrs and notified rider dispatch chat.
4. Despite fulfilling my duties in complete accordance with partner guidelines, a penalty of ₹120 titled "Delayed Pickup" was deducted from my weekly payout.

Statutory and Contractual Grounds:
Under standard Fair Partner Engagement Guidelines and Principles of Natural Justice, a delivery partner cannot be financially penalized for kitchen preparation delays beyond the rider's physical control. The merchant preparation timestamp clearly exonerates my transit timeline.

Requested Resolution:
1. Immediate reversal and reimbursement of the ₹120 deduction to my partner wallet within 48 hours.
2. Removal of the negative compliance flag from my internal partner rating profile.

Supporting Evidence:
- Merchant arrival GPS timestamp (13:42 hrs)
- Partner app "Food Not Ready" in-app screenshot
- In-app rider chat reference log

Thank you for your prompt attention to this legitimate concern.

Yours faithfully,
Ramesh Kumar
Delivery Partner ID: DL-88419
Contact: +91 98765 43210`,
    supportingEvidence: ['Merchant arrival GPS timestamp', 'In-app chat screenshot', 'Food Not Ready status log'],
    status: 'draft',
    createdAt: '2026-10-16T19:30:00Z'
  }
];

export const DEMO_DOCUMENTS: DocumentDraft[] = [
  {
    id: 'doc-sample-1',
    userId: 'demo-worker-001',
    docType: 'worker_self_declaration',
    title: 'Informal Worker Self-Declaration of Occupation & Income',
    language: 'en',
    metadata: {
      workerName: 'Ramesh Kumar',
      category: 'Gig Delivery Partner',
      state: 'Delhi',
      averageMonthlyEarnings: '₹26,000'
    },
    generatedContent: `SELF-DECLARATION OF OCCUPATION AND INCOME
(For Unorganised & Gig Workers Registration / Welfare Verification)

I, Ramesh Kumar, Son/Daughter of [Parent Name], residing at [Residential Address, South Delhi, Delhi - 110016], do hereby solemnly affirm and declare as follows:

1. That I am a self-employed gig worker engaged primarily in on-demand delivery services across digital aggregator platforms in the National Capital Territory of Delhi.
2. That my average monthly gross earnings from delivery work range between ₹24,000 and ₹28,000, depending on seasonal demand and active hours.
3. That I am not an active member of EPFO (Employees' Provident Fund) or ESIC (Employees' State Insurance Corporation), nor am I an income tax assessee.
4. That I am registered on the National Database of Unorganised Workers (e-Shram Portal) under UAN: [12-Digit UAN Number].
5. That all information provided herein is true, correct, and complete to the best of my knowledge and belief.

Date: 17th October 2026
Place: New Delhi, India

______________________________
Signature / Thumb Impression of Declarant
(Ramesh Kumar)`,
    createdAt: '2026-10-10T12:00:00Z'
  }
];
