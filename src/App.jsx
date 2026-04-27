import { useState } from 'react';

// =========================================================================
// IMMUNODEFICIENCY TRAINER v2 
// =========================================================================

const FIRST_M = ['James','William','Lucas','Ethan','Mason','Noah','Liam','Oliver','Daniel','Henry','Aiden','Caleb','Owen','Wyatt','Sebastian','Marcus','Theo','Jamal','Andre','Diego','Kenji','Arjun','Malik','Dmitri','Finn','Mateo','Hiroshi', 'Gwimbly'];
const FIRST_F = ['Emma','Sophia','Olivia','Ava','Charlotte','Mia','Amelia','Harper','Evelyn','Abigail','Eloise','Nora','Lila','Maya','Aisha','Priya','Lucia','Zara','Naomi','Imani','Sienna','Yuki','Elena','Camila','Freya','Anika','Beatriz'];
const LAST = ['Patel','Garcia','Kim','Nguyen','Okafor','Rodriguez','Martinez','Johnson','Williams','Brown','Tanaka','Singh','O\'Brien','Cohen','Andersen','Petrov','Hassan','Reyes','Mbeki','Schmidt','Liu','Romano','Bishara','Larsson','Dubois','Park','Nakamura'];

const RH_PMH = ['Wears glasses for mild myopia','Mild seasonal allergies','Right ankle sprain last fall, fully resolved','No known drug allergies','Wisdom teeth extracted last year','Has braces','Lactose intolerant','Birth: spontaneous vaginal delivery at 39 weeks, uncomplicated'];
const RH_SHX = ['Lives at home with parents and one younger sibling','Plays soccer on the school team','Family owns a Labrador retriever','Mother is an accountant, father is a high-school teacher','Father is a firefighter, mother is a nurse','In the school chess club','Recently returned from a beach vacation in Florida','Honor roll student','Plays clarinet in the school band','Has a pet goldfish named Captain'];

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

const SYNDROMES = [
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
    clue:'Infant under 1 year with FTT + opportunistic infections (PCP, CMV, persistent thrush, chronic diarrhea) + ABSENT thymic shadow + everything low → SCID. Most commonly defective IL-2R γ chain (X-linked recessive). LIVE VACCINES and non-irradiated blood are CONTRAINDICATED.'
  },
  {
    id:'at', name:'Ataxia–Telangiectasia', short:'A-T', category:'B+T', sex:'any', ageMin:2, ageMax:10,
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
    clue:'Delayed UMBILICAL CORD separation + recurrent infections WITHOUT PUS + markedly elevated WBC → LAD-1 (defective CD18/β2-integrin). Autosomal recessive. Neutrophils cannot extravasate.'
  }
];

