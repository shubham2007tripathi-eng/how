import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { BNS_FULL_REFERENCE_TEXT, BNS_CATEGORIES, EMERGENCY_NUMBERS, QUICK_QUESTIONS } from './src/data/bnsKnowledgeBase';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client lazily or safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set. Please set it in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Dynamic System Instruction generator according to user's selected language mode
function getSystemInstruction(languageMode: string = 'hindi'): string {
  let langDirective = '';

  if (languageMode === 'english') {
    langDirective = `
================================================================================
STRICT LANGUAGE DIRECTIVE - ENGLISH ONLY (CRITICAL):
================================================================================
- The user selected ENGLISH as their language setting.
- You MUST respond ENTIRELY in fluent, clear, simple, and professional ENGLISH.
- Do NOT output Devanagari Hindi or Hinglish text (except when referencing official titles like 'Bharatiya Nyaya Sanhita').
- Every explanation, legal section, immediate steps, required documents, and hotline number MUST be written in ENGLISH.
- Always conclude your response with this exact disclaimer in English:
  "I am an AI assistant, not a lawyer. For court cases, consult a legal professional."
`;
  } else if (languageMode === 'hindi') {
    langDirective = `
================================================================================
STRICT LANGUAGE DIRECTIVE - HINDI (हिंदी) ONLY (CRITICAL):
================================================================================
- The user selected HINDI (हिंदी) as their language setting.
- You MUST respond ENTIRELY in clean, fluent, natural Devanagari HINDI (हिंदी).
- Do NOT output English or Roman script unless citing an official section number (e.g. BNS Section 303).
- Every explanation, legal section, immediate steps, required documents, and hotline number MUST be written in HINDI (हिंदी).
- Always conclude your response with this exact disclaimer in Hindi:
  "मैं एक AI सहायक हूँ, वकील नहीं। अदालत के मामलों के लिए किसी कानूनी पेशेवर से सलाह लें।"
`;
  } else {
    // Hinglish
    langDirective = `
================================================================================
STRICT LANGUAGE DIRECTIVE - HINGLISH ONLY (CRITICAL):
================================================================================
- The user selected HINGLISH mode.
- Respond in smooth, natural, everyday Hinglish (Hindi written in Roman script mixed with simple English words).
- Always conclude your response with this exact disclaimer:
  "I am an AI assistant, not a lawyer. For court cases, consult a legal professional."
`;
  }

  return `
You are 'Justice Voice' (न्याय वाणी in Hindi), an expert legal assistant for Indian citizens, specializing in the Bharatiya Nyaya Sanhita (BNS 2023). When answering in Pure Devanagari Hindi, refer to yourself as 'न्याय वाणी'.

${langDirective}

================================================================================
COLLOQUIAL HINDI TO LEGAL SECTION MAPPING DIRECTORY:
================================================================================
1. THEFT / SNATCHING / ROBBERY: BNS Section 303 (Theft), BNS Section 304 (Snatching), BNS Section 309 (Robbery).
2. DOMESTIC VIOLENCE / CRUELTY: BNS Section 85 & Section 86 (Cruelty), Domestic Violence Act 2005.
3. CYBER FRAUD / ONLINE SCAM: BNS Section 318 (Cheating), BNS Section 319 (Cheating by Personation), IT Act.
4. ASSAULT / HURT: BNS Section 115 (Causing Hurt), BNS Section 117 (Grievous Hurt).
5. BLACKMAIL / VOYEURISM / STALKING: BNS Section 308 (Extortion), BNS Section 77 (Voyeurism), BNS Section 78 (Stalking).

BNS AND LEGAL REFERENCE SECTIONS:
${BNS_FULL_REFERENCE_TEXT}
`.trim();
}

