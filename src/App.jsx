import { useState, useMemo } from 'react';

/* =========================================================================
   IMMUNODEFICIENCY TRAINER — procedurally generated patient cases
   No LLM. Each syndrome has rules; generators fill in randomized specifics.
   ========================================================================= */

// ---------- name pools ----------
const FIRST_M = ['James','William','Lucas','Ethan','Mason','Noah','Liam','Oliver','Daniel','Henry','Aiden','Caleb','Owen','Wyatt','Sebastian','Marcus','Theo','Jamal','Andre','Diego','Kenji','Arjun','Malik','Dmitri','Finn'];
const FIRST_F = ['Emma','Sophia','Olivia','Ava','Charlotte','Mia','Amelia','Harper','Evelyn','Abigail','Eloise','Nora','Lila','Maya','Aisha','Priya','Lucia','Zara','Naomi','Imani','Sienna','Yuki','Elena','Camila','Freya'];
const LAST = ['Patel','Garcia','Kim','Nguyen','Okafor','Rodriguez','Martinez','Johnson','Williams','Brown','Tanaka','Singh','O\'Brien','Cohen','Andersen','Petrov','Hassan','Reyes','Mbeki','Schmidt','Liu','Romano','Bishara','Larsson','Dubois'];

// ---------- red-herring pools (truly irrelevant details) ----------
const RH_PMH = [
  'Wears glasses for mild myopia',
  'Mild seasonal allergies, treated PRN with cetirizine',
  'Right ankle sprain last fall, fully resolved',
  'No known drug allergies',
  'Penicillin allergy (rash, age 4)',
  'Wisdom teeth extracted last year',
  'Has braces',
  'Lactose intolerant',
  'Vegetarian diet',
  'Was breastfed for 8 months as an infant',
  'Birth: spontaneous vaginal delivery at 39 weeks, uncomplicated'
];

const RH_SHX = [
  'Lives at home with parents and one younger sibling',
  'Plays soccer on the school team',
  'Family owns a Labrador retriever',
  'Mother is an accountant, father is a high-school teacher',
  'Father is a firefighter, mother is a nurse',
  'Enjoys piano lessons twice weekly',
  'In the school chess club',
  'Recently returned from a beach vacation in Florida',
  'Honor roll student',
  'Plays clarinet in the school band',
  'Family recently moved from out of state',
  'Mother had gestational diabetes; otherwise unremarkable pregnancy',
  'Up to date on all routine immunizations (live vaccines noted in record)',
  'Has a pet goldfish named Captain',
  'Older sister is healthy, currently in college'
];

const CC_TEMPLATES = {
  recurrent: ['recurrent infections','frequent illnesses requiring multiple antibiotic courses','being "always sick"','failure to thrive and recurrent infections'],
  acute: ['fever and productive cough','spreading skin abscess','severe diarrhea','seizure activity','poor feeding and lethargy']
};

// ---------- helpers ----------
const rand = (a) => a[Math.floor(Math.random()*a.length)];
const randInt = (lo, hi) => Math.floor(Math.random()*(hi-lo+1))+lo;
const randFloat = (lo, hi, dp=1) => +(Math.random()*(hi-lo)+lo).toFixed(dp);
const pick = (arr, n) => { const c=[...arr]; const out=[]; for(let i=0;i<n && c.length;i++){ out.push(c.splice(Math.floor(Math.random()*c.length),1)[0]); } return out; };
const caseId = () => `${rand(['MR','EMR','PT'])}-${randInt(10000,99999)}`;

// Lab value generators — return a NUMBER (string for display formatting elsewhere)
const LAB_GEN = {
  // Immunoglobulins (mg/dL)
  igG: { absent:[5,30], very_low:[40,200], low:[250,550], normal:[750,1500], high:[1700,2200], very_high:[2300,3500] },
  igA:  { absent:[0,4],  very_low:[1,8],    low:[10,45],   normal:[80,380],  high:[420,650],  very_high:[700,1200] },
  igM:  { absent:[1,5],  very_low:[3,15],   low:[18,35],   normal:[50,220],  high:[260,500],  very_high:[600,2500] },
  // IgE in IU/mL
  igE:  { absent:[0,1],  very_low:[0,2],    low:[1,5],     normal:[10,90],   high:[300,1500], very_high:[2500,50000] },
  // Cell counts /μL
  bCells: { absent:[0,8],   low:[20,90],     normal:[150,500],   high:[600,1200] },
  tCells: { absent:[10,80], low:[200,600],   normal:[900,2000],  high:[2200,3500] },
  // CBC
  wbc:    { low:[2.0,3.5], normal:[4.5,10.5], high:[14,28] },           // x10^3/μL
  plt:    { very_low:[15,55], low:[60,120], normal:[170,380], high:[450,650] }, // x10^3/μL
  hgb:    { low:[8,11], normal:[12,15.5], high:[16,18] },
  // Mean platelet volume (fL) — small in WAS
  mpv:    { low:[3.5,5.5], normal:[7.5,11.0], high:[12,14] },
};

const NORMAL_RANGES = {
  igG:'700–1600 mg/dL', igA:'70–400 mg/dL', igM:'40–230 mg/dL', igE:'<100 IU/mL',
  bCells:'100–500 /μL', tCells:'700–2100 /μL', wbc:'4.5–11.0 ×10³/μL', plt:'150–400 ×10³/μL',
  hgb:'12–16 g/dL', mpv:'7.5–11.5 fL'
};

const genVal = (lab, qual) => {
  const range = LAB_GEN[lab][qual] || LAB_GEN[lab].normal;
  if (lab === 'wbc' || lab === 'hgb' || lab === 'mpv') return randFloat(range[0], range[1], 1);
  if (lab === 'plt') return randInt(range[0], range[1]);
  return randInt(range[0], range[1]);
};

