import { useState } from 'react';

// =========================================================================
// USMLE TRAINER v3 — Mode-based (Immunodeficiency, Trisomies, ...)
// =========================================================================

const FIRST_M = ['James','William','Lucas','Ethan','Mason','Noah','Liam','Oliver','Daniel','Henry','Aiden','Caleb','Owen','Wyatt','Sebastian','Marcus','Theo','Jamal','Andre','Diego','Kenji','Arjun','Malik','Dmitri','Finn','Mateo','Hiroshi', 'Gwimbly'];
const FIRST_F = ['Emma','Sophia','Olivia','Ava','Charlotte','Mia','Amelia','Harper','Evelyn','Abigail','Eloise','Nora','Lila','Maya','Aisha','Priya','Lucia','Zara','Naomi','Imani','Sienna','Yuki','Elena','Camila','Freya','Anika','Beatriz'];
const LAST = ['Patel','Garcia','Kim','Nguyen','Okafor','Rodriguez','Martinez','Johnson','Williams','Brown','Tanaka','Singh','O\'Brien','Cohen','Andersen','Petrov','Hassan','Reyes','Mbeki','Schmidt','Liu','Romano','Bishara','Larsson','Dubois','Park','Nakamura'];

// Past medical / social pools for older children & adults (immunodeficiency mode)
const RH_PMH = ['Wears glasses for mild myopia','Mild seasonal allergies','Right ankle sprain last fall, fully resolved','No known drug allergies','Wisdom teeth extracted last year','Has braces','Lactose intolerant','Birth: spontaneous vaginal delivery at 39 weeks, uncomplicated'];
const RH_SHX = ['Lives at home with parents and one younger sibling','Plays soccer on the school team','Family owns a Labrador retriever','Mother is an accountant, father is a high-school teacher','Father is a firefighter, mother is a nurse','In the school chess club','Recently returned from a beach vacation in Florida','Honor roll student','Plays clarinet in the school band','Has a pet goldfish named Captain'];

// Newborn-appropriate pools (trisomy mode)
const NEONATAL_PMH = [
  'Birth: spontaneous vaginal delivery at 38+2 weeks gestation',
  'Birth: cesarean delivery for non-reassuring fetal heart tracing at 37+5 weeks',
  'Apgar scores 7 and 9 at 1 and 5 minutes',
  'Apgar scores 4 and 6 at 1 and 5 minutes — required brief positive-pressure ventilation in the delivery room',
  'Routine vitamin K, erythromycin eye ointment, and hepatitis B vaccine administered at birth',
  'Newborn metabolic and hearing screens are pending at the time of evaluation',
  'No known drug allergies'
];
const NEONATAL_SHX = [
  'Mother is a 38-year-old G2P1 woman with regular prenatal care beginning at 9 weeks',
  'Mother is a 41-year-old G3P2 woman; pregnancy was unplanned but desired',
  'First child of a non-consanguineous couple of European and South-Asian descent',
  'Mother had well-controlled gestational diabetes managed with diet',
  'Family lives in a suburban single-family home; no environmental hazards reported',
  'No prior pregnancy losses or family history of congenital anomalies',
  'Older sibling, age 3, is healthy and developmentally appropriate',
  'Mother declined invasive prenatal diagnostic testing'
];

// Toddler / early-childhood pools (Angelman, Prader-Willi)
const PEDIATRIC_PMH = [
  'Term birth via spontaneous vaginal delivery at 39 weeks; appropriate for gestational age',
  'Routine immunizations are up to date through the 12-month visit',
  'Newborn metabolic and hearing screens were normal',
  'No known drug allergies',
  'Followed in early intervention since 9 months of age for global developmental delay',
  'One prior emergency department visit at 14 months for febrile illness, no admission',
  'Mild eczema managed with emollients'
];
const PEDIATRIC_SHX = [
  'Lives at home with both parents and an older sister, age 5, who is healthy and developmentally appropriate',
  'Cared for by maternal grandmother during the day while parents are at work',
  'Attends a community-based early-intervention program three afternoons per week',
  'Mother is a pediatric nurse; father is a software engineer',
  'No tobacco smoke or other environmental exposures in the home',
  'Family recently moved from a different state; this is the first visit with the current pediatrician',
  'Family has one indoor cat; no other pets'
];

// Adolescent / young-adult pools (Klinefelter, Turner)
const ADOLESCENT_PMH = [
  'Immunizations are up to date including HPV and meningococcal series',
  'No known drug allergies',
  'Mild seasonal allergic rhinitis managed with cetirizine as needed',
  'One prior dental extraction under local anesthesia, uncomplicated',
  'No prior hospitalizations',
  'Annual well-adolescent visits at the pediatrician\'s office have otherwise been unremarkable',
  'Routine hearing and vision screens at school were within normal limits'
];
const ADOLESCENT_SHX = [
  'Lives at home with both parents and one younger sibling',
  'In the 9th grade at the local public high school; grades are average',
  'Active in the school marching band',
  'Mother is a paralegal; father is a small-business owner',
  'Denies use of alcohol, tobacco, or recreational drugs',
  'No current sexual activity reported',
  'Family pet is a Labrador retriever; no other significant environmental exposures'
];

// Adult pools (Huntington, SCA, myotonic dystrophy, adult-onset disorders)
const ADULT_PMH = [
  'Hypertension controlled on amlodipine 5 mg daily',
  'No known drug allergies',
  'Prior cholecystectomy at age 38 without complications',
  'Routine colorectal cancer screening was negative two years ago',
  'No prior hospitalizations apart from an uncomplicated childbirth',
  'Annual physical examinations have been unremarkable until the current presentation',
  'Mild gastroesophageal reflux managed with as-needed omeprazole'
];
const ADULT_SHX = [
  'Married for 18 years; has two healthy children, ages 14 and 12',
  'Works as an accountant at a regional firm',
  'Drinks one or two glasses of wine on weekends; denies tobacco or illicit drug use',
  'Lives with their spouse in a single-family home in the suburbs',
  'Father, age 68, has hypertension; mother, age 65, is well',
  'No recent travel outside the United States',
  'Exercises by walking the family dog daily; no formal sports'
];