function generateCase(syndrome) {
  const sex = syndrome.sex === 'any' ? rand(['M','F']) : syndrome.sex;
  const firstNames = sex === 'M' ? FIRST_M : FIRST_F;
  const ageYears = randFloat(syndrome.ageMin, syndrome.ageMax, 1);
  const isInfant = ageYears < 2;
  const ageStr = isInfant ? `${Math.round(ageYears*12)}-month-old` : `${Math.round(ageYears)}-year-old`;
  const sexWord = sex === 'M' ? (isInfant ? 'boy' : 'male') : (isInfant ? 'girl' : 'female');
  const patient = {
    name: `${rand(firstNames)} ${rand(LAST)}`,
    age: ageYears, ageStr, sex, sexWord,
    pronoun: sex==='M' ? 'he' : 'she',
    guardian: rand(['his mother','her mother','his father','her father','both parents'])
  };

  const depth = weighted(['sparse','medium','full'], [0.25, 0.50, 0.25]);

  let hpi = [];
  if (depth === 'sparse') {
    if (syndrome.pathognomonic.length && Math.random() < 0.65) {
      hpi = [...pick(syndrome.pathognomonic, 1)];
      if (Math.random() < 0.5) hpi.push(...pick(syndrome.classic, 1));
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

  const rhPmh = pick(RH_PMH, depth === 'sparse' ? randInt(0,1) : randInt(1,2));
  const rhShx = pick(RH_SHX, depth === 'sparse' ? 1 : randInt(1,2));

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

  if (depth === 'sparse') {
    if (labDepthRoll < 0.4) {
      labMode = 'none';
    } else if (labDepthRoll < 0.75) {
      const hideKey = Math.random() < 0.4;
      const candidates = hideKey ? allLabKeys.filter(k=>!keyLabs.includes(k)) : allLabKeys;
      labKeysToShow = pick(candidates.length?candidates:allLabKeys, randInt(1,2));
      labMode = 'few';
      if (syndrome.extraLabs && Math.random() < 0.5) extraLabsToShow = syndrome.extraLabs();
    } else {
      labKeysToShow = keyLabs.length ? pick(keyLabs, 1) : pick(allLabKeys, 1);
      labMode = 'few';
      if (syndrome.extraLabs && Math.random() < 0.4) extraLabsToShow = syndrome.extraLabs();
    }
  } else if (depth === 'medium') {
    const n = randInt(3, Math.min(5, allLabKeys.length || 3));
    const mustHave = keyLabs.length ? pick(keyLabs, 1) : [];
    const others = pick(allLabKeys.filter(k=>!mustHave.includes(k)), Math.max(0, n - mustHave.length));
    labKeysToShow = [...mustHave, ...others];
    labMode = 'partial';
    if (syndrome.extraLabs && Math.random() < 0.7) extraLabsToShow = syndrome.extraLabs();
  } else {
    labKeysToShow = allLabKeys;
    labMode = 'full';
    if (syndrome.extraLabs) extraLabsToShow = syndrome.extraLabs();
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

const QUESTION_TYPES = [
  { id:'diagnosis', weight: 50 },
  { id:'defect', weight: 18 },
  { id:'inheritance', weight: 12 },
  { id:'organism', weight: 12 },
  { id:'test', weight: 8 },
];

function pickQuestionType(syndrome) {
  const valid = QUESTION_TYPES.filter(t => {
    if (t.id === 'organism' && (!syndrome.organismOptions || syndrome.organismOptions.length === 0)) return false;
    return true;
  });
  const total = valid.reduce((a,t)=>a+t.weight, 0);
  let r = Math.random()*total;
  for (const t of valid) { r -= t.weight; if (r <= 0) return t.id; }
  return 'diagnosis';
}

function buildDiagnosisQ(syndrome) {
  const sameCat = SYNDROMES.filter(s => s.id !== syndrome.id && s.category === syndrome.category);
  const otherCat = SYNDROMES.filter(s => s.id !== syndrome.id && s.category !== syndrome.category);
  const distractors = pick(sameCat, Math.min(3, sameCat.length));
  while (distractors.length < 4) {
    const nxt = pick(otherCat.filter(s=>!distractors.includes(s)),1)[0];
    if (nxt) distractors.push(nxt); else break;
  }
  const opts = shuffle([syndrome, ...distractors]).map(s => ({
    label: s.name, sub: `${s.category} disorder`, correct: s.id === syndrome.id
  }));
  return { type:'diagnosis', prompt:'Which of the following is the most likely diagnosis?', options: opts };
}

function buildDefectQ(syndrome) {
  const others = pick(SYNDROMES.filter(s => s.id !== syndrome.id && s.defect !== syndrome.defect), 4);
  const opts = shuffle([
    { label: syndrome.defect, correct: true },
    ...others.map(s => ({ label: s.defect, correct: false }))
  ]);
  return { type:'defect', prompt:'Which of the following proteins or genes is most likely non-functional in this patient?', options: opts };
}

function buildInheritanceQ(syndrome) {
  const labels = ['X-linked recessive','Autosomal recessive','Autosomal dominant','Microdeletion (de novo)','Sporadic / unknown'];
  const t = syndrome.inheritance.toLowerCase();
  const correctLabel =
    t.includes('x-linked') ? 'X-linked recessive' :
    t.includes('autosomal recessive') ? 'Autosomal recessive' :
    t.includes('autosomal dominant') ? 'Autosomal dominant' :
    t.includes('microdeletion') ? 'Microdeletion (de novo)' :
    'Sporadic / unknown';
  const opts = shuffle(labels.map(l => ({ label: l, correct: l === correctLabel })));
  return { type:'inheritance', prompt:'What is the most likely pattern of inheritance for this disorder?', options: opts };
}

function buildOrganismQ(syndrome) {
  const correct = syndrome.keyOrganism;
  const allOtherOrganisms = [...new Set(SYNDROMES.filter(s => s.id !== syndrome.id).flatMap(s => s.organismOptions || []))]
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

function buildTestQ(syndrome) {
  const others = pick(SYNDROMES.filter(s => s.id !== syndrome.id && s.diagnosticTest !== syndrome.diagnosticTest), 4);
  const opts = shuffle([
    { label: syndrome.diagnosticTest, correct: true },
    ...others.map(s => ({ label: s.diagnosticTest, correct: false }))
  ]);
  return { type:'test', prompt:'Which of the following is the most appropriate confirmatory test?', options: opts };
}

function buildQuestion(syndrome) {
  const type = pickQuestionType(syndrome);
  if (type==='defect') return buildDefectQ(syndrome);
  if (type==='inheritance') return buildInheritanceQ(syndrome);
  if (type==='organism') return buildOrganismQ(syndrome);
  if (type==='test') return buildTestQ(syndrome);
  return buildDiagnosisQ(syndrome);
}

function generateRound() {
  const syndrome = rand(SYNDROMES);
  const caseData = generateCase(syndrome);
  const question = buildQuestion(syndrome);
  return { caseData, syndrome, question };
}

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

const SPECIAL_LABEL = { ca:'Serum calcium', afp:'α-Fetoprotein', dhr:'DHR (NADPH oxidase)', ch50:'CH50 (total complement)', cd18:'CD18 (flow cytometry)' };
const SPECIAL_UNIT = { ca:' mg/dL', afp:' ng/mL' };

function capitalize(s) { return s.charAt(0).toUpperCase()+s.slice(1); }

export default function App() {
  const [round, setRound] = useState(generateRound());
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ right:0, wrong:0 });
  const [showRef, setShowRef] = useState(false);

  const { caseData, syndrome, question } = round;
  const { patient, vitals, labs, extraLabs } = caseData;

  const answer = (opt) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    setScore(prev => opt.correct ? { ...prev, right: prev.right+1 } : { ...prev, wrong: prev.wrong+1 });
  };
  const next = () => { setRound(generateRound()); setSelected(null); setRevealed(false); };

  const correct = revealed && selected?.correct;
  const total = score.right + score.wrong;
  const hasLabs = Object.keys(labs).length > 0 || (extraLabs && Object.keys(extraLabs).length > 0);
  const correctOption = question.options.find(o => o.correct);
  const questionTypeLabel = { diagnosis:'Diagnosis', defect:'Molecular defect', inheritance:'Inheritance pattern', organism:'Organism susceptibility', test:'Confirmatory test' }[question.type];

  return (
    <>
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

      <div className="paper">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <header className="flex items-end justify-between pb-3 mb-2" style={{borderBottom:'2px solid #1f1812'}}>
            <div>
              <div className="text-xs mono uppercase tracking-widest" style={{color:'#8b2635'}}>Wayne State University School of Medicine · Trainer</div>
              <h1 className="display text-5xl mt-1" style={{color:'#1f1812'}}>Differential <span style={{color:'#8b2635'}}>·</span> Immunodeficiency</h1>
              <div className="text-sm italic mt-1" style={{color:'#5a4a3a'}}>A procedurally generated patient encounter quiz</div>
            </div>
            <div className="text-right">
              <div className="mono text-xs uppercase tracking-widest" style={{color:'#5a4a3a'}}>Score</div>
              <div className="display text-3xl"><span style={{color:'#2d784e'}}>{score.right}</span><span style={{color:'#5a4a3a'}}> / </span><span>{total}</span></div>
              <button onClick={()=>setShowRef(!showRef)} className="mono text-xs underline mt-1" style={{color:'#8b2635', background:'none', border:'none', cursor:'pointer'}}>
                {showRef ? 'hide' : 'show'} syndrome list
              </button>
            </div>
          </header>
          <div className="accent-rule mb-6"></div>

          {showRef && (
            <div className="panel rounded p-4 mb-6 text-sm">
              <div className="mono uppercase tracking-widest text-xs mb-2" style={{color:'#8b2635'}}>Reference · all syndromes in this trainer</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5">
                {SYNDROMES.map(s =>
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
              <Section title={caseData.labMode === 'few' ? 'Selected Laboratory Studies' : caseData.labMode === 'partial' ? 'Initial Laboratory Studies' : 'Laboratory Studies'}>
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
                  Running accuracy: <span style={{color: correct ? '#2d784e' : '#1f1812'}}>{Math.round((score.right/total)*100)}%</span>
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