// ---------- SYNDROMES ----------
// Each syndrome defines: demographic constraints, history fragments, PE findings,
// and lab patterns (qualitative). The case generator fills in the specifics.
const SYNDROMES = [
  {
    id:'bruton', name:'X-linked (Bruton) Agammaglobulinemia', short:'Bruton XLA',
    category:'B-cell', sex:'M', ageMin:0.6, ageMax:5,
    cc: () => `${rand(['fourth','fifth','third'])} episode of ${rand(['pneumonia','otitis media'])} in ${rand(['12','14','18'])} months`,
    required: [
      'Patient was well during the first 6 months of life but began having recurrent infections shortly thereafter',
      'Has been hospitalized for bacterial pneumonia (Streptococcus pneumoniae cultured)',
      'Multiple episodes of acute otitis media requiring tympanostomy tubes'
    ],
    optional: [
      'One episode of presumed viral meningitis; CSF PCR was positive for an enterovirus',
      'Chronic intermittent diarrhea; stool studies have grown Giardia lamblia',
      'A maternal uncle died in early childhood from "overwhelming infection"',
      'Allergist noted patient has not received MMR or varicella vaccines per pediatrician',
      'Sinusitis requiring multiple courses of amoxicillin-clavulanate'
    ],
    pe_required: ['Tonsils are not visible on oropharyngeal examination','No palpable cervical, axillary, or inguinal lymphadenopathy'],
    pe_optional: ['Tympanic membranes are dull and scarred bilaterally','Mild conductive hearing loss on screening audiometry'],
    labs: { bCells:'absent', tCells:'normal', igM:'very_low', igG:'very_low', igA:'very_low', igE:'very_low', wbc:'normal', plt:'normal', hgb:'normal' },
    clue: 'Male infant, well until ~6 months (when maternal IgG waned), then recurrent encapsulated bacterial infections, ABSENT tonsils/lymph nodes, ALL immunoglobulins low, and B cells absent → defective BTK (X-linked recessive).'
  },
  {
    id:'iga', name:'Selective IgA Deficiency', short:'IgA Deficiency',
    category:'B-cell', sex:'any', ageMin:5, ageMax:35,
    cc: () => rand(['anaphylactic reaction during a blood transfusion','recurrent sinus infections','chronic loose stools and bloating']),
    required: [
      'History of recurrent sinopulmonary infections (sinusitis, bronchitis)',
      'Atopic disease — eczema and seasonal allergic rhinitis since childhood'
    ],
    optional: [
      'Developed urticaria, hypotension, and bronchospasm minutes into a packed red blood cell transfusion',
      'Older sister with celiac disease',
      'Patient himself has biopsy-confirmed celiac disease',
      'Mild persistent asthma, well controlled on inhaled corticosteroids',
      'Recently diagnosed with Hashimoto thyroiditis'
    ],
    pe_required: ['Mild eczematous patches on antecubital fossae'],
    pe_optional: ['Boggy nasal turbinates with clear discharge','Mild expiratory wheeze on forced expiration'],
    labs: { bCells:'normal', tCells:'normal', igM:'normal', igG:'normal', igA:'absent', igE:'high', wbc:'normal', plt:'normal', hgb:'normal' },
    clue: 'Atopy + recurrent sinopulmonary infections + autoimmune disease (celiac/thyroid) + ANAPHYLAXIS to blood products → ISOLATED IgA deficiency. All other Igs normal.'
  },
  {
    id:'cvid', name:'Common Variable Immunodeficiency', short:'CVID',
    category:'B-cell', sex:'any', ageMin:16, ageMax:38,
    cc: () => rand(['recurrent pneumonia in a young adult','chronic diarrhea and weight loss','newly diagnosed lymphoma found on workup of recurrent infections']),
    required: [
      'Recurrent sinopulmonary infections beginning in late adolescence or early adulthood',
      'Multiple courses of antibiotics in the past two years'
    ],
    optional: [
      'Splenomegaly noted on prior abdominal imaging',
      'Personal history of autoimmune cytopenia (ITP)',
      'Recent diagnosis of granulomatous disease in lymph nodes',
      'Family history of immune dysregulation in a first-degree relative',
      'Chronic giardiasis on stool studies'
    ],
    pe_required: ['Mild splenomegaly palpable below the costal margin'],
    pe_optional: ['Diffuse non-tender lymphadenopathy','Crackles at the right lung base'],
    labs: { bCells:'normal', tCells:'normal', igM:'low', igG:'very_low', igA:'low', igE:'low', wbc:'normal', plt:'normal', hgb:'normal' },
    clue: 'Young ADULT with recurrent infections, low IgG/IgA/±IgM but B cells PRESENT (defect is in differentiation to plasma cells). Often autoimmune disease and increased lymphoma risk.'
  },
  {
    id:'thi', name:'Transient Hypogammaglobulinemia of Infancy', short:'THI',
    category:'B-cell', sex:'any', ageMin:0.7, ageMax:3,
    cc: () => rand(['recurrent mild ear infections','frequent runny nose and cough','third URI in two months']),
    required: [
      'Patient is otherwise growing and developing normally',
      'Infections have been mild and respond well to standard outpatient antibiotics'
    ],
    optional: [
      'Older sibling had similar pattern that resolved by age 4',
      'No hospitalizations or severe infections to date',
      'Vaccine titers show appropriate response to tetanus toxoid'
    ],
    pe_required: ['Well-appearing, well-nourished child at the 60th percentile for height and weight'],
    pe_optional: ['Mild rhinorrhea','Erythematous tympanic membrane on the right'],
    labs: { bCells:'normal', tCells:'normal', igM:'normal', igG:'low', igA:'normal', igE:'high', wbc:'normal', plt:'normal', hgb:'normal' },
    clue: 'Young child (typically 6 mo–3 yr) with MILD recurrent infections, isolated low IgG, normal B/T cells, otherwise thriving — usually NORMALIZES by age 2–6.'
  },
  {
    id:'job', name:'Hyper-IgE Syndrome (Job Syndrome)', short:'Job / Hyper-IgE',
    category:'T-cell', sex:'any', ageMin:3, ageMax:18,
    cc: () => rand(['large but oddly painless skin abscess','retained primary teeth in an older child','fracture of the radius after a minor fall']),
    required: [
      'Multiple Staphylococcus aureus skin abscesses notable for being "cold" — minimal warmth, erythema, or tenderness despite size',
      'Severe atopic dermatitis since infancy'
    ],
    optional: [
      'Primary teeth have not exfoliated; multiple retained baby teeth on dental exam',
      'Previous fracture of a long bone after trivial trauma (skateboarding fall)',
      'Recurrent pneumonias have left pneumatoceles visible on chest CT',
      'Coarse facial features noted by the dermatologist'
    ],
    pe_required: ['Large fluctuant abscess on the back, surprisingly non-tender and minimally erythematous','Lichenified eczematous patches in flexural areas'],
    pe_optional: ['Broad nasal bridge and prominent forehead','Multiple retained primary teeth alongside erupted permanent teeth'],
    labs: { bCells:'normal', tCells:'normal', igM:'normal', igG:'normal', igA:'normal', igE:'very_high', wbc:'normal', plt:'normal', hgb:'normal' },
    clue: 'Cold staph abscesses + eczema + retained baby teeth + minor-trauma fractures + coarse facies + sky-high IgE = STAT3 mutation (impaired Th17 → poor neutrophil recruitment).'
  },
  {
    id:'digeorge', name:'Thymic Aplasia (DiGeorge Syndrome / 22q11.2 deletion)', short:'DiGeorge',
    category:'T-cell', sex:'any', ageMin:0.05, ageMax:2,
    cc: () => rand(['neonatal seizure','cyanotic congenital heart disease','poor feeding and tetany']),
    required: [
      'Neonatal hypocalcemia documented on day-of-life 2 chemistries',
      'Cardiac echocardiogram showed a conotruncal anomaly (truncus arteriosus / tetralogy of Fallot / interrupted aortic arch)'
    ],
    optional: [
      'Cleft palate noted at birth',
      'Carpopedal spasm observed during a low-calcium episode',
      'Chest X-ray notable for absence of the thymic shadow',
      'Early speech delay'
    ],
    pe_required: ['Hypertelorism, low-set posteriorly rotated ears, micrognathia','Harsh systolic murmur loudest at the left sternal border'],
    pe_optional: ['Cleft of the soft palate','Positive Chvostek sign on facial tap'],
    labs: { bCells:'normal', tCells:'low', igM:'normal', igG:'normal', igA:'normal', igE:'normal', wbc:'normal', plt:'normal', hgb:'normal' },
    extraLabs: () => ({ ca: randFloat(5.8,7.2,1), normal_ca:'8.5–10.5 mg/dL' }),
    clue: 'Neonate with hypocalcemic tetany + conotruncal cardiac defect + dysmorphic facies + absent thymic shadow → 22q11.2 microdeletion. Low T cells (variable severity), B cells/Igs preserved.'
  },
  {
    id:'scid', name:'Severe Combined Immunodeficiency', short:'SCID',
    category:'B+T', sex:'any', ageMin:0.1, ageMax:1.0,
    cc: () => rand(['failure to thrive in an infant','persistent oral thrush and chronic diarrhea','Pneumocystis pneumonia in a 4-month-old']),
    required: [
      'Failure to thrive — has fallen from the 50th to the 3rd percentile for weight',
      'Persistent oral candidiasis unresponsive to nystatin',
      'Chronic watery diarrhea since age 2 months'
    ],
    optional: [
      'Confirmed Pneumocystis jirovecii pneumonia on bronchoalveolar lavage',
      'Disseminated CMV viremia by PCR',
      'Disseminated BCG infection following routine vaccination abroad',
      'No tonsillar tissue or palpable lymph nodes',
      'Older male sibling died of overwhelming infection at 7 months'
    ],
    pe_required: ['Cachectic, irritable infant','Thick white plaques coating the buccal mucosa and tongue'],
    pe_optional: ['Absent lymphoid tissue (tonsils, palpable nodes)','Chest X-ray shows ABSENT thymic shadow'],
    labs: { bCells:'low', tCells:'absent', igM:'very_low', igG:'very_low', igA:'very_low', igE:'very_low', wbc:'low', plt:'normal', hgb:'low' },
    clue: 'Infant under 1 year with FTT + opportunistic infections (PCP, CMV, persistent thrush, chronic diarrhea) + ABSENT thymic shadow + everything low → SCID (most commonly defective IL-2R γ chain, X-linked).'
  },
  {
    id:'at', name:'Ataxia–Telangiectasia', short:'A-T',
    category:'B+T', sex:'any', ageMin:2, ageMax:10,
    cc: () => rand(['progressively unsteady gait in a child','recurrent sinopulmonary infections with developmental concerns','red spots noticed on the eyes']),
    required: [
      'Progressive gait abnormality first noticed when learning to walk',
      'Telangiectasias on the bulbar conjunctivae and the pinnae of the ears'
    ],
    optional: [
      'Recurrent sinopulmonary infections (low IgA)',
      'Markedly elevated serum alpha-fetoprotein',
      'Family history of lymphoma in a young first-degree relative',
      'Increased sensitivity to ionizing radiation noted by oncologist'
    ],
    pe_required: ['Wide-based unsteady gait with truncal titubation','Spider-like vascular lesions on the bulbar conjunctivae bilaterally'],
    pe_optional: ['Dysarthric speech','Choreoathetoid movements of the hands'],
    labs: { bCells:'low', tCells:'low', igM:'high', igG:'low', igA:'very_low', igE:'low', wbc:'normal', plt:'normal', hgb:'normal' },
    extraLabs: () => ({ afp: randInt(120,800), normal_afp:'<10 ng/mL' }),
    clue: 'Triad: cerebellar Ataxia (toddler) + Telangiectasias (conjunctival/auricular) + IgA deficiency. ATM gene defect → impaired DNA repair, ↑AFP, ↑lymphoma risk.'
  },
  {
    id:'higm', name:'Hyper-IgM Syndrome (CD40L deficiency)', short:'Hyper-IgM',
    category:'B+T', sex:'M', ageMin:0.5, ageMax:6,
    cc: () => rand(['Pneumocystis pneumonia in a young boy','severe Cryptosporidium-associated diarrhea','recurrent bacterial pneumonia']),
    required: [
      'Severe pyogenic infections beginning in the first year of life',
      'One episode of confirmed Pneumocystis jirovecii pneumonia'
    ],
    optional: [
      'Persistent Cryptosporidium-associated cholangitis',
      'CMV viremia detected during workup of fever',
      'Recurrent neutropenia documented across multiple CBCs',
      'Ascending cholangitis on MRCP'
    ],
    pe_required: ['Tachypneic with diffuse rales (pneumonia in evolution)'],
    pe_optional: ['Mild jaundice with palpable hepatomegaly'],
    labs: { bCells:'normal', tCells:'normal', igM:'very_high', igG:'very_low', igA:'very_low', igE:'very_low', wbc:'low', plt:'normal', hgb:'normal' },
    clue: 'Boy with severe early infections including PNEUMOCYSTIS and CRYPTOSPORIDIUM, with markedly ELEVATED IgM and very low IgG/IgA/IgE → defective CD40L on T cells (no class switching). X-linked.'
  },
  {
    id:'was', name:'Wiskott-Aldrich Syndrome', short:'WAS',
    category:'B+T', sex:'M', ageMin:0.3, ageMax:6,
    cc: () => rand(['petechiae and bloody diarrhea in an infant boy','recurrent infections with eczema','prolonged bleeding after circumcision']),
    required: [
      'Petechiae and easy bruising since infancy',
      'Severe eczematous rash, present since the first months of life',
      'Recurrent infections (otitis media, pneumonia)'
    ],
    optional: [
      'Bloody stools attributed to thrombocytopenia',
      'Older male cousin (maternal side) with similar features who died young',
      'Recently developed autoimmune hemolytic anemia'
    ],
    pe_required: ['Scattered petechiae across the trunk and lower extremities','Lichenified, weeping eczematous patches in the antecubital and popliteal fossae'],
    pe_optional: ['Mild splenomegaly'],
    labs: { bCells:'normal', tCells:'normal', igM:'low', igG:'normal', igA:'high', igE:'high', wbc:'normal', plt:'very_low', hgb:'low', mpv:'low' },
    clue: 'WATER: Wiskott-Aldrich + Thrombocytopenia (with SMALL platelets — ↓MPV) + Eczema + Recurrent infections. Boys, X-linked, WAS gene. ↑IgA/IgE, ↓IgM.'
  },
  {
    id:'cgd', name:'Chronic Granulomatous Disease', short:'CGD',
    category:'Phagocyte', sex:'M', ageMin:0.5, ageMax:8,
    cc: () => rand(['recurrent skin and lymph node abscesses','liver abscess in a child','pneumonia caused by Aspergillus species']),
    required: [
      'Multiple deep tissue abscesses since infancy (skin, perirectal, liver)',
      'Cultures have grown CATALASE-POSITIVE organisms — Staphylococcus aureus and Burkholderia cepacia'
    ],
    optional: [
      'Pulmonary aspergillosis treated with prolonged voriconazole',
      'Granulomatous inflammation seen on biopsy of inflamed lymph nodes',
      'Older brother with similar history died from Serratia sepsis',
      'Dihydrorhodamine (DHR) flow-cytometry assay was abnormal'
    ],
    pe_required: ['Tender, fluctuant abscess in the right axilla','Hepatomegaly with point tenderness in the right upper quadrant'],
    pe_optional: ['Healed scars from prior incision-and-drainage procedures'],
    labs: { bCells:'normal', tCells:'normal', igM:'normal', igG:'high', igA:'normal', igE:'normal', wbc:'high', plt:'normal', hgb:'low' },
    extraLabs: () => ({ dhr:'Abnormal — failure to oxidize dihydrorhodamine on flow cytometry' }),
    clue: 'Boy with recurrent abscesses caused by CATALASE-POSITIVE organisms (S. aureus, Burkholderia, Serratia, Aspergillus, Nocardia) + granulomas + abnormal DHR/NBT → CGD. NADPH oxidase defect.'
  },
  {
    id:'complement', name:'Terminal Complement Deficiency (C5–C9)', short:'Complement Deficiency',
    category:'Complement', sex:'any', ageMin:8, ageMax:25,
    cc: () => rand(['second episode of meningococcal meningitis','disseminated gonococcal infection','meningitis with petechial rash']),
    required: [
      'This is the patient\'s SECOND episode of bacterial meningitis',
      'Cultures from both episodes grew Neisseria meningitidis (different serogroups)'
    ],
    optional: [
      'A first-degree relative also had meningococcal disease as a teenager',
      'Workup of recurrent disseminated gonococcal infection',
      'CH50 (total hemolytic complement) is markedly decreased'
    ],
    pe_required: ['Petechial rash on the trunk and extremities','Nuchal rigidity with positive Brudzinski sign'],
    pe_optional: ['Skin lesions consistent with disseminated gonococcal infection'],
    labs: { bCells:'normal', tCells:'normal', igM:'normal', igG:'normal', igA:'normal', igE:'normal', wbc:'high', plt:'normal', hgb:'normal' },
    extraLabs: () => ({ ch50:'Markedly decreased', normal_ch50:'≥60 U/mL' }),
    clue: 'Recurrent NEISSERIAL infections (meningococcal meningitis or disseminated gonococcal) → suspect terminal complement (C5–C9 / MAC) deficiency. CH50 is decreased.'
  },
  {
    id:'lad', name:'Leukocyte Adhesion Deficiency (LAD type 1)', short:'LAD-1',
    category:'Phagocyte', sex:'any', ageMin:0.05, ageMax:3,
    cc: () => rand(['delayed separation of the umbilical cord','recurrent skin infections without pus formation','severe periodontal disease in a toddler']),
    required: [
      'Umbilical cord did not separate until after 30 days of life',
      'Recurrent bacterial soft-tissue infections that drain little to no pus'
    ],
    optional: [
      'Severe early periodontitis with loss of primary teeth',
      'Poor wound healing after minor lacerations',
      'Flow cytometry showed absent CD18 expression on leukocytes'
    ],
    pe_required: ['Indurated, erythematous skin lesions noted to be NOTABLY without purulent drainage','Severely inflamed gingiva with recession'],
    pe_optional: ['Healing umbilical scar with surrounding induration'],
    labs: { bCells:'normal', tCells:'normal', igM:'normal', igG:'normal', igA:'normal', igE:'normal', wbc:'high', plt:'normal', hgb:'normal' },
    extraLabs: () => ({ cd18:'Absent on flow cytometry' }),
    clue: 'Delayed UMBILICAL CORD separation + recurrent infections WITHOUT PUS + markedly elevated WBC → LAD-1 (defective CD18/β2-integrin). Neutrophils can\'t migrate out of vessels.'
  }
];