const rand = (a) => a[Math.floor(Math.random()*a.length)];
const randInt = (lo, hi) => Math.floor(Math.random()*(hi-lo+1))+lo;
const randFloat = (lo, hi, dp=1) => +(Math.random()*(hi-lo)+lo).toFixed(dp);
const pick = (arr, n) => { const c=[...arr]; const out=[]; for(let i=0;i<n && c.length;i++){ out.push(c.splice(Math.floor(Math.random()*c.length),1)[0]); } return out; };
const weighted = (items, weights) => { const total = weights.reduce((a,b)=>a+b,0); let r = Math.random()*total; for (let i=0;i<items.length;i++){ r -= weights[i]; if (r<=0) return items[i]; } return items[items.length-1]; };
const caseId = () => `${rand(['MR','EMR','PT'])}-${randInt(10000,99999)}`;
const shuffle = (arr) => { const a=[...arr]; for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

const LAB_GEN = {
  igG: { absent:[5,30], very_low:[40,200], low:[250,550], normal:[750,1500], high:[1700,2200], very_high:[2300,3500] },
  igA: { absent:[0,4], very_low:[1,8], low:[10,45], normal:[80,380], high:[420,650], very_high:[700,1200] },
  igM: { absent:[1,5], very_low:[3,15], low:[18,35], normal:[50,220], high:[260,500], very_high:[600,2500] },
  igE: { absent:[0,1], very_low:[0,2], low:[1,5], normal:[10,90], high:[300,1500], very_high:[2500,50000] },
  bCells: { absent:[0,8], low:[20,90], normal:[150,500], high:[600,1200] },
  tCells: { absent:[10,80], low:[200,600], normal:[900,2000], high:[2200,3500] },
  wbc: { low:[2.0,3.5], normal:[4.5,10.5], high:[14,28] },
  plt: { very_low:[15,55], low:[60,120], normal:[170,380], high:[450,650] },
  hgb: { low:[8,11], normal:[12,15.5], high:[16,18] },
  mpv: { low:[3.5,5.5], normal:[7.5,11.0], high:[12,14] },
};
const NORMAL_RANGES = { igG:'700–1600 mg/dL', igA:'70–400 mg/dL', igM:'40–230 mg/dL', igE:'<100 IU/mL', bCells:'100–500 /μL', tCells:'700–2100 /μL', wbc:'4.5–11.0 ×10³/μL', plt:'150–400 ×10³/μL', hgb:'12–16 g/dL', mpv:'7.5–11.5 fL' };
const genVal = (lab, qual) => {
  const range = LAB_GEN[lab][qual] || LAB_GEN[lab].normal;
  if (lab === 'wbc' || lab === 'hgb' || lab === 'mpv') return randFloat(range[0], range[1], 1);
  return randInt(range[0], range[1]);
};

// =========================================================================
// MODE 1: IMMUNODEFICIENCY (preserved from v2)
// =========================================================================
const SYNDROMES_IMMUNO = [
  {
    id:'bruton', name:'X-linked (Bruton) Agammaglobulinemia', short:'Bruton XLA', category:'B-cell', sex:'M', ageMin:0.6, ageMax:6,
    defect:'BTK (Bruton tyrosine kinase)', inheritance:'X-linked recessive',
    mechanism:'Failure of pre-B cells to mature into B cells',
    diagnosticTest:'Flow cytometry — absent CD19+ B cells',
    keyOrganism:'Streptococcus pneumoniae',
    organismOptions:['Streptococcus pneumoniae','Haemophilus influenzae type b','enterovirus','Giardia lamblia'],
    cc: () => `${rand(['recurrent pneumonia','recurrent otitis media','recurrent sinusitis'])} — ${rand(['third','fourth','fifth'])} episode in ${rand(['12','14','18'])} months`,
    pathognomonic:['On examination, no tonsillar tissue is visible','No palpable lymph nodes in any cervical, axillary, or inguinal chain','A maternal uncle died in early childhood from overwhelming sepsis'],
    classic:['Was well during the first 6 months of life; recurrent infections began thereafter','Hospitalized previously for pneumococcal pneumonia with positive blood cultures','Stool studies during a prior diarrheal illness grew Giardia lamblia','CSF PCR during a prior febrile illness detected an enterovirus','Multiple episodes of acute otitis media requiring tympanostomy tubes'],
    supportive:['Has been on multiple courses of oral antibiotics over the past two years','Sinusitis requiring amoxicillin-clavulanate at least twice yearly'],
    pe_pathognomonic:['Tonsils are absent on oropharyngeal examination','No palpable cervical lymphadenopathy'],
    pe_classic:['Tympanic membranes are dull and scarred bilaterally'],
    pe_supportive:['Coarse breath sounds at the right base'],
    labs:{ bCells:'absent', tCells:'normal', igM:'very_low', igG:'very_low', igA:'very_low', igE:'very_low' },
    keyLabs:['bCells','igG','igA'],
    differential:'cvid',
    clue:'Male infant, well until ~6 months (when maternal IgG waned), then recurrent encapsulated bacterial infections, ABSENT tonsils/lymph nodes, all Igs low, B cells absent → defective BTK, X-linked recessive. Pre-B cells cannot mature.'
  },
  {
    id:'iga', name:'Selective IgA Deficiency', short:'IgA Deficiency', category:'B-cell', sex:'any', ageMin:6, ageMax:35,
    defect:'Unknown — failure of IgA-class plasma cell development', inheritance:'Sporadic / unknown',
    mechanism:'Isolated failure of IgA production with intact other Ig classes',
    diagnosticTest:'Quantitative serum IgA (markedly low) with normal IgG and IgM',
    keyOrganism:'(no single dominant organism — mucosal sinopulmonary infections)',
    organismOptions:[],
    cc: () => rand(['anaphylactic reaction during a blood transfusion','recurrent sinusitis','chronic diarrhea and bloating','newly diagnosed celiac disease']),
    pathognomonic:['Developed urticaria, hypotension, and bronchospasm minutes into a packed red blood cell transfusion','Quantitative serum IgA on prior labs was undetectable with normal IgG and IgM'],
    classic:['History of biopsy-confirmed celiac disease','Recurrent sinopulmonary infections (sinusitis, bronchitis) since childhood','Atopic dermatitis and seasonal allergic rhinitis since early childhood','Older sister has celiac disease and Hashimoto thyroiditis'],
    supportive:['Mild persistent asthma, well controlled on inhaled corticosteroids','Recently diagnosed with autoimmune thyroiditis'],
    pe_pathognomonic:[],
    pe_classic:['Mild eczematous patches on antecubital fossae','Boggy nasal turbinates with clear discharge'],
    pe_supportive:['Mild expiratory wheeze on forced expiration'],
    labs:{ bCells:'normal', tCells:'normal', igM:'normal', igG:'normal', igA:'absent', igE:'high' },
    keyLabs:['igA','igM','igG'],
    differential:'cvid',
    clue:'Atopy + recurrent sinopulmonary infections + autoimmune disease (celiac/thyroid) + ANAPHYLAXIS to blood products → ISOLATED IgA deficiency. All other Igs normal. Cause unknown.'
  },
  {
    id:'cvid', name:'Common Variable Immunodeficiency', short:'CVID', category:'B-cell', sex:'any', ageMin:16, ageMax:40,
    defect:'B-cell differentiation defect (failure to become plasma cells)', inheritance:'Sporadic (most cases) or autosomal recessive variants',
    mechanism:'Mature B cells fail to differentiate into antibody-secreting plasma cells',
    diagnosticTest:'Quantitative immunoglobulins plus impaired vaccine titer response',
    keyOrganism:'Streptococcus pneumoniae',
    organismOptions:['Streptococcus pneumoniae','Haemophilus influenzae type b','Giardia lamblia','enterovirus'],
    cc: () => rand(['recurrent pneumonia in a young adult','chronic diarrhea and weight loss','newly diagnosed lymphoma found during workup']),
    pathognomonic:['Onset of recurrent infections began in late adolescence — patient was healthy throughout childhood','Vaccination response titers (tetanus, pneumococcal) were undetectable on prior testing'],
    classic:['Recurrent sinopulmonary infections beginning in late adolescence','Personal history of immune thrombocytopenic purpura (ITP)','Prior abdominal imaging noted splenomegaly','Granulomatous inflammation seen on biopsy of mediastinal lymph nodes','Chronic giardiasis confirmed on stool studies'],
    supportive:['Multiple courses of antibiotics over the past two years','Family history of autoimmunity in a first-degree relative'],
    pe_pathognomonic:[],
    pe_classic:['Mild splenomegaly palpable below the costal margin','Diffuse non-tender lymphadenopathy'],
    pe_supportive:['Crackles at the right lung base'],
    labs:{ bCells:'normal', tCells:'normal', igM:'low', igG:'very_low', igA:'low', igE:'low' },
    keyLabs:['igG','igA','bCells'],
    differential:'bruton',
    clue:'Young ADULT with recurrent infections + low IgG and IgA (±IgM) but B cells PRESENT — defect is in differentiation to plasma cells. ↑ risk of lymphoma, autoimmunity, granulomas. Often diagnosed after puberty.'
  },
  {
    id:'thi', name:'Transient Hypogammaglobulinemia of Infancy', short:'THI', category:'B-cell', sex:'any', ageMin:0.7, ageMax:3,
    defect:'Delayed maturation of immunoglobulin synthesis', inheritance:'Sporadic (self-limited)',
    mechanism:'Transient lag in endogenous IgG production after maternal IgG wanes',
    diagnosticTest:'Serial immunoglobulin levels (resolve by 2–6 years)',
    keyOrganism:'(typical childhood viruses; mild infections only)',
    organismOptions:[],
    cc: () => rand(['recurrent mild ear infections','frequent runny nose and cough','third uncomplicated upper respiratory infection in two months']),
    pathognomonic:['Patient is otherwise growing and developing normally; height and weight track at the 60th percentile','Vaccine titers to tetanus and Hib show appropriate antibody response'],
    classic:['Infections have all been mild and respond well to standard outpatient antibiotics','Older sibling had a similar pattern of recurrent mild URIs that resolved by age 4','No hospitalizations or severe infections to date'],
    supportive:['Up to date on all routine immunizations','Birth weight and developmental milestones have been normal'],
    pe_pathognomonic:[],
    pe_classic:['Well-appearing, well-nourished child at the 60th percentile for height and weight'],
    pe_supportive:['Mild rhinorrhea','Erythematous tympanic membrane on the right'],
    labs:{ bCells:'normal', tCells:'normal', igM:'normal', igG:'low', igA:'normal', igE:'normal' },
    keyLabs:['igG'],
    differential:'bruton',
    clue:'Young child (typically 6mo–3yr) with MILD recurrent infections, isolated low IgG, normal B/T cells, normal vaccine responses, otherwise THRIVING. Self-resolves by age 2–6.'
  },
  {
    id:'job', name:'Hyper-IgE Syndrome (Job Syndrome)', short:'Job / Hyper-IgE', category:'T-cell', sex:'any', ageMin:3, ageMax:18,
    defect:'STAT3 (loss-of-function mutation) — impaired Th17 cell differentiation', inheritance:'Autosomal dominant',
    mechanism:'Defective Th17 response → impaired neutrophil recruitment to skin/lung',
    diagnosticTest:'Markedly elevated serum IgE (often >2000 IU/mL) and STAT3 sequencing',
    keyOrganism:'Staphylococcus aureus',
    organismOptions:['Staphylococcus aureus','Candida albicans','Aspergillus fumigatus'],
    cc: () => rand(['large but oddly painless skin abscess','retained primary teeth in an older child','fracture of the radius after trivial trauma','severe eczema since infancy']),
    pathognomonic:['Multiple Staphylococcus aureus skin abscesses notable for being COLD — minimal warmth, erythema, or tenderness despite size','Multiple primary teeth have failed to exfoliate; permanent teeth are erupting alongside retained baby teeth','Coarse facial features — broad nasal bridge, prominent forehead, deep-set eyes — noted by dermatology'],
    classic:['Severe atopic dermatitis since infancy','Previous fracture of a long bone after trivial trauma (skateboarding fall)','Recurrent pneumonias have left pneumatoceles visible on chest CT'],
    supportive:['Frequent oral candidiasis since toddlerhood','Two previous incision-and-drainage procedures for axillary abscesses'],
    pe_pathognomonic:['Large fluctuant abscess on the back, surprisingly NON-tender and minimally erythematous','Multiple retained primary teeth alongside erupted permanent teeth','Broad nasal bridge and prominent forehead'],
    pe_classic:['Lichenified eczematous patches in flexural areas'],
    pe_supportive:['Healed scars from prior incision-and-drainage procedures'],
    labs:{ igM:'normal', igG:'normal', igA:'normal', igE:'very_high' },
    keyLabs:['igE'],
    differential:'cgd',
    clue:'Cold staph abscesses + eczema + retained baby teeth + minor-trauma fractures + coarse facies + sky-high IgE = STAT3 mutation (autosomal dominant). Th17 deficiency → poor neutrophil recruitment.'
  },
  {
    id:'digeorge', name:'DiGeorge Syndrome (22q11.2 deletion / Thymic Aplasia)', short:'DiGeorge', category:'T-cell', sex:'any', ageMin:0.05, ageMax:2,
    defect:'22q11.2 microdeletion (TBX1) — failure of 3rd/4th pharyngeal pouch development', inheritance:'Microdeletion (often de novo)',
    mechanism:'Failed development of thymus and parathyroids → T-cell deficiency + hypocalcemia',
    diagnosticTest:'FISH or chromosomal microarray for 22q11.2 deletion',
    keyOrganism:'Pneumocystis jirovecii',
    organismOptions:['Pneumocystis jirovecii','Candida albicans'],
    cc: () => rand(['neonatal seizure','cyanotic congenital heart disease','poor feeding and tetany in a neonate']),
    pathognomonic:['Cardiac echocardiogram showed a conotruncal anomaly — truncus arteriosus','Cardiac echocardiogram showed an interrupted aortic arch type B','Chest X-ray notable for ABSENCE of the thymic shadow','Karyotype with FISH probe showed a 22q11.2 microdeletion'],
    classic:['Neonatal hypocalcemia documented on day-of-life 2 chemistries','Cleft of the soft palate noted at birth','Carpopedal spasm observed during a low-calcium episode'],
    supportive:['Recurrent feeding difficulties since birth','Early speech delay'],
    pe_pathognomonic:['Hypertelorism, low-set posteriorly rotated ears, and micrognathia','Cleft of the soft palate'],
    pe_classic:['Harsh systolic murmur loudest at the left sternal border','Positive Chvostek sign on facial tap'],
    pe_supportive:[],
    labs:{ bCells:'normal', tCells:'low', igM:'normal', igG:'normal', igA:'normal', igE:'normal' },
    keyLabs:['tCells'],
    extraLabs: () => ({ ca: randFloat(5.8,7.2,1) }),
    extraNormals:{ ca:'8.5–10.5 mg/dL' },
    differential:'scid',
    clue:'Neonate with hypocalcemic tetany + conotruncal cardiac defect + dysmorphic facies + absent thymic shadow → 22q11.2 microdeletion (CATCH-22). T cells low, B cells/Igs preserved.'
  },
  {
    id:'scid', name:'Severe Combined Immunodeficiency', short:'SCID', category:'B+T', sex:'any', ageMin:0.1, ageMax:1.0,
    defect:'IL-2 receptor γ chain (most common, X-linked); also ADA, RAG, JAK3 (autosomal recessive)', inheritance:'X-linked recessive (most common form) or autosomal recessive',
    mechanism:'Profound failure of T-cell development; B cells present but non-functional',
    diagnosticTest:'Lymphocyte panel (absent T cells) and TREC analysis on newborn screening',
    keyOrganism:'Pneumocystis jirovecii',
    organismOptions:['Pneumocystis jirovecii','cytomegalovirus','Candida albicans'],
    cc: () => rand(['failure to thrive in an infant','persistent oral thrush and chronic diarrhea','Pneumocystis pneumonia in a 4-month-old']),
    pathognomonic:['Bronchoalveolar lavage during current admission grew Pneumocystis jirovecii','Chest X-ray notable for ABSENT thymic shadow','Older male sibling died of overwhelming infection at 7 months of life','Newborn TREC screening was abnormal at birth'],
    classic:['Failure to thrive — has fallen from the 50th to the 3rd percentile for weight','Persistent oral candidiasis unresponsive to nystatin since age 2 months','Chronic watery non-bloody diarrhea since age 2 months','Disseminated CMV viremia detected by PCR'],
    supportive:['No tonsillar tissue or palpable lymph nodes on examination','Disseminated BCG infection following routine vaccination abroad'],
    pe_pathognomonic:['Chest X-ray on admission shows absent thymic shadow','Cachectic, irritable infant with thick white plaques coating the buccal mucosa'],
    pe_classic:['Thick white plaques coating the buccal mucosa and tongue'],
    pe_supportive:['Absent lymphoid tissue (no tonsils, no palpable nodes)'],
    labs:{ bCells:'low', tCells:'absent', igM:'very_low', igG:'very_low', igA:'very_low', igE:'very_low' },
    keyLabs:['tCells','igG'],
    differential:'digeorge',
    clue:'Infant under 1 year with FTT + opportunistic infections (PCP, CMV, persistent thrush, chronic diarrhea) + ABSENT thymic shadow + everything low → SCID. Most commonly defective IL-2R γ chain (X-linked recessive). LIVE VACCINES and non-irradiated blood are CONTRAINDICATED.'
  },
  {
    id:'at', name:'Ataxia-Telangiectasia', short:'A-T', category:'B+T', sex:'any', ageMin:2, ageMax:10,
    defect:'ATM (Ataxia-Telangiectasia Mutated) — DNA double-strand break repair', inheritance:'Autosomal recessive',
    mechanism:'Defective DNA repair → progressive cerebellar degeneration, immune defects, lymphoma risk',
    diagnosticTest:'Markedly elevated serum α-fetoprotein and ATM gene sequencing',
    keyOrganism:'(sinopulmonary — encapsulated bacteria from IgA deficiency)',
    organismOptions:[],
    cc: () => rand(['progressively unsteady gait in a child','recurrent sinopulmonary infections with developmental concerns','red spots noticed on the eyes']),
    pathognomonic:['Spider-like vascular lesions on the bulbar conjunctivae bilaterally','Telangiectasias on the pinnae of both ears','Markedly elevated serum α-fetoprotein on prior labs'],
    classic:['Progressive gait abnormality first noticed when learning to walk','Wide-based unsteady gait with truncal titubation','Family history of lymphoma in a young first-degree relative','Increased sensitivity to ionizing radiation noted by oncology'],
    supportive:['Recurrent sinopulmonary infections','Dysarthric speech'],
    pe_pathognomonic:['Spider-like telangiectasias on the bulbar conjunctivae bilaterally','Telangiectasias on the helices of both ears'],
    pe_classic:['Wide-based unsteady gait with truncal titubation','Dysarthric speech'],
    pe_supportive:['Choreoathetoid movements of the hands'],
    labs:{ bCells:'low', tCells:'low', igM:'high', igG:'low', igA:'very_low', igE:'low' },
    keyLabs:['igA'],
    extraLabs: () => ({ afp: randInt(120,800) }),
    extraNormals:{ afp:'<10 ng/mL' },
    differential:'iga',
    clue:'Triad: cerebellar Ataxia (toddler) + Telangiectasias (conjunctival/auricular) + IgA deficiency. ATM gene defect (autosomal recessive) → impaired DNA repair, ↑AFP, ↑lymphoma risk.'
  },
  {
    id:'higm', name:'Hyper-IgM Syndrome (CD40L deficiency)', short:'Hyper-IgM', category:'B+T', sex:'M', ageMin:0.5, ageMax:6,
    defect:'CD40 ligand (CD40L) on T cells — class-switching defect', inheritance:'X-linked recessive',
    mechanism:'T cells cannot signal B cells to undergo Ig class switching → IgM normal/↑, IgG/IgA/IgE absent',
    diagnosticTest:'Flow cytometry for CD40L expression on activated T cells',
    keyOrganism:'Pneumocystis jirovecii',
    organismOptions:['Pneumocystis jirovecii','Cryptosporidium parvum','cytomegalovirus'],
    cc: () => rand(['Pneumocystis pneumonia in a young boy','severe Cryptosporidium-associated diarrhea','recurrent bacterial pneumonia in a young boy']),
    pathognomonic:['Bronchoalveolar lavage on current admission grew Pneumocystis jirovecii','Stool studies during chronic diarrhea grew Cryptosporidium parvum','Recent MRCP showed sclerosing-cholangitis–like changes'],
    classic:['Severe pyogenic infections beginning in the first year of life','CMV viremia detected during workup of fever','Recurrent neutropenia documented across multiple CBCs'],
    supportive:['Multiple courses of broad-spectrum antibiotics','Frequent oral ulcers (associated with cyclic neutropenia)'],
    pe_pathognomonic:[],
    pe_classic:['Tachypneic with diffuse rales','Mild jaundice with palpable hepatomegaly'],
    pe_supportive:['Generalized lymphadenopathy'],
    labs:{ bCells:'normal', tCells:'normal', igM:'high', igG:'very_low', igA:'very_low', igE:'very_low' },
    keyLabs:['igM','igG'],
    differential:'scid',
    clue:'Boy with severe early infections including PNEUMOCYSTIS and CRYPTOSPORIDIUM, with normal/elevated IgM and very low IgG/IgA/IgE → defective CD40L on T cells (no class switching). X-linked recessive.'
  },
  {
    id:'was', name:'Wiskott-Aldrich Syndrome', short:'WAS', category:'B+T', sex:'M', ageMin:0.3, ageMax:6,
    defect:'WAS protein (cytoskeletal regulator)', inheritance:'X-linked recessive',
    mechanism:'Defective WASP → impaired cytoskeleton in lymphocytes and platelets → small platelets, eczema, immunodeficiency',
    diagnosticTest:'Small platelets (low MPV) on smear and WAS gene sequencing',
    keyOrganism:'Streptococcus pneumoniae',
    organismOptions:['Streptococcus pneumoniae','Haemophilus influenzae type b'],
    cc: () => rand(['petechiae and bloody diarrhea in an infant boy','recurrent infections with severe eczema','prolonged bleeding after circumcision']),
    pathognomonic:['Peripheral blood smear shows MICROTHROMBOCYTES (small platelets); MPV is low','Maternal first cousin (male) had a similar phenotype and died young'],
    classic:['Petechiae and easy bruising since infancy','Severe eczematous rash present since the first months of life','Recurrent otitis media and pneumonia','Bloody stools attributed to thrombocytopenia'],
    supportive:['Recently developed autoimmune hemolytic anemia','Prolonged bleeding after a routine venipuncture'],
    pe_pathognomonic:['Scattered petechiae across the trunk and lower extremities','Lichenified, weeping eczematous patches in the antecubital and popliteal fossae'],
    pe_classic:['Mild splenomegaly'],
    pe_supportive:[],
    labs:{ bCells:'normal', tCells:'normal', igM:'low', igG:'normal', igA:'high', igE:'high', plt:'very_low', mpv:'low' },
    keyLabs:['plt','mpv'],
    clue:'WATER: Wiskott-Aldrich + Thrombocytopenia (with SMALL platelets — ↓MPV) + Eczema + Recurrent infections. Boys, X-linked recessive. WAS protein defect. ↑IgA/IgE, ↓IgM, ↑lymphoma risk.'
  },
  {
    id:'cgd', name:'Chronic Granulomatous Disease', short:'CGD', category:'Phagocyte', sex:'M', ageMin:0.5, ageMax:8,
    defect:'NADPH oxidase (gp91phox / CYBB most commonly) — phagocyte respiratory burst', inheritance:'X-linked recessive (most common form)',
    mechanism:'Phagocytes cannot generate reactive oxygen species → infections with catalase-positive organisms',
    diagnosticTest:'Dihydrorhodamine (DHR) flow cytometry — failure to oxidize',
    keyOrganism:'Aspergillus fumigatus',
    organismOptions:['Aspergillus fumigatus','Burkholderia cepacia','Serratia marcescens','Staphylococcus aureus','Nocardia asteroides'],
    cc: () => rand(['recurrent skin and lymph node abscesses','liver abscess in a child','pneumonia caused by Aspergillus species']),
    pathognomonic:['Cultures from prior abscesses have grown Burkholderia cepacia','Cultures from prior abscesses have grown Serratia marcescens','Pulmonary aspergillosis treated with prolonged voriconazole','Dihydrorhodamine (DHR) flow-cytometry assay was abnormal','Granulomatous inflammation seen on biopsy of inflamed lymph nodes'],
    classic:['Multiple deep tissue abscesses since infancy (skin, perirectal, liver)','Cultures have grown Staphylococcus aureus','Older brother with similar history died from Serratia sepsis'],
    supportive:['Multiple healed scars from prior incision-and-drainage procedures','On long-term TMP-SMX prophylaxis prescribed by infectious disease'],
    pe_pathognomonic:['Hepatomegaly with point tenderness in the right upper quadrant (concerning for liver abscess)'],
    pe_classic:['Tender, fluctuant abscess in the right axilla'],
    pe_supportive:['Healed scars from prior incision-and-drainage procedures'],
    labs:{ bCells:'normal', tCells:'normal', igM:'normal', igG:'high', igA:'normal', igE:'normal', wbc:'high' },
    keyLabs:['wbc'],
    extraLabs: () => ({ dhr:'Abnormal — failure to oxidize dihydrorhodamine on flow cytometry' }),
    extraNormals:{ dhr:'Normal oxidation' },
    differential:'job',
    clue:'Boy with recurrent abscesses caused by CATALASE-POSITIVE organisms (S. aureus, Burkholderia, Serratia, Aspergillus, Nocardia) + granulomas + abnormal DHR/NBT → CGD. NADPH oxidase defect, X-linked recessive (most common form).'
  },
  {
    id:'complement', name:'Terminal Complement Deficiency (C5–C9 / MAC)', short:'Terminal Complement Deficiency', category:'Complement', sex:'any', ageMin:8, ageMax:25,
    defect:'C5, C6, C7, C8, or C9 — components of the membrane attack complex (MAC)', inheritance:'Autosomal recessive',
    mechanism:'Inability to form the membrane attack complex → susceptibility to Neisseria species',
    diagnosticTest:'CH50 (total hemolytic complement) — markedly decreased',
    keyOrganism:'Neisseria meningitidis',
    organismOptions:['Neisseria meningitidis','Neisseria gonorrhoeae'],
    cc: () => rand(['second episode of bacterial meningitis','disseminated gonococcal infection with skin lesions','meningitis with petechial rash']),
    pathognomonic:['This is the patient\'s SECOND episode of bacterial meningitis','Cultures from both episodes grew Neisseria meningitidis (different serogroups)','CH50 (total hemolytic complement) on prior labs was undetectable','A first-degree relative also had meningococcal disease as a teenager'],
    classic:['Petechial rash on the trunk and extremities','Workup of recurrent disseminated gonococcal infection (tenosynovitis, dermatitis)','Up to date on meningococcal vaccination but still developed disease'],
    supportive:['Severe headache, photophobia, and neck stiffness','Fever to 39.4°C on presentation'],
    pe_pathognomonic:[],
    pe_classic:['Petechial rash on the trunk and extremities','Nuchal rigidity with positive Brudzinski sign'],
    pe_supportive:['Skin lesions consistent with disseminated gonococcal infection (pustular dermatitis)'],
    labs:{ wbc:'high' },
    keyLabs:[],
    extraLabs: () => ({ ch50:'Markedly decreased' }),
    extraNormals:{ ch50:'≥60 U/mL' },
    clue:'Recurrent NEISSERIAL infections (meningococcal meningitis or disseminated gonococcal) → terminal complement (C5–C9 / MAC) deficiency. CH50 is low. Autosomal recessive.'
  },
  {
    id:'lad', name:'Leukocyte Adhesion Deficiency Type 1 (LAD-1)', short:'LAD-1', category:'Phagocyte', sex:'any', ageMin:0.05, ageMax:3,
    defect:'CD18 (β2-integrin / ITGB2) — leukocyte adhesion molecule', inheritance:'Autosomal recessive',
    mechanism:'Neutrophils cannot adhere to endothelium and migrate to sites of infection → no pus formation',
    diagnosticTest:'Flow cytometry for CD18 expression on leukocytes (absent)',
    keyOrganism:'Staphylococcus aureus',
    organismOptions:['Staphylococcus aureus','Pseudomonas aeruginosa'],
    cc: () => rand(['delayed separation of the umbilical cord','recurrent skin infections without pus formation','severe periodontal disease in a toddler']),
    pathognomonic:['Umbilical cord did not separate until day 32 of life','Indurated erythematous skin lesions notable for being WITHOUT purulent drainage','Flow cytometry on a previous admission showed absent CD18 expression on leukocytes'],
    classic:['Recurrent bacterial soft-tissue infections that drain little to no pus','Severe early periodontitis with loss of primary teeth','Poor wound healing after minor lacerations'],
    supportive:['Multiple courses of antibiotics with surprisingly good response despite recurrence','Markedly elevated peripheral white count even when clinically well'],
    pe_pathognomonic:['Indurated, erythematous skin lesion notable for ABSENCE of purulent drainage','Healing umbilical scar with surrounding induration in an infant'],
    pe_classic:['Severely inflamed gingiva with recession'],
    pe_supportive:[],
    labs:{ bCells:'normal', tCells:'normal', wbc:'high' },
    keyLabs:['wbc'],
    extraLabs: () => ({ cd18:'Absent on flow cytometry' }),
    extraNormals:{ cd18:'>90% expression' },
    differential:'cgd',
    clue:'Delayed UMBILICAL CORD separation + recurrent infections WITHOUT PUS + markedly elevated WBC → LAD-1 (defective CD18/β2-integrin). Autosomal recessive. Neutrophils cannot extravasate.'
  }
];

// =========================================================================
// MODE 2: AUTOSOMAL TRISOMIES
// =========================================================================
const SYNDROMES_TRISOMY = [
  {
    id:'down', name:'Down Syndrome (Trisomy 21)', short:'Down (T21)', category:'Autosomal Trisomy',
    sex:'any', ageMin:0.01, ageMax:1.0,
    defect:'Trisomy 21 — three copies of chromosome 21',
    inheritance:'Meiotic nondisjunction (~95%, advanced maternal age); Robertsonian translocation t(14;21) (~4%); mosaicism (~1%)',
    mechanism:'Nondisjunction during meiosis I (usually maternal) → extra copy of chromosome 21. Translocation form is not age-dependent and can be inherited from a balanced-carrier parent.',
    diagnosticTest:'Karyotype showing 47,XX,+21 or 47,XY,+21 (or chromosomal microarray)',
    keyOrganism:'',
    organismOptions:[],
    // trisomy-specific fields
    keyCardiac:'Complete atrioventricular (AV) septal defect — endocardial cushion defect',
    cardiacOptions:['Complete atrioventricular (AV) septal defect — endocardial cushion defect','Ventricular septal defect (VSD)','Atrial septal defect (ostium primum)','Patent ductus arteriosus','Tetralogy of Fallot'],
    keyComplication:'Increased risk of acute lymphoblastic leukemia (ALL) and acute megakaryoblastic leukemia (AMKL); early-onset Alzheimer disease due to APP gene overexpression on chromosome 21',
    complicationOptions:['Increased risk of acute lymphoblastic leukemia and early-onset Alzheimer disease','Duodenal atresia presenting as bilious vomiting in the newborn','Hirschsprung disease','Congenital hypothyroidism','Atlantoaxial instability'],
    cc: () => rand([
      'newborn with hypotonia and dysmorphic features',
      'newborn with bilious vomiting on day-of-life 1',
      'newborn with a heart murmur and feeding difficulty',
      '6-month-old with persistent hypotonia and developmental concerns'
    ]),
    pathognomonic:[
      'Pregnancy was complicated by a maternal serum quadruple screen showing ↓ AFP, ↑ β-hCG, ↓ estriol, and ↑ inhibin A',
      'First-trimester combined screening showed increased nuchal translucency, ↑ free β-hCG, and ↓ PAPP-A',
      'Amniocentesis at 16 weeks gestation showed 47,XY,+21',
      'Abdominal radiograph shows a classic "double bubble" sign consistent with duodenal atresia'
    ],
    classic:[
      'Mother was 39 years old at the time of delivery',
      'Mother was 41 years old; this is her first pregnancy',
      'Hypotonia evident from the first moments of life with a weak suck and poor feeding',
      'Echocardiogram performed on day-of-life 2 demonstrated a complete atrioventricular septal defect',
      'Failed to pass meconium in the first 48 hours of life; rectal suction biopsy showed absent ganglion cells consistent with Hirschsprung disease',
      'Routine newborn metabolic screen identified congenital hypothyroidism'
    ],
    supportive:[
      'Mother declined first-trimester screening during pregnancy',
      'No family history of congenital anomalies',
      'Pregnancy was otherwise uncomplicated with appropriate fetal growth on serial ultrasounds'
    ],
    pe_pathognomonic:[
      'Flat facial profile with depressed nasal bridge, upslanting palpebral fissures, and bilateral epicanthal folds',
      'Single transverse palmar crease bilaterally ("simian crease")',
      'Brushfield spots — small white speckled lesions — visible on the iris bilaterally on slit-lamp examination',
      'Wide sandal-gap between the first and second toes bilaterally'
    ],
    pe_classic:[
      'Diffuse hypotonia with marked head lag on the pull-to-sit maneuver',
      'Protruding tongue with a small oral cavity (relative macroglossia)',
      'Short broad neck with redundant nuchal skin',
      'Harsh holosystolic murmur loudest at the lower left sternal border',
      'Bilateral fifth-finger clinodactyly with hypoplastic middle phalanges'
    ],
    pe_supportive:[
      'Small, low-set ears with overfolded helices',
      'Weight and length tracking at the third percentile'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: (patient) => ({ karyo: patient?.sex === 'F' ? '47,XX,+21' : '47,XY,+21' }),
    extraNormals:{ karyo:'46,XX or 46,XY' },
    differential:'edwards',
    clue:'Newborn with flat facies, hypotonia, single palmar crease, sandal-gap, Brushfield spots → Trisomy 21 (Down). Most common cause: maternal meiosis I nondisjunction (95%). AV septal defect is the classic cardiac lesion. ↑risk ALL/AMKL, duodenal atresia, Hirschsprung, hypothyroidism, atlantoaxial instability, early-onset Alzheimer (APP on chr 21). Quad screen: ↓AFP, ↑β-hCG, ↓estriol, ↑inhibin A.'
  },
  {
    id:'edwards', name:'Edwards Syndrome (Trisomy 18)', short:'Edwards (T18)', category:'Autosomal Trisomy',
    sex:'any', ageMin:0.01, ageMax:0.8,
    defect:'Trisomy 18 — three copies of chromosome 18',
    inheritance:'Meiotic nondisjunction (advanced maternal age)',
    mechanism:'Nondisjunction during meiosis (usually maternal) → extra copy of chromosome 18. Risk increases with maternal age, as with all autosomal trisomies.',
    diagnosticTest:'Karyotype showing 47,XX,+18 or 47,XY,+18',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'Ventricular septal defect (VSD)',
    cardiacOptions:['Ventricular septal defect (VSD)','Atrial septal defect','Patent ductus arteriosus','Complete atrioventricular septal defect','Tetralogy of Fallot'],
    keyComplication:'Death within the first year of life — ~90% of liveborn infants die before their first birthday from cardiac and respiratory complications',
    complicationOptions:['Death within the first year of life from cardiac and respiratory complications','Horseshoe kidney','Omphalocele','Severe intellectual disability in survivors','Recurrent apneic episodes'],
    cc: () => rand([
      'newborn with severe intrauterine growth restriction and dysmorphic features',
      'newborn with apneic episodes and clenched fists',
      'newborn with feeding difficulty and a prominent occiput',
      'newborn with abnormal hand posture and a heart murmur'
    ]),
    pathognomonic:[
      'Maternal serum quadruple screen showed ↓ AFP, ↓ β-hCG, ↓ estriol, and low/normal inhibin A (all markers down)',
      'Amniocentesis at 18 weeks gestation showed 47,XX,+18',
      'Both hands are tightly clenched with the index finger overlapping the third digit and the fifth finger overlapping the fourth ("overlapping fingers")',
      'Third-trimester ultrasound demonstrated severe intrauterine growth restriction with polyhydramnios attributed to poor fetal swallowing'
    ],
    classic:[
      'Mother was 41 years old at the time of delivery',
      'Echocardiogram on day-of-life 2 demonstrated a moderate-sized ventricular septal defect',
      'Renal ultrasound showed a horseshoe kidney',
      'Infant required brief positive-pressure ventilation in the delivery room for apnea',
      'Severe intrauterine growth restriction noted from the third-trimester ultrasound onward'
    ],
    supportive:[
      'Apgar scores were 3 and 6 at 1 and 5 minutes',
      'Has had multiple apneic episodes since birth requiring stimulation',
      'Birth weight is below the third percentile despite a 38-week gestation'
    ],
    pe_pathognomonic:[
      'Both hands clenched with the index finger overlapping the third digit and the fifth finger overlapping the fourth digit',
      'Rocker-bottom feet with prominent calcanei bilaterally',
      'Prominent occiput with low-set malformed ears and marked micrognathia',
      'Short sternum with closely-spaced nipples on chest examination'
    ],
    pe_classic:[
      'Severely growth-restricted infant well below the third percentile for weight',
      'Harsh holosystolic murmur at the lower left sternal border',
      'Cryptorchidism noted on genital examination',
      'Microcephaly with a sloping forehead'
    ],
    pe_supportive:[
      'Marked hypertonia of the extremities (in contrast to the hypotonia of Trisomy 21)',
      'Hypoplastic nails on multiple digits'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: (patient) => ({ karyo: patient?.sex === 'F' ? '47,XX,+18' : '47,XY,+18' }),
    extraNormals:{ karyo:'46,XX or 46,XY' },
    differential:'patau',
    clue:'PRINCE Edward turned 18: Prominent occiput, Rocker-bottom feet, Intellectual disability, Nondisjunction, Clenched fists with overlapping fingers, low-set Ears, chromosome 18. Severe IUGR + horseshoe kidney + VSD. Quad screen: all four markers ↓. ~90% mortality in first year. Mnemonic: "Election age 18."'
  },
  {
    id:'patau', name:'Patau Syndrome (Trisomy 13)', short:'Patau (T13)', category:'Autosomal Trisomy',
    sex:'any', ageMin:0.01, ageMax:0.8,
    defect:'Trisomy 13 — three copies of chromosome 13',
    inheritance:'Meiotic nondisjunction (advanced maternal age); occasionally Robertsonian translocation',
    mechanism:'Nondisjunction during meiosis → extra copy of chromosome 13. Disrupts midline development (forebrain, face, anterior abdominal wall).',
    diagnosticTest:'Karyotype showing 47,XX,+13 or 47,XY,+13',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'Ventricular septal defect (VSD), frequently with dextrocardia',
    cardiacOptions:['Ventricular septal defect (VSD), frequently with dextrocardia','Atrial septal defect','Patent ductus arteriosus','Complete atrioventricular septal defect','Hypoplastic left heart syndrome'],
    keyComplication:'Death within the first year of life — ~90% of liveborn infants die before their first birthday due to severe CNS and cardiac malformations',
    complicationOptions:['Death within the first year of life from severe CNS and cardiac malformations','Holoprosencephaly with seizures','Severe intellectual disability in survivors','Recurrent omphalocele complications','Apneic episodes'],
    cc: () => rand([
      'newborn with cleft lip/palate and a scalp defect',
      'newborn with apparent eye malformations and a small head',
      'newborn with polydactyly and a holosystolic murmur',
      'newborn with seizure-like activity on day-of-life 1'
    ]),
    pathognomonic:[
      'Prenatal ultrasound demonstrated holoprosencephaly — a single fused forebrain ventricle without separation of the cerebral hemispheres',
      'A 3 × 4 cm patch of absent skin and underlying scalp (cutis aplasia) is visible on the vertex',
      'Bilateral postaxial polydactyly of the hands and feet (extra digit on the ulnar / fibular side)',
      'Amniocentesis at 17 weeks gestation showed 47,XY,+13',
      'Bilateral cleft lip with a midline cleft of the hard palate'
    ],
    classic:[
      'Microphthalmia of the left eye with a hypoplastic globe',
      'Echocardiogram demonstrated a large ventricular septal defect with the cardiac apex displaced to the right (dextrocardia)',
      'Mother was 39 years old; prenatal screening had been declined',
      'Brief seizure-like activity observed on day-of-life 1',
      'Omphalocele noted on abdominal examination at birth',
      'Maternal serum quadruple screen was reported as normal — Patau is not reliably detected by the standard quad screen'
    ],
    supportive:[
      'Apgar scores were 4 and 6',
      'Infant has been difficult to feed since birth',
      'No family history of congenital anomalies'
    ],
    pe_pathognomonic:[
      'Bilateral cleft lip and palate with a midline facial cleft',
      'Bilateral postaxial polydactyly of the hands and feet',
      'A 3 × 4 cm area of cutis aplasia on the vertex of the scalp',
      'Microphthalmia of the left eye'
    ],
    pe_classic:[
      'Microcephaly with a sloping forehead',
      'Rocker-bottom feet',
      'Harsh holosystolic murmur with the cardiac apex displaced to the right (dextrocardia)',
      'Omphalocele at the umbilical base'
    ],
    pe_supportive:[
      'Low-set, malformed ears',
      'Severely growth-restricted infant below the third percentile'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: (patient) => ({ karyo: patient?.sex === 'F' ? '47,XX,+13' : '47,XY,+13' }),
    extraNormals:{ karyo:'46,XX or 46,XY' },
    differential:'edwards',
    clue:'Newborn with holoprosencephaly + cleft lip/palate + polydactyly + microphthalmia + cutis aplasia + VSD with dextrocardia → Trisomy 13 (Patau). ~90% mortality in first year. Quad screen is typically NORMAL — Patau is not reliably detected. Mnemonic: "Puberty at 13" — midline defects + extra digit + scalp defect.'
  },
  {
    id:'angelman', name:'Angelman Syndrome', short:'Angelman', category:'Imprinting Disorder',
    sex:'any', ageMin:1.0, ageMax:5.0,
    pmhPool: PEDIATRIC_PMH, shxPool: PEDIATRIC_SHX,
    defect:'Loss of function of the maternally-inherited UBE3A gene on chromosome 15q11-q13. In neurons the paternal UBE3A allele is silenced by genomic imprinting, so loss of the maternal allele leaves no functional UBE3A in the brain.',
    inheritance:'Genomic imprinting — most commonly de novo deletion of the maternal 15q11-q13 region (~70%); less frequently paternal uniparental disomy of chromosome 15 (~2–7%), imprinting-center defects (~3%), or maternal UBE3A point mutations (~10%)',
    mechanism:'UBE3A encodes a ubiquitin protein ligase. Only the maternal allele is expressed in neurons because the paternal allele is silenced by an antisense transcript (UBE3A-ATS) regulated by the imprinting center. Loss of the active maternal UBE3A → severe neurodevelopmental phenotype.',
    diagnosticTest:'DNA methylation analysis at the 15q11-q13 imprinting center; chromosomal microarray to detect the maternal deletion',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'',
    cardiacOptions:[],
    keyComplication:'Refractory seizures with a characteristic high-amplitude 2–3 Hz slow-wave EEG pattern, typically beginning before three years of age',
    complicationOptions:[
      'Refractory seizures with a high-amplitude 2–3 Hz slow-wave EEG pattern beginning before three years of age',
      'Hyperphagia leading to morbid early-childhood obesity',
      'Hypergonadotropic hypogonadism with primary amenorrhea',
      'Acute lymphoblastic leukemia of childhood',
      'Mediastinal nonseminomatous germ cell tumor in adolescence'
    ],
    cc: () => rand([
      'toddler with severe global developmental delay and frequent unprovoked episodes of laughter',
      'toddler with no spoken words and a jerky, wide-based gait',
      'preschooler with a recent first generalized tonic-clonic seizure on a background of severe developmental delay',
      'toddler with frequent hand-flapping, a fascination with water, and a persistently happy demeanor'
    ]),
    pathognomonic:[
      'Frequent, paroxysmal bouts of laughter without an obvious provoking stimulus, with an overall happy and excitable demeanor',
      'Severe expressive language delay — the child has only 2–3 single words despite being three years of age',
      'EEG shows the characteristic pattern of high-amplitude 2–3 Hz triphasic delta-wave activity with intermittent spikes, most prominent over the frontal regions',
      'Chromosomal microarray reveals a de novo ~4 Mb deletion of the maternally-derived 15q11.2-q13.1 region'
    ],
    classic:[
      'Generalized tonic-clonic seizures with onset before three years of age that have been difficult to control with first-line antiepileptics',
      'Jerky, wide-based, ataxic gait with stereotyped hand-flapping movements during excitement',
      'Severe global developmental delay evident by the first year of life — sat unsupported only at 15 months and is not yet walking independently at age 3',
      'Sleep difficulties with frequent night-time awakenings and a markedly reduced overall sleep requirement',
      'Fascination with water and with shiny or crinkly objects'
    ],
    supportive:[
      'Normal pregnancy and delivery at 39 weeks with appropriate birth weight',
      'Newborn metabolic screen and head circumference were normal at birth',
      'No family history of intellectual disability or seizure disorder'
    ],
    pe_pathognomonic:[
      'Recurrent bouts of unprovoked laughter and smiling that appear inappropriate to context and recur throughout the encounter',
      'Stereotyped hand-flapping movements precipitated by excitement',
      'Wide-based, ataxic, puppet-like gait with jerky limb movements'
    ],
    pe_classic:[
      'Acquired microcephaly — head circumference has fallen from the 50th percentile at birth to the 3rd percentile',
      'Hypopigmented skin and fair hair, noticeably lighter than other family members (due to deletion of the neighboring OCA2 gene)',
      'Prognathism with widely-spaced teeth and frequent tongue protrusion',
      'Strabismus on extraocular movement testing'
    ],
    pe_supportive:[
      'No dysmorphic features beyond those noted; growth parameters are otherwise normal',
      'Drooling and frequent mouthing of objects'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: () => ({ methylation:'Abnormal — only the unmethylated (paternal) pattern is detected at the 15q11-q13 imprinting center; the methylated maternal allele is absent' }),
    extraNormals:{ methylation:'Normal biparental methylation pattern at 15q11-q13' },
    differential:'prader',
    clue:'Toddler with severe ID, no/minimal speech, ataxic puppet-like gait, hand-flapping, inappropriate laughter, seizures with a characteristic 2–3 Hz EEG, microcephaly, and fair coloring → Angelman. Loss of the MATERNAL UBE3A allele at 15q11-q13 — in neurons only the maternal copy is expressed (paternal is silenced by imprinting). ~70% from de novo maternal deletion. Confirm with DNA methylation analysis. Partner imprinting disorder: Prader-Willi (paternal deletion of the same region).'
  },
  {
    id:'prader', name:'Prader-Willi Syndrome', short:'Prader-Willi', category:'Imprinting Disorder',
    sex:'any', ageMin:2.0, ageMax:6.0,
    pmhPool: PEDIATRIC_PMH, shxPool: PEDIATRIC_SHX,
    defect:'Loss of function of paternally-expressed imprinted genes (including SNRPN, MAGEL2, NDN, MKRN3, and a cluster of snoRNAs) on chromosome 15q11-q13. The maternal allele of this region is silenced by genomic imprinting, so loss of the paternal allele leaves no functional gene expression.',
    inheritance:'Genomic imprinting — most commonly de novo deletion of the paternal 15q11-q13 region (~65–75%); also maternal uniparental disomy of chromosome 15 (~20–30%); imprinting-center defects (~1–3%)',
    mechanism:'Loss of paternally-expressed 15q11-q13 genes → hypothalamic dysfunction → infantile hypotonia and poor feeding, then childhood-onset hyperphagia (with elevated ghrelin), short stature from growth-hormone deficiency, hypogonadotropic hypogonadism, and a characteristic behavioral phenotype.',
    diagnosticTest:'DNA methylation analysis at the 15q11-q13 imprinting center; chromosomal microarray to detect the paternal deletion',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'',
    cardiacOptions:[],
    keyComplication:'Severe early-childhood obesity from insatiable hyperphagia, with subsequent complications of type 2 diabetes, obstructive sleep apnea, and gastric necrosis from binge eating',
    complicationOptions:[
      'Severe early-childhood obesity from insatiable hyperphagia, with later type 2 diabetes and obstructive sleep apnea',
      'Refractory seizures with a high-amplitude 2–3 Hz slow-wave EEG pattern',
      'Aortic dissection in early adulthood from cystic medial necrosis',
      'Acute lymphoblastic leukemia of childhood',
      'Mediastinal nonseminomatous germ cell tumor in adolescence'
    ],
    cc: () => rand([
      'preschooler with rapid weight gain and an apparently insatiable appetite',
      'toddler followed since infancy for poor feeding and hypotonia, now with rapid weight gain and food-seeking behavior',
      'preschooler with morbid obesity, food-seeking behavior, and short stature',
      'preschooler whose parents report frequent food hoarding, temper tantrums when meals are denied, and skin picking'
    ]),
    pathognomonic:[
      'Insatiable hunger with food-seeking behavior — the child reportedly hoards food, takes food from neighbors\' homes, and has been found eating from the garbage',
      'History of profound infantile hypotonia with a weak suck requiring nasogastric tube feeds in the first months of life, followed by transition to hyperphagia between two and four years of age',
      'Chromosomal microarray reveals a de novo ~4 Mb deletion of the paternally-derived 15q11.2-q13.1 region',
      'Fasting serum ghrelin is markedly elevated at more than three times the upper limit of normal'
    ],
    classic:[
      'History of severe central hypotonia in infancy with failure to thrive requiring gavage feeds for the first three months of life',
      'Onset of rapid weight gain and food-seeking behavior between 18 months and three years of age',
      'Short stature — height is at the 1st percentile for age',
      'Cryptorchidism with a hypoplastic scrotum (in boys) or hypoplastic labia minora (in girls)',
      'Mild-to-moderate intellectual disability with measured IQ in the 60–70 range',
      'Behavioral problems including temper tantrums, stubbornness, and compulsive skin picking'
    ],
    supportive:[
      'Term birth at 38 weeks gestation via cesarean delivery for breech presentation',
      'Reduced fetal movement reported throughout the third trimester of pregnancy',
      'Mother is 31 years old; no family history of obesity or intellectual disability'
    ],
    pe_pathognomonic:[
      'Striking truncal obesity with disproportionately small hands and feet ("acromicria")',
      'Narrow bifrontal diameter with almond-shaped palpebral fissures and a down-turned mouth',
      'Persistent central hypotonia with reduced spontaneous movement and a weak gag reflex'
    ],
    pe_classic:[
      'Short stature: height at the 1st percentile for age',
      'Hypogonadism: cryptorchidism with a hypoplastic scrotum',
      'Multiple linear excoriations on the forearms and shins from compulsive skin picking',
      'Strabismus on extraocular movement testing'
    ],
    pe_supportive:[
      'Light hair and skin pigmentation relative to other family members',
      'Thick, viscous saliva with multiple dental caries'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: () => ({ methylation:'Abnormal — only the methylated (maternal) pattern is detected at the 15q11-q13 imprinting center; the unmethylated paternal allele is absent', ghrelin: randInt(1800, 3200) }),
    extraNormals:{ methylation:'Normal biparental methylation pattern at 15q11-q13', ghrelin:'fasting <800 pg/mL' },
    differential:'angelman',
    clue:'Toddler/preschooler with history of profound infantile hypotonia and poor suck, now with hyperphagia → obesity, short stature, small hands/feet, almond-shaped eyes, hypogonadism (cryptorchidism), and mild ID → Prader-Willi. Loss of the PATERNAL 15q11-q13. ~70% from de novo paternal deletion; ~25% from MATERNAL uniparental disomy. Hypothalamic dysfunction → markedly ↑ ghrelin. Partner imprinting disorder: Angelman (maternal deletion of the same region).'
  },
  {
    id:'klinefelter', name:'Klinefelter Syndrome', short:'Klinefelter', category:'Sex Chromosome Aneuploidy',
    sex:'M', ageMin:14, ageMax:18,
    pmhPool: ADOLESCENT_PMH, shxPool: ADOLESCENT_SHX,
    defect:'Aneuploidy of the sex chromosomes — an extra X chromosome producing a 47,XXY karyotype, which arises from meiotic nondisjunction (~half maternal, half paternal in origin). The classic karyotype 47,XXY accounts for >90% of cases; mosaicism (46,XY/47,XXY) and higher-grade aneuploidies (48,XXXY, 49,XXXXY) account for the remainder.',
    inheritance:'Meiotic nondisjunction of the sex chromosomes — the extra X may arise from either maternal or paternal meiosis (roughly evenly split); risk increases with advanced maternal age',
    mechanism:'Presence of an extra X chromosome → progressive seminiferous tubule hyalinization and Sertoli/Leydig cell dysfunction at the onset of puberty → primary (hypergonadotropic) hypogonadism with elevated FSH and LH, low-to-low-normal testosterone, elevated estradiol, and azoospermia.',
    diagnosticTest:'Karyotype demonstrating 47,XXY (the gold standard); chromosomal microarray as an alternative',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'',
    cardiacOptions:[],
    keyComplication:'Markedly increased risk (~50 times the general male population) of breast cancer; also increased risk of mediastinal nonseminomatous germ cell tumors',
    complicationOptions:[
      'Markedly increased risk of breast cancer and of mediastinal nonseminomatous germ cell tumors',
      'Aortic dissection in adulthood from cystic medial necrosis of the ascending aorta',
      'Acute lymphoblastic leukemia of childhood',
      'Renal cell carcinoma developing within a horseshoe kidney',
      'Refractory seizures with hand-flapping stereotypies'
    ],
    cc: () => rand([
      'adolescent male brought in by his parents for "delayed puberty" and unusually tall stature',
      'adolescent male evaluated for progressive bilateral breast enlargement',
      'adolescent male with chronic learning difficulties and recently-noted small testes',
      'late-adolescent male presenting for evaluation of primary infertility with his partner'
    ]),
    pathognomonic:[
      'Karyotype performed on peripheral blood lymphocytes demonstrates 47,XXY',
      'Bilateral testicular volume of approximately 3 mL each on orchidometer examination (normal adult male volume ≥15 mL) despite advanced pubic-hair Tanner staging',
      'Semen analysis demonstrates azoospermia on two separate samples obtained one month apart'
    ],
    classic:[
      'Eunuchoid body habitus — arm span (192 cm) exceeds standing height (188 cm) by more than 2 cm',
      'Bilateral gynecomastia developing during early puberty and progressively enlarging',
      'Sparse facial and body hair distribution despite advanced chronologic age',
      'Decreased libido and erectile difficulties of recent onset',
      'Mild learning difficulties, particularly with verbal language and reading, reported throughout primary and secondary school'
    ],
    supportive:[
      'Otherwise healthy with no chronic medical conditions',
      'No family history of infertility or chromosomal disorders',
      'Mother was 34 years old at the time of his birth'
    ],
    pe_pathognomonic:[
      'Small, firm testes (≤4 mL bilaterally on orchidometer) despite Tanner stage 4–5 pubic-hair development',
      'Eunuchoid body habitus with arm span exceeding standing height by ≥2 cm',
      'Bilateral gynecomastia with palpable glandular tissue posterior to the areolae'
    ],
    pe_classic:[
      'Sparse facial and axillary hair with a female-pattern body-hair distribution',
      'Underdeveloped musculature with reduced muscle mass for chronological age',
      'Penile length within the normal adult male range despite the small testicular volume'
    ],
    pe_supportive:[
      'No dysmorphic facial features',
      'External genitalia otherwise normal apart from the testicular volume'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: () => ({
      karyo:'47,XXY',
      testosterone: randInt(140, 240),
      lh: randInt(18, 28),
      fsh: randInt(28, 48),
      estradiol: randInt(44, 60)
    }),
    extraNormals:{
      karyo:'46,XY',
      testosterone:'300–1000 ng/dL (adult ♂)',
      lh:'1.7–8.6 mIU/mL (adult ♂)',
      fsh:'1.5–12.4 mIU/mL (adult ♂)',
      estradiol:'<40 pg/mL (adult ♂)'
    },
    differential:'turner',
    clue:'Tall adolescent male with eunuchoid habitus, small firm testes, gynecomastia, sparse facial/body hair, learning difficulties, and infertility/azoospermia → Klinefelter (47,XXY). Hypergonadotropic (primary) hypogonadism: ↓ testosterone, ↑↑ FSH (from loss of Sertoli-cell inhibin B), ↑ LH, ↑ estradiol. Caused by meiotic nondisjunction (maternal- or paternal-origin extra X). Histology: hyalinized seminiferous tubules. ↑ risk breast cancer (~50×) and mediastinal nonseminomatous germ cell tumors. Partner sex-chromosome aneuploidy: Turner (45,X).'
  },
  {
    id:'turner', name:'Turner Syndrome (45,X)', short:'Turner', category:'Sex Chromosome Aneuploidy',
    sex:'F', ageMin:11, ageMax:15,
    pmhPool: ADOLESCENT_PMH, shxPool: ADOLESCENT_SHX,
    defect:'Monosomy X (45,X) due to loss of one X chromosome — most often from paternal meiotic nondisjunction or anaphase lag during early embryogenesis. Mosaic forms (45,X/46,XX, isochromosome Xq, ring X) account for roughly half of cases. Haploinsufficiency of the SHOX gene in the pseudoautosomal region accounts for the short stature.',
    inheritance:'Sex chromosome monosomy (45,X) — most often arising from loss of the paternally-derived X chromosome through meiotic nondisjunction or anaphase lag; NOT associated with advanced maternal age (unlike the autosomal trisomies)',
    mechanism:'Loss of an X chromosome → haploinsufficiency of pseudoautosomal-region genes (notably SHOX → short stature) and accelerated atresia of oocytes from the second trimester onward → streak ovaries → hypergonadotropic hypogonadism with primary amenorrhea and absent pubertal development.',
    diagnosticTest:'Karyotype demonstrating 45,X (or a 45,X/46,XX mosaic) on peripheral blood lymphocytes; chromosomal microarray as an alternative',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'Bicuspid aortic valve (the most common cardiac lesion, ~30%) with or without preductal coarctation of the aorta (~15%)',
    cardiacOptions:[
      'Bicuspid aortic valve with preductal coarctation of the aorta',
      'Complete atrioventricular septal defect',
      'Ventricular septal defect with overlapping fingers',
      'Tetralogy of Fallot',
      'Transposition of the great arteries'
    ],
    keyComplication:'Aortic dissection in adulthood (~6× the general female population), particularly in patients with a bicuspid aortic valve, coarctation, or untreated hypertension',
    complicationOptions:[
      'Aortic dissection in adulthood, particularly with a bicuspid aortic valve or coarctation',
      'Breast cancer and mediastinal nonseminomatous germ cell tumors',
      'Acute lymphoblastic leukemia of childhood',
      'Refractory seizures with hand-flapping stereotypies',
      'Severe early-onset Alzheimer disease'
    ],
    cc: () => rand([
      'adolescent female presenting for evaluation of short stature and lack of pubertal development',
      'adolescent female evaluated for primary amenorrhea',
      'adolescent female brought in for poor growth — she has fallen progressively below the 3rd percentile for height',
      'adolescent female with primary amenorrhea and absent breast development'
    ]),
    pathognomonic:[
      'Karyotype performed on peripheral blood lymphocytes demonstrates 45,X',
      'History of bilateral hand and foot lymphedema present at birth that gradually resolved over the first year of life',
      'Prenatal ultrasound at 19 weeks gestation demonstrated a large cystic hygroma of the posterior neck',
      'Pelvic ultrasound demonstrates a small, prepubertal uterus and bilateral streak gonads with no identifiable ovarian follicles'
    ],
    classic:[
      'Height (138 cm) is well below the 3rd percentile for age; growth velocity has been progressively declining since age six',
      'No breast development (Tanner stage 1) and no menarche at age 14',
      'Echocardiogram performed for an asymptomatic systolic ejection murmur demonstrated a bicuspid aortic valve',
      'Blood pressure in the right arm is 138/88 mmHg while in the left thigh is 92/60 mmHg; femoral pulses are diminished and delayed compared with the brachial pulses',
      'Hashimoto thyroiditis was diagnosed at age 11 with positive anti-TPO antibodies',
      'Recurrent otitis media throughout childhood with subsequent conductive hearing loss'
    ],
    supportive:[
      'Normal intelligence; honor-roll student with no learning difficulties reported',
      'Mother was 28 years old at the time of her birth — pregnancy was otherwise uncomplicated',
      'No family history of chromosomal disorders or congenital heart disease'
    ],
    pe_pathognomonic:[
      'Bilateral webbed neck with a low posterior hairline',
      'Shield-shaped chest with widely-spaced and inverted nipples',
      'Bilateral cubitus valgus — increased carrying angle at both elbows beyond 15°',
      'Multiple pigmented nevi over the upper back and chest'
    ],
    pe_classic:[
      'Short stature (height well below the 3rd percentile for age) without skeletal disproportion',
      'Tanner stage 1 breast development with sparse pubic hair (Tanner 2)',
      'Soft systolic ejection murmur with an early ejection click at the upper right sternal border; femoral pulses are diminished and delayed compared with the brachial pulses',
      'Bilateral shortening of the fourth metacarpals (a positive "knuckle-knuckle-dimple-knuckle" sign)'
    ],
    pe_supportive:[
      'High-arched palate with crowded dentition',
      'Down-slanting palpebral fissures with epicanthal folds'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: () => ({
      karyo:'45,X',
      fsh: randInt(65, 92),
      lh: randInt(36, 52),
      estradiol: randInt(2, 9),
      tsh: randFloat(6.2, 11.0, 1)
    }),
    extraNormals:{
      karyo:'46,XX',
      fsh:'follicular 3–10 mIU/mL',
      lh:'follicular 2–10 mIU/mL',
      estradiol:'follicular 30–120 pg/mL',
      tsh:'0.4–4.0 μIU/mL'
    },
    differential:'klinefelter',
    clue:'Adolescent girl with short stature, primary amenorrhea, absent breast development, webbed neck, shield chest, widely-spaced nipples, cubitus valgus, and a history of newborn hand/foot lymphedema or fetal cystic hygroma → Turner (45,X). Streak ovaries → hypergonadotropic hypogonadism (↑↑ FSH/LH, ↓ estradiol). Bicuspid aortic valve + preductal coarctation are the classic cardiovascular lesions; aortic dissection is the feared adult complication. Horseshoe kidney is common. NOT maternal-age related (unlike the autosomal trisomies). Increased risk of Hashimoto thyroiditis. SHOX-gene haploinsufficiency drives the short stature. Partner sex-chromosome aneuploidy: Klinefelter (47,XXY).'
  }
];

// =========================================================================
// SYNDROMES — TRINUCLEOTIDE REPEAT EXPANSION DISORDERS
// =========================================================================
const SYNDROMES_TRINUCLEOTIDE = [
  {
    id:'huntington', name:'Huntington Disease', short:'Huntington', category:'Polyglutamine Disorder',
    sex:'any', ageMin:32, ageMax:55,
    defect:'CAG trinucleotide repeat expansion in the HTT gene on chromosome 4p16.3 producing mutant huntingtin with a toxic gain-of-function polyglutamine (polyQ) tract; pathology shows selective loss of GABAergic medium spiny neurons in the striatum (caudate > putamen).',
    inheritance:'Autosomal dominant trinucleotide (CAG) repeat expansion in the HTT gene on chromosome 4p; exhibits anticipation that is more pronounced with paternal transmission because the largest expansions occur during spermatogenesis',
    mechanism:'Expanded CAG repeats (≥40 in fully penetrant alleles; 36–39 reduced penetrance) encode a polyglutamine tract in huntingtin that misfolds and aggregates with toxic gain-of-function. Loss of GABAergic medium spiny neurons in the striatum produces caudate atrophy on neuroimaging.',
    diagnosticTest:'Targeted PCR sizing of the CAG trinucleotide repeat in the HTT gene',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'',
    cardiacOptions:[],
    keyComplication:'Marked caudate nucleus atrophy with secondary ex vacuo dilation of the frontal horns of the lateral ventricles on neuroimaging',
    complicationOptions:[
      'Marked caudate nucleus atrophy with ex vacuo dilation of the frontal horns of the lateral ventricles on neuroimaging',
      'Hypertrophic cardiomyopathy on echocardiography',
      'Bilateral posterior subcapsular iridescent cataracts on slit-lamp examination',
      'Macroorchidism developing after the onset of puberty',
      'Diffuse cerebellar and pontine atrophy with sparing of the basal ganglia on MRI'
    ],
    cc: () => rand([
      'middle-aged man presenting with involuntary jerking movements and progressive irritability of one year duration',
      'middle-aged woman with personality changes and abnormal involuntary movements',
      'middle-aged man brought in by his wife for new-onset clumsiness, restlessness, and forgetfulness',
      'middle-aged woman with worsening fidgety movements and a one-year history of major depression'
    ]),
    pathognomonic:[
      'PCR sizing of the HTT gene reveals 47 CAG trinucleotide repeats on the affected allele (normal <27; full penetrance ≥40)',
      'MRI of the brain demonstrates marked symmetric atrophy of the caudate nuclei bilaterally with ex vacuo enlargement of the frontal horns of the lateral ventricles',
      'Family history: the patient\'s father developed similar involuntary movements and progressive dementia in his early 50s and died of complications at age 60'
    ],
    classic:[
      'Insidious onset of involuntary, irregular, dance-like movements affecting the face, hands, and trunk',
      'Personality changes preceding the motor symptoms by several years — irritability, apathy, and disinhibition',
      'Progressive cognitive decline most prominent in executive function and working memory ("subcortical dementia" pattern)',
      'Recurrent major depressive episodes with one prior suicide attempt at age 38',
      'A father who developed similar involuntary movements and personality change in his early 50s'
    ],
    supportive:[
      'No recent stimulant or dopaminergic drug exposure',
      'Mild dysphagia with reported weight loss of 6 kg over the past year',
      'Sleep is fragmented with frequent nocturnal awakenings'
    ],
    pe_pathognomonic:[
      'Continuous, irregular, non-rhythmic involuntary movements (chorea) of the face, tongue, and distal extremities, persisting at rest and worsened by distraction',
      'Impersistence of tongue protrusion and a "milkmaid grip" when grasping the examiner\'s fingers — the grip waxes and wanes involuntarily',
      'Saccadic eye movements are slow and hypometric; the patient cannot maintain steady fixation'
    ],
    pe_classic:[
      'Gait is wide-based, jerky, and incorporates involuntary choreiform overlays of the limbs',
      'Mini-Mental State Examination score 22/30 with prominent executive-function deficits on clock-drawing and trail-making tests',
      'Affect is labile with brief episodes of tearfulness during the interview',
      'Muscle tone is variable with motor impersistence rather than frank weakness'
    ],
    pe_supportive:[
      'Reflexes are symmetric and normal; plantar responses are flexor bilaterally',
      'No cerebellar dysmetria on finger-to-nose testing apart from the choreiform overlay'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: () => ({ repeats:`${randInt(43,52)} CAG repeats on the affected HTT allele` }),
    extraNormals:{ repeats:'fewer than 27 CAG repeats per HTT allele; 36–39 reduced penetrance; ≥40 fully penetrant' },
    differential:'sca',
    clue:'Middle-aged adult with progressive chorea + subcortical dementia + psychiatric symptoms (depression, irritability) + family history of similar adult-onset disease → Huntington (HTT, 4p, CAG repeat). AUTOSOMAL DOMINANT with ANTICIPATION (paternal transmission causes the largest expansions; juvenile HD almost always paternally inherited). Penetrance ≥40 (full), 36–39 reduced. Polyglutamine gain-of-function → loss of GABAergic medium spiny neurons in CAUDATE → caudate atrophy with ex vacuo ventricular dilation on MRI. Markedly elevated suicide risk.'
  },
  {
    id:'friedreich', name:'Friedreich Ataxia', short:'Friedreich', category:'Recessive Ataxia',
    sex:'any', ageMin:9, ageMax:18,
    pmhPool: RH_PMH, shxPool: RH_SHX,
    defect:'GAA trinucleotide repeat expansion within intron 1 of the FXN gene on chromosome 9q21.11. Biallelic expansion silences FXN transcription → reduced frataxin → impaired mitochondrial iron handling, Fe-S cluster dysfunction, and oxidative damage in cells with high metabolic demand.',
    inheritance:'Autosomal recessive trinucleotide (GAA) repeat expansion in both alleles of the FXN gene on chromosome 9q (a small subset of patients are compound heterozygous for a GAA expansion plus a point mutation)',
    mechanism:'Biallelic GAA expansion (typically 600–1200 repeats) impedes FXN transcription. Frataxin is a mitochondrial iron chaperone; its deficiency causes mitochondrial iron accumulation, Fe-S cluster dysfunction, and reactive-oxygen-species damage. Most affected: dorsal root ganglia, spinocerebellar/corticospinal tracts, dorsal columns, cardiomyocytes, and pancreatic β-cells.',
    diagnosticTest:'Triplet-repeat-primed PCR demonstrating biallelic GAA expansion in intron 1 of the FXN gene',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'Hypertrophic cardiomyopathy (concentric, ~60% of patients) — the most common cause of death in Friedreich ataxia',
    cardiacOptions:[
      'Concentric hypertrophic cardiomyopathy — the most common cause of death in Friedreich ataxia',
      'Dilated cardiomyopathy with biventricular enlargement',
      'Bicuspid aortic valve with preductal coarctation of the aorta',
      'Atrial septal defect of the secundum type',
      'Progressive cardiac conduction-system disease with first-degree AV block'
    ],
    keyComplication:'Insulin-dependent diabetes mellitus develops in 10–30% of patients from oxidative damage to pancreatic β-cells',
    complicationOptions:[
      'Insulin-dependent diabetes mellitus from β-cell oxidative damage (10–30% of patients)',
      'Bilateral posterior subcapsular iridescent cataracts on slit-lamp examination',
      'Markedly increased risk of acute lymphoblastic leukemia of childhood',
      'Marked caudate atrophy with ex vacuo ventricular dilation on neuroimaging',
      'Macroorchidism developing after the onset of puberty'
    ],
    cc: () => rand([
      'adolescent presenting with progressive clumsiness and a wide-based gait',
      'preteen with worsening difficulty walking, frequent falls, and slurred speech',
      'adolescent with gait ataxia and a recently noted heart murmur on routine sports physical',
      'teenager with progressive ataxia and new-onset glucose intolerance'
    ]),
    pathognomonic:[
      'Triplet-repeat-primed PCR demonstrates biallelic GAA expansion in intron 1 of the FXN gene (820 / 740 repeats; normal <33)',
      'Echocardiogram demonstrates concentric left ventricular hypertrophy without outflow-tract obstruction, consistent with hypertrophic cardiomyopathy',
      'Loss of joint-position and vibration sense in both lower extremities with preserved pain and temperature sensation (dorsal-column pattern)',
      'Absent deep-tendon reflexes at the patellae and ankles bilaterally with bilateral extensor plantar responses (Babinski) — the classic combination of areflexia with upper-motor-neuron signs'
    ],
    classic:[
      'Insidious onset of progressive gait ataxia beginning around age 10, with worsening clumsiness and frequent falls',
      'Scanning, dysarthric speech with broken phonation on prolonged vowels',
      'Pes cavus deformity of both feet with hammer toes',
      'Progressive kyphoscoliosis with a thoracic curve of 38° on standing radiographs',
      'No similarly affected family members across three generations — but the parents are first cousins'
    ],
    supportive:[
      'Diabetes mellitus diagnosed at age 14 requiring insulin therapy',
      'Reports occasional bladder urgency and a sensation of incomplete emptying',
      'Cognition is intact; the patient is performing at grade level academically'
    ],
    pe_pathognomonic:[
      'Wide-based ataxic gait — the patient cannot perform tandem heel-to-toe walking',
      'Absent ankle and knee jerk reflexes bilaterally with bilateral extensor plantar responses (positive Babinski sign) — the hallmark combination of areflexia plus upper-motor-neuron signs',
      'Loss of vibration sense at the medial malleoli and decreased joint-position sense in the toes bilaterally; pain and light touch are preserved'
    ],
    pe_classic:[
      'Bilateral pes cavus with hammer-toe deformity of the second through fifth toes',
      'Right-thoracic kyphoscoliosis evident on inspection of the back',
      'Scanning dysarthric speech with broken phonation when sustaining the vowel "ah"',
      'Apical impulse displaced laterally with a soft systolic murmur at the left lower sternal border'
    ],
    pe_supportive:[
      'Horizontal nystagmus on lateral gaze',
      'Mild distal weakness with dysmetria on finger-to-nose and heel-to-shin testing'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: () => ({ repeats:`biallelic GAA expansion ${randInt(680,950)} / ${randInt(640,820)} repeats in FXN intron 1` }),
    extraNormals:{ repeats:'fewer than 33 GAA repeats per FXN allele; >66 pathogenic' },
    differential:'sca',
    clue:'Adolescent with progressive gait ataxia + dysarthria + LOSS of position/vibration sense (dorsal columns) + AREFLEXIA (peripheral nerve) + extensor BABINSKI (corticospinal) + pes cavus + scoliosis + hypertrophic cardiomyopathy + DM → Friedreich ataxia. AUTOSOMAL RECESSIVE GAA expansion in FXN intron 1 (chromosome 9) → ↓ frataxin → mitochondrial iron mishandling. The only AR trinucleotide repeat in the standard list. HCM is the most common cause of death. Step 1 differential: SCA (AD CAG polyQ, adult onset, no cardiomyopathy).'
  },
  {
    id:'myotonic', name:'Myotonic Dystrophy Type 1 (Steinert Disease)', short:'Myotonic Dystrophy', category:'Myotonic Myopathy',
    sex:'any', ageMin:25, ageMax:45,
    defect:'CTG trinucleotide repeat expansion in the 3\' untranslated region of the DMPK gene on chromosome 19q13.3. The expanded CUG-containing mRNA forms nuclear foci that sequester the muscleblind-like (MBNL1) splicing factor, producing toxic mis-splicing of numerous transcripts ("RNA-mediated toxicity").',
    inheritance:'Autosomal dominant trinucleotide (CTG) repeat expansion in the DMPK gene on chromosome 19q; exhibits anticipation, with the most dramatic intergenerational expansions occurring during maternal transmission (giving rise to the severe congenital form)',
    mechanism:'Expanded CUG-repeat RNA accumulates in nuclear foci and sequesters MBNL1, causing aberrant alternative splicing of the muscle chloride channel CLCN1 (myotonia), the insulin receptor (insulin resistance), and cardiac troponin T (conduction defects). DMPK haploinsufficiency may also contribute.',
    diagnosticTest:'Triplet-repeat-primed PCR demonstrating CTG expansion in the DMPK gene (Southern blot for very large expansions)',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'Progressive cardiac conduction-system disease — typically beginning as first-degree atrioventricular block and progressing to higher-degree blocks and ventricular arrhythmias',
    cardiacOptions:[
      'Progressive cardiac conduction-system disease (first-degree AV block progressing to higher-degree blocks and ventricular arrhythmias)',
      'Concentric hypertrophic cardiomyopathy',
      'Bicuspid aortic valve with preductal coarctation of the aorta',
      'Complete atrioventricular septal defect',
      'Aortic dissection from cystic medial necrosis of the ascending aorta'
    ],
    keyComplication:'Bilateral posterior subcapsular cataracts with characteristic multicolored ("Christmas-tree") iridescent opacities on slit-lamp examination',
    complicationOptions:[
      'Bilateral posterior subcapsular cataracts with multicolored iridescent ("Christmas-tree") opacities on slit-lamp examination',
      'Concentric hypertrophic cardiomyopathy with left ventricular hypertrophy',
      'Macroorchidism with normal testosterone and intact spermatogenesis',
      'Marked caudate atrophy with ex vacuo ventricular dilation on neuroimaging',
      'Severe early-childhood obesity from insatiable hyperphagia'
    ],
    cc: () => rand([
      'young adult with progressive difficulty releasing objects from her grip',
      'young adult man with new-onset distal weakness, drooping eyelids, and a "doughy" facial expression',
      'young adult brought in for evaluation of syncope after an ECG demonstrated a first-degree AV block',
      'young adult with progressive distal weakness, daytime sleepiness, and bilateral cataracts noted on routine ophthalmologic examination'
    ]),
    pathognomonic:[
      'When asked to firmly grip the examiner\'s hand and then release, the patient cannot release for 3–4 seconds; the phenomenon eases with repeated attempts ("warm-up phenomenon")',
      'Percussion of the thenar eminence with a reflex hammer produces sustained contraction of the abductor pollicis brevis for 3–4 seconds (percussion myotonia)',
      'Targeted PCR demonstrates >150 CTG repeats in the DMPK gene (normal <35)',
      'Electromyography demonstrates myotonic discharges with the characteristic "dive-bomber" pattern on the audio output'
    ],
    classic:[
      'Progressive distal weakness of the hands and feet — atypical for a primary myopathy, which usually involves proximal muscles first',
      'Bilateral ptosis, facial weakness, and temporal and masseter wasting giving a long, narrow ("hatchet") face',
      'Frontal balding and bilateral cataracts noted in his late 20s',
      'His mother has reported similar but milder symptoms and was diagnosed with "weakness" in her 40s',
      'Excessive daytime sleepiness with episodes of falling asleep in social or work settings',
      'Recently developed glucose intolerance attributed to insulin resistance'
    ],
    supportive:[
      'No prior surgeries; the patient reports no anesthesia complications, though his mother had a prolonged recovery from general anesthesia for cholecystectomy',
      'Father is healthy; mother and maternal grandmother are reportedly affected',
      'No history of recent medication changes or other systemic symptoms'
    ],
    pe_pathognomonic:[
      'Grip myotonia — after firm hand grip the patient cannot release for 3–4 seconds; the phenomenon eases with repeated effort ("warm-up phenomenon")',
      'Percussion myotonia of the thenar eminence with sustained involuntary contraction of the abductor pollicis brevis',
      'Bilateral ptosis with marked atrophy of the temporalis and masseter muscles producing a long, narrow ("hatchet") face'
    ],
    pe_classic:[
      'Bilateral facial weakness — the patient cannot fully close her eyes against resistance and has a flat smile',
      'Frontal balding although the patient is only 32 years old',
      'Distal weakness of the hands and feet with preserved proximal strength',
      'Bilateral posterior subcapsular cataracts visible as iridescent opacities on slit-lamp examination'
    ],
    pe_supportive:[
      'Mild dysarthric speech with nasal quality',
      'Reflexes are symmetric and depressed throughout'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: () => ({ repeats:`${randInt(180,560)} CTG repeats in the DMPK gene` }),
    extraNormals:{ repeats:'fewer than 35 CTG repeats per DMPK allele; classic adult disease 100–1000; congenital >1000' },
    differential:'huntington',
    clue:'Adult with progressive DISTAL weakness (atypical for myopathy) + MYOTONIA (delayed grip release, percussion myotonia, "warm-up" phenomenon) + ptosis + "hatchet face" + frontal balding + posterior subcapsular cataracts + cardiac conduction defects + insulin resistance + maternal hx of similar symptoms → Myotonic dystrophy type 1 (Steinert disease). AUTOSOMAL DOMINANT CTG expansion in DMPK 3\'UTR (chromosome 19) → toxic CUG RNA → sequesters MBNL1 splicing factor → mis-splicing of CLCN1 (myotonia), insulin receptor (DM), troponin T (conduction defect). ANTICIPATION — severe congenital form usually from MATERNAL transmission. Most common adult muscular dystrophy.'
  },
  {
    id:'fragilex', name:'Fragile X Syndrome', short:'Fragile X', category:'X-linked Trinucleotide Disorder',
    sex:'M', ageMin:6, ageMax:14,
    pmhPool: RH_PMH, shxPool: RH_SHX,
    defect:'CGG trinucleotide repeat expansion in the 5\' untranslated region of the FMR1 gene on chromosome Xq27.3. Expansion of more than 200 CGG repeats triggers hypermethylation of the FMR1 promoter → transcriptional silencing → loss of fragile X mental retardation protein (FMRP), an RNA-binding protein essential for synaptic plasticity.',
    inheritance:'X-linked dominant trinucleotide (CGG) repeat expansion in the FMR1 gene on Xq27.3; premutation alleles (55–200 repeats) typically expand to full mutation (>200) during maternal transmission. Females are affected but typically more mildly than males because of X-inactivation.',
    mechanism:'Full-mutation expansion (>200 CGG repeats) → hypermethylation of the FMR1 5\' UTR and promoter → transcriptional silencing of FMR1 → loss of FMRP at the synapse → impaired synaptic plasticity with downstream cognitive, behavioral, and somatic manifestations.',
    diagnosticTest:'Targeted PCR for the FMR1 CGG repeat number, with Southern blot to determine methylation status when the expansion is large',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'Mitral valve prolapse with a mid-systolic click on auscultation (a manifestation of the connective-tissue laxity seen in fragile X)',
    cardiacOptions:[
      'Mitral valve prolapse with a mid-systolic click on auscultation',
      'Concentric hypertrophic cardiomyopathy on echocardiography',
      'Bicuspid aortic valve with preductal coarctation of the aorta',
      'Progressive first-degree atrioventricular block on serial ECGs',
      'Dilated cardiomyopathy with reduced ejection fraction'
    ],
    keyComplication:'Macroorchidism — testicular volume of 30–50 mL — typically developing after the onset of puberty, with normal pituitary-gonadal hormone levels',
    complicationOptions:[
      'Macroorchidism developing after the onset of puberty, with normal pituitary-gonadal hormone levels',
      'Severe hypertrophic cardiomyopathy from frataxin deficiency',
      'Aortic dissection in adulthood from cystic medial necrosis',
      'Bilateral posterior subcapsular cataracts on slit-lamp examination',
      'Early-onset Alzheimer disease before age 40 from APP gene overexpression'
    ],
    cc: () => rand([
      'school-age boy referred for evaluation of intellectual disability, hyperactivity, and autistic behaviors',
      'school-age boy with developmental delay, poor eye contact, and hand-flapping behaviors',
      'pre-adolescent boy with intellectual disability and a history of febrile seizures',
      'adolescent boy with mild intellectual disability and recently-noted testicular enlargement'
    ]),
    pathognomonic:[
      'PCR demonstrates >250 CGG repeats in the FMR1 gene (normal 5–44; premutation 55–200; full mutation >200)',
      'Southern blot demonstrates full methylation of the expanded FMR1 5\' UTR with absent FMRP expression on Western blot',
      'Family history: the patient\'s maternal grandfather, age 62, has developed a progressive intention tremor and cerebellar ataxia (FXTAS — fragile X-associated tremor/ataxia syndrome) and a maternal aunt experienced cessation of menses at age 36 (FXPOI — fragile X-associated primary ovarian insufficiency)'
    ],
    classic:[
      'Global developmental delay first recognized at 24 months of age, with no spoken words until age 3',
      'Currently in a special-education program with a measured full-scale IQ of 52',
      'Behavioral features including poor eye contact, hand-flapping, perseveration on a small set of preferred objects, and severe anxiety in unfamiliar settings — meets diagnostic criteria for autism spectrum disorder',
      'History of two febrile seizures between 18 and 36 months of age',
      'No congenital anomalies; growth parameters are at the 50th percentile for age'
    ],
    supportive:[
      'Mother reports the boy was a "floppy" infant with poor feeding for the first months of life',
      'No prior hospitalizations beyond a brief admission for one of the febrile seizures',
      'Three older female cousins on the maternal side have learning difficulties of varying severity'
    ],
    pe_pathognomonic:[
      'Long, narrow face with a prominent forehead and elongated mandible (prognathism)',
      'Large, prominent, posteriorly-rotated ears with simple helices',
      'Macroorchidism — testicular volume 35 mL bilaterally on orchidometer examination (well above the normal post-pubertal volume of 15–25 mL)'
    ],
    pe_classic:[
      'Joint hyperextensibility — passive thumb-to-forearm apposition is possible bilaterally',
      'High-arched palate with crowded dentition',
      'Pectus excavatum with marked sternal depression',
      'Mid-systolic click best heard at the apex, consistent with mitral valve prolapse'
    ],
    pe_supportive:[
      'Poor eye contact during the encounter, with frequent hand-flapping when the examiner approaches',
      'Pes planus bilaterally with hyperextensible distal interphalangeal joints'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: () => ({ repeats:`${randInt(280,650)} CGG repeats in FMR1 with full promoter methylation` }),
    extraNormals:{ repeats:'5–44 CGG repeats per FMR1 allele; 55–200 premutation; >200 full mutation' },
    differential:'',
    clue:'School-age BOY with moderate-to-severe intellectual disability + autism-like behaviors (poor eye contact, hand-flapping) + long face, large ears, prominent jaw + post-pubertal macroorchidism + connective-tissue laxity (mitral valve prolapse, joint hyperextensibility, high-arched palate) → Fragile X. X-LINKED DOMINANT CGG expansion in FMR1 (Xq27.3) → hypermethylation → silencing → loss of FMRP. Second most common genetic cause of ID overall (Down is #1); most common INHERITED cause of ID. Premutation carriers (55–200): FXTAS in older males, FXPOI in females.'
  },
  {
    id:'sca', name:'Spinocerebellar Ataxia (autosomal dominant)', short:'SCA', category:'Polyglutamine Disorder',
    sex:'any', ageMin:32, ageMax:55,
    defect:'CAG trinucleotide repeat expansions in one of several genes — most commonly ATXN1 (SCA1, 6p), ATXN2 (SCA2, 12q), ATXN3 (SCA3 / Machado-Joseph, 14q — the most common subtype worldwide), CACNA1A (SCA6, 19p), and ATXN7 (SCA7, 3p). Each encodes a toxic polyglutamine protein that aggregates and causes degeneration of cerebellar Purkinje cells, the inferior olives, and variable extracerebellar regions.',
    inheritance:'Autosomal dominant trinucleotide (CAG) repeat expansion in one of several ATXN genes (or CACNA1A for SCA6); exhibits anticipation, more pronounced with paternal transmission',
    mechanism:'Polyglutamine (polyQ) gain-of-function similar to Huntington disease — expanded CAG tracts produce misfolded proteins that aggregate intraneuronally. Cerebellar Purkinje cells and inferior olivary neurons are most vulnerable. Extracerebellar features vary by subtype: pyramidal in SCA1, slow saccades in SCA2, ophthalmoplegia/dystonia in SCA3, pure cerebellar in SCA6, retinal degeneration in SCA7.',
    diagnosticTest:'Targeted PCR sizing of the CAG repeat in a panel of SCA-associated genes (ATXN1, ATXN2, ATXN3, CACNA1A, ATXN7)',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'',
    cardiacOptions:[],
    keyComplication:'Marked atrophy of the cerebellum, brainstem, and inferior olives on neuroimaging — the "hot cross bun" sign of cruciform pontine atrophy may be seen in SCA2 and SCA3',
    complicationOptions:[
      'Marked atrophy of the cerebellum, brainstem, and inferior olives on neuroimaging',
      'Marked caudate atrophy with ex vacuo enlargement of the frontal horns of the lateral ventricles',
      'Concentric hypertrophic cardiomyopathy on echocardiography',
      'Bilateral posterior subcapsular iridescent cataracts on slit-lamp examination',
      'Macroorchidism developing after the onset of puberty'
    ],
    cc: () => rand([
      'middle-aged adult with progressive gait imbalance and slurred speech',
      'middle-aged man with new-onset clumsiness and dysmetria over two years',
      'middle-aged woman with worsening incoordination and a strong paternal family history of similar adult-onset disease',
      'middle-aged adult with progressive ataxia, slow saccades, and mild dysphagia'
    ]),
    pathognomonic:[
      'Targeted PCR demonstrates 64 CAG repeats in ATXN3, consistent with SCA3 (Machado-Joseph disease; normal <44)',
      'MRI of the brain demonstrates marked atrophy of the cerebellar hemispheres and vermis with associated pontine and middle-cerebellar-peduncle volume loss',
      'Family history: the patient\'s father was diagnosed with an adult-onset ataxia at age 58 and died with the condition; an older brother developed similar symptoms at age 45'
    ],
    classic:[
      'Insidious onset of gait ataxia beginning in his mid-40s, progressively worsening over the past three years',
      'Scanning, dysarthric speech that is most pronounced on multi-syllabic words and prolonged vowels',
      'Frequent falls over the past year, prompting use of a cane',
      'A father who developed adult-onset incoordination at age 58 and a paternal aunt with similar symptoms',
      'Mild dysphagia for thin liquids with intermittent coughing during meals'
    ],
    supportive:[
      'No diabetes, vitamin deficiency, alcohol misuse, or recent toxic exposures',
      'Cognition has remained largely intact, though the patient reports mild difficulty with multitasking',
      'No urinary or bowel symptoms suggestive of multiple-system atrophy'
    ],
    pe_pathognomonic:[
      'Wide-based ataxic gait with the patient unable to perform tandem walking even briefly',
      'Marked dysmetria on finger-to-nose and heel-to-knee-shin testing bilaterally with terminal overshoot',
      'Saccadic eye movements are slow on horizontal gaze with hypermetric overshoot and broken pursuit'
    ],
    pe_classic:[
      'Scanning, dysarthric speech with broken phonation on sustained "ahh"',
      'Mild peripheral-neuropathy pattern of reduced vibration sense in the toes with normal joint-position sense',
      'Deep-tendon reflexes are brisk at the knees with bilateral extensor plantar responses (pyramidal involvement, particularly in SCA1 and SCA3)',
      'Gaze-evoked horizontal nystagmus on lateral gaze'
    ],
    pe_supportive:[
      'Cognition is grossly preserved on bedside testing',
      'No retinal pigmentary changes on fundoscopic examination (which would suggest SCA7)'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: () => ({ repeats:`${randInt(58,74)} CAG repeats in ATXN3 (SCA3 / Machado-Joseph)` }),
    extraNormals:{ repeats:'fewer than 44 CAG repeats per ATXN3 allele; >60 pathogenic for SCA3' },
    differential:'friedreich',
    clue:'Middle-aged adult with progressive gait ataxia + scanning dysarthria + cerebellar dysmetria + ± pyramidal signs + AUTOSOMAL DOMINANT family history of adult-onset ataxia → Spinocerebellar ataxia (SCA). AD CAG polyglutamine expansion in one of several genes (ATXN1/2/3/6/7; CACNA1A for SCA6); SCA3 (Machado-Joseph) is the most common subtype worldwide. ANTICIPATION (paternal transmission > maternal). MRI: cerebellar + pontine atrophy ± "hot cross bun" sign (SCA2/3). Step 1 differential: Friedreich ataxia (AR GAA, child onset, HCM, areflexia + Babinski).'
  }
];

// =========================================================================
// FALLBACK DISTRACTOR POOLS
// =========================================================================
const FALLBACK_DIAGNOSIS_TRISOMY = [
  { label:'Williams syndrome (7q11.23 microdeletion)', sub:'Microdeletion' },
  { label:'Cri-du-chat syndrome (5p deletion)', sub:'Chromosomal deletion' },
  { label:'DiGeorge syndrome (22q11.2 microdeletion)', sub:'Microdeletion' },
  { label:'Fragile X syndrome (FMR1 CGG expansion)', sub:'Trinucleotide repeat' },
  { label:'Noonan syndrome (PTPN11 gain-of-function)', sub:'Autosomal dominant' },
  { label:'Beckwith-Wiedemann syndrome (11p15.5 imprinting)', sub:'Imprinting' },
  { label:'47,XYY syndrome', sub:'Sex chromosome' },
  { label:'47,XXX (triple X) syndrome', sub:'Sex chromosome' }
];
const FALLBACK_DEFECT_TRISOMY = [
  '7q11.23 microdeletion involving the elastin (ELN) gene',
  '5p terminal deletion',
  '22q11.2 microdeletion involving TBX1',
  'FMR1 trinucleotide (CGG) repeat expansion',
  'PTPN11 gain-of-function mutation',
  'NF1 inactivating mutation on chromosome 17q11.2',
  '11p15.5 imprinting defect involving IGF2 / H19',
  '47,XYY karyotype'
];
const FALLBACK_TEST_TRISOMY = [
  'Echocardiogram with color Doppler imaging',
  'Brain MRI with and without contrast',
  'Renal and bladder ultrasonography',
  'FMR1 trinucleotide repeat sizing by PCR',
  'Serum 17-hydroxyprogesterone level',
  'Whole-exome sequencing',
  'Fluorescence in-situ hybridization (FISH) for 22q11.2',
  'Quantitative immunoglobulin levels with lymphocyte subsets'
];
const FALLBACK_CARDIAC = [
  'Tetralogy of Fallot','Transposition of the great arteries','Coarctation of the aorta','Pulmonary stenosis','Ebstein anomaly','Hypoplastic left heart syndrome','Total anomalous pulmonary venous return','Truncus arteriosus','Bicuspid aortic valve in isolation','Supravalvular aortic stenosis'
];
const FALLBACK_COMPLICATION = [
  'Wilms tumor of the kidney','Pheochromocytoma','Hepatoblastoma','Medulloblastoma','Optic pathway glioma','Retinoblastoma','Severe asthma exacerbations','Recurrent pyogenic infections from neutrophil dysfunction','Premature ovarian failure with subsequent infertility','Disseminated tuberculosis in early childhood'
];

const FALLBACK_DIAGNOSIS_TRINUCLEOTIDE = [
  { label:'Wilson disease (ATP7B mutation)', sub:'Autosomal recessive' },
  { label:'Multiple system atrophy — cerebellar type (MSA-C)', sub:'Sporadic neurodegeneration' },
  { label:'Vitamin B12 deficiency with subacute combined degeneration', sub:'Acquired' },
  { label:'Ataxia-telangiectasia (ATM mutation)', sub:'Autosomal recessive' },
  { label:'Spinal muscular atrophy (SMN1 deletion)', sub:'Autosomal recessive' },
  { label:'Duchenne muscular dystrophy (DMD frame-shift deletion)', sub:'X-linked recessive' },
  { label:'Becker muscular dystrophy (DMD in-frame deletion)', sub:'X-linked recessive' },
  { label:'Sydenham chorea (post-streptococcal autoimmune)', sub:'Acquired' }
];
const FALLBACK_DEFECT_TRINUCLEOTIDE = [
  'ATP7B loss-of-function mutation causing impaired biliary copper excretion',
  'ATM loss-of-function mutation impairing DNA double-strand-break repair',
  'SMN1 homozygous deletion causing motor-neuron loss',
  'DMD frame-shift deletion → absent dystrophin',
  'DMD in-frame deletion → truncated but partly functional dystrophin',
  'PMP22 duplication on chromosome 17p (Charcot-Marie-Tooth type 1A)',
  'Loss of frataxin from a point mutation in FXN (atypical Friedreich)',
  'Mitochondrial DNA point mutation in MT-TL1 (MELAS)'
];
const FALLBACK_TEST_TRINUCLEOTIDE = [
  '24-hour urinary copper and serum ceruloplasmin levels',
  'Serum vitamin B12 and methylmalonic acid levels',
  'Brain MRI with diffusion-weighted imaging and contrast',
  'Electromyography with nerve-conduction studies',
  'Muscle biopsy with dystrophin immunohistochemistry',
  'Serum creatine kinase level',
  'Anti-Yo, anti-Hu, and other paraneoplastic antibody panel',
  'Whole-exome sequencing'
];

// =========================================================================
// MODE REGISTRY
// =========================================================================
const MODES = [
  {
    id:'immuno',
    name:'Immunodeficiency',
    blurb:'Primary immunodeficiencies — B-cell, T-cell, combined, phagocyte, complement.',
    syndromes: SYNDROMES_IMMUNO,
    pmhPool: RH_PMH,
    shxPool: RH_SHX,
    headerLabel:'Immunodeficiency',
    fallbacks:{}
  },
  {
    id:'trisomy',
    name:'Chromosomal Disorders',
    blurb:'Chromosomal and imprinting syndromes: trisomies 21/18/13, Klinefelter, Turner, Angelman, Prader-Willi.',
    syndromes: SYNDROMES_TRISOMY,
    pmhPool: NEONATAL_PMH,
    shxPool: NEONATAL_SHX,
    headerLabel:'Chromosomal Disorders',
    fallbacks:{
      diagnosis: FALLBACK_DIAGNOSIS_TRISOMY,
      defect: FALLBACK_DEFECT_TRISOMY,
      test: FALLBACK_TEST_TRISOMY,
      cardiac: FALLBACK_CARDIAC,
      complication: FALLBACK_COMPLICATION
    }
  },
  {
    id:'trinucleotide',
    name:'Trinucleotide Repeat Disorders',
    blurb:'Triplet-repeat expansion diseases: Huntington, Friedreich ataxia, myotonic dystrophy, fragile X, spinocerebellar ataxia.',
    syndromes: SYNDROMES_TRINUCLEOTIDE,
    pmhPool: ADULT_PMH,
    shxPool: ADULT_SHX,
    headerLabel:'Trinucleotide Repeat Disorders',
    fallbacks:{
      diagnosis: FALLBACK_DIAGNOSIS_TRINUCLEOTIDE,
      defect: FALLBACK_DEFECT_TRINUCLEOTIDE,
      test: FALLBACK_TEST_TRINUCLEOTIDE,
      cardiac: FALLBACK_CARDIAC,
      complication: FALLBACK_COMPLICATION
    }
  }
];

// =========================================================================
// CASE GENERATION
// =========================================================================
function generateCase(syndrome, mode) {
  const sex = syndrome.sex === 'any' ? rand(['M','F']) : syndrome.sex;
  const firstNames = sex === 'M' ? FIRST_M : FIRST_F;
  const ageYears = randFloat(syndrome.ageMin, syndrome.ageMax, 1);
  const isInfant = ageYears < 2;
  const isNewborn = ageYears < 0.08; // ~ <1 month
  const ageStr = isNewborn
    ? `${Math.max(1, Math.round(ageYears*365))}-day-old`
    : isInfant
      ? `${Math.max(1, Math.round(ageYears*12))}-month-old`
      : `${Math.round(ageYears)}-year-old`;
  const sexWord = sex === 'M' ? (isInfant ? 'boy' : 'male') : (isInfant ? 'girl' : 'female');
  const isAdult = ageYears >= 18;
  const guardianAdult = sex === 'M'
    ? ['his wife','his partner','his adult daughter','his adult son','his brother']
    : ['her husband','her partner','her adult daughter','her adult son','her sister'];
  const guardianChild = sex === 'M'
    ? ['his mother','his father','both parents','his maternal aunt']
    : ['her mother','her father','both parents','her maternal aunt'];
  const patient = {
    name: `${rand(firstNames)} ${rand(LAST)}`,
    age: ageYears, ageStr, sex, sexWord,
    pronoun: sex==='M' ? 'he' : 'she',
    guardian: isAdult ? rand(guardianAdult) : rand(guardianChild)
  };

  const depth = weighted(['sparse','medium','full'], [0.25, 0.50, 0.25]);

  let hpi = [];
  if (depth === 'sparse') {
    if (syndrome.pathognomonic.length && Math.random() < 0.65) {
      hpi = [...pick(syndrome.pathognomonic, 1)];
      if (syndrome.classic.length && Math.random() < 0.5) hpi.push(...pick(syndrome.classic, 1));
    } else {
      hpi = [...pick(syndrome.classic, Math.min(2, syndrome.classic.length))];
    }
  } else if (depth === 'medium') {
    const npath = syndrome.pathognomonic.length ? randInt(1, Math.min(2, syndrome.pathognomonic.length)) : 0;
    hpi = [...pick(syndrome.pathognomonic, npath), ...pick(syndrome.classic, randInt(1, Math.min(3, syndrome.classic.length)))];
    if (syndrome.supportive.length) hpi.push(...pick(syndrome.supportive, randInt(0,1)));
  } else {
    hpi = [...pick(syndrome.pathognomonic, Math.min(2, syndrome.pathognomonic.length)), ...pick(syndrome.classic, Math.min(3, syndrome.classic.length)), ...pick(syndrome.supportive, Math.min(2, syndrome.supportive.length))];
  }
  hpi = shuffle(hpi);

  let pe = [];
  if (depth === 'sparse') {
    pe = syndrome.pe_pathognomonic.length ? pick(syndrome.pe_pathognomonic, 1) : pick(syndrome.pe_classic, 1);
  } else if (depth === 'medium') {
    pe = [...pick(syndrome.pe_pathognomonic, syndrome.pe_pathognomonic.length ? 1 : 0), ...pick(syndrome.pe_classic, randInt(1, Math.min(2, syndrome.pe_classic.length)))];
  } else {
    pe = [...pick(syndrome.pe_pathognomonic, syndrome.pe_pathognomonic.length), ...pick(syndrome.pe_classic, Math.min(2, syndrome.pe_classic.length)), ...pick(syndrome.pe_supportive, Math.min(1, syndrome.pe_supportive.length))];
  }
  pe = shuffle(pe);

  const pmhPool = syndrome.pmhPool || mode.pmhPool;
  const shxPool = syndrome.shxPool || mode.shxPool;
  const rhPmh = pick(pmhPool, depth === 'sparse' ? randInt(0,1) : randInt(1,2));
  const rhShx = pick(shxPool, depth === 'sparse' ? 1 : randInt(1,2));

  const sick = depth !== 'sparse' || Math.random() < 0.5;
  const vitals = {
    temp: sick ? randFloat(38.0, 39.6, 1) : randFloat(36.6, 37.6, 1),
    hr: isInfant ? randInt(110, 165) : randInt(70, 130),
    rr: isInfant ? randInt(28, 50) : randInt(14, 26),
    bp: isInfant ? `${randInt(75,95)}/${randInt(45,60)}` : `${randInt(95,125)}/${randInt(60,80)}`,
    spo2: randInt(94, 100)
  };

  const allLabKeys = Object.keys(syndrome.labs);
  const keyLabs = syndrome.keyLabs || [];
  const labDepthRoll = Math.random();
  let labKeysToShow = [];
  let extraLabsToShow = null;
  let labMode;

  if (allLabKeys.length === 0) {
    // Trisomy-style: no standard immunology panel, just possibly extra labs (e.g., karyotype)
    labMode = 'none';
    if (syndrome.extraLabs && (depth !== 'sparse' || Math.random() < 0.6)) {
      extraLabsToShow = syndrome.extraLabs(patient);
    }
  } else if (depth === 'sparse') {
    if (labDepthRoll < 0.4) {
      labMode = 'none';
    } else if (labDepthRoll < 0.75) {
      const hideKey = Math.random() < 0.4;
      const candidates = hideKey ? allLabKeys.filter(k=>!keyLabs.includes(k)) : allLabKeys;
      labKeysToShow = pick(candidates.length?candidates:allLabKeys, randInt(1,2));
      labMode = 'few';
      if (syndrome.extraLabs && Math.random() < 0.5) extraLabsToShow = syndrome.extraLabs(patient);
    } else {
      labKeysToShow = keyLabs.length ? pick(keyLabs, 1) : pick(allLabKeys, 1);
      labMode = 'few';
      if (syndrome.extraLabs && Math.random() < 0.4) extraLabsToShow = syndrome.extraLabs(patient);
    }
  } else if (depth === 'medium') {
    const n = randInt(3, Math.min(5, allLabKeys.length || 3));
    const mustHave = keyLabs.length ? pick(keyLabs, 1) : [];
    const others = pick(allLabKeys.filter(k=>!mustHave.includes(k)), Math.max(0, n - mustHave.length));
    labKeysToShow = [...mustHave, ...others];
    labMode = 'partial';
    if (syndrome.extraLabs && Math.random() < 0.7) extraLabsToShow = syndrome.extraLabs(patient);
  } else {
    labKeysToShow = allLabKeys;
    labMode = 'full';
    if (syndrome.extraLabs) extraLabsToShow = syndrome.extraLabs(patient);
  }

  const labs = {};
  for (const k of labKeysToShow) labs[k] = genVal(k, syndrome.labs[k]);

  return {
    id: caseId(), patient, syndromeId: syndrome.id,
    cc: syndrome.cc(), hpi, pe, pmh: rhPmh, shx: rhShx,
    vitals, labs, extraLabs: extraLabsToShow,
    extraNormals: syndrome.extraNormals || {},
    depth, labMode, clue: syndrome.clue
  };
}

// =========================================================================
// QUESTION BUILDERS — all scoped to current mode's pool
// =========================================================================
function buildDiagnosisQ(syndrome, pool, fallbacks) {
  const sameCat = pool.filter(s => s.id !== syndrome.id && s.category === syndrome.category);
  const otherCat = pool.filter(s => s.id !== syndrome.id && s.category !== syndrome.category);
  const distractors = pick(sameCat, Math.min(4, sameCat.length))
    .map(s => ({ label: s.name, sub: `${s.category} disorder`, correct: false }));
  // top up from same mode (other categories)
  while (distractors.length < 4) {
    const nxt = pick(otherCat.filter(s => !distractors.some(d => d.label === s.name)), 1)[0];
    if (!nxt) break;
    distractors.push({ label: nxt.name, sub: `${nxt.category} disorder`, correct: false });
  }
  // top up from fallback pool if still short
  const fb = fallbacks?.diagnosis || [];
  while (distractors.length < 4 && fb.length) {
    const nxt = pick(fb.filter(f => !distractors.some(d => d.label === f.label)), 1)[0];
    if (!nxt) break;
    distractors.push({ ...nxt, correct: false });
  }
  const opts = shuffle([
    { label: syndrome.name, sub: `${syndrome.category} disorder`, correct: true },
    ...distractors
  ]);
  return { type:'diagnosis', prompt:'Which of the following is the most likely diagnosis?', options: opts };
}

function buildDefectQ(syndrome, pool, fallbacks) {
  const others = pick(pool.filter(s => s.id !== syndrome.id && s.defect !== syndrome.defect), 4)
    .map(s => ({ label: s.defect, correct: false }));
  const fb = fallbacks?.defect || [];
  while (others.length < 4 && fb.length) {
    const nxt = pick(fb.filter(f => !others.some(o => o.label === f) && f !== syndrome.defect), 1)[0];
    if (!nxt) break;
    others.push({ label: nxt, correct: false });
  }
  const opts = shuffle([{ label: syndrome.defect, correct: true }, ...others]);
  return { type:'defect', prompt:'Which of the following best describes the underlying genetic or molecular defect in this patient?', options: opts };
}

function buildInheritanceQ(syndrome) {
  const labels = [
    'X-linked recessive',
    'X-linked dominant',
    'Autosomal recessive',
    'Autosomal dominant',
    'Microdeletion (de novo)',
    'Meiotic nondisjunction (sporadic, maternal-age related)',
    'Robertsonian translocation',
    'Genomic imprinting — deletion of the maternally-derived 15q11-q13 region',
    'Genomic imprinting — deletion of the paternally-derived 15q11-q13 region',
    'Sex chromosome monosomy (loss of an X chromosome)',
    'Sporadic / unknown'
  ];
  const t = syndrome.inheritance.toLowerCase();
  const correctLabel =
    (t.includes('deletion of the maternal') || t.includes('maternal 15q')) ? 'Genomic imprinting — deletion of the maternally-derived 15q11-q13 region' :
    (t.includes('deletion of the paternal') || t.includes('paternal 15q')) ? 'Genomic imprinting — deletion of the paternally-derived 15q11-q13 region' :
    (t.includes('monosomy') || t.includes('45,x')) ? 'Sex chromosome monosomy (loss of an X chromosome)' :
    t.includes('x-linked dominant') ? 'X-linked dominant' :
    t.includes('x-linked') ? 'X-linked recessive' :
    t.includes('autosomal recessive') ? 'Autosomal recessive' :
    t.includes('autosomal dominant') ? 'Autosomal dominant' :
    t.includes('meiotic nondisjunction') ? 'Meiotic nondisjunction (sporadic, maternal-age related)' :
    t.includes('robertsonian') ? 'Robertsonian translocation' :
    t.includes('microdeletion') ? 'Microdeletion (de novo)' :
    'Sporadic / unknown';
  const distractorPool = labels.filter(l => l !== correctLabel);
  const distractors = pick(distractorPool, 4);
  const opts = shuffle([
    { label: correctLabel, correct: true },
    ...distractors.map(l => ({ label: l, correct: false }))
  ]);
  return { type:'inheritance', prompt:'What is the most likely mechanism or pattern of inheritance for this disorder?', options: opts };
}

function buildOrganismQ(syndrome, pool) {
  const correct = syndrome.keyOrganism;
  const allOtherOrganisms = [...new Set(pool.filter(s => s.id !== syndrome.id).flatMap(s => s.organismOptions || []))]
    .filter(o => !syndrome.organismOptions.includes(o));
  const distractors = pick(allOtherOrganisms, 4);
  const fallbackPool = ['Mycobacterium tuberculosis','Listeria monocytogenes','Toxoplasma gondii','Escherichia coli','Klebsiella pneumoniae'];
  while (distractors.length < 4) {
    const f = pick(fallbackPool.filter(x => !distractors.includes(x) && x !== correct), 1)[0];
    if (f) distractors.push(f); else break;
  }
  const opts = shuffle([
    { label: correct, correct: true },
    ...distractors.map(d => ({ label: d, correct: false }))
  ]);
  return { type:'organism', prompt:'This patient is at greatest risk of infection by which of the following organisms?', options: opts };
}

function buildTestQ(syndrome, pool, fallbacks) {
  const others = pick(pool.filter(s => s.id !== syndrome.id && s.diagnosticTest !== syndrome.diagnosticTest), 4)
    .map(s => ({ label: s.diagnosticTest, correct: false }));
  const fb = fallbacks?.test || [];
  while (others.length < 4 && fb.length) {
    const nxt = pick(fb.filter(f => !others.some(o => o.label === f) && f !== syndrome.diagnosticTest), 1)[0];
    if (!nxt) break;
    others.push({ label: nxt, correct: false });
  }
  const opts = shuffle([{ label: syndrome.diagnosticTest, correct: true }, ...others]);
  return { type:'test', prompt:'Which of the following is the most appropriate confirmatory test?', options: opts };
}

function buildCardiacQ(syndrome, pool, fallbacks) {
  if (!syndrome.keyCardiac) return null;
  const correct = syndrome.keyCardiac;
  const myOptions = syndrome.cardiacOptions || [];
  const otherSyndromeOpts = [...new Set(pool.filter(s => s.id !== syndrome.id).flatMap(s => s.cardiacOptions || []))]
    .filter(o => !myOptions.includes(o));
  const distractors = pick(otherSyndromeOpts, 4);
  const fb = fallbacks?.cardiac || [];
  while (distractors.length < 4 && fb.length) {
    const nxt = pick(fb.filter(f => !distractors.includes(f) && !myOptions.includes(f) && f !== correct), 1)[0];
    if (!nxt) break;
    distractors.push(nxt);
  }
  const opts = shuffle([
    { label: correct, correct: true },
    ...distractors.map(d => ({ label: d, correct: false }))
  ]);
  return { type:'cardiac', prompt:'Which of the following cardiac defects is most strongly associated with this condition?', options: opts };
}

function buildComplicationQ(syndrome, pool, fallbacks) {
  if (!syndrome.keyComplication) return null;
  const correct = syndrome.keyComplication;
  const myOptions = syndrome.complicationOptions || [];
  const otherSyndromeOpts = [...new Set(pool.filter(s => s.id !== syndrome.id).flatMap(s => s.complicationOptions || []))]
    .filter(o => !myOptions.includes(o));
  const distractors = pick(otherSyndromeOpts, 4);
  const fb = fallbacks?.complication || [];
  while (distractors.length < 4 && fb.length) {
    const nxt = pick(fb.filter(f => !distractors.includes(f) && !myOptions.includes(f) && f !== correct), 1)[0];
    if (!nxt) break;
    distractors.push(nxt);
  }
  const opts = shuffle([
    { label: correct, correct: true },
    ...distractors.map(d => ({ label: d, correct: false }))
  ]);
  return { type:'complication', prompt:'Which of the following is a known complication or association of this condition?', options: opts };
}

function buildSpecificQ(syndrome, pool) {
  if (!syndrome.pe_pathognomonic?.length) return null;
  const otherPath = pool
    .filter(s => s.id !== syndrome.id)
    .flatMap(s => s.pe_pathognomonic || []);
  if (otherPath.length < 3) return null;
  const correct = rand(syndrome.pe_pathognomonic);
  const distractors = pick(otherPath, 4);
  if (distractors.length < 3) return null;
  const opts = shuffle([
    { label: correct, correct: true },
    ...distractors.map(d => ({ label: d, correct: false }))
  ]);
  return { type:'specific', prompt:'Which of the following physical examination findings would be MOST specific for this diagnosis?', options: opts };
}

function buildDifferentialQ(syndrome, pool) {
  if (!syndrome.differential) return null;
  const partner = pool.find(s => s.id === syndrome.differential);
  if (!partner) return null;
  const otherCandidates = pool.filter(s => s.id !== syndrome.id && s.id !== partner.id);
  const distractors = pick(otherCandidates, 4)
    .map(s => ({ label: s.name, sub: `${s.category} disorder`, correct: false }));
  if (distractors.length < 2) return null;
  const opts = shuffle([
    { label: partner.name, sub: `${partner.category} disorder`, correct: true },
    ...distractors
  ]);
  return { type:'differential', prompt:'A patient with overlapping clinical features but a distinct diagnosis is most likely to have which of the following conditions?', options: opts };
}

// =========================================================================
// QUESTION TYPE SELECTION (mode-aware, syndrome-aware)
// =========================================================================
function getValidQuestionTypes(syndrome, pool) {
  const types = [];
  types.push({ id:'diagnosis', weight: 28 });
  types.push({ id:'defect',    weight: 14 });
  types.push({ id:'inheritance', weight: 10 });
  types.push({ id:'test',      weight: 10 });
  if (syndrome.organismOptions?.length > 0) types.push({ id:'organism', weight: 14 });
  if (syndrome.keyCardiac) types.push({ id:'cardiac', weight: 14 });
  if (syndrome.keyComplication) types.push({ id:'complication', weight: 10 });
  if (syndrome.pe_pathognomonic?.length > 0 && pool.some(s => s.id !== syndrome.id && s.pe_pathognomonic?.length > 0)) {
    types.push({ id:'specific', weight: 10 });
  }
  if (syndrome.differential && pool.some(s => s.id === syndrome.differential) && pool.length >= 3) {
    types.push({ id:'differential', weight: 8 });
  }
  return types;
}

function pickQuestionType(syndrome, pool) {
  const valid = getValidQuestionTypes(syndrome, pool);
  const total = valid.reduce((a,t)=>a+t.weight, 0);
  let r = Math.random()*total;
  for (const t of valid) { r -= t.weight; if (r <= 0) return t.id; }
  return 'diagnosis';
}

function buildQuestion(syndrome, pool, fallbacks) {
  const type = pickQuestionType(syndrome, pool);
  let q = null;
  if (type==='defect') q = buildDefectQ(syndrome, pool, fallbacks);
  else if (type==='inheritance') q = buildInheritanceQ(syndrome);
  else if (type==='organism') q = buildOrganismQ(syndrome, pool);
  else if (type==='test') q = buildTestQ(syndrome, pool, fallbacks);
  else if (type==='cardiac') q = buildCardiacQ(syndrome, pool, fallbacks);
  else if (type==='complication') q = buildComplicationQ(syndrome, pool, fallbacks);
  else if (type==='specific') q = buildSpecificQ(syndrome, pool);
  else if (type==='differential') q = buildDifferentialQ(syndrome, pool);
  if (!q) q = buildDiagnosisQ(syndrome, pool, fallbacks);
  return q;
}

function generateRound(mode) {
  const syndrome = rand(mode.syndromes);
  const caseData = generateCase(syndrome, mode);
  const question = buildQuestion(syndrome, mode.syndromes, mode.fallbacks);
  return { caseData, syndrome, question };
}

// =========================================================================
// LAB FORMATTING
// =========================================================================
const LAB_LABELS = { igG:'IgG', igA:'IgA', igM:'IgM', igE:'IgE', bCells:'CD19+ B cells', tCells:'CD3+ T cells', wbc:'WBC', plt:'Platelets', hgb:'Hemoglobin', mpv:'Mean Platelet Volume' };

function fmtLab(k, v) {
  let display, ref, status;
  switch(k) {
    case 'igG': display=`${v} mg/dL`; ref=NORMAL_RANGES.igG; status=v<700?'low':v>1600?'high':'normal'; break;
    case 'igA': display=`${v} mg/dL`; ref=NORMAL_RANGES.igA; status=v<70?'low':v>400?'high':'normal'; break;
    case 'igM': display=`${v} mg/dL`; ref=NORMAL_RANGES.igM; status=v<40?'low':v>230?'high':'normal'; break;
    case 'igE': display=`${v} IU/mL`; ref=NORMAL_RANGES.igE; status=v>100?'high':'normal'; break;
    case 'bCells': display=`${v} /μL`; ref=NORMAL_RANGES.bCells; status=v<100?'low':v>500?'high':'normal'; break;
    case 'tCells': display=`${v} /μL`; ref=NORMAL_RANGES.tCells; status=v<700?'low':v>2100?'high':'normal'; break;
    case 'wbc': display=`${v} ×10³/μL`; ref=NORMAL_RANGES.wbc; status=v<4.5?'low':v>11?'high':'normal'; break;
    case 'plt': display=`${v} ×10³/μL`; ref=NORMAL_RANGES.plt; status=v<150?'low':v>400?'high':'normal'; break;
    case 'hgb': display=`${v} g/dL`; ref=NORMAL_RANGES.hgb; status=v<12?'low':v>16?'high':'normal'; break;
    case 'mpv': display=`${v} fL`; ref=NORMAL_RANGES.mpv; status=v<7.5?'low':v>11.5?'high':'normal'; break;
    default: display=String(v); ref=''; status='normal';
  }
  return { display, ref, status };
}

const SPECIAL_LABEL = { ca:'Serum calcium', afp:'α-Fetoprotein', dhr:'DHR (NADPH oxidase)', ch50:'CH50 (total complement)', cd18:'CD18 (flow cytometry)', karyo:'Karyotype / chromosomal microarray', methylation:'DNA methylation analysis (15q11-q13)', testosterone:'Total testosterone', lh:'Luteinizing hormone (LH)', fsh:'Follicle-stimulating hormone (FSH)', estradiol:'Estradiol', tsh:'TSH', ghrelin:'Fasting serum ghrelin', repeats:'Trinucleotide repeat sizing (PCR)' };
const SPECIAL_UNIT = { ca:' mg/dL', afp:' ng/mL', testosterone:' ng/dL', lh:' mIU/mL', fsh:' mIU/mL', estradiol:' pg/mL', tsh:' μIU/mL', ghrelin:' pg/mL' };

function capitalize(s) { return s.charAt(0).toUpperCase()+s.slice(1); }

// =========================================================================
// MODE PICKER
// =========================================================================
function ModePicker({ onPick }) {
  return (
    <div className="paper">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <header className="pb-3 mb-2" style={{borderBottom:'2px solid #1f1812'}}>
          <div className="text-xs mono uppercase tracking-widest" style={{color:'#8b2635'}}>Wayne State University School of Medicine · Trainer</div>
          <h1 className="display text-5xl mt-1" style={{color:'#1f1812'}}>Differential <span style={{color:'#8b2635'}}>·</span> Choose a Topic</h1>
          <div className="text-sm italic mt-1" style={{color:'#5a4a3a'}}>Each topic generates randomized USMLE Step 1 style cases</div>
        </header>
        <div className="accent-rule mb-8"></div>

        <div className="grid md:grid-cols-2 gap-5">
          {MODES.map(m => (
            <button key={m.id} onClick={()=>onPick(m.id)} className="panel rounded p-6 text-left transition opt"
              style={{border:'2px solid rgba(31,24,18,0.25)', cursor:'pointer', background:'rgba(253,248,238,0.85)'}}>
              <div className="mono text-xs uppercase tracking-widest mb-2" style={{color:'#8b2635'}}>{m.syndromes.length} conditions</div>
              <div className="display text-3xl mb-2" style={{color:'#1f1812'}}>{m.name}</div>
              <div className="text-sm leading-relaxed" style={{color:'#5a4a3a'}}>{m.blurb}</div>
              <div className="mt-4 mono text-xs uppercase tracking-widest" style={{color:'#1f1812'}}>Start →</div>
            </button>
          ))}
        </div>

        <footer className="mt-16 pt-4 mono text-xs flex justify-between" style={{color:'#7a6a55', borderTop:'1px solid rgba(31,24,18,0.3)'}}>
          <span>Confidential · Teaching File · For educational use only</span>
          <span>v3</span>
        </footer>
      </div>
    </div>
  );
}

// =========================================================================
// APP
// =========================================================================
export default function App() {
  const [modeId, setModeId] = useState(null);
  const [round, setRound] = useState(null);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ right:0, wrong:0 });
  const [showRef, setShowRef] = useState(false);

  const mode = MODES.find(m => m.id === modeId);

  const startMode = (id) => {
    const m = MODES.find(x => x.id === id);
    setModeId(id);
    setRound(generateRound(m));
    setSelected(null);
    setRevealed(false);
    setScore({ right:0, wrong:0 });
    setShowRef(false);
  };

  const goHome = () => {
    setModeId(null);
    setRound(null);
    setSelected(null);
    setRevealed(false);
  };

  // ===== Global styles (used by both screens) =====
  const styles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,800&family=Lora:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
      body { margin:0; }
      .paper { background-color:#f3ece0; background-image: radial-gradient(circle at 25% 35%, rgba(139,38,53,0.04) 0, transparent 60%), radial-gradient(circle at 80% 70%, rgba(45,74,62,0.04) 0, transparent 55%), repeating-linear-gradient(0deg, rgba(0,0,0,0.014) 0 1px, transparent 1px 4px); font-family:'Lora',Georgia,serif; color:#1f1812; min-height:100vh; }
      .display { font-family:'Fraunces','Playfair Display',Georgia,serif; font-weight:800; letter-spacing:-0.02em; }
      .mono { font-family:'JetBrains Mono',ui-monospace,monospace; }
      .stamp { font-family:'Fraunces',serif; font-weight:800; letter-spacing:0.18em; text-transform:uppercase; border:2px solid currentColor; padding:4px 10px; display:inline-block; transform:rotate(-2deg); }
      .panel { background:rgba(253,248,238,0.85); border:1px solid rgba(31,24,18,0.18); }
      .accent-rule { background:linear-gradient(90deg,#8b2635 0 22%, transparent 22%); height:6px; }
      .opt:hover:not(:disabled) { background:rgba(139,38,53,0.06); }
      .opt-correct { background:rgba(45,120,80,0.18) !important; border-color:#2d784e !important; }
      .opt-wrong { background:rgba(160,30,40,0.14) !important; border-color:#a01b28 !important; }
      .pulse-dot { animation:pulse 1.6s ease-in-out infinite; }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
      .case-fade { animation:fadeIn 0.45s ease; }
      @keyframes fadeIn { from {opacity:0; transform:translateY(6px)} to {opacity:1; transform:none} }
      .depth-tag { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; padding:2px 7px; border:1px solid currentColor; border-radius:2px; }
    `}</style>
  );

  // Mode picker view
  if (!modeId || !round) {
    return (
      <>
        {styles}
        <ModePicker onPick={startMode} />
      </>
    );
  }

  const { caseData, syndrome, question } = round;
  const { patient, vitals, labs, extraLabs } = caseData;

  const answer = (opt) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    setScore(prev => opt.correct ? { ...prev, right: prev.right+1 } : { ...prev, wrong: prev.wrong+1 });
  };
  const next = () => { setRound(generateRound(mode)); setSelected(null); setRevealed(false); };

  const correct = revealed && selected?.correct;
  const total = score.right + score.wrong;
  const hasLabs = Object.keys(labs).length > 0 || (extraLabs && Object.keys(extraLabs).length > 0);
  const correctOption = question.options.find(o => o.correct);
  const questionTypeLabel = {
    diagnosis:'Diagnosis',
    defect:'Molecular / genetic defect',
    inheritance:'Inheritance pattern',
    organism:'Organism susceptibility',
    test:'Confirmatory test',
    cardiac:'Cardiac association',
    complication:'Complication / association',
    specific:'Most specific finding',
    differential:'Differential diagnosis'
  }[question.type];

  return (
    <>
      {styles}

      <div className="paper">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <header className="flex items-end justify-between pb-3 mb-2" style={{borderBottom:'2px solid #1f1812'}}>
            <div>
              <div className="text-xs mono uppercase tracking-widest" style={{color:'#8b2635'}}>Wayne State University School of Medicine · Trainer</div>
              <h1 className="display text-5xl mt-1" style={{color:'#1f1812'}}>Differential <span style={{color:'#8b2635'}}>·</span> {mode.headerLabel}</h1>
              <div className="text-sm italic mt-1" style={{color:'#5a4a3a'}}>A procedurally generated patient encounter quiz</div>
            </div>
            <div className="text-right">
              <div className="mono text-xs uppercase tracking-widest" style={{color:'#5a4a3a'}}>Score</div>
              <div className="display text-3xl"><span style={{color:'#2d784e'}}>{score.right}</span><span style={{color:'#5a4a3a'}}> / </span><span>{total}</span></div>
              <div className="flex gap-3 justify-end mt-1">
                <button onClick={()=>setShowRef(!showRef)} className="mono text-xs underline" style={{color:'#8b2635', background:'none', border:'none', cursor:'pointer'}}>
                  {showRef ? 'hide' : 'show'} list
                </button>
                <button onClick={goHome} className="mono text-xs underline" style={{color:'#8b2635', background:'none', border:'none', cursor:'pointer'}}>
                  change topic
                </button>
              </div>
            </div>
          </header>
          <div className="accent-rule mb-6"></div>

          {showRef && (
            <div className="panel rounded p-4 mb-6 text-sm">
              <div className="mono uppercase tracking-widest text-xs mb-2" style={{color:'#8b2635'}}>Reference · all conditions in this topic</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5">
                {mode.syndromes.map(s =>
                  <div key={s.id} className="text-sm">
                    <span className="display" style={{color:'#1f1812', fontWeight:600}}>{s.short}</span>
                    <span className="mono text-xs ml-2" style={{color:'#7a6a55'}}>· {s.category} · {s.inheritance}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="case-fade" key={caseData.id}>
            <div className="panel rounded p-5 mb-5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <div>
                <div className="mono text-xs uppercase tracking-widest" style={{color:'#5a4a3a'}}>Patient</div>
                <div className="display text-3xl">{patient.name}</div>
              </div>
              <div className="ml-auto flex flex-wrap gap-x-6 gap-y-1 text-sm items-center">
                <div><span className="mono uppercase text-xs tracking-widest" style={{color:'#5a4a3a'}}>Age </span> {patient.ageStr}</div>
                <div><span className="mono uppercase text-xs tracking-widest" style={{color:'#5a4a3a'}}>Sex </span> {patient.sex}</div>
                <div><span className="mono uppercase text-xs tracking-widest" style={{color:'#5a4a3a'}}>MRN </span> <span className="mono">{caseData.id}</span></div>
                <div className="depth-tag" style={{color:'#8b2635'}}>{caseData.depth} vignette</div>
              </div>
            </div>

            <Section title="Chief Complaint">
              <p className="italic" style={{color:'#1f1812'}}>"{caseData.cc}"</p>
            </Section>

            <Section title="History of Present Illness">
              <p>
                {patient.name} is a {patient.ageStr} {patient.sexWord} brought in by {patient.guardian} for evaluation. {capitalize(patient.pronoun)} presents with {caseData.cc}.
              </p>
              <ul className="list-none mt-3 space-y-1.5">
                {caseData.hpi.map((h,i) =>
                  <li key={i} className="flex gap-2"><span style={{color:'#8b2635'}}>›</span><span>{h}</span></li>
                )}
              </ul>
            </Section>

            {(caseData.pmh.length || caseData.shx.length) ? (
              <div className="grid md:grid-cols-2 gap-4 mb-2">
                {caseData.pmh.length > 0 && (
                  <Section title="Past Medical / Other">
                    <ul className="list-none space-y-1 text-sm">
                      {caseData.pmh.map((h,i) => <li key={i}>· {h}</li>)}
                    </ul>
                  </Section>
                )}
                {caseData.shx.length > 0 && (
                  <Section title="Social / Family">
                    <ul className="list-none space-y-1 text-sm">
                      {caseData.shx.map((h,i) => <li key={i}>· {h}</li>)}
                    </ul>
                  </Section>
                )}
              </div>
            ) : null}

            <Section title="Vital Signs">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mono text-sm">
                <Vital label="Temp" value={`${vitals.temp} °C`} flag={vitals.temp >= 38.0} />
                <Vital label="HR" value={`${vitals.hr} bpm`} pulse={vitals.hr > 130}/>
                <Vital label="RR" value={`${vitals.rr} /min`}/>
                <Vital label="BP" value={vitals.bp}/>
                <Vital label="SpO₂" value={`${vitals.spo2}%`} flag={vitals.spo2 < 95}/>
              </div>
            </Section>

            <Section title="Physical Examination">
              <ul className="list-none space-y-1.5 text-sm">
                {caseData.pe.map((h,i) => <li key={i}>· {h}</li>)}
              </ul>
            </Section>

            {hasLabs ? (
              <Section title={caseData.labMode === 'few' ? 'Selected Laboratory Studies' : caseData.labMode === 'partial' ? 'Initial Laboratory Studies' : caseData.labMode === 'none' ? 'Additional Studies' : 'Laboratory Studies'}>
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
                        const flagStyle = f.status==='low' ? {color:'#a01b28', fontWeight:700} : f.status==='high' ? {color:'#a05a1b', fontWeight:700} : {color:'#7a6a55'};
                        return (
                          <tr key={k} style={{borderBottom:'1px dotted rgba(31,24,18,0.18)'}}>
                            <td className="py-1.5 pr-2" style={{fontFamily:'Lora,serif'}}>{LAB_LABELS[k]}</td>
                            <td className="py-1.5 pr-2"><span style={flagStyle}>{f.display}</span></td>
                            <td className="py-1.5 pr-2 text-xs" style={{color:'#7a6a55'}}>{f.ref}</td>
                            <td className="py-1.5"><span style={flagStyle}>{f.status==='low'?'L': f.status==='high'?'H':' '}</span></td>
                          </tr>
                        );
                      })}
                      {extraLabs && Object.keys(extraLabs).map(k => (
                        <tr key={k} style={{borderBottom:'1px dotted rgba(31,24,18,0.18)'}}>
                          <td className="py-1.5 pr-2" style={{fontFamily:'Lora,serif'}}>{SPECIAL_LABEL[k] || k}</td>
                          <td className="py-1.5 pr-2"><span style={{color:'#a01b28', fontWeight:700}}>{String(extraLabs[k])}{SPECIAL_UNIT[k]||''}</span></td>
                          <td className="py-1.5 pr-2 text-xs" style={{color:'#7a6a55'}}>{caseData.extraNormals[k]||''}</td>
                          <td className="py-1.5"><span style={{color:'#a01b28', fontWeight:700}}>★</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            ) : (
              <Section title="Laboratory Studies">
                <p className="italic text-sm" style={{color:'#7a6a55'}}>Laboratory workup is pending at the time of evaluation.</p>
              </Section>
            )}
          </div>

          <div className="mt-6 mb-3">
            <div className="mono text-xs uppercase tracking-widest mb-1" style={{color:'#8b2635'}}>Question · {questionTypeLabel}</div>
            <div className="display text-2xl" style={{color:'#1f1812'}}>{question.prompt}</div>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5">
            {question.options.map((o,i) => {
              const isSelected = selected === o;
              let cls = 'opt';
              const style = { borderColor:'rgba(31,24,18,0.25)' };
              if (revealed) {
                if (o.correct) cls += ' opt-correct';
                else if (isSelected) cls += ' opt-wrong';
              }
              return (
                <button key={i} onClick={()=>answer(o)} disabled={revealed}
                  className={`${cls} text-left p-3.5 rounded border-2 transition`} style={style}>
                  <div className="display text-base" style={{fontWeight:600}}>{o.label}</div>
                  {o.sub && <div className="mono text-xs uppercase tracking-widest mt-0.5" style={{color:'#7a6a55'}}>{o.sub}</div>}
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className="mt-6 panel rounded p-5 border-2 case-fade" style={{borderColor: correct ? '#2d784e' : '#a01b28'}}>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="stamp" style={{color: correct ? '#2d784e' : '#a01b28'}}>{correct ? 'Correct' : 'Incorrect'}</span>
                <span className="display text-xl">{syndrome.name}</span>
              </div>

              {!correct && (
                <div className="text-sm mt-2 mb-2">
                  <span className="mono uppercase tracking-widest text-xs" style={{color:'#5a4a3a'}}>Correct answer · </span>
                  <span style={{fontWeight:600}}>{correctOption.label}</span>
                </div>
              )}

              <div className="text-sm leading-relaxed mt-3 grid md:grid-cols-2 gap-x-6 gap-y-2">
                <div>
                  <div className="mono uppercase tracking-widest text-xs mb-1" style={{color:'#8b2635'}}>Mechanism</div>
                  <div>{syndrome.mechanism}</div>
                </div>
                <div>
                  <div className="mono uppercase tracking-widest text-xs mb-1" style={{color:'#8b2635'}}>Inheritance</div>
                  <div>{syndrome.inheritance}</div>
                </div>
                <div>
                  <div className="mono uppercase tracking-widest text-xs mb-1" style={{color:'#8b2635'}}>Defect</div>
                  <div>{syndrome.defect}</div>
                </div>
                <div>
                  <div className="mono uppercase tracking-widest text-xs mb-1" style={{color:'#8b2635'}}>Confirmatory test</div>
                  <div>{syndrome.diagnosticTest}</div>
                </div>
              </div>

              <div className="text-sm leading-relaxed mt-4 pt-3" style={{borderTop:'1px dotted rgba(31,24,18,0.25)'}}>
                <span className="mono uppercase tracking-widest text-xs" style={{color:'#8b2635'}}>Key teaching point </span>
                <p className="mt-1">{caseData.clue}</p>
              </div>

              <div className="mt-4 flex gap-3 items-center flex-wrap">
                <button onClick={next} className="display px-5 py-2 text-base"
                  style={{background:'#1f1812', color:'#f3ece0', borderRadius:'2px', fontWeight:700, letterSpacing:'0.02em', border:'none', cursor:'pointer'}}>
                  Next case →
                </button>
                <span className="mono text-xs" style={{color:'#7a6a55'}}>
                  Running accuracy: <span style={{color: correct ? '#2d784e' : '#1f1812'}}>{total>0 ? Math.round((score.right/total)*100) : 0}%</span>
                </span>
              </div>
            </div>
          )}

          {!revealed && (
            <div className="mt-6 flex justify-end">
              <button onClick={next} className="mono text-xs underline" style={{color:'#7a6a55', background:'none', border:'none', cursor:'pointer'}}>
                skip · generate new case
              </button>
            </div>
          )}

          <footer className="mt-12 pt-4 mono text-xs flex justify-between" style={{color:'#7a6a55', borderTop:'1px solid rgba(31,24,18,0.3)'}}>
            <span>Confidential · Teaching File · For educational use only</span>
            <span>Case {caseData.id}</span>
          </footer>
        </div>
      </div>
    </>
  );
}

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