function sanitizeTextForUIAndVoice(rawText: string): string {
  if (!rawText) return "Kripya dobara koshish karein, koi jawab prapt nahi hua.";
  let cleaned = rawText.replace(/[\*\#\_\[\]\(\)\`\~]/g, '');
  cleaned = cleaned.replace(/^\s*[-*]\s*/gm, '• ');
  cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');
  return cleaned.trim();
}

// API Route for BNS Reference Metadata
app.get('/api/bns/metadata', (req, res) => {
  res.json({
    categories: BNS_CATEGORIES,
    emergencyNumbers: EMERGENCY_NUMBERS,
    quickQuestions: QUICK_QUESTIONS,
  });
});

// API Route for Justice Voice Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, languageMode = 'hindi' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required' });
    }

    let replyText = '';
    const apiKey = process.env.GEMINI_API_KEY;

    // Only attempt live Gemini call if API key exists and is not a dummy key
    if (apiKey && !apiKey.startsWith('AQ.') && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = getGeminiClient();

        // Prepare contents including history if available
        const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        if (Array.isArray(history)) {
          for (const msg of history) {
            if ((msg.role === 'user' || msg.role === 'model') && Array.isArray(msg.parts) && msg.parts[0]?.text) {
              formattedContents.push({
                role: msg.role,
                parts: [{ text: msg.parts[0].text }],
              });
            }
          }
        }

        // Append current message
        formattedContents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const systemInstruction = getSystemInstruction(languageMode);

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        replyText = sanitizeTextForUIAndVoice(response.text || '');
      } catch (apiErr: any) {
        // Fall back gracefully to BNS Knowledge Base matcher
        replyText = generateLocalBNSFallbackResponse(message, languageMode);
      }
    }

    if (!replyText) {
      replyText = generateLocalBNSFallbackResponse(message, languageMode);
    }

    res.json({ reply: replyText });
  } catch (err: any) {
    res.json({ reply: generateLocalBNSFallbackResponse(req.body?.message || '', req.body?.languageMode || 'hindi') });
  }
});

