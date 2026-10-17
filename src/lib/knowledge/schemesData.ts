// Verified Indian Worker Rights and Welfare Schemes Directory

import { WelfareScheme } from '@/types';

export const VERIFIED_SCHEMES: WelfareScheme[] = [
  {
    id: 'e-shram',
    officialName: 'e-Shram Portal (National Database of Unorganised Workers)',
    nameHi: 'ई-श्रम पोर्टल (असंगठित कामगार राष्ट्रीय डेटाबेस)',
    namePa: 'ਈ-ਸ਼ਰਮ ਪੋਰਟਲ (ਅਸੰਗਠਿਤ ਕਾਮੇ ਰਾਸ਼ਟਰੀ ਡਾਟਾਬੇਸ)',
    category: 'central',
    plainDescription:
      'National registry by Ministry of Labour & Employment giving a unique 12-digit UAN card to unorganised and gig workers. Unlocks eligibility for future social security schemes and disaster relief assistance directly to worker bank accounts.',
    plainDescriptionHi:
      'श्रम और रोजगार मंत्रालय द्वारा शुरू किया गया राष्ट्रीय डेटाबेस जो कामगारों को 12-अंकों का विशिष्ट यूएएन (UAN) कार्ड प्रदान करता है। भविष्य की सरकारी कल्याणकारी योजनाओं और आपातकालीन सहायता के लिए यह मुख्य पहचान पत्र है।',
    plainDescriptionPa:
      'ਕਿਰਤ ਅਤੇ ਰੋਜ਼ਗਾਰ ਮੰਤਰਾਲੇ ਦਾ ਰਾਸ਼ਟਰੀ ਰਜਿਸਟਰ ਜੋ ਅਸੰਗਠਿਤ ਅਤੇ ਗਿਗ ਕਾਮਿਆਂ ਨੂੰ 12 ਅੰਕਾਂ ਦਾ ਵਿਲੱਖਣ UAN ਕਾਰਡ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ। ਭਵਿੱਖ ਦੀਆਂ ਸਮਾਜਿਕ ਸੁਰੱਖਿਆ ਯੋਜਨਾਵਾਂ ਲਈ ਲਾਜ਼ਮੀ ਹੈ।',
    intendedBeneficiaries: 'Gig workers, delivery partners, drivers, construction laborers, street vendors, domestic workers aged 16-59 years.',
    stateApplicability: 'All India',
    eligibilityCriteria: [
      'Age must be between 16 and 59 years',
      'Must work in the unorganised or gig sector',
      'Must not be an active member of EPFO or ESIC',
      'Must not be an income tax payer'
    ],
    requiredDocuments: [
      'Aadhaar Number (linked to active mobile for OTP)',
      'Bank Account Number with IFSC code',
      'Active mobile number'
    ],
    verifiedBenefits: [
      'Free 12-digit Universal Account Number (UAN) Card',
      'Portability of social security benefits across Indian states',
      'Direct Benefit Transfer (DBT) during state or national emergencies',
      'Automatic linkage with Pradhan Mantri Suraksha Bima Yojana (PMSBY)'
    ],
    applicationProcedure:
      'Self-registration is 100% free online via eshram.gov.in using Aadhaar OTP, or at any Common Service Centre (CSC) across India.',
    applicationUrl: 'https://register.eshram.gov.in/#/user/self',
    officialSourceUrl: 'https://eshram.gov.in',
    verificationDate: '2026-08-15',
    verificationStatus: 'verified',
    isActive: true
  },
  {
    id: 'pm-sym',
    officialName: 'Pradhan Mantri Shram Yogi Maandhan (PM-SYM)',
    nameHi: 'प्रधानमंत्री श्रम योगी मान-धन योजना (PM-SYM)',
    namePa: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਸ਼੍ਰਮ ਯੋਗੀ ਮਾਨ-ਧਨ (PM-SYM)',
    category: 'pension',
    plainDescription:
      'Voluntary and contributory old-age pension scheme for informal and gig workers. Ensures a guaranteed minimum monthly pension of ₹3,000 upon reaching 60 years of age, with 50% matching contribution paid by the Central Government.',
    plainDescriptionHi:
      'असंगठित और गिग कामगारों के लिए वृद्धावस्था पेंशन योजना। 60 वर्ष की आयु के बाद ₹3,000 प्रति माह न्यूनतम पेंशन की गारंटी। 50% अंशदान केंद्र सरकार देती है।',
    plainDescriptionPa:
      'ਅਸੰਗਠਿਤ ਕਾਮਿਆਂ ਲਈ ਪੈਨਸ਼ਨ ਸਕੀਮ। 60 ਸਾਲ ਦੀ ਉਮਰ ਤੋਂ ਬਾਅਦ ₹3,000 ਪ੍ਰਤੀ ਮਹੀਨਾ ਪੈਨਸ਼ਨ ਦੀ ਗਾਰੰਟੀ। 50% ਹਿੱਸਾ ਕੇਂਦਰ ਸਰਕਾਰ ਪਾਉਂਦੀ ਹੈ।',
    intendedBeneficiaries: 'Informal workers, cab drivers, auto operators, delivery boys earning monthly income of ₹15,000 or less.',
    stateApplicability: 'All India',
    eligibilityCriteria: [
      'Entry age between 18 and 40 years',
      'Monthly income must be ₹15,000 or below',
      'Must not be engaged in organized sector (EPFO / NPS / ESIC)',
      'Must not be an income tax assessee'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Savings Bank Account Passbook / Jan Dhan Account with IFSC',
      'Mobile Phone for SMS updates'
    ],
    verifiedBenefits: [
      'Assured monthly pension of ₹3,000 after attaining 60 years',
      'Matching 50:50 financial contribution by the Government of India',
      'Family pension of 50% (₹1,500/month) to spouse in case of beneficiary demise'
    ],
    applicationProcedure:
      'Enroll at any nearest CSC (Common Service Centre) or online at maandhan.in. Monthly debit (₹55 to ₹200 based on entry age) is auto-debited from bank account.',
    applicationUrl: 'https://maandhan.in/shramyogi',
    officialSourceUrl: 'https://labour.gov.in/pm-sym',
    verificationDate: '2026-07-20',
    verificationStatus: 'verified',
    isActive: true
  },
  {
    id: 'ayushman-bharat-pmjay',
    officialName: 'Ayushman Bharat PM-JAY (Pradhan Mantri Jan Arogya Yojana)',
    nameHi: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना (PM-JAY)',
    namePa: 'ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਜਨ ਅਰੋਗਿਆ ਯੋਜਨਾ (PM-JAY)',
    category: 'healthcare',
    plainDescription:
      'The world’s largest government-funded healthcare assurance scheme offering cashless hospitalization coverage of up to ₹5 Lakh per family per year for secondary and tertiary medical care across empaneled private and public hospitals.',
    plainDescriptionHi:
      'प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलेस इलाज कवर। देशभर के सरकारी और सूचीबद्ध निजी अस्पतालों में द्वितीयक और तृतीयक स्वास्थ्य देखभाल के लिए मान्य।',
    plainDescriptionPa:
      'ਪ੍ਰਤੀ ਪਰਿਵਾਰ ਪ੍ਰਤੀ ਸਾਲ ₹5 ਲੱਖ ਤੱਕ ਦਾ ਮੁਫਤ ਹਸਪਤਾਲ ਕਵਰ। ਦੇਸ਼ ਭਰ ਦੇ ਸੂਚੀਬੱਧ ਹਸਪਤਾਲਾਂ ਵਿੱਚ ਕੈਸ਼ਲੈੱਸ ਇਲਾਜ।',
    intendedBeneficiaries: 'Deprived rural and identified urban informal worker occupational categories (drivers, delivery workers, mechanics, construction labor).',
    stateApplicability: 'All Participating States/UTs in India',
    eligibilityCriteria: [
      'Identified under SECC 2011 occupational criteria or state food security ration database',
      'No cap on family size, age, or gender',
      'Pre-existing medical conditions covered from Day 1'
    ],
    requiredDocuments: [
      'Aadhaar Card or Ration Card (NFSA)',
      'Active mobile number',
      'Family ID / Samagra ID (where applicable)'
    ],
    verifiedBenefits: [
      '₹5,00,000 annual cashless coverage per eligible family',
      'Covers 3 days pre-hospitalization and 15 days post-hospitalization medicine & diagnostic tests',
      'Includes emergency surgeries, ICU care, and serious accident trauma treatments'
    ],
    applicationProcedure:
      'Check eligibility with Aadhaar or Ration Card at beneficiary.nha.gov.in, or visit any Ayushman Mitra desk at government or empaneled private hospitals.',
    applicationUrl: 'https://beneficiary.nha.gov.in',
    officialSourceUrl: 'https://pmjay.gov.in',
    verificationDate: '2026-09-01',
    verificationStatus: 'verified',
    isActive: true
  },
  {
    id: 'rajasthan-gig-act',
    officialName: 'Rajasthan Platform Based Gig Workers (Registration & Welfare) Act',
    nameHi: 'राजस्थान प्लेटफॉर्म आधारित गिग श्रमिक (पंजीकरण और कल्याण) अधिनियम',
    namePa: 'ਰਾਜਸਥਾਨ ਪਲੇਟਫਾਰਮ ਆਧਾਰਿਤ ਗਿਗ ਵਰਕਰ ਵੈਲਫੇਅਰ ਐਕਟ',
    category: 'platform_act',
    plainDescription:
      'Landmark state legislation establishing a dedicated Gig Workers Welfare Board funded by a statutory welfare fee (1-2%) levied on each customer transaction by aggregator platforms (Swiggy, Zomato, Uber, Ola, etc.).',
    plainDescriptionHi:
      'भारत का पहला राज्य कानून जिसने गिग श्रमिकों के लिए समर्पित कल्याण बोर्ड की स्थापना की। हर लेनदेन पर 1-2% सेस से फंड बनाकर दुर्घटना बीमा, सामाजिक सुरक्षा और शिकायत निवारण प्रदान किया जाता है।',
    plainDescriptionPa:
      'ਭਾਰਤ ਦਾ ਪਹਿਲਾ ਕਾਨੂੰਨ ਜੋ ਗਿਗ ਕਾਮਿਆਂ ਲਈ ਵੈਲਫੇਅਰ ਬੋਰਡ ਬਣਾਉਂਦਾ ਹੈ। ਹਰੇਕ ਆਰਡਰ ਉੱਤੇ 1-2% ਵੈਲਫੇਅਰ ਫੀਸ ਨਾਲ ਫੰਡ ਤਿਆਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।',
    intendedBeneficiaries: 'All app-based delivery partners, drivers, and service partners operating within Rajasthan.',
    stateApplicability: 'Rajasthan (Model being adopted by Karnataka, Telangana, Tamil Nadu)',
    eligibilityCriteria: [
      'Active registration on any digital aggregator platform in Rajasthan',
      'Must have performed at least one transaction or shift'
    ],
    requiredDocuments: [
      'Aggregator Partner ID (Swiggy / Zomato / Uber / Ola / Urban Company, etc.)',
      'Aadhaar Card',
      'Bank Account details in Rajasthan'
    ],
    verifiedBenefits: [
      'Dedicated state Unique Gig Worker ID',
      'Statutory Social Security & Accident Insurance fund',
      'Right to fair dispute resolution and protection against arbitrary account deactivations',
      'State grievance appellate tribunal for wage deductions'
    ],
    applicationProcedure:
      'Aggregator platforms are legally mandated to onboard workers directly onto the Rajasthan Gig Worker Portal. Workers can view status via the state labor portal.',
    applicationUrl: 'https://labour.rajasthan.gov.in',
    officialSourceUrl: 'https://labour.rajasthan.gov.in/ActsRules.aspx',
    verificationDate: '2026-08-10',
    verificationStatus: 'verified',
    isActive: true
  },
  {
    id: 'karnataka-gig-bill',
    officialName: 'Karnataka Platform-Based Gig Workers Social Security & Welfare Bill',
    nameHi: 'कर्नाटक प्लेटफॉर्म आधारित गिग श्रमिक सामाजिक सुरक्षा और कल्याण विधेयक',
    namePa: 'ਕਰਨਾਟਕ ਗਿਗ ਵਰਕਰ ਸਮਾਜਿਕ ਸੁਰੱਖਿਆ ਬਿਲ',
    category: 'platform_act',
    plainDescription:
      'State framework providing social security, grievance redressal mechanisms, 14-day mandatory notice before account deactivation, and algorithmic transparency for delivery and transport gig workers in Karnataka.',
    plainDescriptionHi:
      'कर्नाटक सरकार का विधेयक जो प्लेटफॉर्म श्रमिकों को सामाजिक सुरक्षा, आईडी ब्लॉक करने से पहले 14 दिन का नोटिस, और एल्गोरिदम पारदर्शिता का अधिकार देता है।',
    plainDescriptionPa:
      'ਕਰਨਾਟਕ ਸਰਕਾਰ ਦਾ ਫਰੇਮਵਰਕ ਜੋ ਗਿਗ ਕਾਮਿਆਂ ਨੂੰ ਆਈਡੀ ਬੰਦ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ 14 ਦਿਨਾਂ ਦਾ ਨੋਟਿਸ ਅਤੇ ਵਿਵਾਦ ਨਿਪਟਾਰਾ ਦਿੰਦਾ ਹੈ।',
    intendedBeneficiaries: 'Delivery executives, auto/cab drivers, logistics workers operating in Karnataka.',
    stateApplicability: 'Karnataka',
    eligibilityCriteria: [
      'Engaged with digital aggregators within Karnataka',
      'Valid partner account'
    ],
    requiredDocuments: [
      'Partner ID and Registered Phone Number',
      'Aadhaar Card',
      'Driving License (for mobility partners)'
    ],
    verifiedBenefits: [
      'Mandatory 14-day notice and reason required before account termination',
      'State-managed Gig Workers Welfare Fund financed via welfare fee',
      'Right to appeal against arbitrary penalties and deductions',
      'Occupational health and safety guidelines during extreme climate conditions'
    ],
    applicationProcedure:
      'Automatic sync by aggregators to state labor database with verification by worker phone OTP.',
    applicationUrl: 'https://labour.karnataka.gov.in',
    officialSourceUrl: 'https://labour.karnataka.gov.in',
    verificationDate: '2026-09-12',
    verificationStatus: 'verified',
    isActive: true
  },
  {
    id: 'pmsby',
    officialName: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    nameHi: 'प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY)',
    namePa: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਸੁਰੱਖਿਆ ਬੀਮਾ ਯੋਜਨਾ (PMSBY)',
    category: 'accident_insurance',
    plainDescription:
      'High-coverage, micro-premium accidental death and disability insurance policy. For an affordable annual premium of just ₹20 auto-debited from your bank account, workers receive ₹2 Lakh coverage for accidental demise or permanent total disability.',
    plainDescriptionHi:
      'मात्र ₹20 प्रति वर्ष के प्रीमियम पर ₹2 लाख का दुर्घटना मृत्यु और पूर्ण विकलांगता बीमा। दोपहिया वाहन चालकों और डिलीवरी पार्टनर्स के लिए अत्यधिक उपयोगी।',
    plainDescriptionPa:
      'ਸਾਲਾਨਾ ਸਿਰਫ ₹20 ਪ੍ਰੀਮੀਅਮ ਉੱਤੇ ₹2 ਲੱਖ ਦਾ ਦੁਰਘਟਨਾ ਬੀਮਾ। ਸੜਕ ਹਾਦਸੇ ਵਿੱਚ ਮੌਤ ਜਾਂ ਪੂਰਨ ਅਪੰਗਤਾ ਹੋਣ ਤੇ ਪਰਿਵਾਰ ਨੂੰ ਸੁਰੱਖਿਆ।',
    intendedBeneficiaries: 'All individuals aged 18 to 70 years having an active bank account.',
    stateApplicability: 'All India',
    eligibilityCriteria: [
      'Age between 18 and 70 years',
      'Active savings bank account with Aadhaar linked',
      'Consent for annual auto-debit of ₹20'
    ],
    requiredDocuments: [
      'Savings Bank Account Passbook',
      'Aadhaar Card'
    ],
    verifiedBenefits: [
      '₹2,00,000 for accidental death',
      '₹2,00,000 for permanent total disability (loss of both eyes or both hands/feet)',
      '₹1,00,000 for permanent partial disability (loss of one eye or one hand/foot)'
    ],
    applicationProcedure:
      'Subscribe directly via internet banking, SMS banking, or submit a 1-page form at your local bank branch.',
    applicationUrl: 'https://financialservices.gov.in/insurance-divisions/Government-Sponsored-Socially-Oriented-Insurance-Schemes/Pradhan-Mantri-Suraksha-Bima-Yojana(PMSBY)',
    officialSourceUrl: 'https://www.jansuraksha.gov.in',
    verificationDate: '2026-08-01',
    verificationStatus: 'verified',
    isActive: true
  },
  {
    id: 'pm-svanidhi',
    officialName: 'PM Street Vendor’s AtmaNirbhar Nidhi (PM SVANidhi)',
    nameHi: 'पीएम स्ट्रीट वेंडर्स आत्मनिर्भर निधि (पीएम स्वनिधि)',
    namePa: 'ਪੀਐਮ ਸਵਨਿਧੀ (PM SVANidhi)',
    category: 'central',
    plainDescription:
      'Collateral-free working capital micro-credit loan scheme for street vendors and informal daily-wage earners. Starting with ₹10,000 in 1st tranche, graduating to ₹20,000 and ₹50,000 upon timely digital repayments with 7% interest subsidy.',
    plainDescriptionHi:
      'स्ट्रीट वेंडरों और दैनिक कामगारों के लिए बिना किसी गारंटी का सस्ता कार्यशील पूंजी ऋण। पहली बार में ₹10,000, समय पर चुकाने पर ₹20,000 और फिर ₹50,000। साथ में 7% ब्याज सब्सिडी और डिजिटल कैशबैक।',
    plainDescriptionPa:
      'ਰੇਹੜੀ-ਫੜੀ ਵਾਲਿਆਂ ਅਤੇ ਰੋਜ਼ਾਨਾ ਕਾਮਿਆਂ ਲਈ ਬਿਨਾਂ ਗਾਰੰਟੀ ਕਰਜ਼ਾ ਯੋਜਨਾ। ਪਹਿਲੀ ਵਾਰ ₹10,000, ਦੂਜੀ ਵਾਰ ₹20,000 ਅਤੇ ਤੀਜੀ ਵਾਰ ₹50,000।',
    intendedBeneficiaries: 'Street vendors, hawkers, informal cart owners operating in urban and peri-urban areas.',
    stateApplicability: 'All India',
    eligibilityCriteria: [
      'Possess Certificate of Vending / ID card issued by Urban Local Body (ULB)',
      'Or identified in ULB vendor survey with Letter of Recommendation (LoR)'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Voter ID / Driving License',
      'Bank Account Passbook',
      'Certificate of Vending or LoR from Local Municipal Office'
    ],
    verifiedBenefits: [
      'Tranche 1: Up to ₹10,000 (1-year tenure)',
      'Tranche 2: Up to ₹20,000 on timely repayment of 1st tranche',
      'Tranche 3: Up to ₹50,000 on repayment of 2nd tranche',
      '7% annual interest subsidy credited directly to bank account',
      'Cashback incentive up to ₹1,200 per year for adopting digital transactions'
    ],
    applicationProcedure:
      'Apply online at pmsvanidhi.mohua.gov.in or through nearby Banking Correspondents (BCs) or CSC centers.',
    applicationUrl: 'https://pmsvanidhi.mohua.gov.in',
    officialSourceUrl: 'https://mohua.gov.in/cms/pmsvanidhi.php',
    verificationDate: '2026-07-28',
    verificationStatus: 'verified',
    isActive: true
  },
  {
    id: 'bocw-board',
    officialName: 'Building and Other Construction Workers (BOCW) Welfare Board',
    nameHi: 'भवन एवं अन्य सन्निर्माण कर्मकार कल्याण बोर्ड (BOCW)',
    namePa: 'ਇਮਾਰਤੀ ਅਤੇ ਹੋਰ ਉਸਾਰੀ ਕਾਮੇ ਭਲਾਈ ਬੋਰਡ (BOCW)',
    category: 'board',
    plainDescription:
      'State welfare boards funded through statutory construction cess (1% of project costs). Provides registered construction laborers with toolkits, safety equipment allowances, daughter marriage assistance, maternity benefits, and accident relief.',
    plainDescriptionHi:
      'निर्माण परियोजनाओं पर 1% सेस से संचालित राज्य कल्याण बोर्ड। पंजीकृत मजदूरों को टूलकिट, सुरक्षा उपकरण अनुदान, बच्चों की छात्रवृत्ति, विवाह सहायता और दुर्घटना सहायता मिलती है।',
    plainDescriptionPa:
      'ਉਸਾਰੀ ਕਾਮਿਆਂ ਲਈ ਰਾਜ ਭਲਾਈ ਬੋਰਡ। ਔਜ਼ਾਰ ਖਰੀਦਣ ਲਈ ਸਹਾਇਤਾ, ਬੱਚਿਆਂ ਦੀ ਪੜ੍ਹਾਈ ਦਾ ਵਜ਼ੀਫ਼ਾ ਅਤੇ ਧੀਆਂ ਦੇ ਵਿਆਹ ਲਈ ਆਰਥਿਕ ਮਦਦ।',
    intendedBeneficiaries: 'Masons, helpers, carpenters, painters, plumbers, electricians, and daily wage site workers who have worked for 90 days in construction in the past 12 months.',
    stateApplicability: 'All States & UTs (Administered by respective State Labor Departments)',
    eligibilityCriteria: [
      'Age between 18 and 60 years',
      'Completed at least 90 days of construction work in the preceding 12 months (certified by contractor or union)'
    ],
    requiredDocuments: [
      '90-day Work Certificate from builder / contractor / registered trade union',
      'Aadhaar Card',
      'Bank Passbook with IFSC',
      'Passport size photographs'
    ],
    verifiedBenefits: [
      'Tool purchase grant: ₹5,000 to ₹10,000 (varies by state)',
      'Daughter marriage assistance: ₹31,000 to ₹51,000',
      'Maternity grant: ₹6,000 to ₹20,000 for female workers',
      'Education scholarships for worker children from class 1 through college/ITI',
      'Immediate accidental death relief: ₹2,00,000 to ₹5,00,000 to nominee'
    ],
    applicationProcedure:
      'Register at your state’s Labor Department website (e.g., bocw.punjab.gov.in, bocw.delhi.gov.in) or visit the district Labour Officer / Shram Kalyan Kendra.',
    applicationUrl: 'https://labour.gov.in/bocw',
    officialSourceUrl: 'https://labour.gov.in/bocw',
    verificationDate: '2026-08-18',
    verificationStatus: 'verified',
    isActive: true
  },
  {
    id: 'motor-vehicle-aggregator-rights',
    officialName: 'Ministry of Road Transport (MoRTH) Motor Vehicle Aggregator Guidelines & Worker Protections',
    nameHi: 'सड़क परिवहन मंत्रालय मोटर वाहन एग्रीगेटर दिशानिर्देश एवं श्रमिक अधिकार',
    namePa: 'ਮੋਟਰ ਵਾਹਨ ਐਗਰੀਗੇਟਰ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ ਅਤੇ ਡਰਾਈਵਰ ਅਧਿਕਾਰ',
    category: 'central',
    plainDescription:
      'Central government guidelines governing cab and bike-taxi platforms (Ola, Uber, Rapido). Mandates driver revenue share of at least 80% of applicable base fare, restricts unilateral cancellation penalties, and requires mandatory health & term insurance coverage for drivers.',
    plainDescriptionHi:
      'केंद्रीय सड़क परिवहन मंत्रालय के दिशानिर्देश। एग्रीगेटर किराये का कम से कम 80% हिस्सा ड्राइवर को देना अनिवार्य है (कंपनी अधिकतम 20% कमीशन ले सकती है)। ड्राइवरों के लिए अनिवार्य स्वास्थ्य और टर्म इंश्योरेंस का प्रावधान।',
    plainDescriptionPa:
      'ਕੇਂਦਰੀ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼: ਕੰਪਨੀ ਕਿਰਾਏ ਦਾ ਵੱਧ ਤੋਂ ਵੱਧ 20% ਹੀ ਕਮਿਸ਼ਨ ਲੈ ਸਕਦੀ ਹੈ, 80% ਡਰਾਈਵਰ ਦਾ ਹੱਕ ਹੈ। ਡਰਾਈਵਰਾਂ ਲਈ ਸਿਹਤ ਬੀਮਾ ਲਾਜ਼ਮੀ ਹੈ।',
    intendedBeneficiaries: 'App-based cab drivers, auto drivers, and delivery bike riders operating on digital aggregator networks.',
    stateApplicability: 'All India (State Transport Departments implement)',
    eligibilityCriteria: [
      'Registered driver/rider on any licensed aggregator platform',
      'Valid driving license and vehicle commercial permit / RC'
    ],
    requiredDocuments: [
      'Commercial or Transport Driving License',
      'Vehicle RC and Fitness Certificate',
      'Platform driver registration credentials'
    ],
    verifiedBenefits: [
      'Statutory fare split: Driver receives minimum 80% of the base fare; platform commission capped at 20%',
      'Mandatory medical insurance of at least ₹5 Lakh and term insurance of ₹10 Lakh per driver sponsored by the aggregator',
      'Platform cannot penalize driver without recorded reason and opportunity to respond',
      'Maximum daily driving shift limit capped at 12 hours with mandatory 10-hour rest period for road safety'
    ],
    applicationProcedure:
      'If your platform deducts more than 20% commission or denies mandatory insurance, raise a formal grievance referencing MoRTH Guidelines Section 13 & 14, or lodge a complaint on the National Consumer Helpline (1915).',
    applicationUrl: 'https://morth.nic.in/motor-vehicle-aggregator-guidelines-2020',
    officialSourceUrl: 'https://morth.nic.in',
    verificationDate: '2026-09-05',
    verificationStatus: 'verified',
    isActive: true
  }
];

