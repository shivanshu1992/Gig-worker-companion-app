// Pre-seeded database of 6 verified real gig worker government schemes & welfare boards in India

export const WELFARE_SCHEMES = [
  {
    id: 'scheme-eshram',
    title: 'e-Shram Portal (National Database of Unorganised Workers)',
    shortName: 'e-Shram Card',
    category: 'Accident & Social Security',
    badge: 'National Priority',
    coverage: '₹2,00,000 for accidental death / total permanent disability; ₹1,00,000 for partial disability.',
    description: 'Universal registration system providing a 12-digit UAN card, seamless social security portability across states, and automatic enrollment in accidental risk cover.',
    eligibility: [
      'Age between 16 and 59 years',
      'Worker in gig/platform economy or informal sector',
      'Not a member of EPFO (PF) or ESIC'
    ],
    documents: ['Aadhaar card with mobile link', 'Bank account details (IFSC)', 'Nominee details'],
    howToApply: 'Self-register for free on eshram.gov.in or visit any nearby Common Service Centre (CSC).',
    helpline: '14434 (Toll-Free National)',
    officialUrl: 'https://eshram.gov.in',
    matchCriteria: (profile) => profile.age >= 16 && profile.age <= 59
  },
  {
    id: 'scheme-state-gig',
    title: 'State Platform-Based Gig Workers Welfare Board',
    shortName: 'Gig Worker Welfare Board',
    category: 'State Social Security Fund',
    badge: 'State Statutory Board',
    coverage: 'Accidental relief, specialized medical assistance fund, and dedicated tripartite grievance redressal tribunal.',
    description: 'Enacted under landmark State Gig Workers Acts (e.g. Rajasthan, Karnataka, Maharashtra). Funded through a 1-2% welfare cess collected from delivery platforms on every transaction.',
    eligibility: [
      'Active delivery partner or driver on any registered platform (Swiggy, Zomato, Uber, Ola, etc.)',
      'Resident or operating in Maharashtra, Karnataka, or Rajasthan',
      'Minimum 30 days active registration on platform'
    ],
    documents: ['Platform Partner ID screenshot', 'Aadhaar Card', 'Registered mobile number'],
    howToApply: 'Automatic integration via platform data sharing or registration on State Labor Department Gig Portal.',
    helpline: '1800-425-0010 (Labor Dept)',
    officialUrl: 'https://labour.gov.in',
    matchCriteria: (profile) => ['Maharashtra', 'Karnataka', 'Rajasthan'].includes(profile.state)
  },
  {
    id: 'scheme-pmsby',
    title: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    shortName: 'PMSBY Accidental Insurance',
    category: 'Low-Cost Insurance',
    badge: '₹20 / Year Policy',
    coverage: '₹2 Lakh risk coverage for accidental death and permanent full disability; ₹1 Lakh for permanent partial disability.',
    description: 'Super-affordable government-backed annual accidental death and disability insurance designed specifically for mobile riders and informal workers.',
    eligibility: [
      'Age between 18 and 70 years',
      'Savings bank account with auto-debit facility enabled'
    ],
    documents: ['Savings Bank Account passbook / Net banking', 'Aadhaar Card for KYC'],
    howToApply: 'Activate via SMS or NetBanking from SBI, HDFC, ICICI, PNB or your local post office savings bank for ₹20/year.',
    helpline: '1800-180-1111 (Financial Services)',
    officialUrl: 'https://www.jansuraksha.gov.in',
    matchCriteria: (profile) => profile.age >= 18 && profile.age <= 70
  },
  {
    id: 'scheme-pmjay',
    title: 'Ayushman Bharat PM-JAY (National Health Protection Scheme)',
    shortName: 'Ayushman Bharat (PM-JAY)',
    category: 'Family Healthcare',
    badge: '₹5 Lakh Cashless',
    coverage: 'Up to ₹5,00,000 per family per year for secondary and tertiary hospital care across 27,000+ empanelled hospitals.',
    description: 'Cashless hospitalisation benefits covering medicines, diagnostics, ICU charges, surgeries, and pre/post-hospitalisation expenses for eligible worker families.',
    eligibility: [
      'Families identified in socio-economic unorganized worker rosters or state low-income cards (Ration card / BPL)',
      'No cap on family size or age of family members'
    ],
    documents: ['Ration Card / Family ID', 'Aadhaar Card', 'Mobile number'],
    howToApply: 'Check eligibility on mera.pmjay.gov.in or visit any government district hospital Ayushman Mitra desk.',
    helpline: '14555 (Toll-Free Health Hotline)',
    officialUrl: 'https://pmjay.gov.in',
    matchCriteria: () => true
  },
  {
    id: 'scheme-pmsvanidhi',
    title: 'PM SVANidhi Scheme (Micro-Credit & EV Upgrade Support)',
    shortName: 'PM SVANidhi Micro-Credit',
    category: 'Working Capital & Loans',
    badge: '7% Interest Subsidy',
    coverage: 'Collateral-free working capital loans of ₹10,000, ₹20,000 and ₹50,000 with 7% interest subsidy and cashback on digital transactions.',
    description: 'Empowers informal and gig workers with formal credit for vehicle repairs, battery replacements, and working capital without loan sharks.',
    eligibility: [
      'Engaged in delivery, vending, or urban informal transport services',
      'Possession of active vendor ID or platform partner certificate'
    ],
    documents: ['Aadhaar card', 'Bank statement of last 3 months', 'Platform partner ID card'],
    howToApply: 'Apply online on pmsvanidhi.mohua.gov.in or through any nationalised bank or micro-finance partner.',
    helpline: '1800-11-1979',
    officialUrl: 'https://pmsvanidhi.mohua.gov.in',
    matchCriteria: (profile) => profile.vehicleType?.includes('Bike') || profile.vehicleType?.includes('Auto')
  },
  {
    id: 'scheme-motor-safety',
    title: 'Mandatory Commercial Third-Party & Platform Group Insurance',
    shortName: 'Motor & On-Duty Group Cover',
    category: 'Commercial Vehicle Rights',
    badge: 'Statutory Right',
    coverage: 'Coverage for third-party bodily injury, property damage, and rider accident indemnity while logged into the platform app.',
    description: 'Under Ministry of Road Transport & Highways guidelines, all commercial and delivery platforms must furnish active transit emergency cover for on-duty riders.',
    eligibility: [
      'Active shift status on the delivery app at the time of transit or accident',
      'Valid driving license for the vehicle class (2-wheeler / Commercial LMV / Auto)'
    ],
    documents: ['Driving License', 'Vehicle RC and Insurance policy', 'First Information Report (FIR) or GD entry'],
    howToApply: 'Report within 1 hour via the platform in-app SOS or Insurance Claims portal.',
    helpline: '112 / Platform Helpline',
    officialUrl: 'https://morth.nic.in',
    matchCriteria: () => true
  }
];