// =========================================================================
// CASE GENERATION
// =========================================================================

function generateCase(syndrome) {
  const sex = syndrome.sex === 'any' ? rand(['M','F']) : syndrome.sex;
  const firstNames = sex === 'M' ? FIRST_M : FIRST_F;
  const ageYears = randFloat(syndrome.ageMin, syndrome.ageMax, 1);
  const isInfant = ageYears < 2;
  const ageStr = isInfant
    ? `${Math.round(ageYears*12)}-month-old`
    : `${Math.round(ageYears)}-year-old`;
  const sexWord = sex === 'M' ? (isInfant ? 'boy' : 'male') : (isInfant ? 'girl' : 'female');
  const patient = {
    name: `${rand(firstNames)} ${rand(LAST)}`,
    age: ageYears, ageStr, sex, sexWord,
    pronoun: sex==='M' ? 'he' : 'she',
    pronounPoss: sex==='M' ? 'his' : 'her',
    pronounObj: sex==='M' ? 'him' : 'her',
    guardian: rand(['his mother','her mother','his father','her father','both parents'])
  };

  // Build history: all required + 1-3 optional
  const optionalCount = randInt(1, Math.min(3, syndrome.optional.length));
  const hpiPoints = [...syndrome.required, ...pick(syndrome.optional, optionalCount)];

  // Physical exam: all required + 0-2 optional
  const peOptCount = randInt(0, Math.min(2, syndrome.pe_optional.length));
  const peFindings = [...syndrome.pe_required, ...pick(syndrome.pe_optional, peOptCount)];

  // Red herrings
  const rhPmh = pick(RH_PMH, randInt(1,2));
  const rhShx = pick(RH_SHX, randInt(2,3));

  // Vitals
  const vitals = {
    temp: randFloat(36.6, 39.5, 1),
    hr: isInfant ? randInt(110, 165) : randInt(70, 130),
    rr: isInfant ? randInt(28, 50) : randInt(14, 28),
    bp: isInfant ? `${randInt(75,95)}/${randInt(45,60)}` : `${randInt(95,125)}/${randInt(60,80)}`,
    spo2: randInt(94, 100)
  };

  // Labs
  const labs = {};
  for (const k of Object.keys(syndrome.labs)) {
    labs[k] = genVal(k, syndrome.labs[k]);
  }
  const extraLabs = syndrome.extraLabs ? syndrome.extraLabs() : null;

  return {
    id: caseId(),
    patient,
    syndromeId: syndrome.id,
    cc: syndrome.cc(),
    hpi: hpiPoints,
    pmh: rhPmh,
    shx: rhShx,
    pe: peFindings,
    vitals,
    labs,
    extraLabs,
    clue: syndrome.clue
  };
}

