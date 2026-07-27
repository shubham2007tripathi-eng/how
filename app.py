import os
import re
import time
import streamlit as st
import google.generativeai as genai

# --- API CONFIGURATION ---
# Streamlit secrets or environment variable or placeholder
API_KEY = os.environ.get("GEMINI_API_KEY", "APNI_API_KEY_YAHAN_DALEIN")
if API_KEY and API_KEY != "APNI_API_KEY_YAHAN_DALEIN":
    genai.configure(api_key=API_KEY)

# --- TTS & UI TEXT SANITIZATION FUNCTION ---
def sanitize_text_for_ui_and_voice(raw_text):
    """
    Cleans markdown symbols, formatting tags, and unwanted syntax 
    so the speech reader (TTS) and UI display smooth, natural text.
    """
    if not raw_text:
        return "Kripya dobara koshish karein, koi jawab prapt nahi hua."
    
    # 1. Remove markdown symbols that break speech synthesis and clutter UI
    cleaned = re.sub(r"[\*\#\_\[\]\(\)\`\~]", "", raw_text)
    
    # 2. Normalize bullet points for clean readability
    cleaned = re.sub(r"^\s*[-*]\s*", "• ", cleaned, flags=re.MULTILINE)
    
    # 3. Collapse excessive empty lines
    cleaned = re.sub(r"\n\s*\n", "\n\n", cleaned)
    
    return cleaned.strip()

clean_text_for_voice = sanitize_text_for_ui_and_voice

# --- NYAYA SETU MASTER SYSTEM PROMPT (LEGAL BUDDY PERSONA) ---
SYSTEM_PROMPT = """
You are 'Nyaya Setu', an expert legal assistant for Indian citizens, specializing in the BNS (Bharatiya Nyaya Sanhita).

================================================================================
COLLOQUIAL HINDI TO LEGAL SECTION MAPPING DIRECTORY (CRITICAL):
================================================================================
You must instantly recognize everyday Hindi speech transcripts and map them to their exact legal definitions inside the uploaded PDF:

1. THEFT / SNATCHING / ROBBERY:
   - Colloquial Inputs: "मेरा फोन चोरी हो गया", "मोबाइल छीन कर भाग गया", "जेब कट गई", "chori ho gaya", "phone stolen"
   - Legal Section Mapping: Look up Chapter/Sections related to Theft, Snatching, and Extortion in the uploaded PDF.

2. DOMESTIC VIOLENCE / CRUELTY BY HUSBAND OR RELATIVES:
   - Colloquial Inputs: "मेरे साथ मारपीट हुई है", "पति प्रताड़ित करता है", "घर से निकाल दिया", "domestic violence", "marpeet"
   - Legal Section Mapping: Look up sections concerning cruelty by husband/relatives or domestic protection provisions in the document.

3. CYBER FRAUD / ONLINE SCAM / CHEATING:
   - Colloquial Inputs: "ऑनलाइन धोखा हुआ है", "पैसा कट गया खाते से", "cyber fraud", "online scam"
   - Legal Section Mapping: Look up sections concerning Cheating, Identity Theft, or Cyber Offenses in the document.

4. ASSAULT / HURT / PHYSICAL FIGHT:
   - Colloquial Inputs: "झगड़ा हो गया", "चोट लग गई", "maar-peet", "physical fight"
   - Legal Section Mapping: Look up sections concerning Hurt, Grievous Hurt, or Criminal Force.

================================================================================
EXECUTION RULE FOR KEYWORD MATCHING:
================================================================================
- Never reject an input due to informal phrasing or Devanagari script. 
- Use the mapping directory above to instantly locate the correct legal provisions in your attached PDF or BNS database.
- Deliver responses in smooth, natural local Hinglish without rigid headings or robotic steps.
- Always conclude your response with this exact sentence, word for word:
  "I am an AI assistant, not a lawyer. For court cases, consult a legal professional."
"""

# Gemini Model Setup
try:
    model = genai.GenerativeModel(
        model_name="gemma-4-31b-it",
        system_instruction=SYSTEM_PROMPT
    )
except Exception as e:
    model = None

# --- STREAMLIT UI DESIGN ---
st.set_page_config(page_title="Nyaya Setu - Legal Buddy", page_icon="⚖️", layout="centered")

st.title("⚖️ Nyaya Setu (न्याय सेतु)")
st.subheader("Aapka Apna Legal Buddy - Har Kanooni Sawal ka Aasan Jawab")

# Initialize session state keys safely
if "messages" not in st.session_state:
    st.session_state.messages = []
if "user_transcript" not in st.session_state:
    st.session_state.user_transcript = ""
if "is_processing" not in st.session_state:
    st.session_state.is_processing = False

# Display prior chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# --- USER INPUT HANDLING & BULLETPROOF INPUT ROUTER WITH ASYNC STATE LOCKING ---
chat_input_text = st.chat_input("Yahan apni problem likhein ya bolein...")
mic_transcript_text = st.session_state.get('speech_transcript', None) or st.session_state.get('user_transcript', None)

active_query = None

if chat_input_text:
    active_query = chat_input_text
elif mic_transcript_text:
    time.sleep(0.1)
    if isinstance(mic_transcript_text, dict) and 'text' in mic_transcript_text:
        active_query = mic_transcript_text['text']
    elif isinstance(mic_transcript_text, str):
        active_query = mic_transcript_text

if active_query and not st.session_state.is_processing:
    st.session_state.is_processing = True
    cleaned_query = str(active_query).strip()

    # Blacklisted canned fallback strings to filter out
    blacklisted_fallbacks = [
        "Aapko pareshan hone ki zarurat nahi hai",
        "Section 173",
        "BNS Dhara 173",
    ]
    contains_fallback = any(
        bad_phrase.lower() in cleaned_query.lower()
        for bad_phrase in blacklisted_fallbacks
    )

    if len(cleaned_query) > 0 and not contains_fallback:
        st.session_state.messages.append({"role": "user", "content": cleaned_query})
        with st.chat_message("user"):
            st.markdown(cleaned_query)

        with st.chat_message("assistant"):
            with st.spinner("Nyaya Setu soch raha hai..."):
                try:
                    if not API_KEY or API_KEY == "APNI_API_KEY_YAHAN_DALEIN":
                        reply_text = (
                            "Aapka sawal mil gaya hai! Nyaya Setu real-time response ke liye kripya apni GEMINI_API_KEY set karein. "
                            "Indian law ke mutabiq aap kisi bhi emergency me Police 112, Cyber Crime 1930, ya Women Helpline 1091 par turant sampark kar sakte hain.\n\n"
                            "I am an AI assistant, not a lawyer. For court cases, consult a legal professional."
                        )
                    else:
                        response = model.generate_content(cleaned_query)
                        reply_text = sanitize_text_for_ui_and_voice(response.text)

                    st.markdown(reply_text)
                    st.session_state.messages.append({"role": "assistant", "content": reply_text})
                except Exception as api_err:
                    st.error(f"An error occurred while communicating with Gemini: {str(api_err)}")
                finally:
                    st.session_state.is_processing = False
    else:
        st.session_state.is_processing = False
        st.warning("Detected empty input or default fallback string. Please try speaking or typing again.")

