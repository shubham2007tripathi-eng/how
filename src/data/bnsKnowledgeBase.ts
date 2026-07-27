/**
 * Justice Voice - BNS Citizen Knowledge Base (Bharatiya Nyaya Sanhita, 2023)
 * Full text reference based on Parts 1 through 7 for legal awareness.
 */

export interface BNSCategory {
  id: string;
  title: string;
  hindiTitle: string;
  iconName: string;
  summary: string;
  topics: {
    title: string;
    details: string;
    punishmentOrAction?: string;
  }[];
}

export const EMERGENCY_NUMBERS = [
  { name: 'Police Emergency', number: '112', desc: 'Instant police assistance in emergency', icon: 'ShieldAlert' },
  { name: 'Women Helpline', number: '181', desc: 'Support for women in distress / harassment', icon: 'HeartHandshake' },
  { name: 'Child Helpline', number: '1098', desc: 'Protection for children in distress', icon: 'Baby' },
  { name: 'Cyber Crime Helpline', number: '1930', desc: 'Financial fraud & cyber crime reporting', icon: 'Globe' },
  { name: 'Ambulance', number: '108', desc: 'Medical emergencies & injury assistance', icon: 'Ambulance' },
];

export const QUICK_QUESTIONS = [
  "Mera phone kisi ne chori kar liya hai, kya karun?",
  "Kisi ne meri private photos leak karne ki dhamki di hai.",
  "Police station mein Zero FIR register karwana hai, kya hota hai?",
  "What are my rights if police arrests me?",
  "Can I hit back in self-defence if someone attacks me?",
  "Difference between Theft, Robbery and Snatching in BNS?",
  "Ghar par domestic violence ho raha hai, emergency help kaise lein?"
];