function pickDistractors(correct, n=4) {
  // prefer same category
  const sameCategory = SYNDROMES.filter(s => s.id !== correct.id && s.category === correct.category);
  const other = SYNDROMES.filter(s => s.id !== correct.id && s.category !== correct.category);
  const pool = pick(sameCategory, Math.min(n, sameCategory.length));
  while (pool.length < n) pool.push(pick(other,1)[0]);
  const opts = pool.concat([correct]);
  // shuffle
  for (let i = opts.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

function generateRound() {
  const syndrome = rand(SYNDROMES);
  const caseData = generateCase(syndrome);
  const options = pickDistractors(syndrome, 4);
  return { caseData, syndrome, options };
}

// =========================================================================
// FORMATTING HELPERS
// =========================================================================

const fmtLab = (k, v) => {
  const flag = (low, high) => v < low ? '↓' : v > high ? '↑' : '';
  const tag = (l, h) => `<span style="color:${flag(l,h)?(v<l?'#a01b1b':'#a05a1b'):'#5a5a5a'}">${flag(l,h)||'·'}</span>`;
  let display, ref, status;
  switch(k) {
    case 'igG':    display = `${v} mg/dL`;   ref = NORMAL_RANGES.igG;   status = v<700?'low':v>1600?'high':'normal'; break;
    case 'igA':    display = `${v} mg/dL`;   ref = NORMAL_RANGES.igA;   status = v<70?'low':v>400?'high':'normal'; break;
    case 'igM':    display = `${v} mg/dL`;   ref = NORMAL_RANGES.igM;   status = v<40?'low':v>230?'high':'normal'; break;
    case 'igE':    display = `${v} IU/mL`;   ref = NORMAL_RANGES.igE;   status = v>100?'high':'normal'; break;
    case 'bCells': display = `${v} /μL`;     ref = NORMAL_RANGES.bCells;status = v<100?'low':v>500?'high':'normal'; break;
    case 'tCells': display = `${v} /μL`;     ref = NORMAL_RANGES.tCells;status = v<700?'low':v>2100?'high':'normal'; break;
    case 'wbc':    display = `${v} ×10³/μL`; ref = NORMAL_RANGES.wbc;   status = v<4.5?'low':v>11?'high':'normal'; break;
    case 'plt':    display = `${v} ×10³/μL`; ref = NORMAL_RANGES.plt;   status = v<150?'low':v>400?'high':'normal'; break;
    case 'hgb':    display = `${v} g/dL`;    ref = NORMAL_RANGES.hgb;   status = v<12?'low':v>16?'high':'normal'; break;
    case 'mpv':    display = `${v} fL`;      ref = NORMAL_RANGES.mpv;   status = v<7.5?'low':v>11.5?'high':'normal'; break;
    default: display = String(v); ref=''; status='normal';
  }
  return { display, ref, status };
};

const LAB_LABELS = {
  igG:'IgG', igA:'IgA', igM:'IgM', igE:'IgE',
  bCells:'CD19+ B cells', tCells:'CD3+ T cells',
  wbc:'WBC', plt:'Platelets', hgb:'Hemoglobin', mpv:'Mean Platelet Volume'
};

// =========================================================================
// UI
// =========================================================================

export default function App() {
  const [round, setRound] = useState(generateRound());
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ right:0, wrong:0 });
  const [showRef, setShowRef] = useState(false);

  const { caseData, syndrome, options } = round;
  const { patient, vitals, labs, extraLabs } = caseData;

  const answer = (s) => {
    if (revealed) return;
    setSelected(s);
    setRevealed(true);
    setScore(prev => s.id === syndrome.id
      ? { ...prev, right: prev.right+1 }
      : { ...prev, wrong: prev.wrong+1 });
  };

  const next = () => {
    setRound(generateRound());
    setSelected(null);
    setRevealed(false);
  };

  const correct = revealed && selected?.id === syndrome.id;
  const total = score.right + score.wrong;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,800&family=Lora:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
        body { margin:0; }
        .paper {
          background-color: #f3ece0;
          background-image:
            radial-gradient(circle at 25% 35%, rgba(139,38,53,0.04) 0, transparent 60%),
            radial-gradient(circle at 80% 70%, rgba(45,74,62,0.04) 0, transparent 55%),
            repeating-linear-gradient(0deg, rgba(0,0,0,0.014) 0 1px, transparent 1px 4px);
          font-family: 'Lora', Georgia, serif;
          color: #1f1812;
          min-height: 100vh;
        }
        .display { font-family: 'Fraunces', 'Playfair Display', Georgia, serif; font-weight:800; letter-spacing:-0.02em; }
        .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .stamp {
          font-family:'Fraunces',serif; font-weight:800;
          letter-spacing:0.18em; text-transform:uppercase;
          border:2px solid currentColor; padding:4px 10px; display:inline-block;
          transform: rotate(-2deg);
        }
        .panel { background: rgba(253, 248, 238, 0.85); border: 1px solid rgba(31,24,18,0.18); }
        .accent-rule { background: linear-gradient(90deg, #8b2635 0 22%, transparent 22%); height: 6px; }
        .opt:hover { background: rgba(139,38,53,0.06); }
        .opt-correct { background: rgba(45,120,80,0.18) !important; border-color:#2d784e !important; }
        .opt-wrong { background: rgba(160,30,40,0.14) !important; border-color:#a01b28 !important; }
        .pulse-dot { animation: pulse 1.6s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .case-fade { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from {opacity:0; transform:translateY(6px)} to {opacity:1; transform:none} }
      `}</style>

      <div className="paper">
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* ======= HEADER ======= */}
          <header className="flex items-end justify-between pb-3 mb-2" style={{borderBottom:'2px solid #1f1812'}}>
            <div>
              <div className="text-xs mono uppercase tracking-widest" style={{color:'#8b2635'}}>
                 Wayne State School of Medicine · Teaching File
              </div>
              <h1 className="display text-5xl mt-1" style={{color:'#1f1812'}}>
                Differential <span style={{color:'#8b2635'}}>·</span> Immunodeficiency
              </h1>
              <div className="text-sm italic mt-1" style={{color:'#5a4a3a'}}>
                A procedurally generated patient encounter trainer
              </div>
            </div>
            <div className="text-right">
              <div className="mono text-xs uppercase tracking-widest" style={{color:'#5a4a3a'}}>Score</div>
              <div className="display text-3xl">
                <span style={{color:'#2d784e'}}>{score.right}</span>
                <span style={{color:'#5a4a3a'}}> / </span>
                <span>{total}</span>
              </div>
              <button onClick={()=>setShowRef(!showRef)} className="mono text-xs underline mt-1" style={{color:'#8b2635'}}>
                {showRef ? 'hide' : 'show'} syndrome list
              </button>
            </div>
          </header>
          <div className="accent-rule mb-6"></div>

          {showRef && (
            <div className="panel rounded p-4 mb-6 text-sm">
              <div className="mono uppercase tracking-widest text-xs mb-2" style={{color:'#8b2635'}}>Reference · all 13 syndromes in this trainer</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {SYNDROMES.map(s =>
                  <div key={s.id} className="text-sm">
                    <span className="display" style={{color:'#1f1812', fontWeight:600}}>{s.short}</span>
                    <span className="mono text-xs ml-2" style={{color:'#7a6a55'}}>· {s.category}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======= CASE ======= */}
          <div className="case-fade" key={caseData.id}>
            {/* patient header */}
            <div className="panel rounded p-5 mb-5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <div>
                <div className="mono text-xs uppercase tracking-widest" style={{color:'#5a4a3a'}}>Patient</div>
                <div className="display text-3xl">{patient.name}</div>
              </div>
              <div className="ml-auto flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <div><span className="mono uppercase text-xs tracking-widest" style={{color:'#5a4a3a'}}>Age </span> {patient.ageStr}</div>
                <div><span className="mono uppercase text-xs tracking-widest" style={{color:'#5a4a3a'}}>Sex </span> {patient.sex}</div>
                <div><span className="mono uppercase text-xs tracking-widest" style={{color:'#5a4a3a'}}>MRN </span> <span className="mono">{caseData.id}</span></div>
              </div>
            </div>

            {/* CC + HPI */}
            <Section title="Chief Complaint">
              <p className="italic" style={{color:'#1f1812'}}>"{caseData.cc}"</p>
            </Section>

            <Section title="History of Present Illness">
              <p>
                {patient.name} is a {patient.ageStr} {patient.sexWord} brought in by {patient.guardian} for evaluation. {capitalize(patient.pronoun)} presents with {caseData.cc}.
              </p>
              <ul className="list-none mt-3 space-y-1.5">
                {caseData.hpi.map((h,i) =>
                  <li key={i} className="flex gap-2">
                    <span style={{color:'#8b2635'}}>›</span>
                    <span>{h}</span>
                  </li>
                )}
              </ul>
            </Section>

            {/* PMH + SHx — note these mix relevant and irrelevant */}
            <div className="grid md:grid-cols-2 gap-4 mb-2">
              <Section title="Past Medical / Other">
                <ul className="list-none space-y-1 text-sm">
                  {caseData.pmh.map((h,i) =>
                    <li key={i}>· {h}</li>
                  )}
                </ul>
              </Section>
              <Section title="Social / Family">
                <ul className="list-none space-y-1 text-sm">
                  {caseData.shx.map((h,i) =>
                    <li key={i}>· {h}</li>
                  )}
                </ul>
              </Section>
            </div>

            {/* Vitals */}
            <Section title="Vital Signs">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mono text-sm">
                <Vital label="Temp" value={`${vitals.temp} °C`} flag={vitals.temp >= 38.0} />
                <Vital label="HR"   value={`${vitals.hr} bpm`}  flag={false} pulse={vitals.hr > 130}/>
                <Vital label="RR"   value={`${vitals.rr} /min`} flag={false}/>
                <Vital label="BP"   value={vitals.bp}/>
                <Vital label="SpO₂" value={`${vitals.spo2}%`} flag={vitals.spo2 < 95}/>
              </div>
            </Section>

            {/* Physical exam */}
            <Section title="Physical Examination">
              <ul className="list-none space-y-1.5 text-sm">
                {caseData.pe.map((h,i) => <li key={i}>· {h}</li>)}
              </ul>
            </Section>

            {/* LABS */}
            <Section title="Laboratory Studies">
              <div className="overflow-x-auto">
                <table className="w-full text-sm mono">
                  <thead>
                    <tr style={{borderBottom:'2px solid #1f1812'}}>
                      <th className="text-left py-1.5 pr-2 uppercase tracking-widest text-xs" style={{color:'#5a4a3a'}}>Test</th>
                      <th className="text-left py-1.5 pr-2 uppercase tracking-widest text-xs" style={{color:'#5a4a3a'}}>Result</th>
                      <th className="text-left py-1.5 pr-2 uppercase tracking-widest text-xs" style={{color:'#5a4a3a'}}>Reference</th>
                      <th className="text-left py-1.5 uppercase tracking-widest text-xs" style={{color:'#5a4a3a'}}>Flag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(labs).map((k) => {
                      const f = fmtLab(k, labs[k]);
                      const flagStyle = f.status==='low' ? {color:'#a01b28', fontWeight:700}
                                       : f.status==='high' ? {color:'#a05a1b', fontWeight:700}
                                       : {color:'#7a6a55'};
                      return (
                        <tr key={k} style={{borderBottom:'1px dotted rgba(31,24,18,0.18)'}}>
                          <td className="py-1.5 pr-2" style={{fontFamily:'Lora,serif'}}>{LAB_LABELS[k]}</td>
                          <td className="py-1.5 pr-2"><span style={flagStyle}>{f.display}</span></td>
                          <td className="py-1.5 pr-2 text-xs" style={{color:'#7a6a55'}}>{f.ref}</td>
                          <td className="py-1.5"><span style={flagStyle}>{f.status==='low'?'L': f.status==='high'?'H':' '}</span></td>
                        </tr>
                      );
                    })}
                    {extraLabs && Object.keys(extraLabs).filter(k=>!k.startsWith('normal')).map(k => (
                      <tr key={k} style={{borderBottom:'1px dotted rgba(31,24,18,0.18)'}}>
                        <td className="py-1.5 pr-2" style={{fontFamily:'Lora,serif'}}>{specialLabel(k)}</td>
                        <td className="py-1.5 pr-2"><span style={{color:'#a01b28', fontWeight:700}}>{
                          k==='ca' ? `${extraLabs[k]} mg/dL` :
                          k==='afp' ? `${extraLabs[k]} ng/mL` :
                          extraLabs[k]
                        }</span></td>
                        <td className="py-1.5 pr-2 text-xs" style={{color:'#7a6a55'}}>{extraLabs['normal_'+k]||''}</td>
                        <td className="py-1.5"><span style={{color:'#a01b28', fontWeight:700}}>★</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>

          {/* ======= DIAGNOSIS ======= */}
          <div className="mt-6 mb-3">
            <div className="display text-2xl" style={{color:'#1f1812'}}>
              Your diagnosis?
            </div>
            <div className="text-sm italic" style={{color:'#5a4a3a'}}>Select the most likely immunodeficiency.</div>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5">
            {options.map(o => {
              const isSelected = selected?.id === o.id;
              const isCorrectOption = o.id === syndrome.id;
              let cls = 'opt';
              let style = { borderColor: 'rgba(31,24,18,0.25)' };
              if (revealed) {
                if (isCorrectOption) cls += ' opt-correct';
                else if (isSelected) cls += ' opt-wrong';
              }
              return (
                <button
                  key={o.id}
                  onClick={()=>answer(o)}
                  disabled={revealed}
                  className={`${cls} text-left p-3.5 rounded border-2 transition`}
                  style={style}
                >
                  <div className="display text-base" style={{fontWeight:600}}>{o.name}</div>
                  <div className="mono text-xs uppercase tracking-widest mt-0.5" style={{color:'#7a6a55'}}>
                    {o.category} disorder
                  </div>
                </button>
              );
            })}
          </div>

          {/* ======= REVEAL ======= */}
          {revealed && (
            <div className="mt-6 panel rounded p-5 border-2 case-fade"
                 style={{borderColor: correct ? '#2d784e' : '#a01b28'}}>
              <div className="flex items-center gap-3 mb-2">
                <span className="stamp" style={{color: correct ? '#2d784e' : '#a01b28'}}>
                  {correct ? 'Correct' : 'Incorrect'}
                </span>
                <span className="display text-xl">{syndrome.name}</span>
              </div>
              <div className="text-sm leading-relaxed mt-2">
                <span className="mono uppercase tracking-widest text-xs" style={{color:'#8b2635'}}>Key teaching point</span>
                <p className="mt-1">{caseData.clue}</p>
              </div>
              <div className="mt-4 flex gap-3 items-center">
                <button onClick={next}
                        className="display px-5 py-2 text-base"
                        style={{background:'#1f1812', color:'#f3ece0', borderRadius:'2px', fontWeight:700, letterSpacing:'0.02em'}}>
                  Next case →
                </button>
                <span className="mono text-xs" style={{color:'#7a6a55'}}>
                  Running accuracy: <span style={{color: correct ? '#2d784e' : '#1f1812'}}>{Math.round((score.right/total)*100)}%</span>
                </span>
              </div>
            </div>
          )}

          {!revealed && (
            <div className="mt-6 flex justify-end">
              <button onClick={next} className="mono text-xs underline" style={{color:'#7a6a55'}}>
                skip · generate new case
              </button>
            </div>
          )}

          <footer className="mt-12 pt-4 mono text-xs flex justify-between" style={{color:'#7a6a55', borderTop:'1px solid rgba(31,24,18,0.3)'}}>
            <span>Confidential · Teaching File · For educational use</span>
            <span>Case {caseData.id}</span>
          </footer>
        </div>
      </div>
    </>
  );
}

// ---- small subcomponents ----
function Section({ title, children }) {
  return (
    <div className="mb-4">
      <div className="mono uppercase tracking-widest text-xs mb-1.5 flex items-center gap-2" style={{color:'#8b2635'}}>
        <span>{title}</span>
        <span style={{flex:1, height:'1px', background:'rgba(139,38,53,0.3)'}}></span>
      </div>
      <div className="panel rounded px-4 py-3 leading-relaxed">{children}</div>
    </div>
  );
}

function Vital({ label, value, flag, pulse }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest" style={{color:'#5a4a3a'}}>
        {label}{pulse && <span className="pulse-dot" style={{color:'#a01b28', marginLeft:4}}>●</span>}
      </div>
      <div style={{color: flag ? '#a01b28' : '#1f1812', fontWeight: flag ? 700 : 500}}>{value}</div>
    </div>
  );
}

function capitalize(s) { return s.charAt(0).toUpperCase()+s.slice(1); }
function specialLabel(k) {
  return ({ ca:'Serum Calcium', afp:'α-Fetoprotein', dhr:'DHR (NADPH oxidase)', ch50:'CH50', cd18:'CD18 (flow)' })[k] || k;
}