// Helper function for local intelligent BNS responses in user's selected language
function generateLocalBNSFallbackResponse(userMessage: string, languageMode: string = 'hindi'): string {
  const msg = (userMessage || '').toLowerCase();

  const DISCLAIMER_EN = "I am an AI assistant, not a lawyer. For court cases, consult a legal professional.";
  const DISCLAIMER_HI = "मैं एक AI सहायक हूँ, वकील नहीं। अदालत के मामलों के लिए किसी कानूनी पेशेवर से सलाह लें।";

  const isEn = languageMode === 'english';
  const isHi = languageMode === 'hindi';

  // 1. Phone Theft / Loss / Chori / Snatching
  if (
    msg.includes('phone') || msg.includes('mobile') || msg.includes('stolen') || msg.includes('chori') ||
    msg.includes('gum') || msg.includes('snatch') || msg.includes('फोन') || msg.includes('मोबाइल') ||
    msg.includes('चोरी') || msg.includes('छीन') || msg.includes('गुम') || msg.includes('खो')
  ) {
    if (isEn) {
      return `You do not need to worry. Let us see what the law says regarding phone theft or snatching. Mobile theft is classified as Theft under BNS Section 303, and forcibly snatching a mobile is a serious offense under BNS Section 304 (Snatching). Taking or snatching someone's mobile phone without consent is a punishable crime.

Immediate steps you must take:
1. Contact your mobile network operator and bank immediately to block your SIM card and mobile wallets to prevent unauthorized transactions.
2. Visit your nearest police station to lodge an FIR or a Zero FIR.
3. Visit the central CEIR portal (ceir.gov.in) to block your phone's IMEI number nationwide.

Required documents: Mobile purchase invoice/bill with IMEI number, your ID proof (Aadhaar or Voter ID), and a copy of the police complaint.

In case of emergency, call Police Control Room 112 or Cyber Crime Helpline 1930 immediately.

${DISCLAIMER_EN}`;
    }

    if (isHi) {
      return `आपको बिल्कुल परेशान होने की ज़रूरत नहीं है, आइए देखते हैं कानून इस विषय में क्या कहता है। मोबाइल चोरी होना BNS धारा 303 के तहत चोरी (Theft) है और हाथ से छीन कर ले जाना BNS धारा 304 के तहत स्नेचिंग (Snatching) का गंभीर अपराध है। बिना अनुमति किसी का मोबाइल लेना या छीनना एक दंडनीय अपराध है।

आपको तुरंत कुछ ज़रूरी कदम उठाने चाहिए:
1. सबसे पहले अपने मोबाइल ऑपरेटर और बैंक को कॉल करके अपनी SIM कार्ड और UPI/मोबाइल वॉलेट ब्लॉक करवाएं ताकि कोई दुरुपयोग न हो।
2. अपने नजदीकी पुलिस स्टेशन जाकर FIR या Zero FIR दर्ज करवाएं।
3. सेंट्रल CEIR पोर्टल (ceir.gov.in) पर जाकर अपने फोन का IMEI नंबर ऑनलाइन ब्लॉक करवाएं।

शिकायत के लिए ज़रूरी दस्तावेज़: मोबाइल का बिल/इनवॉइस (IMEI नंबर के साथ), आपका आधार कार्ड/आईडी प्रूफ, और पुलिस शिकायत की कॉपी।

इमरजेंसी में आप पुलिस हेल्पलाइन 112 या साइबर क्राइम हेल्पलाइन 1930 पर तुरंत कॉल कर सकते हैं।

${DISCLAIMER_HI}`;
    }

    return `Aapko bilkul pareshan hone ki zarurat nahi hai, aaiye dekhte hain kanoon is vishay me kya kehta hai. Mobile chori hona BNS Dhara 303 ke under theft hai aur haath se chheen kar le jana BNS Dhara 304 ke under snatching ka serious offence hai. Bina permission kisi ka mobile lena ya chheen-jhapat karna ek dandniya crime hai.

Aapko abhi turant kuch zaroori steps lene chahiye. Sabse pehle apne mobile operator aur bank ko call karke apni SIM card aur mobile wallets block karwayein taaki koi misuse na ho sake. Iske baad apne nearest police station jakar FIR ya Zero FIR darj karwayein, aur central CEIR portal par online jakar apne phone ka IMEI number block karwayein.

Iskeliye aapko kuch basic proofs chahiye honge, jaise mobile ka khareed bill ya invoice jisme IMEI number ho, aapka Aadhaar card ya photo ID proof, aur police complaint ki copy. Kisi bhi emergency me aap Police Helpline 112 ya Cyber Crime Helpline 1930 par turant call kar sakte hain.

${DISCLAIMER_EN}`;
  }

  // 2. Photo Leak / Blackmail / Online Harassment / Dhamki / Extortion
  if (
    msg.includes('leak') || msg.includes('blackmail') || msg.includes('photo') || msg.includes('private') ||
    msg.includes('stalk') || msg.includes('dhamki') || msg.includes('extort') || msg.includes('threat') ||
    msg.includes('फोटो') || msg.includes('लीक') || msg.includes('ब्लैकमेल') || msg.includes('धमकी') ||
    msg.includes('प्राइवेट') || msg.includes('तस्वीर') || msg.includes('विडियो') || msg.includes('वीडियो')
  ) {
    if (isEn) {
      return `Please stay calm, the law is completely on your side. Threatening to leak private photos or demanding money is a severe crime under BNS Section 308 (Extortion), BNS Section 77 (Voyeurism), and BNS Section 78 (Stalking).

Immediate action steps:
1. Do not pay any money or fulfill any demands of the blackmailer.
2. Call Cyber Helpline 1930 immediately or register a complaint online at cybercrime.gov.in.
3. Visit your nearest police station or Mahila Thana to lodge an FIR.

Required evidence: Save all blackmail messages, chat screenshots, call logs, and dates securely.

Emergency contact numbers: Cyber Crime 1930, Women Helpline 1091 / 181, and Police 112.

${DISCLAIMER_EN}`;
    }

    if (isHi) {
      return `आप बिल्कुल मत घबराएं, कानून पूरी तरह से आपके साथ है। प्राइवेट फोटो लीक करने की धमकी देना या पैसे मांगना BNS धारा 308 (Extortion), BNS धारा 77 (Voyeurism), और BNS धारा 78 (Stalking) के तहत गंभीर कानूनी अपराध है।

आपको तुरंत ये कदम उठाने चाहिए:
1. अपराधी को एक भी रुपया न दें और उसकी कोई मांग पूरी न करें।
2. तुरंत साइबर हेल्पलाइन 1930 पर कॉल करें या cybercrime.gov.in पोर्टल पर शिकायत दर्ज कराएं।
3. अपने नजदीकी पुलिस स्टेशन या महिला थाना जाकर FIR दर्ज करवाएं।

सबूत के रूप में ब्लैकमेलेर के मैसेज, चैट के स्क्रीनशॉट, और कॉल रिकॉर्ड संभाल कर रखें। इमरजेंसी में आप Cyber Crime 1930, Women Helpline 1091/181, या Police 112 पर कॉल कर सकते हैं।

${DISCLAIMER_HI}`;
    }

    return `Aap bilkul mat ghabrayein, kanoon poori tarah se aapke saath hai. Private photos leak karne ki dhamki dena ya paise mangna BNS Dhara 308 extortion, BNS Dhara 77 voyeurism, aur BNS Dhara 78 stalking ke under gambhir kanooni apradh hai.

Aapko abhi turant yeh kadam uthane chahiye. Sabse pehle apradhi ko ek bhi rupaya mat dein aur uski koi demand poori na karein. Aap turant Cyber Helpline 1930 par call karein ya cybercrime.gov.in portal par complaint darj karein, aur apne nearest police station ya Mahila Thana jakar FIR likhwayein.

Case darj karwane ke liye aapko blackmailing messages aur chats ke screenshots, call records, aur dates safe rakhni hongi. Emergency me aap Cyber Crime 1930, Women Helpline 1091 ya 181, aur Police 112 par sampark kar sakte hain.

${DISCLAIMER_EN}`;
  }

  // 3. Cyber / Financial Fraud / Paise Kat Gaye / UPI / OTP Fraud / Scam
  if (
    msg.includes('paise') || msg.includes('money') || msg.includes('kat gaye') || msg.includes('upi') ||
    msg.includes('cyber') || msg.includes('fraud') || msg.includes('otp') || msg.includes('scam') ||
    msg.includes('account') || msg.includes('पैसा') || msg.includes('पैसे') || msg.includes('खाता') ||
    msg.includes('खाते') || msg.includes('बैंक') || msg.includes('साइबर') || msg.includes('फ्रॉड') ||
    msg.includes('ऑनलाइन') || msg.includes('यूपीआई') || msg.includes('ओटीपी') || msg.includes('स्कैम') ||
    msg.includes('धोखा') || msg.includes('कट')
  ) {
    if (isEn) {
      return `Do not worry, let us understand what the law says regarding financial fraud. Online financial scams involving fake QR codes, OTP sharing, or unauthorized bank debits are punishable offenses under BNS Section 318 (Cheating) and BNS Section 319 (Cheating by Personation).

Immediate steps you must take without delay:
1. Immediately dial National Cyber Crime Helpline 1930 and provide your transaction details so the money transfer can be frozen in time.
2. Call your bank immediately to block your UPI ID, debit card, and bank account.
3. Lodge a formal online complaint at cybercrime.gov.in.

Required documents: Transaction reference UTR number, bank statement, and screenshots of scam messages.

Emergency contacts: Cyber Crime 1930 and Police Helpline 112.

${DISCLAIMER_EN}`;
    }

    if (isHi) {
      return `आप परेशान मत होइए, आइए समझते हैं कि इस मामले में कानून क्या कहता है। फर्जी QR कोड, OTP पूछना, या ऑनलाइन धोखाधड़ी से पैसे कट जाना BNS धारा 318 (Cheating) और BNS धारा 319 (Cheating by Personation) के तहत आपराधिक धोखाधड़ी है।

आपको बिना वक्त गंवाए तुरंत ये कदम उठाने होंगे:
1. सबसे पहले नेशनल साइबर क्राइम हेल्पलाइन 1930 पर कॉल करके ट्रांजैक्शन की जानकारी दें ताकि पैसे आगे ट्रांसफर होने से रोके जा सकें।
2. अपने बैंक को कॉल करके अपनी UPI आईडी, डेबिट कार्ड, और अकाउंट तुरंत ब्लॉक/फ्रीज करवाएं।
3. cybercrime.gov.in पर शिकायत दर्ज करवाएं।

शिकायत के लिए आपको ट्रांजैक्शन यूटीआर (UTR) नंबर, बैंक स्टेटमेंट, और मैसेज के स्क्रीनशॉट की ज़रूरत होगी। सहायता के लिए Cyber Crime 1930 और Police 112 पर तुरंत संपर्क करें।

${DISCLAIMER_HI}`;
    }

    return `Aap pareshan mat hoiye, aaiye samajhte hain ki is mamle me kanoon kya kehta hai. Fake QR code, OTP poochhna, ya online investment ke naam par paise katna BNS Dhara 318 cheating aur BNS Dhara 319 cheating by personation ke under criminal fraud hai.

Is waqt aapko bina waqt gavaye turant action lena hoga. Sabse pehle National Cyber Crime Helpline 1930 par call karke transaction details batayein taaki paise aage transfer hone se roke ja sakein. Apne bank ko call karke apna UPI ID, debit card, aur account freeze karwayein, aur cybercrime.gov.in par complaint darj karein.

Shikayat ke liye aapko transaction reference UTR number, bank statement, aur scam messages ke screenshots ki zarurat hogi. Kisi bhi emergency help ke liye Cyber Crime 1930 aur Police Control Room 112 hamesha uplabdha hain.

${DISCLAIMER_EN}`;
  }

  // 4. Domestic Violence / Gharelu Hinsa / Cruelty
  if (
    msg.includes('domestic') || msg.includes('violence') || msg.includes('cruelty') || msg.includes('gharelu') ||
    msg.includes('pati') || msg.includes('marpeet') || msg.includes('डोमेस्टिक') || msg.includes('वायलेंस') ||
    msg.includes('घरेलू') || msg.includes('हिंसा') || msg.includes('मारपीट') || msg.includes('पति') ||
    msg.includes('प्रताड़ित') || msg.includes('ससुराल')
  ) {
    if (isEn) {
      return `Please do not worry, Indian law provides stringent protection for women. Physical or mental harassment by husband or relatives is a punishable offense under BNS Section 85 & Section 86 (Cruelty) and the Protection of Women from Domestic Violence Act 2005.

Immediate action steps:
1. For emergency protection, call Women Helpline 181, 1091, or Emergency 112.
2. Contact the Protection Officer in your district, District Legal Services Authority (DLSA) for free legal aid, or visit the nearest Women Police Station (Mahila Thana) for a safety protection order.

Required evidence: Medical treatment receipts/slips, photos of injuries, and your identity proof.

Emergency helpline numbers: Women Helpline 181 / 1091 and Police 112.

${DISCLAIMER_EN}`;
    }

    if (isHi) {
      return `आप बिल्कुल चिंता न करें, कानून महिलाओं की सुरक्षा के लिए बहुत सख्त है। पति या ससुराल वालों द्वारा शारीरिक या मानसिक हिंसा करना BNS धारा 85 व धारा 86 (Cruelty), और घरेलू हिंसा अधिनियम 2005 (Domestic Violence Act) के तहत दंडनीय अपराध है।

आपको तुरंत ये कदम उठाने चाहिए:
1. इमरजेंसी सुरक्षा के लिए वूमेन हेल्पलाइन 181, 1091 या Emergency 112 पर कॉल करें।
2. अपने इलाके के प्रोटेक्शन ऑफिसर (Protection Officer), जिला कानूनी सेवा प्राधिकरण (DLSA), या नजदीकी महिला थाना से संपर्क करके सुरक्षा आदेश मांगें।

प्रमाण के तौर पर डॉक्टर की मेडिकल पर्ची, चोट की तस्वीरें, और आपका पहचान पत्र काम आएगा। आपातकालीन सहायता के लिए 181, 1091 या 112 पर कॉल करें।

${DISCLAIMER_HI}`;
    }

    return `Aap bilkul chinta na karein, kanoon mahilao ki suraksha ke liye bahut sakht hai. Pati ya sasural walon dwara sharirik ya mansik hinsa karna BNS Dhara 85 aur Dhara 86 cruelty, aur Domestic Violence Act 2005 ke under dandniya apradh hai.

Aapko turant madad lene ke liye yeh kadam uthane chahiye. Emergency protection ke liye Women Helpline 181 ya Emergency 112 par call karein. Aap apne ilake ke Protection Officer, District Legal Services Authority DLSA, ya nearest Mahila Thana se sampark karke safety order maang sakti hain.

Pramaan ke taur par doctor ki medical treatment slips, chot ke photos, aur aapka identity proof ya marriage document kaam aayega. Emergency help ke liye Women Helpline 181 ya 1091 aur Police 112 par kisi bhi waqt call karein.

${DISCLAIMER_EN}`;
  }

  // 5. FIR / Zero FIR / Police Station
  if (
    msg.includes('fir') || msg.includes('zero fir') || msg.includes('police station') || msg.includes('complain') ||
    msg.includes('एफआईआर') || msg.includes('जीरो एफआईआर') || msg.includes('पुलिस') || msg.includes('थाना') ||
    msg.includes('शिकायत') || msg.includes('रिपोर्ट')
  ) {
    if (isEn) {
      return `Filing an FIR is your fundamental legal right. Under BNS Section 173, police are obligated to record an FIR for any cognizable offense. Even if the crime occurred in a different jurisdiction, police must register a Zero FIR immediately.

Immediate action steps:
1. Visit the nearest police station and submit a written complaint detailing date, time, and incident facts.
2. Ensure you obtain a free stamped copy of the FIR with the FIR number.
3. If police refuse to register your FIR, you can send a written complaint to the Superintendent of Police (SP) or approach a Judicial Magistrate.

Required documents: Signed written application, date/time/location details, and your photo ID.

Emergency hotline: Police Control Room 112.

${DISCLAIMER_EN}`;
    }

    if (isHi) {
      return `एफआईआर दर्ज करवाना आपका कानूनी अधिकार है। BNS धारा 173 के तहत किसी भी गंभीर अपराध की शिकायत मिलने पर पुलिस को एफआईआर लिखना अनिवार्य है। यदि घटना किसी अन्य क्षेत्र में हुई हो, तब भी आप किसी भी पुलिस स्टेशन में जीरो एफआईआर (Zero FIR) दर्ज करवा सकते हैं।

आपको ये कदम उठाने चाहिए:
1. नजदीकी पुलिस स्टेशन जाकर लिखित शिकायत (Written Complaint) दें और उस पर मुहर (Stamp) व एफआईआर नंबर वाली मुफ्त कॉपी जरूर लें।
2. यदि पुलिस एफआईआर लिखने से मना करती है, तो आप वरिष्ठ पुलिस अधीक्षक (SP) या मजिस्ट्रेट को लिखित शिकायत भेज सकते हैं।

शिकायत के लिए ज़रूरी दस्तावेज़: हस्ताक्षरित आवेदन (Signed Application) और आपका पहचान पत्र (आधार/वोटर आईडी)। इमरजेंसी के लिए 112 पर कॉल करें।

${DISCLAIMER_HI}`;
    }

    return `Aapko pareshan hone ki zarurat nahi hai, FIR darj karwana aapka kanooni adhikar hai. BNS Dhara 173 ke under kisi bhi serious crime ki complaint par police ko FIR likhna zaroori hai. Agar ghatna kisi doosre ilake me hui ho tab bhi aap kisi bhi police station me Zero FIR darj karwa sakte hain.

Aapko abhi nearest police station jakar written complaint submit karni chahiye aur stamp va FIR number wali free copy zaroor leni chahiye. Agar police FIR likhne se mana kare toh aap Senior Police Officer SP ya Magistrate ko written complaint bhej sakte hain.

Shikayat ke liye aapko ek signed application jisme date, time aur location likhi ho, aur aapka Aadhaar ya Voter ID proof chahiye hoga. Emergency madad ke liye Police Control Room 112 par call karein.

${DISCLAIMER_EN}`;
  }

  // General Fallback
  if (isEn) {
    return `Under the Bharatiya Nyaya Sanhita (BNS 2023), every citizen is entitled to legal protection and procedural rights. You have the right to lodge a formal complaint at any police station regarding any illegal act or grievance.

Please share more details about your issue (e.g. mobile theft, online fraud, domestic violence, or filing an FIR) so I can provide the exact BNS sections and immediate action steps in English.

For urgent emergency assistance, contact Police Helpline 112, Cyber Crime 1930, or Women Helpline 181/1091 immediately.

${DISCLAIMER_EN}`;
  }

  if (isHi) {
    return `भारतीय न्याय संहिता (BNS 2023) के अनुसार आपको पूरा कानूनी अधिकार और सुरक्षा प्राप्त है। हर नागरिक किसी भी अपराध या समस्या के खिलाफ पुलिस में लिखित शिकायत दर्ज करवा सकता है।

कृपया अपनी समस्या से जुड़ी जानकारी विस्तार से बताएं (जैसे मोबाइल चोरी, ऑनलाइन धोखाधड़ी, घरेलू हिंसा, या एफआईआर दर्ज करवाना) ताकि हम BNS 2023 की सटीक धारा और तुरंत उठाए जाने वाले कदमों की जानकारी हिंदी में दे सकें।

इमरजेंसी सहायता के लिए पुलिस 112, साइबर क्राइम 1930, वूमेन हेल्पलाइन 181/1091 पर तुरंत कॉल करें।

${DISCLAIMER_HI}`;
  }

  return `Aapke dwara poochhe gaye sawal par Bharatiya Nyaya Sanhita (BNS) 2023 ke mutabiq aapko poora kanooni adhikar prapt hai. Har nagrik kisi bhi apradh ya pareshani ke khilaf police me written complaint darj karwa sakta hai.

Kripya apni samasya se judi detail batayein (jaise mobile chori, online dhokhadhadi, gharelu hinsa, ya FIR darj karwana) taaki hum BNS 2023 ke exact section aur turant lene wale steps ki jankari de sakein.

Emergency assistance ke liye Police 112, Cyber Crime 1930, Women Helpline 181/1091 par turant call karein.

${DISCLAIMER_EN}`;
}

// Setup Vite Development or Static Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Justice Voice server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
