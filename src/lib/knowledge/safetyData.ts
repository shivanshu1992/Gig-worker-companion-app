// Worker Safety Center Knowledge Base & Checklists

import { SafetyChecklistItem } from '@/types';

export interface SafetyTopic {
  id: string;
  category: 'road' | 'night' | 'weather' | 'ergonomics' | 'equipment' | 'conflict' | 'emergency';
  title: string;
  titleHi: string;
  titlePa: string;
  summary: string;
  summaryHi: string;
  summaryPa: string;
  icon: string;
  keyActionPoints: {
    en: string[];
    hi: string[];
    pa: string[];
  };
  warning?: string;
  warningHi?: string;
}

export const SAFETY_TOPICS: SafetyTopic[] = [
  {
    id: 'road-traffic',
    category: 'road',
    title: 'Road & Two-Wheeler Traffic Safety',
    titleHi: 'सड़क एवं दोपहिया यातायात सुरक्षा',
    titlePa: 'ਸੜਕ ਅਤੇ ਦੋ-ਪਹੀਆ ਵਾਹਨ ਸੁਰੱਖਿਆ',
    summary: 'Essential habits to avoid road collisions during delivery rush hours.',
    summaryHi: 'डिलीवरी के दौरान सड़क दुर्घटनाओं से बचने के मुख्य नियम।',
    summaryPa: 'ਡਿਲੀਵਰੀ ਦੌਰਾਨ ਸੜਕ ਹਾਦਸਿਆਂ ਤੋਂ ਬਚਣ ਲਈ ਜ਼ਰੂਰੀ ਨਿਯਮ।',
    icon: 'Bike',
    keyActionPoints: {
      en: [
        'Always wear an ISI-certified full-face helmet with chin strap securely locked.',
        'Never mount phone directly in direct eye-line while driving; use handlebar mount and voice navigation.',
        'Do not rush for 10-minute delivery promises. Personal safety is worth more than any order incentive.',
        'Maintain a 3-second braking buffer behind heavy commercial vehicles and auto-rickshaws.',
        'Use rear-view mirrors actively before every lane change or turn.'
      ],
      hi: [
        'हमेशा आईएसआई (ISI) प्रमाणित फुल-फेस हेलमेट पहनें और स्ट्रैप ठीक से बांधें।',
        'ड्राइविंग करते समय हाथ में फोन न पकड़ें; हैंडल माउंट और वॉयस नेविगेशन का उपयोग करें।',
        '10-15 मिनट की डिलीवरी की जल्दबाजी में जान जोखिम में न डालें। कोई भी इंसेंटिव आपकी जिंदगी से बड़ा नहीं है।',
        'आगे चल रहे बड़े वाहनों से कम से कम 3 सेकंड की दूरी (बफर) बनाकर रखें।'
      ],
      pa: [
        'ਹਮੇਸ਼ਾ ISI ਮਾਰਕਾ ਹੈਲਮੇਟ ਪਹਿਨੋ ਅਤੇ ਪੱਟੀ ਠੀਕ ਤਰ੍ਹਾਂ ਬੰਨ੍ਹੋ।',
        'ਗੱਡੀ ਚਲਾਉਂਦੇ ਸਮੇਂ ਹੱਥ ਵਿੱਚ ਫ਼ੋਨ ਨਾ ਫੜੋ; ਹੈਂਡਲ ਮਾਊਂਟ ਦੀ ਵਰਤੋਂ ਕਰੋ।',
        'ਜਲਦਬਾਜ਼ੀ ਵਿੱਚ ਕੋਈ ਆਰਡਰ ਨਾ ਕਰੋ; ਸੁਰੱਖਿਆ ਪਹਿਲਾਂ ਹੈ।'
      ]
    },
    warning: 'Over 68% of delivery incidents occur during quick U-turns and blind-spot lane weaving in peak traffic.'
  },
  {
    id: 'night-shift',
    category: 'night',
    title: 'Night-Shift Vigilance & Dark Routes',
    titleHi: 'नाइट शिफ्ट सतर्कता एवं अंधेरे रास्तों की सुरक्षा',
    titlePa: 'ਨਾਈਟ ਸ਼ਿਫਟ ਅਤੇ ਰਾਤ ਦੇ ਰਸਤੇ',
    summary: 'Stay visible to other motorists and protect yourself during late-night deliveries and cab trips.',
    summaryHi: 'देर रात की डिलीवरी और कैब यात्राओं के दौरान खुद को सुरक्षित और दृश्यमान रखें।',
    summaryPa: 'ਦੇਰ ਰਾਤ ਕੰਮ ਕਰਦੇ ਸਮੇਂ ਸੁਰੱਖਿਅਤ ਰਹਿਣ ਦੇ ਤਰੀਕੇ।',
    icon: 'Moon',
    keyActionPoints: {
      en: [
        'Wear high-visibility retro-reflective jackets or stick 3M reflective tape on your delivery bag and bike tail.',
        'Share your live WhatsApp/Google location with a trusted family member or co-worker during night shifts.',
        'Park only under streetlights when picking or dropping off orders in unfamiliar alleys.',
        'If a delivery address feels deserted or unsafe, stop at a well-lit junction and call the customer to meet there.',
        'Keep bike headlight clean; high-beam should be dipped when approaching oncoming riders.'
      ],
      hi: [
        'रिफ्लेक्टिव जैकेट पहनें या डिलीवरी बैग पर चमकदार रिफ्लेक्टिव टेप लगाएं।',
        'रात में अपनी लाइव लोकेशन व्हाट्सएप पर परिवार या साथी ड्राइवर के साथ साझा करें।',
        'अंजान गलियों में गाड़ी हमेशा स्ट्रीटलाइट के नीचे ही पार्क करें।',
        'अगर डिलीवरी लोकेशन सुनसान या असुरक्षित लगे, तो मुख्य सड़क पर रुककर ग्राहक को वहीं आने को कहें।'
      ],
      pa: [
        'ਚਮਕਦਾਰ ਰਿਫਲੈਕਟਿਵ ਜੈਕੇਟ ਪਹਿਨੋ ਤਾਂ ਜੋ ਰਾਤ ਨੂੰ ਦੂਰੋਂ ਦਿਖਾਈ ਦਿਓ।',
        'ਆਪਣੀ ਲਾਈਵ ਲੋਕੇਸ਼ਨ ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਨਾਲ ਸਾਂਝੀ ਰੱਖੋ।',
        'ਸੁੰਨਸਾਨ ਥਾਵਾਂ ਉੱਤੇ ਅੰਦਰ ਜਾਣ ਤੋਂ ਬਚੋ।'
      ]
    }
  },
  {
    id: 'extreme-weather',
    category: 'weather',
    title: 'Extreme Heat, Rain & Smog Safety',
    titleHi: 'भीषण गर्मी, मूसलाधार बारिश और वायु प्रदूषण से बचाव',
    titlePa: 'ਗਰਮੀ, ਮੀਂਹ ਅਤੇ ਪ੍ਰਦੂਸ਼ਣ ਤੋਂ ਸੁਰੱਖਿਆ',
    summary: 'Crucial steps to avoid heatstroke, dehydration, slippery skids, and lung distress.',
    summaryHi: 'लू, डिहाइड्रेशन, बारिश में फिसलन और सांस की बीमारियों से सुरक्षा।',
    summaryPa: 'ਗਰਮੀ ਵਿੱਚ ਲੂ ਅਤੇ ਮੀਂਹ ਵਿੱਚ ਤਿਲਕਣ ਤੋਂ ਬਚਾਅ।',
    icon: 'CloudRain',
    keyActionPoints: {
      en: [
        'Summer/Heatwaves: Carry at least 2 liters of water with ORS or glucose; take 10-minute shade breaks every 2 hours.',
        'Wet Monsoons: Reduce bike speed by 30%. Wet road markings (zebra crossings) and metal manhole covers are slick as ice.',
        'Waterlogged Roads: Never enter water where depth is uncertain; open potholes and submerged live wires pose extreme hazard.',
        'Smog & Heavy Pollution: Wear N95 particulate mask during peak rush hours to prevent long-term respiratory damage.',
        'Keep essential documents (RC, DL, Insurance) sealed in waterproof zip pouches inside the bike boot.'
      ],
      hi: [
        'भीषण गर्मी: हमेशा ओआरएस (ORS) या नींबू पानी साथ रखें; हर 2 घंटे में छाया में 10 मिनट आराम करें।',
        'बारिश का मौसम: गाड़ी की गति 30% कम रखें। गीले मैनहोल के ढक्कन और सफेद पट्टियां बहुत ज्यादा फिसलती हैं।',
        'जलभराव: जहां पानी की गहराई का अंदाजा न हो, वहां बाइक न उतारें; खुले गड्ढे जानलेवा हो सकते हैं।',
        'प्रदूषण/धुआं: सर्दियों और स्मॉग के दौरान N95 मास्क अवश्य पहनें।'
      ],
      pa: [
        'ਗਰਮੀ ਵਿੱਚ ਪਾਣੀ ਅਤੇ ਓ.ਆਰ.ਐੱਸ. (ORS) ਪੀਂਦੇ ਰਹੋ।',
        'ਮੀਂਹ ਵਿੱਚ ਬਾਈਕ ਦੀ ਰਫਤਾਰ ਹੌਲੀ ਰੱਖੋ ਅਤੇ ਪਾਣੀ ਭਰੀਆਂ ਸੜਕਾਂ ਤੋਂ ਬਚੋ।'
      ]
    }
  },
  {
    id: 'ergonomics-lifting',
    category: 'ergonomics',
    title: 'Safe Heavy Lifting & Posture Ergonomics',
    titleHi: 'वजन उठाने का सही तरीका और पीठ की सुरक्षा',
    titlePa: 'ਭਾਰ ਚੁੱਕਣ ਦਾ ਸਹੀ ਤਰੀਕਾ ਅਤੇ ਪਿੱਠ ਦੀ ਸੁਰੱਖਿਆ',
    summary: 'Protect your spine and joints when carrying heavy grocery packs (15-25kg) or construction materials.',
    summaryHi: 'भारी ग्रोसरी बैग और सामान उठाते समय रीढ़ की हड्डी और जोड़ों को सुरक्षित रखें।',
    summaryPa: 'ਭਾਰਾ ਸਾਮਾਨ ਚੁੱਕਣ ਵੇਲੇ ਕਮਰ ਦੀ ਸੁਰੱਖਿਆ।',
    icon: 'Activity',
    keyActionPoints: {
      en: [
        'Bend at your knees and hips, NOT at your waist. Keep your back straight when lifting parcels from the ground.',
        'Hold heavy grocery cartons close to your chest, not at arm’s length.',
        'Adjust delivery backpack straps so the weight rests snug against your mid-back, not hanging low over tailbone.',
        'When mounting or dismounting a loaded two-wheeler, plant both feet firmly on level ground before lifting kickstand.'
      ],
      hi: [
        'सामान उठाते समय कमर मत झुकाएं; घुटनों को मोड़कर बैठें और पीठ सीधी रखकर वजन उठाएं।',
        'भारी डिब्बे या बैग को अपने सीने के करीब रखें।',
        'डिलीवरी बैग के स्ट्रैप को कसकर रखें ताकि वजन पीठ पर बराबर बंटे।'
      ],
      pa: [
        'ਭਾਰ ਚੁੱਕਦੇ ਸਮੇਂ ਗੋਡੇ ਮੋੜੋ, ਕਮਰ ਨਾ ਝੁਕਾਓ।',
        'ਸਾਮਾਨ ਛਾਤੀ ਦੇ ਨੇੜੇ ਰੱਖ ਕੇ ਚੁੱਕੋ।'
      ]
    }
  },
  {
    id: 'customer-conflict',
    category: 'conflict',
    title: 'Customer Conflict & Aggression De-escalation',
    titleHi: 'विवाद और दुर्व्यवहार से निपटने की रणनीति',
    titlePa: 'ਗਾਹਕ ਨਾਲ ਵਿਵਾਦ ਸੁਲਝਾਉਣ ਦੇ ਤਰੀਕੇ',
    summary: 'How to handle delayed deliveries, angry customers, and apartment security disputes without escalating.',
    summaryHi: 'देरी पर नाराज ग्राहकों या सुरक्षा गार्डों के साथ झगड़े से बचने के सुरक्षित तरीके।',
    summaryPa: 'ਨਾਰਾਜ਼ ਗਾਹਕਾਂ ਨਾਲ ਸ਼ਾਂਤੀ ਨਾਲ ਗੱਲਬਾਤ ਕਰਨ ਦੇ ਨੁਕਤੇ।',
    icon: 'ShieldAlert',
    keyActionPoints: {
      en: [
        'Remain calm and speak with a polite, even tone. Do not engage in verbal shouting matches.',
        'State factual reasons neutrally: "Sir, the kitchen took 25 minutes to pack your hot food. I brought it as fast as safety permitted."',
        'If a customer threatens physical violence, do NOT retaliate. Step back immediately, return to your vehicle, and call platform emergency support.',
        'Document incidents: Take photo of delivery location or doorstep with timestamp if delivery was refused.',
        'Never enter inside a customer’s private residence or apartment beyond the main doorway threshold.'
      ],
      hi: [
        'शांत रहें और संयम से बात करें; गुस्से का जवाब गुस्से से कभी न दें।',
        'तथ्य बताएं: "सर, रेस्टोरेंट को खाना पैक करने में समय लगा, मैंने रास्ते में कोई देरी नहीं की।"',
        'यदि कोई ग्राहक हिंसक होने की कोशिश करे, तो तुरंत पीछे हटें और ऐप पर इमरजेंसी सपोर्ट दबाएं।',
        'कभी भी किसी ग्राहक के घर के अंदर प्रवेश न करें; डिलीवरी हमेशा मुख्य दरवाजे पर ही करें।'
      ],
      pa: [
        'ਹਮੇਸ਼ਾ ਸ਼ਾਂਤ ਰਹੋ ਅਤੇ ਨਿਮਰਤਾ ਨਾਲ ਗੱਲ ਕਰੋ।',
        'ਕਿਸੇ ਵੀ ਹਾਲਤ ਵਿੱਚ ਗਾਹਕ ਦੇ ਘਰ ਦੇ ਅੰਦਰ ਨਾ ਜਾਓ।'
      ]
    }
  }
];

