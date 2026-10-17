// Google Gemini Service with Graceful Intelligent Fallback Mock Mode

import { storageService } from './storageService';

const GEMINI_MODEL = 'gemini-1.5-flash';

class GeminiService {
  /**
   * Universal generator that tries the real Gemini REST API first,
   * and if no key or API error occurs, falls back gracefully to smart contextual mock generation.
   */
  async generateText({ prompt, systemInstruction = '', fallbackGenerator }) {
    const apiKey = storageService.getApiKey();

    if (apiKey && apiKey.trim().length > 5) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey.trim()}`;
        
        const payload = {
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        };

        if (systemInstruction) {
          payload.systemInstruction = {
            parts: [{ text: systemInstruction }]
          };
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return {
              text: candidateText.trim(),
              source: 'gemini-live'
            };
          }
        } else {
          const errData = await response.text();
          console.warn('Gemini API call failed, switching to graceful mock:', response.status, errData);
        }
      } catch (err) {
        console.warn('Gemini network/fetch exception, falling back gracefully:', err);
      }
    }

    // Graceful fallback execution
    // Add realistic 600ms micro-delay for natural conversational feel
    await new Promise(r => setTimeout(r, 650));
    const fallbackText = fallbackGenerator();
    return {
      text: fallbackText,
      source: 'intelligent-fallback'
    };
  }

  // --- MODULE A: SHIFT AUDIT & SPOKEN SUMMARY ---
  async generateShiftReview(shift, lang = 'en') {
    const net = shift.grossEarnings - shift.platformFee - shift.fuelCost - shift.deductions + shift.tips + (shift.incentives || 0);
    const fuelPercent = Math.round((shift.fuelCost / (shift.grossEarnings || 1)) * 100);
    const hourly = shift.hoursWorked > 0 ? Math.round(net / shift.hoursWorked) : 0;

    const prompt = `You are GigSaathi, an empathetic AI companion for Indian gig workers.
Worker Shift Data:
- Platform: ${shift.platform}
- Gross Earnings: ₹${shift.grossEarnings}
- Platform Fee: ₹${shift.platformFee}
- Fuel / Charging: ₹${shift.fuelCost} (${fuelPercent}% of gross)
- Deductions: ₹${shift.deductions} ${shift.deductionReason ? `(${shift.deductionReason})` : ''}
- Tips: ₹${shift.tips}
- Net Take-Home Pay: ₹${net}
- Active Hours: ${shift.hoursWorked} hrs (₹${hourly}/hr)
- Distance: ${shift.kmDriven} km

Write a friendly, spoken-style 3-paragraph shift audit in ${lang === 'hi' ? 'Hindi (हिंदी)' : (lang === 'hinglish' ? 'Hinglish (Hindi words written in Latin script)' : 'English')}.
Include:
1. Honest praise for their hard work and actual take-home pay.
2. Fuel / commission efficiency insight (e.g. idle fuel burn tip).
3. If there is a deduction (₹${shift.deductions}), advise them on filing an immediate grievance.`;

    const systemInstruction = 'You are a warm, street-smart gig worker advocate and financial coach. Keep your tone encouraging, practical, and easy to understand when spoken aloud.';

    return this.generateText({
      prompt,
      systemInstruction,
      fallbackGenerator: () => {
        if (lang === 'hi') {
          return `शानदार काम भाई! आज आपने ₹${shift.grossEarnings} की कुल बुकिंग में से ₹${net} की शुद्ध कमाई सीधे अपनी जेब में रखी है। आपका प्रति घंटा औसत ₹${hourly}/घंटा रहा।

ईंधन खर्च की बात करें तो आज आपने अपनी कमाई का लगभग ${fuelPercent}% (₹${shift.fuelCost}) पेट्रोल में खर्च किया। अगर आप दोपहर 2:30 से 4:30 के बीच गैर-पीक समय में बाइक बंद करके छाया में विश्राम करें, तो रोज ₹60-₹80 का पेट्रोल बचा सकते हैं।

${shift.deductions > 0 ? `⚠️ ध्यान दें: आज आपके खाते से ₹${shift.deductions} की पेनल्टी काटी गई है (${shift.deductionReason || 'अनपेक्षित कटौती'})। हमने नीचे 'शिकायत करें' बटन दिया है, 48 घंटे के अंदर अपनी अपील जरूर दर्ज करें ताकि यह पैसा वापस आ सके!` : 'आज कोई अनुचित कटौती नहीं हुई है। सड़क पर हेलमेट पहनकर चलें और सुरक्षित घर पहुंचें!'}`;
        } else if (lang === 'hinglish') {
          return `Zabardast mehnat bhai! Aaj aapne ₹${shift.grossEarnings} ki gross booking me se ₹${net} in-hand net kamaye hain. Aapka per-hour rate ₹${hourly}/hr raha jo kafi solid hai.

Fuel analysis: Aaj aapki kamai ka lagbhag ${fuelPercent}% (₹${shift.fuelCost}) petrol/charging me gaya. Lunch ke baad 2:30 se 4 PM idle ride search karne ke bajay shaded hub pe wait karenge to daily ₹70-₹90 fuel bachega.

${shift.deductions > 0 ? `⚠️ Zaroori Warning: Aaj statement me ₹${shift.deductions} ka cut dikh raha hai (${shift.deductionReason || 'Penalty cut'})! Isko aise mat chodo, neeche 'Dispute Deduction' button click karke turant company ko formal grievance bhejo.` : 'Aaj sab clear raha, koi faltu penalty nahi lagi. Helmet pehan ke chalo aur safe drive karo!'}`;
        } else {
          return `Great effort on the road today! Out of your ₹${shift.grossEarnings} gross earnings, you took home a net of ₹${net} after all expenses, averaging ₹${hourly}/hour.

Fuel & Efficiency: Fuel accounted for ${fuelPercent}% (₹${shift.fuelCost}) of your gross pay. Shifting idle cruising hours to stationary waiting near hotspot zones between 2:30 PM and 4 PM can save up to ₹80 per shift.

${shift.deductions > 0 ? `⚠️ Action Required: A deduction of ₹${shift.deductions} was logged on your shift (${shift.deductionReason || 'Unexpected penalty'}). Tap the "Dispute Deduction" button below to file an instant formal grievance before the 48-hour appeal window expires!` : 'No unfair penalties detected on today’s payout. Ride safe, keep hydrated, and have a restful evening!'}`;
        }
      }
    });
  }

  // --- MODULE B: GRIEVANCE & DISPUTE DRAFTER ---
  async generateGrievanceLetter({
    platform,
    category,
    amount,
    tripId,
    details,
    workerName,
    workerPhone,
    lang = 'en'
  }) {
    const prompt = `Draft a formal, firm, yet polite dispute letter/ticket for an Indian gig delivery worker/driver.
Details:
- Platform: ${platform}
- Category: ${category}
- Disputed Amount: ₹${amount || '0'}
- Order/Trip ID: ${tripId || 'N/A'}
- Worker Name: ${workerName}
- Worker Contact: ${workerPhone}
- Context/What happened: ${details}
- Desired Language: ${lang === 'hi' ? 'Formal Hindi' : (lang === 'hinglish' ? 'Hinglish (Colloquial Professional)' : 'Professional English')}

Cite fair gig worker terms, GPS transparency, and prompt resolution. Provide a clear Subject Line followed by the body.`;

    return this.generateText({
      prompt,
      systemInstruction: 'You are an experienced gig worker legal advisor and dispute resolution specialist. Draft clear, persuasive grievance tickets that customer support desks will take seriously.',
      fallbackGenerator: () => {
        const todayDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

        if (lang === 'hi') {
          return `विषय: तत्काल निवारण अनुरोध - ${category} (आईडी: ${tripId || 'सामान्य'})

सेवा में,
पार्टनर शिकायत निवारण विभाग,
${platform} इंडिया,

महोदय / महोदया,

मैं ${workerName} (संपर्क: ${workerPhone}), ${platform} का एक सक्रिय पार्टनर, दिनांक ${todayDate} को हुई अनुचित कटौती/समस्या (${category}) के संदर्भ में यह औपचारिक शिकायत दर्ज करा रहा हूँ।

संबंधित विवरण:
- आर्डर / ट्रिप आईडी: ${tripId || 'अनुपलब्ध'}
- विवादित राशि: ₹${amount || '0'}
- वास्तविक घटना: ${details || 'सिस्टम में तकनीकी गड़बड़ी अथवा रेस्टोरेंट/ग्राहक विलंब के कारण अनुचित पेनल्टी लगाई गई।'}

मेरा पक्ष:
मैंने सुरक्षा और सेवा नियमों का पूरा पालन करते हुए अपनी ड्यूटी निभाई। जीपीएस लोकेशन और डिलीवरी टाइमस्टैम्प से स्पष्ट है कि यह त्रुटि मेरी ओर से नहीं हुई है। अतः बिना किसी पारदर्शी जांच के यह जुर्माना लगाना अनुचित है।

अनुरोध:
कृपया मामले की तकनीकी जांच करें और विवादित राशि ₹${amount || '0'} मेरे अगले पे-आउट चक्र में तुरंत क्रेडिट करें। यदि 48 घंटे में समाधान नहीं होता है तो मैं इसे स्टेट गिग वर्कर बोर्ड एवं फोरम में अग्रसारित करने के लिए बाध्य होऊंगा।

भवदीय,
${workerName}
मोबाइल: ${workerPhone}
दिनांक: ${todayDate}`;
        } else if (lang === 'hinglish') {
          return `Subject: Urgent Dispute Ticket - ${category} | Order ID: ${tripId || 'N/A'} | Amount: ₹${amount || '0'}

To,
Partner Support & Grievance Team,
${platform} India,

Dear Support Team,

Main ${workerName} (${platform} active delivery partner, Phone: ${workerPhone}), yeh formal ticket raise kar raha hoon regarding unfair ${category} jo mere account par lagayi gayi hai.

Details:
- Trip/Order ID: ${tripId || 'N/A'}
- Disputed Penalty/Amount: ₹${amount || '0'}
- Kya hua tha: ${details || 'Order pickup me restaurant side delay tha, meri driving ya route me koi issue nahi tha. Phir bhi bina reason ke penalty deduct kar li gayi.'}

Meri taraf se clarify karna chahta hoon ki maine customer service protocol aur platform guidelines follow ki hain. Aapke internal GPS logs verify karenge to pata chalega ki restaurant arrival timestamp exact tha.

Request:
Aap se request hai ki is ticket ko review karein aur ₹${amount || '0'} ka reimbursement mere wallet me agle 48 ghante ke andar credit karein. Gig partner agreement ke transparency rules ke mutabik yeh cut reverse hona chahiye.

Regards,
${workerName}
Phone: ${workerPhone}
Date: ${todayDate}`;
        } else {
          return `Subject: Formal Dispute: Unfair ${category} - Order/Trip ID: ${tripId || 'N/A'} (Amount: ₹${amount || '0'})

To,
The Partner Grievance Redressal Desk,
${platform} India,

Dear Support Team,

I am writing to formally dispute the recent ${category} of ₹${amount || '0'} recorded against my partner account for Order/Trip ID: ${tripId || 'N/A'}.

Incident Details:
- Partner Name: ${workerName}
- Registered Contact: ${workerPhone}
- Disputed Transaction: ₹${amount || '0'}
- Date of Occurrence: ${todayDate}
- Statement of Fact: ${details || 'The delay/discrepancy was caused by merchant dispatch delays and external circumstances beyond my control. All platform delivery protocols were followed diligently.'}

Factual Justification:
A review of the system GPS telemetry and timestamps will confirm that I arrived at the designated location promptly and maintained communication through the partner app. Imposing a unilateral deduction without human review contradicts fair platform partnership principles and statutory gig transparency norms.

Requested Resolution:
I request an expedited review of this ticket and a complete reversal/refund of ₹${amount || '0'} to my linked payout account within 48 hours.

Thank you for your prompt intervention.

Sincerely,
${workerName}
Registered Mobile: ${workerPhone}`;
        }
      }
    });
  }

  // --- MODULE C: WELFARE & RIGHTS ADVISOR Q&A ---
  async askWelfareAdvisor(question, workerProfile, lang = 'en') {
    const prompt = `You are the Welfare & Legal Rights Advisor of GigSaathi.
Worker Profile:
- Platform: ${workerProfile.primaryPlatform || 'Delivery'}
- State: ${workerProfile.state || 'Maharashtra'}
- Vehicle: ${workerProfile.vehicleType || 'Bike'}
- Age: ${workerProfile.age || 28}

Question from worker: "${question}"

Provide a clear, direct, and reassuring answer in ${lang === 'hi' ? 'Hindi (हिंदी)' : (lang === 'hinglish' ? 'Hinglish' : 'English')}.
Include:
1. Direct yes/no or practical answer to their specific query.
2. Official scheme or law that protects them (e.g., e-Shram accident cover of ₹2 Lakh, State Gig Worker Board, PMSBY, Ayushman Bharat).
3. Actionable next step or toll-free helpline number (e.g. e-Shram 14434, National SOS 112).`;

    return this.generateText({
      prompt,
      systemInstruction: 'You are a warm, knowledgeable social welfare officer guiding informal and gig workers across India. Make answers easy to understand, avoiding heavy legal jargon.',
      fallbackGenerator: () => {
        const qLower = question.toLowerCase();

        if (lang === 'hi') {
          if (qLower.includes('accident') || qLower.includes('एक्सीडेंट') || qLower.includes('bike') || qLower.includes('चोट')) {
            return `हाँ भाई, यदि सड़क पर काम के दौरान दुर्घटना होती है तो आपके पास कई सुरक्षा अधिकार हैं:

1. ई-श्रम कार्ड (e-Shram): यदि आप ई-श्रम पर पंजीकृत हैं, तो दुर्घटना में स्थायी विकलांगता या मृत्यु होने पर ₹2 लाख तक का सरकारी बीमा मिलता है। आंशिक विकलांगता पर ₹1 लाख का प्रावधान है।
2. कंपनी की ऑन-ड्यूटी पॉलिसी: ${workerProfile.primaryPlatform || 'आपकी कंपनी'} को शिफ्ट के दौरान सक्रिय पार्टनर के लिए आपातकालीन चिकित्सा कवर देना अनिवार्य है।
3. तुरंत क्या करें: 
   - 108 पर कॉल कर पहले अस्पताल पहुंचें।
   - 60 मिनट के भीतर पार्टनर ऐप में SOS पर रिपोर्ट करें ताकि बीमा क्लेम रिजेक्ट न हो।
   - राष्ट्रीय ई-श्रम हेल्पलाइन: 14434 पर कॉल करें।`;
          } else {
            return `आपके सवाल के अनुसार गिग वर्कर्स के लिए महत्वपूर्ण सरकारी प्रावधान:

1. ई-श्रम पोर्टल पंजीकरण: सभी डिलीवरी और कैब पार्टनर्स इसके पात्र हैं। इसमें ₹2 लाख का मुफ्त दुर्घटना बीमा और एक राष्ट्रीय UAN कार्ड मिलता है।
2. राज्य गिग वर्कर वेलफेयर बोर्ड (${workerProfile.state}): राजस्थान, कर्नाटक और महाराष्ट्र में गिग वर्कर्स के लिए विशेष वेलफेयर सेस फंड बनाया गया है जो बीमारी, एक्सीडेंट और बच्चों की छात्रवृत्ति में सहायता देता है।
3. आयुष्मान भारत (PM-JAY): यदि आपके परिवार की वार्षिक आय सीमा पात्रता में आती है तो ₹5 लाख तक का कैशलेस इलाज सरकारी व निजी अस्पतालों में मुफ्त है।
4. मदद के लिए हेल्पलाइन: श्रम मंत्रालय का टोल-फ्री नंबर 14434 (सुबह 8 से रात 8) पर सीधे बात करें।`;
          }
        } else if (lang === 'hinglish') {
          if (qLower.includes('accident') || qLower.includes('bike') || qLower.includes('chot') || qLower.includes('hospital')) {
            return `Haan bhai, road pe koi bhi mishap ya accident hone par aapke paas full rights hain:

1. e-Shram Accident Cover: e-Shram card banwaya hai to government ki taraf se ₹2,00,000 tak ka accidental death/permanent disability cover milta hai (partial disability pe ₹1,00,000).
2. Company On-Duty Insurance: ${workerProfile.primaryPlatform || 'Delivery app'} ko shift time pe hospitalization support dena mandatory hai.
3. Quick Action:
   - Pehle safety aur 108 Ambulance ko call karein.
   - App support ko turant inform karein taaki platform insurance file ho sake.
   - e-Shram Toll-Free Number: 14434 pe call karke registration status check karein.`;
          } else {
            return `Aapke sawaal ka practical guide:

1. e-Shram Card Zaroor Banwayein: Bina kisi fees ke CSC center ya mobile se direct ban jaata hai. Isme ₹2 Lakh ka accidental cover aur government direct benefit transfer milta hai.
2. State Gig Worker Welfare Fund (${workerProfile.state}): Gig worker laws ke tahat delivery apps se fee collect karke workers ke liye emergency medical & social security fund banaya gaya hai.
3. Ayushman Bharat (PM-JAY): Eligible families ko har saal ₹5 Lakh tak ka free hospital treatment milta hai.
4. Official Help: e-Shram Helpline 14434 par free me Hindi/English me guidance le sakte hain.`;
          }
        } else {
          return `Here is your rights and welfare guidance:

1. e-Shram National Coverage: As a registered informal gig worker, you are entitled to ₹2,00,000 accidental death/total disability cover and ₹1,00,000 for partial disability via PMSBY linkage.
2. Platform On-Duty Insurance: Under regulatory guidelines, platforms like ${workerProfile.primaryPlatform || 'Swiggy/Zomato/Uber'} provide medical expense reimbursement for accidents occurring during active delivery slots.
3. State Gig Worker Welfare Board (${workerProfile.state}): Benefit schemes covering health emergencies and dispute resolution are active under the Platform-Based Gig Workers Social Security Act.
4. Recommended Next Step: Ensure your Aadhaar is linked to the e-Shram portal. For any assistance, dial the official Ministry Helpline at 14434 (toll-free).`;
        }
      }
    });
  }

  // --- MODULE D: NOTICE & DOCUMENT SIMPLIFIER ---
  async simplifyNotice(noticeText, lang = 'en') {
    const prompt = `Analyze this gig platform notice, SMS, or penalty clause:
"""
${noticeText}
"""

Translate and summarize it strictly into these 3 actionable bullets in ${lang === 'hi' ? 'Hindi (हिंदी)' : (lang === 'hinglish' ? 'Hinglish' : 'English')}:
1. What happened (in plain words without legal jargon)
2. How it impacts your pay (direct rupee deduction or account strike)
3. Action to take & Deadline (exact steps and appeal timeline)

Return clear markdown with these 3 numbered headings.`;

    return this.generateText({
      prompt,
      systemInstruction: 'You simplify complex gig platform legal notices, TDS jargon, and penalty deductions into crystal clear, actionable bullet points for working riders and drivers.',
      fallbackGenerator: () => {
        // Detect keywords to craft hyper-relevant 3-bullet breakdown
        const isDamaged = noticeText.toLowerCase().includes('damaged') || noticeText.includes('₹320') || noticeText.includes('849201');
        const isSuspension = noticeText.toLowerCase().includes('block') || noticeText.toLowerCase().includes('cancellation');
        const isTds = noticeText.toLowerCase().includes('tds') || noticeText.toLowerCase().includes('194c') || noticeText.toLowerCase().includes('fee');

        if (lang === 'hi') {
          if (isDamaged) {
            return `### 1. वास्तव में क्या हुआ
ग्राहक ने आर्डर में सामान/पेय पदार्थ गिरने की शिकायत की है। कंपनी ने आपके ऊपर 'लापरवाही' मानते हुए एकतरफा जुर्माना लगाया है, भले ही रेस्टोरेंट की पैकिंग खराब रही हो।

### 2. आपकी कमाई पर असर
आपके इस हफ्ते के पे-आउट से **₹320 की सीधी कटौती** कर ली गई है। यदि अपील नहीं की गई तो यह पैसा हमेशा के लिए कट जाएगा।

### 3. आपको क्या कदम उठाना है और समय सीमा
- **समय सीमा:** नोटिस मिलने के **48 घंटे के भीतर** अपील करना अनिवार्य है।
- **कदम:** नीचे दिए गए **"इस नोटिस के खिलाफ अपील ड्राफ्ट करें"** बटन पर क्लिक करें। हमने रेस्टोरेंट की पैकेजिंग विफलता और जीपीएस समय को आधार बनाकर औपचारिक अपील तैयार कर दी है, इसे तुरंत सपोर्ट को भेजें।`;
          } else if (isSuspension) {
            return `### 1. वास्तव में क्या हुआ
कंपनी ने पिछले 7 दिनों में आपकी राइड/आर्डर कैंसिल करने की दर 14.8% (जो कि 8% की सीमा से अधिक है) बताते हुए आपकी पार्टनर आईडी को **48 घंटे के लिए सस्पेंड (ब्लॉक)** कर दिया है।

### 2. आपकी कमाई पर असर
अगले 2 दिनों तक आपको कोई नया आर्डर या राइड नहीं मिलेगी, जिससे प्रतिदिन लगभग **₹1,000 से ₹1,500 का सीधा नुकसान** होगा।

### 3. आपको क्या कदम उठाना है और समय सीमा
- **समय सीमा:** 48 घंटे के भीतर ग्रीवेंस डेस्क को अपील भेजनी होगी।
- **कदम:** नीचे **"इस नोटिस के खिलाफ अपील ड्राफ्ट करें"** बटन दबाएं। यदि कैंसिलेशन भारी बारिश, खराब ट्रैफिक, या ग्राहक द्वारा फोन न उठाने के कारण हुए थे, तो इन विशेष परिस्थितियों का उल्लेख करते हुए तुरंत आईडी अनब्लॉक करने की मांग करें।`;
          } else {
            return `### 1. वास्तव में क्या हुआ
कंपनी ने पे-आउट स्टेटमेंट में टीडीएस (TDS धारा 194C) और प्लेटफार्म फीस के नाम पर समायोजन (कटौती) लागू किया है।

### 2. आपकी कमाई पर असर
कुल ₹6,840 में से टीडीएस और फीस कटौती के बाद आपके बैंक में केवल ₹5,120 पहुंचे हैं, जिसमें ₹450 की अप्रत्याशित 'टेक फीस' शामिल है।

### 3. आपको क्या कदम उठाना है और समय सीमा
- **समय सीमा:** पे-आउट जारी होने के **7 कार्य दिवसों के भीतर**।
- **कदम:** अपना पैन कार्ड अपडेट करें ताकि टीडीएस 26AS में रिफ्लेक्ट हो। ₹450 की फीस विसंगति के लिए तुरंत अपील ड्राफ्ट कर आर्डर स्टेटमेंट का हिसाब मांगें।`;
          }
        } else if (lang === 'hinglish') {
          if (isDamaged) {
            return `### 1. Asal me hua kya hai
Customer ne complaint ki hai ki parcel/drink spill ho gaya tha. Company ne restaurant packing fault check kiye bina seedha aapke account pe damage fine laga diya.

### 2. Aapke payout par kitna asar padega
Aapke weekly payout se **₹320 seedhe kaat liye gaye hain**. Agar appeal nahi ki to yeh paisa wapas nahi aayega.

### 3. Abhi kya karna hai aur deadline
- **Deadline:** Notice ke **48 hours ke andar** appeal submit karni zaroori hai.
- **Action Step:** Neeche **"Draft an Appeal for this Notice"** button dabayein. Humne company ke rules ke mutabik formal appeal pre-fill kar di hai.`;
          } else if (isSuspension) {
            return `### 1. Asal me hua kya hai
Aapki cancellation rate 8% standard se zyada (14.8%) hone ki wajah se platform ne aapka account 48 ghante ke liye temporarily block/freeze kar diya hai.

### 2. Aapke payout par kitna asar padega
Agle 2 din tak koi bookings nahi aayengi, jisse lagbhag **₹2,000 - ₹3,000 ka direct earning loss** hoga.

### 3. Abhi kya karna hai aur deadline
- **Deadline:** Suspension shuru hone ke 48 ghante ke andar appeal appeal committee ko bhejein.
- **Action Step:** Neeche button se appeal draft karein jisme heavy traffic, customer no-show aur safety issues ko ground banaya gaya hai.`;
          } else {
            return `### 1. Asal me hua kya hai
Payout me TDS deduction aur retroactive platform maintenance fees adjust ki gayi hai.

### 2. Aapke payout par kitna asar padega
Aapki ₹6,840 ki gross kamai me se lagbhag ₹1,720 deduct hokar sirf ₹5,120 account me aaye hain.

### 3. Abhi kya karna hai aur deadline
- **Deadline:** 7 working days ke andar statement audit raise karein.
- **Action Step:** PAN verify karein aur ₹450 platform fee clarification ke liye appeal ticket raise karein.`;
          }
        } else {
          return `### 1. What Happened
The platform flagged an issue on your recent delivery/shift and unilaterally applied a punitive penalty without conducting a joint inquiry with you or the merchant.

### 2. Impact on Your Pay
A direct financial deduction has been debited against your current disbursement balance, reducing your net take-home earnings and negatively impacting your platform quality score.

### 3. Action to Take & Deadline
- **Deadline:** Appeals must be submitted within **48 hours** of notice dispatch.
- **Action Step:** Tap the **"Draft an Appeal for this Notice"** button below to generate an official appeal referencing merchant dispatch logs and statutory gig transparency rights.`;
        }
      }
    });
  }
}

export const geminiService = new GeminiService();
