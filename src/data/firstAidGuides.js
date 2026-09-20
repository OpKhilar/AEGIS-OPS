/**
 * Static, pre-loaded emergency first-aid protocols written in Markdown.
 * Used for instant, zero-latency local fallback whenever network drops or API is unreachable.
 */

export const FIRST_AID_GUIDES = [
  {
    id: 'cpr-adult',
    title: 'Adult CPR & Defibrillation (AED)',
    category: 'Cardiovascular',
    severity: 'critical',
    triageLevel: '🔴 RED - IMMEDIATE / LIFE-THREATENING',
    keywords: ['cpr', 'cardiac', 'arrest', 'heart attack', 'unresponsive', 'unconscious', 'no pulse', 'not breathing', 'chest compression', 'aed', 'defibrillator'],
    summary: 'Step-by-step hands-only CPR and AED guidance for an unresponsive adult not breathing normally.',
    markdown: `### 🚨 TRIAGE PRIORITY: 🔴 RED - IMMEDIATE / LIFE-THREATENING
**Condition: Adult Unresponsive / Cardiac Arrest**

### ⏱️ IMMEDIATE ACTION PLAN (STEP-BY-STEP)

1. **Step 1: Check Scene Safety & Response**
   - Ensure the area is safe from traffic, fire, electricity, or gas.
   - Tap shoulders firmly and shout loudly: *"Are you okay?!"*
   - Check breathing for **no more than 10 seconds** (gasping / agonal breathing is NOT normal breathing).

2. **Step 2: Call for Help & Get AED**
   - Point to a specific bystander: *"You, call 112 and bring an AED immediately!"*
   - If alone with a phone, put it on speaker with emergency dispatch while starting CPR.

3. **Step 3: Position Hands on Center of Chest**
   - Place victim flat on back on a hard surface.
   - Heel of one hand on the center of the chest (lower half of sternum).
   - Interlock fingers of your second hand on top. Keep arms straight and shoulders directly over hands.

4. **Step 4: Push Hard and Fast (100–120 Beats Per Minute)**
   - Compress at least **2 inches (5 cm)** deep.
   - Allow full chest recoil between compressions without lifting hands.
   - Maintain cadence to the beat of **"Stayin' Alive"** or **110 BPM**.
   - Perform continuous compressions (or 30 compressions followed by 2 rescue breaths if trained).

5. **Step 5: Apply AED As Soon As Available**
   - Turn AED on and expose bare chest (dry chest if wet).
   - Attach adhesive pads as pictured on the pads (Upper right chest, lower left ribs).
   - Shout *"STAND CLEAR"* during analysis and before shock delivery.
   - Resume compressions immediately after shock or if no shock advised.

### ⚠️ CRITICAL DO NOTs
- **DO NOT** stop compressions for more than 10 seconds.
- **DO NOT** hesitate to push hard; broken ribs heal, anoxia is irreversible.
- **DO NOT** place AED pads directly over an implanted pacemaker bulge or medication patch.
- **DO NOT** touch the patient while the AED is analyzing or administering a shock.

### 📞 EMERGENCY DISPATCH REMINDER
Call **112 (India's national emergency number)** or hit the **ResQBharat SOS Beacon** on your dashboard right now!`
  },
  {
    id: 'severe-bleeding',
    title: 'Severe Bleeding & Tourniquet Application',
    category: 'Trauma',
    severity: 'critical',
    triageLevel: '🔴 RED - IMMEDIATE / LIFE-THREATENING',
    keywords: ['bleeding', 'blood', 'arterial', 'hemorrhage', 'cut', 'stab', 'gunshot', 'wound', 'laceration', 'tourniquet', 'gash'],
    summary: 'Hemorrhage control protocol: direct pressure, wound packing, and tactical tourniquet placement.',
    markdown: `### 🚨 TRIAGE PRIORITY: 🔴 RED - IMMEDIATE / LIFE-THREATENING
**Condition: Massive Arterial / Venous Hemorrhage**

### ⏱️ IMMEDIATE ACTION PLAN (STEP-BY-STEP)

1. **Step 1: Expose Wound & Identify Bleeding Source**
   - Quickly cut or remove clothing to see the exact bleeding point.
   - Look for spurting, pulsing, or rapidly pooling bright red blood.

2. **Step 2: Direct Firm Pressure with Both Hands**
   - Place sterile gauze, clean cloth, or bare hands directly onto the bleeding vessel.
   - Lean your full upper-body weight into the wound with arms locked straight.
   - Maintain continuous, relentless pressure without lifting to "peek".

3. **Step 3: Pack Deep Cavity Wounds (Groin, Neck, Armpit)**
   - For junctional wounds where a tourniquet cannot fit:
   - Pack hemostatic gauze or clean fabric deeply and tightly into the wound cavity directly against the bleeding vessel.
   - Hold heavy manual pressure over the packed wound for at least **3 full minutes**.

4. **Step 4: Apply Tourniquet (Extremity Wounds - Arm or Leg)**
   - If bleeding from arm/leg does not stop with pressure, apply a commercial windlass tourniquet (e.g. CAT/SOFTT).
   - Place **2–3 inches above the wound** (between wound and heart).
   - Never apply over a joint (elbow or knee); place above joint if necessary.
   - Pull velcro strap as tight as possible before turning the windlass rod.
   - Twist windlass rod until all arterial bleeding and distal pulse stop completely.
   - Lock rod into clip and write the **exact application time (e.g., T=14:32)** on the strap or victim's forehead.

5. **Step 5: Treat for Shock**
   - Lay victim flat on back, elevate legs 8–12 inches (unless spinal trauma or pelvic fracture).
   - Cover with emergency blanket or jacket to preserve body heat.

### ⚠️ CRITICAL DO NOTs
- **DO NOT** loosen or remove a tourniquet once placed—only medical doctors in trauma bays may release it.
- **DO NOT** use thin wires, cables, or shoelaces as improvised tourniquets (they cut into tissue and fail to occlude deep arteries).
- **DO NOT** remove blood-soaked bandages; layer fresh pads over existing ones.
- **DO NOT** let the patient stand up or walk.

### 📞 EMERGENCY DISPATCH REMINDER
Inform 112 dispatch immediately that a **tourniquet is applied with the time recorded**.`
  },
  {
    id: 'choking-heimlich',
    title: 'Choking & Obstructed Airway (Heimlich Maneuver)',
    category: 'Respiratory',
    severity: 'critical',
    triageLevel: '🔴 RED - IMMEDIATE / LIFE-THREATENING',
    keywords: ['choking', 'heimlich', 'suffocating', 'airway', 'cannot breathe', 'throat', 'food stuck', 'coughing', 'gasping'],
    summary: 'Airway clearance protocols for conscious adults, pregnant individuals, and infants.',
    markdown: `### 🚨 TRIAGE PRIORITY: 🔴 RED - IMMEDIATE / LIFE-THREATENING
**Condition: Complete Foreign Body Airway Obstruction**

### ⏱️ IMMEDIATE ACTION PLAN (STEP-BY-STEP)

1. **Step 1: Confirm Severe Airway Obstruction**
   - Ask: *"Are you choking? Can you speak?"*
   - If they can cough forcefully or speak, **encourage coughing**—do not interfere.
   - If they cannot speak, are making high-pitched squeaks, or clutch their throat (universal choking sign), act immediately.

2. **Step 2: Position Yourself Behind Victim**
   - Stand firmly behind the person with one foot slightly forward between their feet for stability.
   - Wrap both arms around their waist.

3. **Step 3: Execute Abdominal Thrusts (Heimlich)**
   - Make a fist with one hand and place the thumb-side against the middle of the abdomen, **just above the navel and well below the ribcage**.
   - Grasp your fist with your other hand.
   - Pull forcefully **inward and upward** in quick, distinct jolt motions.
   - Repeat until the object is expelled or the person loses consciousness.

4. **Step 4: Special Cases (Pregnant or Obese Victims)**
   - Position hands higher, at the **center of the chest** (sternum), exactly as in chest compressions.
   - Deliver sharp chest thrusts straight back.

5. **Step 5: If the Victim Loses Consciousness**
   - Carefully ease them to the floor onto their back.
   - Call 112 / activate speakerphone immediately.
   - Begin **30 chest compressions**.
   - Before giving rescue breaths, open airway and look into the mouth. If you clearly see the object, sweep it out with a finger.
   - Attempt 2 rescue breaths. Repeat CPR cycle until breathing resumes or EMS arrives.

### ⚠️ CRITICAL DO NOTs
- **DO NOT** perform blind finger sweeps in the mouth (can push the object deeper down trachea).
- **DO NOT** slap a standing choking person on the back without supporting their chest leaning forward.
- **DO NOT** squeeze the lower ribcage (risk of liver/spleen laceration).

### 📞 EMERGENCY DISPATCH REMINDER
If the object is expelled, the victim still requires emergency medical evaluation for internal airway/abdominal trauma.`
  },
  {
    id: 'burns-scalds',
    title: 'Burns & Scalds (Thermal, Chemical & Electrical)',
    category: 'Trauma',
    severity: 'warning',
    triageLevel: '🟡 YELLOW - URGENT (🔴 RED if >10% body surface or airway involved)',
    keywords: ['burn', 'burns', 'fire', 'scald', 'boiling water', 'chemical burn', 'hot', 'blister', 'charred', 'third degree', 'second degree'],
    summary: 'Triage and cooling procedure for 1st, 2nd, and 3rd-degree burns, chemical wash, and dressings.',
    markdown: `### 🚨 TRIAGE PRIORITY: 🟡 YELLOW - URGENT (🔴 RED if face/airway or >10% body area)
**Condition: Acute Thermal / Chemical / Electrical Burn**

### ⏱️ IMMEDIATE ACTION PLAN (STEP-BY-STEP)

1. **Step 1: Extinguish & Eliminate Hazard**
   - Stop, Drop, and Roll if clothing is burning. Smother flames with a blanket or coat.
   - For electrical burns: ensure power source is shut off before touching victim.
   - For dry chemicals: brush off dry powder **before** flushing with water.

2. **Step 2: Cool with Cool Running Water for 20 Minutes**
   - Immediately flush the burn with **cool (NOT freezing cold) clean running tap water** for at least **10–20 minutes**.
   - Cooling stops thermal progression into deeper subdermal layers.
   - For chemical burns: continuously irrigate with water for at least 20–30 minutes.

3. **Step 3: Remove Constrictive Jewelry & Loose Clothing**
   - Quickly take off rings, watches, bracelets, and belts around the burned zone before severe swelling develops.
   - Do NOT tear away clothes melted or stuck to the burn.

4. **Step 4: Protect with Sterile, Non-Adherent Covering**
   - Cover loosely with clear plastic kitchen wrap (cling film) or a clean, dry, non-linting sterile sheet.
   - Do not wrap tightly; leave room for tissue edema.

5. **Step 5: Prevent Hypothermia & Monitor Airway**
   - Keep the rest of the patient warm and dry with blankets.
   - If burns are around mouth, nose, or singed eyebrows: monitor breathing continuously for airway swelling.

### ⚠️ CRITICAL DO NOTs
- **DO NOT** apply ice or ice-cold water (causes vasoconstriction and worsens tissue necrosis).
- **DO NOT** apply butter, oil, toothpaste, mayonnaise, or ointments to broken skin.
- **DO NOT** pop blisters (blister roof is a sterile biological barrier against infection).
- **DO NOT** pull off clothing melted into the flesh.

### 📞 EMERGENCY DISPATCH REMINDER
Seek immediate emergency medical care if the burn covers palms, joints, face, groin, or is greater than 3 inches.`
  },
  {
    id: 'fractures-spinal',
    title: 'Fractures, Sprains & Suspected Spinal Trauma',
    category: 'Orthopedic',
    severity: 'warning',
    triageLevel: '🟡 YELLOW - URGENT (🔴 RED if spinal trauma or loss of pulse)',
    keywords: ['fracture', 'broken bone', 'bone', 'splint', 'sprain', 'spine', 'neck', 'fall', 'back pain', 'numbness', 'deformity', 'compound fracture'],
    summary: 'Splinting principles, neurovascular checks, and spinal immobilization precautions.',
    markdown: `### 🚨 TRIAGE PRIORITY: 🟡 YELLOW - URGENT (🔴 RED if spinal deficit or open fracture)
**Condition: Bone Fracture / Dislocation / Suspected Spinal Injury**

### ⏱️ IMMEDIATE ACTION PLAN (STEP-BY-STEP)

1. **Step 1: Check for Spinal Trauma Signs**
   - Did victim fall from height (>3x body height), suffer high-speed collision, or hit head diving?
   - Look for neck pain, numbness, tingling in hands/feet, paralysis, or loss of bowel/bladder control.
   - If suspected: **MANUALLY STABILIZE HEAD AND NECK**. Tell victim: *"Keep perfectly still, do not move your head."*
   - Kneel behind their head and hold it in neutral alignment with your hands on both sides.

2. **Step 2: Control Bleeding on Open / Compound Fractures**
   - If bone protrudes through skin, do NOT attempt to push it back into the wound!
   - Cover bone and wound with sterile moist gauze or clean dressing.
   - Apply gentle pressure around wound edges to control bleeding.

3. **Step 3: Assess Circulation (Pulse, Motor, Sensory - PMS)**
   - Check pulse distal to fracture (wrist pulse for arm, foot pulse for leg).
   - Check sensation: can they feel you touching their toe/finger?
   - Check capillary refill: press nail bed; pink color should return in under 2 seconds.

4. **Step 4: Immobilize & Splint in Position Found**
   - Splint the joint **above** and the joint **below** the fracture site.
   - Use rolled magazines, umbrellas, cardboard, or branches padded with clothing.
   - Tie securely with bandages or cloth strips above and below fracture—never directly over fracture.
   - Recheck PMS (pulse, sensation) after splinting to ensure dressing is not cutting off circulation.

5. **Step 5: Apply Cold Pack to Closed Sprains/Fractures**
   - Wrap an ice pack in a towel (never bare ice on skin) for 15-20 minutes to reduce edema.

### ⚠️ CRITICAL DO NOTs
- **DO NOT** move a patient with suspected spinal trauma unless there is an imminent life hazard (fire, rising flood, building collapse).
- **DO NOT** attempt to straighten, realign, or manipulate a deformed bone or joint.
- **DO NOT** allow patient to bear weight or walk on an injured lower extremity.

### 📞 EMERGENCY DISPATCH REMINDER
Call 112 immediately if bone is visible, extremity is cold/blue/pulseless, or spinal injury is suspected.`
  },
  {
    id: 'anaphylaxis-allergy',
    title: 'Anaphylaxis & Severe Allergic Reaction',
    category: 'Immunology',
    severity: 'critical',
    triageLevel: '🔴 RED - IMMEDIATE / LIFE-THREATENING',
    keywords: ['anaphylaxis', 'allergic', 'allergy', 'epipen', 'epinephrine', 'swelling', 'hives', 'throat closing', 'peanut', 'bee sting', 'wheezing'],
    summary: 'Rapid administration of epinephrine autoinjector, positioning, and airway management.',
    markdown: `### 🚨 TRIAGE PRIORITY: 🔴 RED - IMMEDIATE / LIFE-THREATENING
**Condition: Anaphylaxis (Severe Systemic Allergic Reaction)**

### ⏱️ IMMEDIATE ACTION PLAN (STEP-BY-STEP)

1. **Step 1: Recognize Systemic Symptoms**
   - Sudden onset of: swelling of lips, tongue, or throat; difficulty breathing; wheezing; hives/rash; vomiting; dizziness or collapse.

2. **Step 2: Administer Epinephrine Autoinjector (EpiPen) Immediately**
   - Check autoinjector window (liquid should be clear).
   - Pull off the safety cap (usually blue or yellow at back).
   - Hold pen in a fist (thumb away from ends).
   - Swing and push tip firmly into **outer mid-thigh** at a 90° angle (can inject through jeans/clothing).
   - Hold firmly in place for **3 full seconds** (or 10 seconds for older devices).
   - Remove pen and massage the injection site for 10 seconds.

3. **Step 3: Call 112 / EMS Immediately**
   - State clearly: *"Patient in anaphylactic shock, epinephrine administered at [Time]."*

4. **Step 4: Position Patient Correctly**
   - Lay patient flat on their back with legs elevated.
   - **If breathing is difficult**: allow them to sit up slightly, but DO NOT let them stand or walk (sudden standing causes fatal blood pressure drop).
   - If vomiting or pregnant, place on their left side (recovery position).

5. **Step 5: Prepare Second Dose if No Improvement**
   - If symptoms do not improve within **5 to 10 minutes**, administer a second autoinjector if available in the opposite thigh.

### ⚠️ CRITICAL DO NOTs
- **DO NOT** delay giving epinephrine to wait for antihistamines (Benadryl takes 30+ minutes and cannot reverse airway swelling or shock).
- **DO NOT** allow the patient to stand up or walk, even if they feel better.
- **DO NOT** inject into veins, buttocks, fingers, hands, or feet.

### 📞 EMERGENCY DISPATCH REMINDER
Biphasic reactions can trigger a second life-threatening episode up to 12 hours later. Hospital monitoring is required.`
  },
  {
    id: 'seizure-convulsion',
    title: 'Seizures & Convulsions',
    category: 'Neurological',
    severity: 'warning',
    triageLevel: '🟡 YELLOW - URGENT (🔴 RED if >5 minutes or pregnant)',
    keywords: ['seizure', 'epilepsy', 'convulsion', 'shaking', 'fitting', 'tonic clonic', 'postictal', 'foaming', 'unresponsive'],
    summary: 'Protecting patient during generalized seizures, airway preservation, and recovery position.',
    markdown: `### 🚨 TRIAGE PRIORITY: 🟡 YELLOW - URGENT (🔴 RED if lasting >5 min or repetitive)
**Condition: Tonic-Clonic Seizure / Active Convulsion**

### ⏱️ IMMEDIATE ACTION PLAN (STEP-BY-STEP)

1. **Step 1: Protect from Surrounding Hazards**
   - Move sharp objects, furniture, hot liquids, or hard edges away from patient.
   - Loosen tight clothing around their neck (ties, tight collars).

2. **Step 2: Cushion Head & Time the Episode**
   - Place a soft folded jacket, pillow, or towel under their head.
   - **Note the exact start time** on your watch or phone.

3. **Step 3: Turn on Side Once Convulsions Subside**
   - When active jerking stops, roll the person onto their side into the **Recovery Position**.
   - Tilt head gently back with chin up to keep airway clear of saliva or vomit.

4. **Step 4: Monitor Post-Ictal State**
   - Expect confusion, drowsiness, or agitation for 10–30 minutes after seizure.
   - Speak calmly and reassure them as awareness returns.

### ⚠️ CRITICAL DO NOTs
- **DO NOT** put ANYTHING into their mouth (no spoons, fingers, or water). Victims cannot swallow their tongue, and objects cause broken teeth or airway blockage.
- **DO NOT** hold them down or try to physically restrain convulsing limbs.
- **DO NOT** offer water, food, or medication until fully alert and awake.

### 📞 CALL 112 / EMS IMMEDIATELY IF:
- Seizure lasts **longer than 5 minutes**.
- A second seizure starts without regaining consciousness.
- Person is pregnant, diabetic, or injured during fall.
- Seizure occurred in water.`
  },
  {
    id: 'heat-stroke',
    title: 'Heat Stroke vs. Heat Exhaustion',
    category: 'Environmental',
    severity: 'critical',
    triageLevel: '🔴 RED - IMMEDIATE (Heat Stroke) / 🟡 YELLOW (Heat Exhaustion)',
    keywords: ['heat stroke', 'heat exhaustion', 'hot', 'sunstroke', 'hyperthermia', 'dehydrated', 'fainting', 'hot skin', 'no sweat'],
    summary: 'Distinguishing heat exhaustion from life-threatening heat stroke with aggressive cooling procedures.',
    markdown: `### 🚨 TRIAGE PRIORITY: 🔴 RED - IMMEDIATE (Heat Stroke) / 🟡 YELLOW (Heat Exhaustion)
**Condition: Severe Hyperthermia / Environmental Heat Emergency**

### ⏱️ IMMEDIATE ACTION PLAN (STEP-BY-STEP)

1. **Step 1: Differentiate Heat Exhaustion vs. Life-Threatening Heat Stroke**
   - **Heat Exhaustion**: Heavy sweating, cold/pale/clammy skin, nausea, fast pulse, dizziness.
   - **Heat Stroke (CRITICAL)**: Body temp >104°F (40°C), **confusion, altered mental state, slurred speech, seizures, hot red dry or sweaty skin**, loss of consciousness.

2. **Step 2: Rapid Aggressive Cooling (Heat Stroke)**
   - Move to shade or air-conditioned area immediately.
   - Strip outer clothing down to underwear.
   - **Best Method**: Immerse patient in cold water bath or tub up to neck.
   - **Alternative**: Continuously drench with cold water and vigorously fan the body.
   - Place ice packs / cold wet towels on **neck, armpits (axillae), and groin** where major blood vessels run.

3. **Step 3: Hydration Protocol**
   - **If Conscious and Alert**: Sip cool water or electrolyte drink slowly.
   - **If Confused, Disoriented, or Unconscious**: DO NOT give fluids (choking hazard).

4. **Step 4: Monitor Airway & Core Temp**
   - Continue active cooling until body feels cool to the touch.
   - If patient vomits, roll to recovery position immediately.

### ⚠️ CRITICAL DO NOTs
- **DO NOT** give aspirin, Tylenol/acetaminophen, or fever reducers (they do not work for environmental heat and can damage liver/kidneys).
- **DO NOT** leave patient unattended.
- **DO NOT** give energy drinks, alcohol, or caffeine.

### 📞 EMERGENCY DISPATCH REMINDER
Heat stroke is an acute medical emergency with high mortality if cooling is delayed. Call 112 instantly.`
  },
  {
    id: 'hypothermia-frostbite',
    title: 'Hypothermia & Frostbite Protocol',
    category: 'Environmental',
    severity: 'critical',
    triageLevel: '🔴 RED - IMMEDIATE (Severe Hypothermia) / 🟡 YELLOW (Frostbite)',
    keywords: ['hypothermia', 'cold', 'freezing', 'frostbite', 'shivering', 'frozen', 'numb', 'ice', 'blizzard', 'winter'],
    summary: 'Gentle rewarming protocols to prevent rewarming shock and lethal ventricular fibrillation.',
    markdown: `### 🚨 TRIAGE PRIORITY: 🔴 RED - IMMEDIATE / LIFE-THREATENING
**Condition: Deep Accidental Hypothermia / Tissue Frostbite**

### ⏱️ IMMEDIATE ACTION PLAN (STEP-BY-STEP)

1. **Step 1: Handle Extremely Gently**
   - A cold heart is prone to lethal ventricular fibrillation (fatal arrhythmia).
   - Avoid sudden rough movements, jolting, or aggressive massage.

2. **Step 2: Remove from Cold & Strip Wet Clothing**
   - Shelter victim from wind, rain, and snow.
   - Cut away wet garments rather than wrestling them off.
   - Insulate victim from cold ground with sleeping pads, blankets, or coats.

3. **Step 3: Core Rewarming**
   - Wrap entire body in dry blankets or a reflective thermal survival blanket.
   - Cover head, leaving only the face exposed.
   - Apply warm (not scalding) water bottles or heat packs wrapped in cloth to **chest, neck, and groin**.
   - If conscious and swallowing normally: offer warm, sweetened non-caffeinated drinks.

4. **Step 4: Managing Frostbite (Numb, Waxy, Hardened Skin)**
   - Protect frozen tissue from friction or mechanical stress.
   - Rewarm by immersion in warm water (99–102°F / 37–39°C) only if there is **NO danger of refreezing**.
   - Place clean sterile dry gauze between frostbitten toes or fingers.

### ⚠️ CRITICAL DO NOTs
- **DO NOT** rub or massage frostbitten tissue or rub snow on frozen skin (ice crystals destroy cells).
- **DO NOT** apply direct intense heat (open flame, stove, heating lamp, scalding water) to numb flesh.
- **DO NOT** rewarm a frostbitten limb if it might refreeze before reaching a hospital (refreezing causes catastrophic gangrene).
- **DO NOT** give alcohol or cigarettes (causes peripheral vasodilation and heat loss).

### 📞 EMERGENCY DISPATCH REMINDER
In hypothermia, pulse may be extremely faint and slow (10-20 bpm). Check carotid pulse for 60 seconds before concluding cardiac arrest.`
  },
  {
    id: 'snake-bite',
    title: 'Snake Bite & Venomous Stings',
    category: 'Toxicology',
    severity: 'critical',
    triageLevel: '🔴 RED - IMMEDIATE (Venomous Bite) / 🟡 YELLOW (Non-Venomous)',
    keywords: ['snake', 'snake bite', 'venom', 'rattlesnake', 'copperhead', 'viper', 'fang', 'sting', 'spider', 'scorpion'],
    summary: 'Pressure immobilization technique, anti-venom coordination, and myth avoidance.',
    markdown: `### 🚨 TRIAGE PRIORITY: 🔴 RED - IMMEDIATE / LIFE-THREATENING
**Condition: Suspected Venomous Snake Envenomation**

### ⏱️ IMMEDIATE ACTION PLAN (STEP-BY-STEP)

1. **Step 1: Move to Safe Distance & Keep Patient Calm**
   - Move away from the snake's strike zone (snakes can strike up to half their body length).
   - Keep victim completely still and calm; physical activity accelerates venom circulation.

2. **Step 2: Position Bitten Limb Below Heart Level**
   - Keep the affected arm or leg resting level with or lower than the heart.

3. **Step 3: Remove Constrictive Items Immediately**
   - Rapidly remove rings, watches, tight bracelets, and boots before massive swelling locks them in place.

4. **Step 4: Immobilize the Limb**
   - Splint the limb to minimize movement.
   - For neurotoxic vipers / elapids (coral snake, cobras): apply a firm elastic pressure bandage from fingers/toes up the limb (like a sprain bandage).
   - For pit vipers (rattlesnakes): clean wound gently, dress with clean cloth, keep limb immobilized without tight tourniquet.
   - Mark the boundary of swelling and redness with a pen, noting the time (e.g. "14:15 - swelling edge").

5. **Step 5: Identify or Photograph the Snake from Safety**
   - Take a phone photo if safe to do so from 6+ feet away. Note color patterns, head shape, rattle, or eye pupils.

### ⚠️ CRITICAL DO NOTs (AVOID DEADLY MYTHS)
- **DO NOT** cut the bite marks with knives or razors.
- **DO NOT** attempt to suck venom out with mouth or commercial venom extractor pumps (proven ineffective and causes infection).
- **DO NOT** apply a tight arterial tourniquet (causes localized tissue necrosis and limb amputation).
- **DO NOT** apply ice or immerse the limb in cold water.
- **DO NOT** give caffeine, alcohol, or pain medications.

### 📞 EMERGENCY DISPATCH REMINDER
Call 112 / Poison Control immediately. Antivenom is the only definitive cure and must be given early in a hospital.`
  },
  {
    id: 'electric-shock',
    title: 'Electrical Shock & Lightning Strikes',
    category: 'Environmental',
    severity: 'critical',
    triageLevel: '🔴 RED - IMMEDIATE / LIFE-THREATENING',
    keywords: ['electric', 'shock', 'electrocution', 'lightning', 'high voltage', 'wire', 'outlet', 'breaker', 'spark'],
    summary: 'Power isolation, scene sweep, electrical burn inspection, and cardiac monitoring.',
    markdown: `### 🚨 TRIAGE PRIORITY: 🔴 RED - IMMEDIATE / LIFE-THREATENING
**Condition: High/Low Voltage Electrical Contact or Lightning Injury**

### ⏱️ IMMEDIATE ACTION PLAN (STEP-BY-STEP)

1. **Step 1: DO NOT Touch the Victim Until Power is Disconnected!**
   - If they are still in contact with electrical source, touching them will electrocute you!
   - Turn off main circuit breaker, unplug cord, or call utility company for downed power lines.
   - If source cannot be turned off and voltage is low household (120V): push victim away using a dry non-conductive object (wooden broom handle, dry PVC pipe).

2. **Step 2: For Downed High-Voltage Power Lines**
   - Stay at least **35 feet (10 meters)** away.
   - Ground voltage radiates in rings; shuffle away with feet together so voltage doesn't bridge between legs.

3. **Step 3: Check Airway, Breathing & Circulation**
   - Electric current disrupts cardiac conduction (causes ventricular fibrillation or asystole).
   - If unresponsive and not breathing: **START CPR IMMEDIATELY** and attach an AED.

4. **Step 4: Check for Entry and Exit Burns**
   - Electricity travels through internal tissues (nerves, blood vessels, muscles).
   - Look for entry wound (often hands/feet) and exit wound (where current grounded).
   - Cool burns with clean cloth, dress sterilely without bursting blisters.

5. **Step 5: Check for Secondary Trauma**
   - High voltage explosions blast victims backward; assume cervical spine fractures or blunt trauma.

### ⚠️ CRITICAL DO NOTs
- **DO NOT** approach a victim near downed power lines until utility crew certifies line is dead.
- **DO NOT** use wet, metallic, or conductive tools to move electrical wires.
- **DO NOT** dismiss low-voltage shocks; internal cardiac arrhythmias can manifest hours later.

### 📞 EMERGENCY DISPATCH REMINDER
All electrical shock victims must be evaluated in an Emergency Department with continuous EKG monitoring.`
  },
  {
    id: 'head-trauma',
    title: 'Head Trauma, Concussion & Skull Fractures',
    category: 'Trauma',
    severity: 'critical',
    triageLevel: '🔴 RED - IMMEDIATE (Loss of consciousness/CSF leak) / 🟡 YELLOW (Mild concussion)',
    keywords: ['head', 'concussion', 'headache', 'skull', 'vomiting', 'pupils', 'brain', 'passed out', 'confused', 'blood from ear', 'amnesia'],
    summary: 'Neurological triage, identifying intracranial hemorrhage red flags, and spinal precautions.',
    markdown: `### 🚨 TRIAGE PRIORITY: 🔴 RED - IMMEDIATE / CRITICAL
**Condition: Traumatic Brain Injury (TBI) / Basilar Skull Fracture**

### ⏱️ IMMEDIATE ACTION PLAN (STEP-BY-STEP)

1. **Step 1: Immobilize Cervical Spine**
   - Any significant blow to head carries high risk of neck fracture.
   - Hold head steady in neutral position. Prevent patient from nodding or turning head.

2. **Step 2: Check for Critical Neurological Red Flags**
   - **Unequal pupil dilation** (one pupil large and unreactive).
   - **Clear watery fluid or blood** draining from nose or ears (Cerebrospinal Fluid / CSF leak).
   - **Bruising behind ears** (Battle's sign) or black eyes with no facial hit (Raccoon eyes).
   - **Repeated projectile vomiting**.
   - **Deteriorating alertness** (slurred speech, increasing agitation, combativeness, or unresponsiveness).

3. **Step 3: Manage Scalp Lacerations**
   - Scalp is highly vascular and bleeds copiously.
   - Apply gentle direct pressure with sterile dressing.
   - **Exception**: If you feel a soft depression or bone fragments (depressed skull fracture), do NOT press down; apply pressure only to outer edges of wound.

4. **Step 4: Keep Patient Calm & Elevated (30°)**
   - If no spinal trauma is suspected, keep head and shoulders slightly elevated 30 degrees to reduce intracranial pressure.

### ⚠️ CRITICAL DO NOTs
- **DO NOT** plug ears or nose if clear CSF fluid is draining (allowing fluid egress prevents intracranial hypertension and brain herniation).
- **DO NOT** give aspirin, ibuprofen, or NSAIDs (they inhibit platelets and increase intracranial bleeding).
- **DO NOT** let a concussed athlete or victim return to activity.

### 📞 EMERGENCY DISPATCH REMINDER
Seek immediate emergency neurosurgical evaluation if any loss of consciousness or vomiting occurs.`
  },
  {
    id: 'asthma-attack',
    title: 'Acute Asthma Attack & Severe Wheezing',
    category: 'Respiratory',
    severity: 'critical',
    triageLevel: '🔴 RED - IMMEDIATE (Silent chest/exhaustion) / 🟡 YELLOW (Moderate wheeze)',
    keywords: ['asthma', 'inhaler', 'wheezing', 'shortness of breath', 'cannot catch breath', 'puffed', 'albuterol', 'bronchospasm'],
    summary: '4x4x4 reliever inhaler technique, tripoding posture, and silent chest emergency detection.',
    markdown: `### 🚨 TRIAGE PRIORITY: 🔴 RED - IMMEDIATE (Severe Dyspnea) / 🟡 YELLOW (Moderate Attack)
**Condition: Acute Severe Bronchospasm / Asthma Exacerbation**

### ⏱️ IMMEDIATE ACTION PLAN (STEP-BY-STEP)

1. **Step 1: Position Patient Upright (Tripoding)**
   - Sit patient upright leaning slightly forward with hands resting on knees.
   - Never lay someone having an asthma attack down flat on their back (compresses diaphragmatic excursion).

2. **Step 2: Administer Reliever Inhaler (The 4 x 4 x 4 Protocol)**
   - Use blue/grey reliever inhaler (Albuterol / Salbutamol), ideally with a spacer chamber.
   - Shake inhaler well.
   - Give **1 puff** -> Patient takes 4 slow, deep breaths through spacer.
   - Wait 1 minute.
   - Repeat for **4 puffs in total**.

3. **Step 3: Reassess After 4 Minutes**
   - If little to no improvement, give **another 4 puffs**.
   - In severe distress, up to **6 to 8 puffs** can be delivered while awaiting paramedics.

4. **Step 4: Coach Pursed-Lip Breathing**
   - Inhale slowly through nose for 2 counts.
   - Exhale gently through pursed lips (like blowing out birthday candles) for 4 counts to prevent airway collapse.

### ⚠️ CRITICAL RED FLAGS (CALL 112 IMMEDIATELY)
- **Silent Chest**: Wheezing stops suddenly because air movement is too weak to create sound (sign of impending respiratory arrest).
- Inability to speak more than 1 or 2 words between breaths.
- Bluish tint (cyanosis) to lips, tongue, or fingernails.
- Patient appears exhausted, confused, or drowsy.

### 📞 EMERGENCY DISPATCH REMINDER
Dial 112 immediately if the reliever inhaler does not provide clear relief within 5 minutes.`
  },
  {
    id: 'poisoning-overdose',
    title: 'Poisoning, Chemical Ingestion & Drug Overdose',
    category: 'Toxicology',
    severity: 'critical',
    triageLevel: '🔴 RED - IMMEDIATE / LIFE-THREATENING',
    keywords: ['poison', 'swallowed', 'overdose', 'pills', 'narcan', 'naloxone', 'bleach', 'chemical', 'toxic', 'vomit', 'opioid'],
    summary: 'Toxin identification, Naloxone/Narcan administration, and airway positioning.',
    markdown: `### 🚨 TRIAGE PRIORITY: 🔴 RED - IMMEDIATE / LIFE-THREATENING
**Condition: Acute Poisoning / Corrosive Ingestion / Opioid Overdose**

### ⏱️ IMMEDIATE ACTION PLAN (STEP-BY-STEP)

1. **Step 1: Check for Opioid Overdose Signs & Administer Naloxone (Narcan)**
   - **Triad**: Pinpoint pupils, shallow or stopped breathing, unresponsiveness / blue lips.
   - Peel open Narcan nasal spray package.
   - Insert nozzle into one nostril until fingers touch bottom of patient's nose.
   - Press plunger firmly to release dose.
   - If no response after **2–3 minutes**, give second dose in opposite nostril.
   - Begin rescue breathing / CPR if patient is not breathing.

2. **Step 2: Ingested Chemicals / Toxins (Household Cleaners, Detergents, Plants)**
   - Remove remaining substance from mouth with clean cloth.
   - Save containers, pill bottles, or vomit in a bag for paramedic identification.
   - Check label for specific emergency warnings.

3. **Step 3: Position in Recovery Position**
   - If unresponsive but breathing, roll onto left side (delays stomach emptying into intestines and protects airway from aspiration).

4. **Step 4: Call Poison Control Center Immediately**
   - In the US: **1-800-222-1222** (Free, confidential 24/7 expert medical toxicologists).
   - In Europe/International: Call 112 / local national poison center.

### ⚠️ CRITICAL DO NOTs
- **DO NOT** induce vomiting (syrup of ipecac, gagging, or salt water). Corrosives (acid/lye) burn the esophagus twice coming back up, and volatile hydrocarbons can be inhaled into lungs causing fatal chemical pneumonitis!
- **DO NOT** give large amounts of milk, raw eggs, or water unless explicitly told by Poison Control.
- **DO NOT** wait for symptoms to appear before calling Poison Control.

### 📞 EMERGENCY DISPATCH REMINDER
State exact chemical name, concentration, estimated volume consumed, and time of exposure to dispatch.`
  }
];