export const INITIAL_PRE_SHIFT_CHECKLIST: SafetyChecklistItem[] = [
  {
    id: 'check-helmet',
    label: 'Helmet & chin-strap in sound condition',
    labelHi: 'हेलमेट और स्ट्रैप सही स्थिति में है',
    labelPa: 'ਹੈਲਮੇਟ ਅਤੇ ਪੱਟੀ ਠੀਕ ਹੈ',
    checked: true,
    category: 'gear'
  },
  {
    id: 'check-brakes-tyres',
    label: 'Front and rear brakes inspected & tyre pressure checked',
    labelHi: 'ब्रेक और टायर की हवा की जांच की गई',
    labelPa: 'ਬ੍ਰੇਕਾਂ ਅਤੇ ਟਾਇਰ ਹਵਾ ਚੈੱਕ ਕੀਤੀ',
    checked: true,
    category: 'vehicle'
  },
  {
    id: 'check-lights',
    label: 'Headlight, tail brake light and indicators operational',
    labelHi: 'हेडलाइट, बैक ब्रेक लाइट और इंडिकेटर चालू हैं',
    labelPa: 'ਹੈੱਡਲਾਈਟ ਅਤੇ ਇੰਡੀਕੇਟਰ ਚੱਲਦੇ ਹਨ',
    checked: false,
    category: 'vehicle'
  },
  {
    id: 'check-phone-battery',
    label: 'Smartphone charged > 75% + Powerbank packed',
    labelHi: 'फोन 75% से अधिक चार्ज है + पावरबैंक साथ है',
    labelPa: 'ਫੋਨ ਚਾਰਜ ਹੈ ਅਤੇ ਪਾਵਰਬੈਂਕ ਨਾਲ ਹੈ',
    checked: true,
    category: 'gear'
  },
  {
    id: 'check-water',
    label: 'Drinking water bottle & ORS / glucose carried',
    labelHi: 'पीने का पानी और ओआरएस/ग्लूकोज साथ है',
    labelPa: 'ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਨਾਲ ਹੈ',
    checked: false,
    category: 'health'
  },
  {
    id: 'check-documents',
    label: 'Driving license & vehicle insurance digital copy ready in phone',
    labelHi: 'ड्राइविंग लाइसेंस और बीमा कॉपी फोन में उपलब्ध है',
    labelPa: 'ਲਾਈਸੈਂਸ ਅਤੇ ਬੀਮਾ ਫ਼ੋਨ ਵਿੱਚ ਉਪਲਬਧ ਹੈ',
    checked: true,
    category: 'gear'
  }
];