export const WORKER_RIGHTS_SUMMARY = [
  {
    title: 'Right to Transparent Payouts',
    titleHi: 'पारदर्शी भुगतान का अधिकार',
    titlePa: 'ਪਾਰਦਰਸ਼ੀ ਕਮਾਈ ਦਾ ਅਧਿਕਾਰ',
    description: 'Platforms cannot arbitrarily deduct pay without documenting specific order penalties or contractual clauses. You have the right to an itemized breakdown of base fare, distance pay, waiting time, and deductions.',
    source: 'Payment of Wages Act / MoRTH Aggregator Guidelines Section 13'
  },
  {
    title: 'Protection Against Arbitrary Deactivation',
    titleHi: 'मनमाने आईडी ब्लॉक के खिलाफ सुरक्षा',
    titlePa: 'ਬਿਨਾਂ ਵਜ੍ਹਾ ਆਈਡੀ ਬੰਦ ਕਰਨ ਖਿਲਾਫ ਸੁਰੱਖਿਆ',
    description: 'You cannot be permanently deactivated based solely on automated algorithmic triggers without human review and a minimum 7 to 14 days notice period to explain your side.',
    source: 'Rajasthan Gig Act 2023 / Karnataka Platform Gig Workers Bill'
  },
  {
    title: 'Rest & Shift Safety Limits',
    titleHi: 'विश्राम और शिफ्ट सुरक्षा सीमा',
    titlePa: 'ਆਰਾਮ ਅਤੇ ਸ਼ਿਫਟ ਸੁਰੱਖਿਆ',
    description: 'No aggregator or contractor can force driving or delivery shifts exceeding 12 consecutive hours. Regular rest periods and safe shelters during heatwaves/heavy rain are basic worker welfare rights.',
    source: 'Occupational Safety, Health and Working Conditions Code'
  },
  {
    title: 'Accidental Medical Coverage On-Duty',
    titleHi: 'ड्यूटी के दौरान दुर्घटना चिकित्सा कवर',
    titlePa: 'ਡਿਊਟੀ ਦੌਰਾਨ ਦੁਰਘਟਨਾ ਬੀਮਾ',
    description: 'Every major platform (Swiggy, Zomato, Uber, Blinkit, etc.) is legally required to provide on-shift emergency accidental hospitalization and medical expenses.',
    source: 'Aggregator Partner Welfare Code of Conduct'
  }
];