export const BNS_CATEGORIES: BNSCategory[] = [
  {
    id: 'part1',
    title: 'Part 1: BNS Basics & Citizen Rights',
    hindiTitle: 'BNS ke mool niyam aur nagrik adhikar',
    iconName: 'BookOpen',
    summary: 'What is BNS, definitions, punishments, general exceptions, and self-defence basics.',
    topics: [
      {
        title: 'Bharatiya Nyaya Sanhita (BNS) 2023',
        details: 'Replaces IPC 1860. Applies throughout India, to citizens abroad, and offences targeting Indian computer resources.',
      },
      {
        title: 'Key Definitions',
        details: 'Child (<18 yrs), Woman (female human any age), Document (paper, electronic, digital records), Injury (harm to body, mind, reputation, or property), Dishonestly & Fraudulently.',
      },
      {
        title: 'Punishments under BNS',
        details: 'Death penalty, Life imprisonment, Rigorous imprisonment, Simple imprisonment, Fine, Forfeiture of property, and Community service.',
      },
      {
        title: 'Exceptions & Age Liability',
        details: 'Child below 7 cannot commit offence. Child 7-12 protected if lacking maturity. Unsound mind protected. Involuntary intoxication protected. Acts done in good faith or by accident not offences.',
      },
      {
        title: 'Right of Private Defence (Self-Defence)',
        details: 'Right to protect own/other body & property against unlawful acts. Deadly force allowed in apprehension of death, grievous hurt, rape, kidnapping, acid attack, or wrongful confinement.',
      }
    ]
  },
  {
    id: 'part2',
    title: 'Part 2: Women, Children & Family Laws',
    hindiTitle: 'Mahilaon aur bachhon ke kanooni adhikar',
    iconName: 'Shield',
    summary: 'Protection against sexual harassment, stalking, voyeurism, acid attack, rape, cruelty & child abuse.',
    topics: [
      {
        title: 'Sexual Harassment & Modesty',
        details: 'Unwelcome physical contact, demanding sexual favors, showing pornography, or making sexual remarks. Punishable with imprisonment/fine.',
      },
      {
        title: 'Voyeurism & Stalking',
        details: 'Secretly recording/sharing private acts without consent (Voyeurism). Repeatedly following, contacting despite refusal, or monitoring online (Stalking).',
      },
      {
        title: 'Acid Attack & Rape Laws',
        details: 'Throwing/attempting acid causing severe injury/disfigurement attract severe imprisonment & fine for medical expenses. Rape requires unequivocal voluntary consent.',
      },
      {
        title: 'Cruelty & Dowry Death',
        details: 'Cruelty by husband or relatives includes physical/mental violence and dowry harassment. Suspicious death within specified post-marriage period is dowry death.',
      },
      {
        title: 'Child Protection & Trafficking',
        details: 'Human trafficking and child abuse are grave offences governed by BNS and POCSO Act where applicable. Child consent is legally irrelevant in trafficking.',
      }
    ]
  },
  {
    id: 'part3',
    title: 'Part 3: Offences Against Human Body',
    hindiTitle: 'Shareerik hinsa aur hamle se judi dharayein',
    iconName: 'UserX',
    summary: 'Murder, Culpable Homicide, Rash Negligence, Hurt, Grievous Hurt, Assault & Kidnapping.',
    topics: [
      {
        title: 'Murder vs Culpable Homicide',
        details: 'Murder is intentional causing of death (punishment: Death or Life imprisonment). Culpable homicide involves causing death with intention/knowledge during sudden fight or without premeditation.',
      },
      {
        title: 'Hurt & Grievous Hurt',
        details: 'Hurt = bodily pain, disease, infirmity (slapping/punching). Grievous Hurt = loss of eyesight/hearing, limb loss, fracture, life-threatening injury.',
      },
      {
        title: 'Hurt by Dangerous Weapons',
        details: 'Using knife, firearm, acid, poison, fire, or corrosive substances attracts enhanced punishment.',
      },
      {
        title: 'Wrongful Restraint & Confinement',
        details: 'Restraint = blocking movement in a direction one has legal right to go. Confinement = illegally locking/tying someone so they cannot leave.',
      },
      {
        title: 'Criminal Intimidation & Extortion',
        details: 'Threatening death, injury, reputation harm, or property damage to compel action or extract money/valuables.',
      }
    ]
  },
  {
    id: 'part4',
    title: 'Part 4: Property, Financial & Cyber Crimes',
    hindiTitle: 'Chori, online dhokhadhadi aur cyber apradh',
    iconName: 'CreditCard',
    summary: 'Theft, Snatching, Robbery, Dacoity, Cheating, Forgery, OTP & QR code scams.',
    topics: [
      {
        title: 'Theft, Snatching & Robbery',
        details: 'Theft = Taking movable property without consent. Snatching = Suddenly pulling away property (phone, chain). Robbery = Theft using violence/threat. Dacoity = Robbery by 5+ persons.',
      },
      {
        title: 'Cheating & Personation',
        details: 'Deceiving someone for money, fake investments, fake jobs, fake UPI requests. Personation = Pretending to be police, bank officer, or government official.',
      },
      {
        title: 'Trespass & House Breaking',
        details: 'Criminal Trespass = Unlawful entry to intimidate/annoy. House breaking by night (after sunset/before sunrise) carries stricter penalties.',
      },
      {
        title: 'Forgery & Identity Theft',
        details: 'Creating fake documents/signatures/wills or using someone’s Aadhaar/PAN details for fraudulent accounts/KYC.',
      },
      {
        title: 'Online Financial & Cyber Scams',
        details: 'OTP fraud, fake bank calls, QR code scams (QR codes receive money, not send), fake customer care, loan app scams. Report immediately on Cyber Helpline 1930.',
      }
    ]
  },
  {
    id: 'part5',
    title: 'Part 5: Police Powers, FIR, Arrest & Bail Rights',
    hindiTitle: 'Police powers, FIR, giraftari aur bail ke niyam',
    iconName: 'FileText',
    summary: 'How to file FIR, Zero FIR, Cognizable offences, rights during arrest, search & bail.',
    topics: [
      {
        title: 'FIR & Zero FIR',
        details: 'FIR (First Information Report) starts investigation for cognizable offences. Zero FIR can be registered at ANY police station irrespective of jurisdiction, then transferred.',
      },
      {
        title: 'Cognizable vs Non-Cognizable',
        details: 'Cognizable = Serious crime where police can register FIR & arrest without warrant. Non-cognizable = Requires Magistrate permission to investigate.',
      },
      {
        title: 'Rights of an Arrested Person',
        details: 'Right to know reason for arrest, consult a lawyer, inform family/friend, produced before Magistrate within time, medical examination.',
      },
      {
        title: 'Special Safeguards for Women',
        details: 'Search of a woman only by another woman, female police personnel involved in arrest procedures.',
      },
      {
        title: 'Bail & Types',
        details: 'Regular Bail (after arrest), Anticipatory Bail (before arrest if fearing arrest), Default Bail (if investigation delayed beyond legal period).',
      }
    ]
  },
  {
    id: 'part6',
    title: 'Part 6: Public Peace, Organized Crime & Elections',
    hindiTitle: 'Sarkari shanti, sangathit apradh aur chunaav',
    iconName: 'Building',
    summary: 'Terrorism, organized crime, petty gangs, sedition replacement, rioting & election crimes.',
    topics: [
      {
        title: 'Terrorism & Sedition Replacement',
        details: 'Acts threatening sovereignty/unity of India or creating public terror. Criticism of government alone is NOT an offence.',
      },
      {
        title: 'Organized & Petty Crime',
        details: 'Syndicated rackets (drug trafficking, extortion, contract killing) and petty gangs (mobile snatching gangs, pickpocketing gangs).',
      },
      {
        title: 'Unlawful Assembly & Rioting',
        details: 'Gathering of 5+ persons with common unlawful object. Using violence constitutes rioting.',
      },
      {
        title: 'Promoting Enmity & Public Mischief',
        details: 'Promoting hatred based on religion, caste, language or spreading fake news causing public panic/disorder.',
      }
    ]
  },
  {
    id: 'part7',
    title: 'Part 7: Citizen Emergency Practical Guide',
    hindiTitle: 'Aapatkaalin sahayata aur turant kadam',
    iconName: 'PhoneCall',
    summary: 'Immediate actionable steps for phone theft, online blackmail, domestic violence, cyber fraud.',
    topics: [
      {
        title: 'If Someone Steals Your Phone',
        details: 'Call 1930 if financial fraud happened. Block SIM card with telecom operator. File FIR / Zero FIR. Block IMEI on CEIR portal. Change passwords.',
      },
      {
        title: 'If You Are Being Blackmailed Online',
        details: 'Do NOT pay money. Save screenshots and chat logs. Report to Cyber Crime Portal (1930 / cybercrime.gov.in). Inform police.',
      },
      {
        title: 'If Facing Domestic Violence or Threat',
        details: 'Call 112 or Women Helpline 181 immediately. Preserve evidence, seek medical help, contact nearest police station.',
      },
      {
        title: 'If Victims of Cyber Fraud',
        details: 'Collect screenshots, Transaction ID, mobile number, UPI ID, Bank details. Report immediately on 1930 / Cyber Crime Portal.',
      }
    ]
  }
];