export const VERIFIED_EMERGENCY_CONTACTS = [
  {
    name: 'National Emergency Helpline',
    nameHi: 'राष्ट्रीय आपातकालीन सेवा',
    namePa: 'ਰਾਸ਼ਟਰੀ ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨ',
    number: '112',
    description: 'Unified 24x7 all-India emergency response for Police, Fire, and Ambulance.',
    descriptionHi: 'पुलिस, अग्निशमन और एम्बुलेंस के लिए एकल 24 घंटे राष्ट्रीय आपात नंबर।',
    category: 'all_emergency'
  },
  {
    name: 'National Ambulance Service',
    nameHi: 'राष्ट्रीय एम्बुलेंस सेवा',
    namePa: 'ਐਂਬੂਲੈਂਸ ਸੇਵਾ',
    number: '108',
    description: 'Free emergency medical transport and trauma accident ambulance response.',
    descriptionHi: 'सड़क दुर्घटना और गंभीर बीमारी के लिए निःशुल्क एम्बुलेंस सेवा।',
    category: 'medical'
  },
  {
    name: 'National Women Helpline',
    nameHi: 'महिला हेल्पलाइन',
    namePa: 'ਮਹਿਲਾ ਹੈਲਪਲਾਈਨ',
    number: '1091',
    description: 'Dedicated 24x7 distress helpline for women workers and female delivery partners.',
    descriptionHi: 'महिला कामगारों की सुरक्षा एवं संकट सहायता के लिए 24 घंटे समर्पित नंबर।',
    category: 'women_safety'
  },
  {
    name: 'Cybercrime Reporting Portal',
    nameHi: 'साइबर अपराध हेल्पलाइन',
    namePa: 'ਸਾਈਬਰ ਕ੍ਰਾਈਮ ਹੈਲਪਲਾਈਨ',
    number: '1930',
    description: 'Immediate reporting for UPI fraud, OTP phishing, and unauthorized bank debits.',
    descriptionHi: 'यूपीआई फ्रॉड, फर्जी ओटीपी कॉल और खाते से अनधिकृत निकासी की त्वरित शिकायत।',
    category: 'cyber_financial'
  },
  {
    name: 'National Consumer Helpline',
    nameHi: 'राष्ट्रीय उपभोक्ता हेल्पलाइन',
    namePa: 'ਖਪਤਕਾਰ ਹੈਲਪਲਾਈਨ',
    number: '1915',
    description: 'Grievance escalation for platform dispute non-resolution and unfair trade practices.',
    descriptionHi: 'प्लेटफॉर्म द्वारा गलत कटौती और शिकायत न सुनने पर सरकारी मध्यस्थता।',
    category: 'dispute'
  }
];