export const BNS_FULL_REFERENCE_TEXT = `
BNS CITIZEN KNOWLEDGE BASE (Bharatiya Nyaya Sanhita, 2023)

PART 1 – Introduction, Basic Concepts & Citizen Rights
1. What is Bharatiya Nyaya Sanhita (BNS)?
The Bharatiya Nyaya Sanhita (BNS), 2023 is India's new criminal law replacing the Indian Penal Code (IPC), 1860. It defines criminal offences and the punishments for those offences. The law applies throughout India and, in certain situations, also applies to offences committed outside India by Indian citizens or offences targeting computer resources located in India.
2. Purpose of BNS:
Modernise criminal law, recognise electronic and digital records, improve protection of women and children, introduce community service for certain offences, address modern forms of crime.
3. Who does BNS apply to?
Every person committing an offence in India; Indian citizens committing offences outside India; Persons on Indian ships or aircraft; Persons outside India who commit offences targeting computer resources in India.
4. Important Definitions:
- Child: A person below 18 years of age.
- Woman: A female human being of any age.
- Document: Includes paper documents, electronic records, digital records used as evidence in legal proceedings.
- Injury: Harm caused to Body, Mind, Reputation, or Property.
- Dishonestly: Doing something intending to cause wrongful gain to one person or wrongful loss to another.
- Fraudulently: Doing something with the intention to deceive or defraud another person.
- Wrongful Gain: Obtaining property by unlawful means that a person is not legally entitled to.
- Wrongful Loss: Losing property by unlawful means even though the person has a legal right to it.
- Public Servant: Police officers, Judges, Government officers, Armed forces officers, Election officials, Court officials, Government employees performing public duties.
- Good Faith: An act done with due care and attention.
- Consent: Not valid if obtained by fear, misconception of facts, from an intoxicated or unsound mind person, or from a child below 12 years.
5. Types of Punishments under BNS:
Courts may impose: Death penalty, Life imprisonment, Rigorous imprisonment (hard labour), Simple imprisonment, Fine, Forfeiture of property, Community service.
6. Community Service:
Introduced as one of the punishments for certain offences. Courts require offenders to perform community work instead of/along with other punishments.
7. General Exceptions (When an Act May Not Be an Offence):
Required by law, done under court order, done by judge acting judicially, done in good faith due to mistake of fact (not law), genuine accident during lawful act with proper care, done in good faith to prevent greater harm.
8. Children & Criminal Responsibility:
Child below 7 years cannot commit offence under BNS. Child 7-12 years not criminally liable if lacking sufficient maturity to understand nature/consequences.
9. Unsound Mind:
Not criminally liable if due to unsoundness of mind at the time, could not understand nature of act or that it was wrong/contrary to law.
10. Intoxication:
Protected only if intoxication was caused without knowledge or against will. Voluntary intoxication does NOT excuse criminal liability.
11. Right of Private Defence (Self-Defence):
Every person has right to protect own/other body and own/other property against unlawful acts, subject to legal limits.
12. When Can Self-Defence Cause Death?
Extends to causing attacker's death when reasonable apprehension of: Death, Grievous hurt, Rape, Kidnapping or abduction, Wrongful confinement preventing access to public authorities, Acid attack or attempted acid attack.
13. Limits on Self-Defence:
No right against public servant acting in good faith (no apprehension of death/grievous hurt), when sufficient time to seek help from public authorities, or to inflict more harm than necessary for defence.
14. Citizen FAQs:
Q: Can I defend myself if someone attacks me? Yes, within limits.
Q: Can I protect another person or property? Yes.
Q: Is deadly force allowed in every fight? No, only in specific situations recognised by law.
Q: Is child below 7 criminally liable? No.
Q: Is electronic file a document? Yes.
Q: Is consent obtained by fear valid? No.

PART 2 – Women, Children & Family-Related Offences
1. Sexual Harassment of a Woman: Unwelcome physical contact with sexual intent, demanding sexual favours, showing pornography against wishes, sexually coloured remarks. Punishment: Imprisonment, fine, or both.
2. Assault or Criminal Force to Outrage Modesty: Assaulting or using criminal force intending/knowing likely to outrage modesty. Punishment: Imprisonment, Fine, or both.
3. Voyeurism: Watching, recording, photographing, or sharing images/videos of a woman in a private act without consent. Higher punishment for repeat offenders.
4. Stalking: Repeatedly following, contacting despite clear refusal, monitoring online, sending unwanted messages, tracking location without consent. Exceptions: Lawful investigation, legal authority, prevention/detection of crime.
5. Acid Attack: Throwing/attempting acid causing permanent injury, burns, disfigurement, disability, severe pain. Severe imprisonment + fine (helps meet victim's medical expenses).
6. Rape: Sexual intercourse without legally valid consent. Consent not valid if through force, threat, fear, fraud, misrepresentation, intoxication, unsound mind, inability to communicate.
7. Important Rule About Consent: Unequivocal voluntary agreement. Silence alone does NOT mean consent. Past relationship does NOT imply consent for future acts.
8. Gang Rape: Multiple persons acting together. Significantly more severe punishment.
9. Disclosure of Victim Identity: Identity of rape victim should not be disclosed publicly except as permitted by law.
10. Kidnapping: Taking minor from lawful guardianship without permission; taking person outside India without lawful authority.
11. Abduction: Compelling/inducing person by force or deceit to move from one place to another.
12. Kidnapping for Ransom: Demand money/property or compel action. Grave offence with severe punishment.
13. Human Trafficking: Recruiting, transporting, harbouring, transferring, receiving persons through threat, force, coercion, fraud, abuse of power, deception for exploitation (forced labour, sexual exploitation, slavery, begging, organ removal).
14. Trafficking of Children: Treated more seriously; child consent is legally irrelevant.
15. Selling or Buying Children for Illegal Purposes: Serious criminal offence.
16. Cruelty by Husband or Relatives: Physical violence, mental harassment, dowry harassment, conduct driving to suicide, serious injury to health.
17. Dowry-Related Death: Suspicious death within legally specified period after marriage having faced dowry cruelty soon before death.
18. Causing Miscarriage: Without lawful justification is punishable.
19. Abandonment of Child: Abandoning/exposing child endangering life/health.
20. Child Abuse: Physical/mental harm punishable under BNS & POCSO Act.
21. Wrongful Confinement: Wrongfully confining person so they cannot leave a place.
22. Criminal Intimidation: Threatening death, injury, reputation harm, property harm to create fear/compel action.
23. Online Harassment: Obscene messages, threats, photo blackmail, intimate image sharing without permission, online stalking.
FAQs:
Q: Someone threatening to leak private photos? Preserve evidence, report to police or cyber crime portal (1930), do NOT pay money.
Q: Secret recording? Voyeurism crime.
Q: Acid attack response? Seek medical treatment, contact police, preserve evidence.

PART 3 – Offences Against Human Body (Murder, Assault, Kidnapping, Hurt & Self-Defence)
1. Murder: Intentional causing of death. Punishment: Death penalty (most serious cases) or Life imprisonment + fine.
2. Culpable Homicide: Causing death with intention/knowledge likely to cause death, but not amounting to murder due to sudden fight/lack of premeditation.
3. Death by Negligence: Rash or negligent conduct without intention to kill (dangerous driving, medical negligence, careless machinery).
4. Hurt: Bodily pain, disease, physical infirmity (slapping, punching, kicking).
5. Grievous Hurt: Permanent eyesight loss, hearing loss, limb loss, disfigurement, bone fracture, injury endangering life. Stricter punishment.
6. Voluntarily Causing Hurt / Grievous Hurt: Intentionally causing bodily pain / serious injury.
7. Hurt by Dangerous Weapons: Knife, firearm, acid, explosives, fire, poison, corrosive substances. Enhanced punishment.
8. Wrongful Restraint: Preventing person from moving in direction they have legal right to go.
9. Wrongful Confinement: Restricting movement so person cannot leave place (locking in room, tying up).
10. Criminal Force: Intentionally using force without lawful justification to cause injury, fear, annoyance.
11. Assault: Threatening or attempting criminal force causing reasonable fear of immediate harm (raising a stick).
12. Kidnapping & Abduction: Taking minor from guardian / removing from India. Abduction involves force/deceit and can involve adults.
13. Kidnapping for Murder / Ransom: Grave offences carrying severe penalties.
14. Wrongful Concealment: Secretly confining or hiding kidnapped/abducted person.
15. Extortion Through Threats: Obtaining money/valuables by putting in fear of injury.
16. Attempt: Direct steps toward committing offence (attempted murder, robbery, kidnapping).
17. Abetment: Instigating, conspiring, or intentionally assisting another to commit offence.
18. Criminal Conspiracy: Agreement between 2+ persons to commit illegal act.
19. Right of Private Defence & Limits: Protecting body/property. Stops once danger ends, cannot be used as revenge, only force reasonably necessary.

PART 4 – Property Crimes, Financial Crimes & Cyber-Related Offences
1. Theft: Dishonestly taking movable property belonging to another without consent.
2. Snatching: Newly recognised BNS offence — suddenly taking property directly from person's possession (mobile, handbag, gold chain).
3. Robbery: Theft/extortion committed using violence, threat of violence, fear of death/hurt, or wrongful restraint.
4. Dacoity: Robbery committed by 5 or more persons acting together.
5. Extortion: Intentionally putting person in fear of injury to obtain money, property, digital assets.
6. Criminal Misappropriation: Dishonestly using another's property for own benefit after lawfully obtaining possession (e.g. spending money accidentally transferred to bank account).
7. Criminal Breach of Trust: Property entrusted to someone dishonestly misused/converted (employee stealing funds, agent keeping client money).
8. Cheating: Deceiving person to deliver property, transfer money, sign documents. (fake investments, fake jobs, lottery scams, online shopping fraud).
9. Cheating by Personation: Pretending to be fake bank officer, police officer, government official, customer care.
10. Criminal & House Trespass: Unlawful entry into property/building with intent to commit offence/intimidate/annoy.
11. House Breaking & House Breaking by Night: Breaking locks/windows or using duplicate key. Breaking in after sunset / before sunrise treated more seriously.
12. Mischief & Mischief by Fire: Destroying/damaging property (car window, crops, setting fire to house/shop/vehicle).
13. Receiving Stolen Property: Knowingly buying, possessing, hiding stolen property.
14. Fraud Using Electronic Means: Fake payment screenshots, online investment fraud, fake QR code scams, fake UPI requests, digital impersonation.
15. Online Financial Fraud: OTP fraud, fake bank calls, credit card fraud, debit card cloning, crypto/loan app scams.
16. Identity Theft: Using another's Aadhaar, PAN, or identity details without permission.
17. Forgery & Using Forged Documents: Creating/using false documents (fake certificates, property papers, fake signatures, fake wills).
18. Counterfeit Currency: Making, possessing, or circulating fake currency.
19. Damage to Public Property: Breaking railway property, buses, infrastructure.
20. Common Cyber Scams:
- QR Code Scam: QR code receives money; it does NOT send money.
- OTP Scam: Never share OTP, ATM PIN, CVV, UPI PIN, Banking password.
- Fake Customer Care & Fake Investment Apps (promising double money / risk-free returns).
FAQs:
Q: Stolen mobile phone? Report to police immediately, block SIM card, block IMEI on CEIR, change passwords.
Q: Cheated online through UPI? Contact bank immediately, report to National Cyber Crime Portal (1930 / cybercrime.gov.in), preserve screenshots.
Q: Difference between theft and robbery? Theft = no immediate violence; Robbery = theft using violence or threat of violence.

PART 5 – Public Order, Police Powers, FIR, Arrest, Bail & Citizen Rights
1. What is an FIR? First Information Report made by police for cognizable offences (Murder, Rape, Kidnapping, Theft, Robbery, Acid attack, Serious assault). Starts formal investigation.
2. What is a Zero FIR? Can be registered at ANY police station even if offence occurred outside jurisdiction. Transferred later to competent station. Common in sexual assault, kidnapping, emergencies.
3. Cognizable Offence: Police can register FIR, begin investigation, and arrest without warrant (e.g. Murder, Rape, Robbery, Dacoity).
4. Non-Cognizable Offence: Police generally cannot investigate without Magistrate permission or arrest without warrant.
5. Arrest & Rights of Arrested Person: Reason for arrest must be communicated, no excessive force. Rights: Know reason, consult lawyer, inform family/friend, produced before Magistrate within time, medical examination.
6. Rights of Women During Arrest: Special legal safeguards, female police personnel involved, search of woman conducted only by another woman.
7. Search & Seizure by Police: Citizens should cooperate, ask for ID, obtain copies of seizure documents for seized items (phones, laptops, vehicles, documents).
8. Bail & Types: Allows accused to remain free under conditions. Regular Bail (granted after arrest), Anticipatory Bail (applied before arrest when fearing arrest), Default Bail (if investigation not completed in legal timeframe).
9. Complaint vs FIR: Complaint can relate to any grievance; FIR registered only for cognizable offences and starts investigation.
10. Witness & False Evidence: Witnesses expected to tell truth. Lying under oath, producing fake documents, or giving false statements is criminal offence.
11. Public Servant & Obstruction: Preventing public servant from performing official duties is an offence.
12. Emergency Numbers: Police Emergency: 112 | Women Helpline: 181 | Child Helpline: 1098 | Cyber Crime Helpline: 1930 | Ambulance: 108.

PART 6 – Offences Against State, Public Peace & Elections
1. Terrorism: Acts threatening unity, integrity, sovereignty, or security of India, creating terror, damaging critical infrastructure. Punishment: Life imprisonment or Death.
2. Organized Crime & Petty Organized Crime: Gang rackets (drug/human trafficking, contract killing, extortion) and petty gangs (mobile snatching gangs, pickpocketing gangs).
3. Sedition Replaced: IPC Sedition replaced. Acts intentionally endangering India's sovereignty/unity through unlawful means attract punishment. Criticism of Government alone is NOT an offence.
4. Unlawful Assembly & Rioting: Gathering of 5+ with unlawful object. Violence by members = Rioting.
5. Promoting Enmity: Promoting hatred between groups based on religion, language, caste, community, place of birth.
6. Public Mischief & Election Offences: Spreading fake news causing panic; bribing voters, booth capturing, impersonating voters.

PART 7 – Citizen Legal Guide & Emergency Information
1. If Someone Steals Your Phone: Call 1930 if financial fraud, block SIM card, file FIR / Zero FIR, block IMEI, change passwords.
2. If Blackmailed Online: Do NOT pay money. Save screenshots. Report to Cyber Crime Portal (1930). Inform police.
3. If Facing Domestic Violence: Call 112 or 181. Preserve evidence, seek medical help, contact police station.
4. If Threat of Murder: Call 112 immediately, preserve recordings/messages, file FIR.
5. If Cyber Fraud: Collect screenshot, Transaction ID, mobile number, UPI ID, Bank details. Report immediately on 1930 helpline.
6. If Someone Goes Missing: Report immediately to police (for children, do NOT wait 24 hours).
7. If Police Arrest You: Know reason, contact lawyer, inform family, produced before Magistrate within prescribed period.
8. Safety Responses:
- If unknown topic: "Is topic ke exact section ka pata nahi — kripya ek lawyer ya legal aid se confirm karein."
- If emergency: "If this is an emergency involving immediate danger, please contact Police (112) immediately."
- Disclaimer on sensitive cases: "Justice Voice provides general legal information under BNS 2023 and is not a substitute for professional legal advice from a qualified lawyer."
`.trim();
