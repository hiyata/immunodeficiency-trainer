// =============================================================================
// syndromes/hematology.js — Hematologic malignancies and lymphoproliferative disorders
// Exports: SYNDROMES_HEME
//
// Each syndrome object schema (in addition to shared fields):
//   keyComplication (string), complicationOptions (string[]),
//   pmhPool (array), shxPool (array)
// =============================================================================

import { rand, randInt, randFloat } from '../../utils/random.js';
import {
  ADULT_PMH, ADULT_SHX,
  ELDERLY_PMH, ELDERLY_SHX,
  CHILD_HEALTHY_PMH, CHILD_HEALTHY_SHX,
  YOUNG_ADULT_PMH, YOUNG_ADULT_SHX
} from '../patient.js';

export const SYNDROMES_HEME = [
  // -------------------------- AML --------------------------
  {
    id:'aml', name:'Acute Myeloid Leukemia (AML)', short:'AML', category:'Acute Leukemia',
    sex:'any', ageMin:40, ageMax:78,
    pmhPool: ADULT_PMH, shxPool: ADULT_SHX,
    defect:'Clonal expansion of immature myeloid precursors (myeloblasts); diverse recurrent cytogenetic abnormalities — t(15;17) PML-RARA defines acute promyelocytic leukemia (APL), t(8;21) RUNX1-RUNX1T1, inv(16) CBFB-MYH11, FLT3-ITD, and NPM1 mutations are commonly tested',
    inheritance:'Acquired somatic mutation in a clonal hematopoietic stem-cell population (not inherited). Risk factors: prior chemotherapy (especially alkylating agents and topoisomerase II inhibitors), prior radiation exposure, antecedent myelodysplastic syndrome, benzene exposure, Down syndrome (AMKL).',
    mechanism:'Differentiation arrest at the myeloblast stage with clonal proliferation → blasts crowd out normal hematopoiesis → pancytopenia (anemia, thrombocytopenia, neutropenia) → fatigue, bleeding, and infection. In acute promyelocytic leukemia (APL, M3), the PML-RARA fusion protein blocks myeloid differentiation; abnormal promyelocytes release tissue factor → disseminated intravascular coagulation, which is exacerbated by chemotherapy and treated with all-trans retinoic acid (ATRA).',
    diagnosticTest:'Bone-marrow biopsy and aspirate demonstrating ≥20% myeloblasts, with myeloperoxidase positivity by cytochemistry and a CD13+/CD33+/CD117+ myeloid immunophenotype on flow cytometry; cytogenetics and FISH for recurrent translocations',
    keyOrganism:'',
    organismOptions:[],
    keyComplication:'Disseminated intravascular coagulation in the acute promyelocytic leukemia (APL, t(15;17)) subtype, which may worsen with the initiation of cytotoxic chemotherapy and is the rationale for differentiation therapy with all-trans retinoic acid (ATRA)',
    complicationOptions:[
      'Disseminated intravascular coagulation with the t(15;17) acute promyelocytic leukemia subtype, addressed with all-trans retinoic acid (ATRA)',
      'Tumor lysis syndrome with hyperuricemia, hyperkalemia, hyperphosphatemia, and hypocalcemia at the initiation of chemotherapy',
      'Richter transformation to diffuse large B-cell lymphoma',
      'Blast crisis with abrupt evolution to acute leukemia driven by additional cytogenetic abnormalities',
      'Hyperviscosity syndrome from a circulating monoclonal IgM paraprotein'
    ],
    cc: () => rand([
      'middle-aged adult with three weeks of fatigue, easy bruising, and a new dental-procedure-related bleeding episode',
      'older adult with progressive fatigue, recurrent fevers, and gingival bleeding',
      'middle-aged adult with diffuse petechiae and a sore throat for one week',
      'older adult with bruising, pallor, and a single episode of epistaxis lasting twenty minutes',
      'middle-aged adult with persistent fatigue and a CBC showing pancytopenia with circulating blasts'
    ]),
    pathognomonic:[
      'Peripheral smear demonstrates large blasts with prominent nucleoli and pink/red rod-shaped cytoplasmic inclusions consistent with Auer rods',
      'Bone-marrow aspirate shows 68% myeloblasts with myeloperoxidase-positive cytochemistry and bundles of Auer rods ("faggot cells") characteristic of acute promyelocytic leukemia',
      'Cytogenetics on the bone-marrow aspirate demonstrate t(15;17)(q22;q12) — PML-RARA — confirming acute promyelocytic leukemia (APL, M3)',
      'Flow cytometry of the bone marrow demonstrates an abnormal blast population that is CD13+, CD33+, CD117+, and myeloperoxidase-positive'
    ],
    classic:[
      'Three to four weeks of progressive fatigue, dyspnea on exertion, and pallor',
      'New onset of easy bruising, petechiae, and gingival bleeding while brushing the teeth',
      'Two recent febrile illnesses with persistent neutropenic fever despite empirical antibiotics',
      'Coagulation studies on admission demonstrate prolonged PT and aPTT, a low fibrinogen, and elevated D-dimer consistent with disseminated intravascular coagulation',
      'CBC reveals a white-blood-cell count of 38,000/μL with 72% blasts on the differential, hemoglobin 7.6 g/dL, and platelets 18,000/μL'
    ],
    supportive:[
      'Received cyclophosphamide-containing chemotherapy for breast cancer five years ago',
      'Prior history of myelodysplastic syndrome diagnosed on bone-marrow biopsy two years ago',
      'Past occupational exposure to benzene as an industrial painter for over 20 years',
      'No family history of hematologic malignancy'
    ],
    pe_pathognomonic:[
      'Diffuse petechiae of the lower extremities with several wet purpuric lesions on the buccal mucosa, in the setting of laboratory-confirmed disseminated intravascular coagulation',
      'Boggy hypertrophic gingiva with bleeding at the gingival margins — a finding particularly associated with monocytic differentiation (AML-M4/M5)'
    ],
    pe_classic:[
      'Pale conjunctivae and mucous membranes',
      'Scattered ecchymoses of varying age over the trunk and extremities',
      'Mild splenomegaly — spleen tip palpable 2 cm below the left costal margin',
      'Oropharyngeal mucosal pallor with a small left-tonsillar exudate'
    ],
    pe_supportive:[
      'Temperature 38.4 °C with tachycardia at 108 bpm',
      'No significant lymphadenopathy on examination'
    ],
    labs:{ wbc:'high', hgb:'low', plt:'very_low' },
    keyLabs:['wbc','plt','hgb'],
    extraLabs: () => ({
      blasts:'72% myeloblasts on bone-marrow aspirate',
      smear:'Numerous large blasts with prominent nucleoli; occasional Auer rods identified',
      cytogenetics: rand(['t(15;17)(q22;q12) — PML-RARA fusion (acute promyelocytic leukemia)','t(8;21)(q22;q22) — RUNX1-RUNX1T1','inv(16)(p13.1;q22) — CBFB-MYH11','Normal karyotype with FLT3-ITD and NPM1 mutations']),
      flow:'CD13+, CD33+, CD117+, myeloperoxidase-positive abnormal myeloid blast population'
    }),
    extraNormals:{ blasts:'<5% blasts in normal bone marrow', smear:'mature granulocytic differentiation, no blasts', cytogenetics:'46,XY or 46,XX', flow:'no abnormal blast population' },
    differential:'all',
    clue:'Adult with pancytopenia + circulating blasts + AUER RODS (especially with t(15;17) APL → DIC, treated with ATRA). Myeloperoxidase+, CD13/CD33/CD117+. ≥20% blasts in bone marrow defines acute leukemia. Step-1 differential: ALL — lymphoblasts (TdT+, CD10+ CALLA), more common in children. Both AML and ALL cause MARROW FAILURE → anemia, infection, bleeding.'
  },

  // -------------------------- ALL --------------------------
  {
    id:'all', name:'Acute Lymphoblastic Leukemia (ALL)', short:'ALL', category:'Acute Leukemia',
    sex:'any', ageMin:2, ageMax:15,
    pmhPool: CHILD_HEALTHY_PMH, shxPool: CHILD_HEALTHY_SHX,
    defect:'Clonal expansion of immature lymphoid precursors (lymphoblasts); B-cell ALL (~80%) is most common, T-cell ALL (~20%) classically presents in adolescent males with a mediastinal mass. Recurrent cytogenetics: t(12;21) ETV6-RUNX1 (best prognosis, children), hyperdiploidy (favorable), t(9;22) BCR-ABL Philadelphia chromosome (poor prognosis), MLL/KMT2A rearrangements in infants.',
    inheritance:'Acquired somatic mutation in a clonal lymphoid stem-cell population (not inherited). Markedly increased incidence in Down syndrome (trisomy 21), ataxia-telangiectasia, and following ionizing-radiation exposure.',
    mechanism:'Maturation arrest at the lymphoblast stage with clonal proliferation → blasts replace normal marrow elements → pancytopenia (anemia, thrombocytopenia, neutropenia). Lymphoblasts also infiltrate extramedullary sites: lymph nodes (lymphadenopathy), liver and spleen (hepatosplenomegaly), bone (pain, often nocturnal in young children), mediastinum (T-cell), testes (sanctuary site), and the central nervous system — requiring intrathecal chemotherapy prophylaxis.',
    diagnosticTest:'Bone-marrow biopsy and aspirate demonstrating ≥20% lymphoblasts with terminal deoxynucleotidyl transferase (TdT) positivity by flow cytometry and immunophenotyping (B-ALL: CD10+ CD19+ CD20+; T-ALL: CD2/CD3/CD5/CD7+)',
    keyOrganism:'',
    organismOptions:[],
    keyComplication:'Tumor lysis syndrome at the initiation of cytotoxic chemotherapy — hyperuricemia, hyperkalemia, hyperphosphatemia, secondary hypocalcemia, and acute kidney injury — prevented with hydration, allopurinol or rasburicase, and urine alkalinization',
    complicationOptions:[
      'Tumor lysis syndrome with hyperuricemia, hyperkalemia, hyperphosphatemia, and secondary hypocalcemia at the initiation of chemotherapy',
      'Disseminated intravascular coagulation related to a t(15;17) acute promyelocytic-leukemia subtype, addressed with all-trans retinoic acid',
      'Richter transformation to diffuse large B-cell lymphoma',
      'Aquagenic pruritus and erythromelalgia from JAK2-V617F driven erythrocytosis',
      'Hyperviscosity syndrome from a circulating monoclonal IgM paraprotein'
    ],
    cc: () => rand([
      'school-age child with three weeks of fatigue, pallor, and a refusal to bear weight on the right leg',
      'school-age child with new bruising, two days of fever, and night pain in the legs',
      'school-age child found on a sports physical to have a markedly elevated white-blood-cell count with circulating blasts',
      'school-age child with persistent fatigue, recurrent epistaxis, and a one-month history of intermittent low-grade fever',
      'adolescent male with progressive shortness of breath and a chest radiograph showing an anterior mediastinal mass'
    ]),
    pathognomonic:[
      'Bone-marrow aspirate demonstrates 92% lymphoblasts with terminal deoxynucleotidyl transferase (TdT) positivity by flow cytometry',
      'Flow cytometry on bone-marrow aspirate demonstrates an abnormal B-cell precursor population that is CD10 (CALLA)-positive, CD19-positive, CD20-positive, TdT-positive, and myeloperoxidase-negative',
      'Cytogenetics on bone-marrow aspirate demonstrate t(12;21)(p13;q22) — ETV6-RUNX1 fusion, a favorable prognostic finding in childhood B-cell ALL',
      'Chest CT in an adolescent male demonstrates a bulky anterior mediastinal mass with airway compression, consistent with T-cell ALL'
    ],
    classic:[
      'Two to four weeks of progressive fatigue, pallor, and decreased energy with poor school attendance',
      'Episodic bone pain — particularly in the long bones of the legs at night — sometimes mistaken for "growing pains"',
      'New bruising over the shins, petechiae of the lower extremities, and two episodes of epistaxis lasting longer than 15 minutes',
      'Recurrent febrile illnesses with persistent fevers despite oral antibiotics for presumed otitis media',
      'CBC reveals a white-blood-cell count of 42,000/μL with 80% blasts on the differential, hemoglobin 6.9 g/dL, and platelets 22,000/μL'
    ],
    supportive:[
      'Sibling with trisomy 21 has been doing well at the local elementary school',
      'No prior radiation exposure or known chemotherapy use in the family',
      'Up to date on immunizations including varicella'
    ],
    pe_pathognomonic:[
      'Diffuse non-tender lymphadenopathy involving cervical, axillary, and inguinal chains in a school-age child with marrow failure',
      'Anterior mediastinal mass on imaging in an adolescent male presenting with shortness of breath and superior-vena-cava syndrome (T-cell ALL phenotype)',
      'Painless testicular enlargement in a school-age boy in relapse, reflecting testicular sanctuary-site involvement'
    ],
    pe_classic:[
      'Pale conjunctivae and mucous membranes',
      'Scattered ecchymoses and petechiae over the shins',
      'Hepatosplenomegaly with the spleen tip palpable 4 cm below the costal margin',
      'Tenderness to palpation over the proximal tibial metaphyses bilaterally'
    ],
    pe_supportive:[
      'Temperature 38.1 °C, tachycardia to 122 bpm',
      'Oropharynx without exudate'
    ],
    labs:{ wbc:'high', hgb:'low', plt:'low' },
    keyLabs:['wbc','plt','hgb'],
    extraLabs: () => ({
      blasts:'85% lymphoblasts on bone-marrow aspirate',
      flow:'CD10+ (CALLA), CD19+, CD20+, TdT+, myeloperoxidase-negative B-lymphoblast population',
      cytogenetics: rand(['t(12;21)(p13;q22) — ETV6-RUNX1 fusion (favorable, childhood B-ALL)','Hyperdiploidy (>50 chromosomes; favorable)','t(9;22)(q34;q11) — Philadelphia chromosome (poor prognosis)','MLL (KMT2A) rearrangement at 11q23 (infant ALL, poor prognosis)']),
      uricacid:randFloat(8.5, 14.0, 1),
      ldh:randInt(900, 2400)
    }),
    extraNormals:{ blasts:'<5% blasts in normal bone marrow', flow:'no abnormal lymphoblast population', cytogenetics:'46,XY or 46,XX', uricacid:'3.5–7.2 mg/dL', ldh:'140–280 U/L' },
    differential:'aml',
    clue:'Child (peak age 2–5 yr) with pancytopenia + bone pain + lymphadenopathy + hepatosplenomegaly + circulating lymphoblasts. TdT+, CD10+ (CALLA) in B-ALL. Adolescent males with T-ALL can present with a MEDIASTINAL MASS. Most common childhood cancer; DOWN SYNDROME ↑↑ risk. t(12;21) favorable; t(9;22) Philadelphia poor. CNS sanctuary requires intrathecal chemo. Step-1 differential: AML — myeloblasts with AUER RODS, MPO+, older patients.'
  },

  // -------------------------- CML --------------------------
  {
    id:'cml', name:'Chronic Myeloid Leukemia (CML)', short:'CML', category:'Myeloproliferative Neoplasm',
    sex:'any', ageMin:45, ageMax:75,
    pmhPool: ADULT_PMH, shxPool: ADULT_SHX,
    defect:'t(9;22)(q34;q11) reciprocal translocation creating the Philadelphia chromosome and the BCR-ABL1 fusion oncogene, which encodes a constitutively active tyrosine kinase that drives myeloid proliferation through downstream RAS, JAK/STAT, and PI3K/AKT signaling',
    inheritance:'Acquired somatic mutation in a clonal hematopoietic stem cell — the t(9;22) translocation is sporadic and not inherited',
    mechanism:'BCR-ABL1 fusion produces a constitutively active cytoplasmic tyrosine kinase → unregulated proliferation of mature granulocytic precursors (mostly metamyelocytes, myelocytes, neutrophils, basophils, eosinophils) with preserved differentiation. Disease progresses through a chronic phase (months to years), an accelerated phase, and a blast phase that morphologically resembles acute leukemia (~70% myeloid, ~30% lymphoid). Treatment with the tyrosine-kinase inhibitor imatinib (and successors) targets the BCR-ABL kinase and has transformed CML from a fatal disease into a chronic one.',
    diagnosticTest:'Cytogenetic analysis or FISH demonstrating the Philadelphia chromosome (t(9;22)), or RT-PCR for the BCR-ABL1 fusion transcript on peripheral blood',
    keyOrganism:'',
    organismOptions:[],
    keyComplication:'Progression to blast crisis — abrupt evolution to acute leukemia (myeloid in ~70%, lymphoid in ~30%) defined by ≥20% blasts in the blood or marrow, with markedly worse prognosis',
    complicationOptions:[
      'Blast crisis with abrupt evolution to acute leukemia driven by additional cytogenetic abnormalities',
      'Richter transformation to diffuse large B-cell lymphoma',
      'Tumor lysis syndrome with hyperuricemia and acute kidney injury at the initiation of chemotherapy',
      'Aquagenic pruritus and erythromelalgia from JAK2-V617F driven erythrocytosis',
      'Hyperviscosity syndrome from a circulating monoclonal IgM paraprotein'
    ],
    cc: () => rand([
      'middle-aged adult with three months of progressive early satiety, left-upper-quadrant fullness, and a routine CBC showing leukocytosis to 180,000/μL',
      'middle-aged adult referred from a primary-care visit after a routine CBC demonstrated marked leukocytosis with a left-shifted differential',
      'older adult with fatigue, drenching night sweats, and a 6-kg unintentional weight loss',
      'middle-aged adult with abdominal distension and weight loss, found to have massive splenomegaly on examination'
    ]),
    pathognomonic:[
      'Cytogenetic analysis on peripheral blood demonstrates the Philadelphia chromosome — t(9;22)(q34;q11)',
      'RT-PCR on peripheral blood is positive for the BCR-ABL1 fusion transcript',
      'Leukocyte alkaline phosphatase (LAP) score is markedly DECREASED, distinguishing CML from a leukemoid reaction (in which LAP is ELEVATED)',
      'Peripheral smear demonstrates a left-shifted granulocytic series at all stages of maturation (myelocytes, metamyelocytes, bands, segmented neutrophils) with absolute basophilia and eosinophilia'
    ],
    classic:[
      'Three to six months of progressive fatigue, early satiety, and left-upper-quadrant abdominal fullness',
      'CBC reveals a white-blood-cell count of 165,000/μL with a left-shifted myeloid differential, absolute basophilia (8%) and eosinophilia (4%), platelets 620,000/μL, and hemoglobin 11.2 g/dL',
      'Bone-marrow biopsy is markedly hypercellular (>95%) with prominent granulocytic hyperplasia and a normal myeloid:erythroid ratio reversal',
      'Drenching night sweats requiring a change of bedclothes',
      'Unintentional weight loss of 6 kg over the past three months'
    ],
    supportive:[
      'No prior cytotoxic chemotherapy or radiation exposure',
      'No family history of hematologic malignancy',
      'Occasional bone tenderness over the sternum, but no fractures or focal lytic lesions'
    ],
    pe_pathognomonic:[
      'Massive splenomegaly with the spleen palpable 12 cm below the left costal margin, crossing the midline',
      'Splenic rub auscultated over the left flank (consistent with subcapsular infarcts of an enlarged spleen)'
    ],
    pe_classic:[
      'Sternal tenderness on direct percussion',
      'Mild hepatomegaly with the liver edge palpable 3 cm below the right costal margin',
      'Pallor of the conjunctivae and palms'
    ],
    pe_supportive:[
      'No significant peripheral lymphadenopathy',
      'No purpura or petechiae on skin examination'
    ],
    labs:{ wbc:'very_high', hgb:'low', plt:'high' },
    keyLabs:['wbc','plt'],
    extraLabs: () => ({
      smear:'Left-shifted myeloid series with all stages of granulocytic maturation; absolute basophilia and eosinophilia',
      bcrabl:'POSITIVE — BCR-ABL1 fusion transcript detected by RT-PCR',
      cytogenetics:'t(9;22)(q34;q11) Philadelphia chromosome',
      lap:'Markedly decreased (consistent with CML; contrast with the high LAP score of a leukemoid reaction)'
    }),
    extraNormals:{ smear:'normal mature granulocytic differentiation', bcrabl:'negative', cytogenetics:'46,XY or 46,XX', lap:'normal LAP score (20–100)' },
    differential:'pv',
    clue:'Middle-aged adult with MASSIVE splenomegaly + leukocytosis 100,000–500,000 with a LEFT-SHIFTED MYELOID series (all stages of granulocyte maturation, BASOPHILIA, EOSINOPHILIA) + LOW LAP score → CML. Driver: t(9;22) BCR-ABL1 (PHILADELPHIA chromosome) — first cancer with a defined molecular target, treated with IMATINIB. Progresses to BLAST CRISIS (myeloid 70% / lymphoid 30%) → behaves like acute leukemia. Step-1 differential: leukemoid reaction = high LAP, infection-driven, no Philadelphia chromosome.'
  },

  // -------------------------- CLL --------------------------
  {
    id:'cll', name:'Chronic Lymphocytic Leukemia (CLL/SLL)', short:'CLL', category:'Chronic Lymphoid Neoplasm',
    sex:'any', ageMin:60, ageMax:82,
    pmhPool: ELDERLY_PMH, shxPool: ELDERLY_SHX,
    defect:'Clonal proliferation of small, mature but functionally incompetent CD5+ CD19+ CD20-dim CD23+ B lymphocytes; recurrent cytogenetic abnormalities include del(13q) (most common, favorable), trisomy 12, del(11q) (ATM), and del(17p) (TP53, poorest prognosis)',
    inheritance:'Acquired somatic mutation in a clonal mature B-cell population (not inherited). Most common adult leukemia in the Western world. CLL and small lymphocytic lymphoma (SLL) are the same disease — CLL when the lymphocytes are predominantly in the blood and marrow, SLL when they are predominantly in lymph nodes.',
    mechanism:'Clonal expansion of mature but anergic B cells that accumulate slowly in the blood, bone marrow, lymph nodes, and spleen. The malignant B cells suppress normal humoral immunity → hypogammaglobulinemia and recurrent encapsulated-bacterial infections. The clone may break tolerance and produce autoantibodies against red cells (warm autoimmune hemolytic anemia) or platelets (immune thrombocytopenia). A small fraction transform to an aggressive large-cell lymphoma — Richter transformation.',
    diagnosticTest:'Peripheral-blood flow cytometry demonstrating a monoclonal B-cell population co-expressing CD5, CD19, CD20 (dim), CD23, and surface kappa or lambda light-chain restriction; absolute lymphocyte count ≥5,000/μL is required for the diagnosis of CLL',
    keyOrganism:'',
    organismOptions:[],
    keyComplication:'Richter transformation — sudden clinical deterioration with rapidly enlarging lymph nodes, B symptoms, and a rising LDH, reflecting transformation of the CLL clone into an aggressive diffuse large B-cell lymphoma',
    complicationOptions:[
      'Richter transformation to diffuse large B-cell lymphoma, signaled by rapidly enlarging adenopathy, B symptoms, and a rising LDH',
      'Warm autoimmune hemolytic anemia and immune thrombocytopenia from autoantibodies produced by the malignant clone',
      'Tumor lysis syndrome with hyperuricemia and acute kidney injury at the initiation of chemotherapy',
      'Disseminated intravascular coagulation from t(15;17) PML-RARA-driven acute promyelocytic leukemia',
      'Aquagenic pruritus and erythromelalgia from JAK2-V617F driven erythrocytosis'
    ],
    cc: () => rand([
      'older adult found on routine annual labs to have an absolute lymphocyte count of 24,000/μL and otherwise feels well',
      'older adult with painless cervical and axillary lymphadenopathy noted while shaving',
      'older adult with recurrent sinopulmonary infections over the past year and new fatigue',
      'older adult with new fatigue and dark urine, found to have a hemoglobin of 8.4 g/dL with reticulocytosis and a positive direct antiglobulin test'
    ]),
    pathognomonic:[
      'Peripheral smear demonstrates numerous mature-appearing small lymphocytes and characteristic SMUDGE cells (fragile lymphocytes mechanically disrupted during smear preparation)',
      'Flow cytometry on peripheral blood identifies a monoclonal B-cell population co-expressing CD5, CD19, CD20 (dim), CD23, and a kappa light-chain restriction',
      'Direct antiglobulin (Coombs) test is POSITIVE with IgG and complement coating the red cells, consistent with a warm autoimmune hemolytic anemia complicating CLL'
    ],
    classic:[
      'Routine annual CBC demonstrates an absolute lymphocyte count of 28,500/μL; the patient is otherwise asymptomatic',
      'Painless lymphadenopathy in the cervical, axillary, and inguinal chains — nodes are non-tender, mobile, and rubbery',
      'Two episodes of community-acquired pneumonia in the past 18 months, attributed to hypogammaglobulinemia',
      'Mild fatigue and exercise intolerance with progressive anemia (hemoglobin 9.8 g/dL)'
    ],
    supportive:[
      'No fevers, drenching night sweats, or weight loss',
      'No prior radiation or chemical exposures',
      'No family history of hematologic malignancy'
    ],
    pe_pathognomonic:[
      'Diffuse, painless, rubbery, mobile lymphadenopathy in cervical, axillary, and inguinal chains, in an otherwise well-appearing older adult',
      'Splenomegaly with the spleen tip palpable 6 cm below the left costal margin'
    ],
    pe_classic:[
      'Pale conjunctivae with mild scleral icterus (consistent with warm AIHA)',
      'No focal lymph-node tenderness or matted nodes',
      'No oral mucosal bleeding or petechiae'
    ],
    pe_supportive:[
      'Mild hepatomegaly with the liver edge palpable 2 cm below the right costal margin',
      'No skin rash or skin infiltration'
    ],
    labs:{ wbc:'very_high', hgb:'low', plt:'normal' },
    keyLabs:['wbc'],
    extraLabs: () => ({
      smear:'Numerous mature small lymphocytes with SMUDGE cells; minimal atypia',
      flow:'Monoclonal CD5+ / CD19+ / CD20-dim / CD23+ B-cell population with kappa light-chain restriction',
      cytogenetics: rand(['del(13q) — most common in CLL, favorable','Trisomy 12 — intermediate','del(11q) involving ATM — adverse','del(17p) involving TP53 — adverse, may resist standard therapy']),
      smudge:'Numerous smudge cells present'
    }),
    extraNormals:{ smear:'normal lymphocyte morphology, occasional reactive forms', flow:'polyclonal mature B-cell population', cytogenetics:'46,XY or 46,XX', smudge:'few or no smudge cells' },
    differential:'hcl',
    clue:'OLDER ADULT (>60 yr) with INCIDENTAL lymphocytosis on a routine CBC + painless adenopathy + SMUDGE cells on smear → CLL. Monoclonal mature CD5+ CD19+ CD20-dim CD23+ B cells (uniquely CD5+ B-cell neoplasm along with mantle-cell lymphoma — but CLL is CD23+, mantle CD23-). Complications: HYPOGAMMAGLOBULINEMIA → encapsulated infections; warm AIHA / ITP; RICHTER TRANSFORMATION to DLBCL. Step-1 differential: hairy-cell leukemia — TRAP+, BRAF V600E, dry tap, massive splenomegaly without prominent adenopathy.'
  },

  // -------------------------- Hairy Cell Leukemia --------------------------
  {
    id:'hcl', name:'Hairy Cell Leukemia', short:'Hairy Cell', category:'Chronic Lymphoid Neoplasm',
    sex:'M', ageMin:48, ageMax:72,
    pmhPool: ADULT_PMH, shxPool: ADULT_SHX,
    defect:'Clonal mature B-cell neoplasm driven by the acquired BRAF V600E somatic mutation (present in >95% of cases), with a characteristic CD11c+, CD25+, CD103+, CD123+ immunophenotype and tartrate-resistant acid phosphatase (TRAP) positivity',
    inheritance:'Acquired somatic mutation in a clonal mature B-cell population (not inherited); strong male predominance (M:F ≈ 4:1), median age in the sixth decade',
    mechanism:'BRAF V600E activation of the MAPK pathway → clonal proliferation of mature B cells with characteristic hair-like cytoplasmic projections that infiltrate the bone marrow and the red pulp of the spleen. Marrow reticulin fibrosis produces a "dry tap" on aspiration. The infiltrate suppresses normal hematopoiesis → pancytopenia. Treatment with the purine-analog cladribine (2-CdA) produces durable remissions in the majority of patients.',
    diagnosticTest:'Bone-marrow biopsy (aspirate is often a "dry tap") showing tartrate-resistant acid phosphatase (TRAP)-positive lymphocytes with "fried-egg" cytologic appearance and reticulin fibrosis; flow cytometry confirming CD11c+ / CD25+ / CD103+ / CD123+ phenotype; BRAF V600E mutation testing',
    keyOrganism:'',
    organismOptions:[],
    keyComplication:'Pancytopenia-related complications — recurrent bacterial and atypical mycobacterial infections, fatigue from anemia, and bleeding from thrombocytopenia — driven by marrow infiltration and fibrosis rather than by typical "marrow failure"',
    complicationOptions:[
      'Pancytopenia with susceptibility to recurrent and atypical-mycobacterial infections from marrow infiltration and reticulin fibrosis',
      'Richter transformation to diffuse large B-cell lymphoma',
      'Aquagenic pruritus and erythromelalgia from JAK2-V617F driven erythrocytosis',
      'Hyperviscosity syndrome from a circulating monoclonal IgM paraprotein',
      'Disseminated intravascular coagulation from t(15;17) PML-RARA-driven acute promyelocytic leukemia'
    ],
    cc: () => rand([
      'middle-aged man with progressive fatigue, left-upper-quadrant fullness, and an incidental CBC showing pancytopenia',
      'middle-aged man with recurrent infections and abdominal distension, found to have splenomegaly on examination',
      'middle-aged man with fatigue, easy bruising, and a routine CBC demonstrating pancytopenia',
      'middle-aged man with several months of left-upper-quadrant discomfort and a single episode of an atypical mycobacterial pulmonary infection'
    ]),
    pathognomonic:[
      'Peripheral smear demonstrates small mononuclear cells with fine "hairy" cytoplasmic projections',
      'Cytochemistry on peripheral blood is positive for tartrate-resistant acid phosphatase (TRAP)',
      'Attempted bone-marrow aspiration produces a "dry tap" due to extensive reticulin fibrosis; the trephine biopsy shows lymphocytes with the characteristic "fried-egg" appearance',
      'Molecular testing on bone marrow is positive for the BRAF V600E mutation'
    ],
    classic:[
      'Massive splenomegaly with the spleen palpable 10 cm below the left costal margin and crossing the midline',
      'CBC reveals pancytopenia: white-blood-cell count 1.8 ×10³/μL with absolute monocytopenia, hemoglobin 9.4 g/dL, platelets 68 ×10³/μL',
      'Flow cytometry on peripheral blood and bone marrow identifies a clonal B-cell population co-expressing CD11c, CD25, CD103, and CD123',
      'Several months of low-grade fevers, fatigue, and weight loss of 4 kg'
    ],
    supportive:[
      'No prior chemotherapy, radiation, or known exposures',
      'No prominent peripheral lymphadenopathy',
      'No family history of hematologic malignancy'
    ],
    pe_pathognomonic:[
      'Massive splenomegaly with the spleen palpable 10 cm below the left costal margin, crossing the midline — without prominent peripheral lymphadenopathy'
    ],
    pe_classic:[
      'Pale conjunctivae and palms',
      'Mild hepatomegaly with the liver edge palpable 2 cm below the right costal margin',
      'Scattered ecchymoses over the forearms and shins'
    ],
    pe_supportive:[
      'Temperature 38.0 °C, otherwise normal vital signs',
      'No prominent cervical, axillary, or inguinal lymphadenopathy'
    ],
    labs:{ wbc:'low', hgb:'low', plt:'low' },
    keyLabs:['wbc','plt','hgb'],
    extraLabs: () => ({
      smear:'Small mononuclear cells with fine cytoplasmic ("hairy") projections; absolute monocytopenia',
      trap:'POSITIVE — tartrate-resistant acid phosphatase staining',
      flow:'CD11c+ / CD25+ / CD103+ / CD123+ clonal mature B-cell population',
      braf:'POSITIVE for BRAF V600E mutation',
      bmbx:'"Dry tap" on aspiration; trephine biopsy shows "fried-egg" lymphocytes with reticulin fibrosis'
    }),
    extraNormals:{ smear:'normal lymphocyte morphology', trap:'negative', flow:'polyclonal mature B-cell population', braf:'no BRAF mutation', bmbx:'normocellular marrow with adequate aspirate' },
    differential:'cll',
    clue:'Middle-aged MAN with PANCYTOPENIA + MASSIVE splenomegaly WITHOUT prominent peripheral lymphadenopathy + "HAIRY" cells on smear + TRAP-positive + DRY TAP on marrow → hairy-cell leukemia. Driver: BRAF V600E. Flow: CD11c+ CD25+ CD103+ CD123+. Treatment: CLADRIBINE (2-CdA) produces durable remissions. Step-1 differential: CLL — older patients with prominent painless lymphadenopathy + smudge cells, CD5+/CD23+ phenotype, no hairy projections.'
  },

  // -------------------------- Burkitt Lymphoma --------------------------
  {
    id:'burkitt', name:'Burkitt Lymphoma', short:'Burkitt', category:'Aggressive Non-Hodgkin Lymphoma',
    sex:'any', ageMin:5, ageMax:25,
    pmhPool: CHILD_HEALTHY_PMH, shxPool: CHILD_HEALTHY_SHX,
    defect:'t(8;14)(q24;q32) translocation placing the MYC proto-oncogene on chromosome 8 under the control of the IgH enhancer on chromosome 14 → constitutive MYC overexpression and an extremely high proliferation index (Ki-67 approaching 100%). Variant translocations involve the kappa- and lambda-light-chain loci: t(2;8) and t(8;22).',
    inheritance:'Acquired somatic translocation; the endemic (African) form is strongly associated with Epstein-Barr virus and chronic Plasmodium falciparum malaria, the immunodeficient form arises in the setting of HIV infection, and the sporadic form (most common in the United States and Western Europe) is not virally associated',
    mechanism:'IgH-driven MYC overexpression unleashes uncontrolled cell-cycle entry and proliferation. The endemic African form classically presents as a JAW (mandibular or maxillary) MASS in a young child; the sporadic form typically presents as an ABDOMINAL MASS in the ileocecal region; the immunodeficient form (HIV-associated) commonly involves lymph nodes and the central nervous system. Histology shows a diffuse infiltrate of medium-sized lymphocytes with a "STARRY-SKY" appearance — pale-staining tingible-body macrophages scattered among sheets of dark malignant lymphocytes.',
    diagnosticTest:'Excisional biopsy showing a "starry-sky" pattern with sheets of medium-sized lymphocytes; FISH or cytogenetics demonstrating t(8;14) MYC-IgH (or variant t(2;8) / t(8;22)); Ki-67 proliferation index approaching 100%; CD20+, CD10+, BCL6+, BCL2-negative immunophenotype',
    keyOrganism:'Epstein-Barr virus',
    organismOptions:['Epstein-Barr virus','Human T-lymphotropic virus type 1 (HTLV-1)','Human herpesvirus 8 (HHV-8 / KSHV)','Helicobacter pylori','Plasmodium falciparum'],
    keyComplication:'Tumor lysis syndrome — Burkitt lymphoma is the prototypical malignancy associated with tumor lysis syndrome (and may present with spontaneous tumor lysis even before any chemotherapy), driven by an extraordinarily high tumor proliferation rate',
    complicationOptions:[
      'Tumor lysis syndrome with hyperuricemia, hyperkalemia, hyperphosphatemia, and secondary hypocalcemia — Burkitt is the prototypical lymphoma associated with this complication',
      'Richter transformation to diffuse large B-cell lymphoma',
      'Aquagenic pruritus and erythromelalgia from JAK2-V617F driven erythrocytosis',
      'Hyperviscosity syndrome from a circulating monoclonal IgM paraprotein',
      'Disseminated intravascular coagulation from t(15;17) PML-RARA-driven acute promyelocytic leukemia'
    ],
    cc: () => rand([
      'school-age child of African descent with a rapidly enlarging painless jaw mass over the past three weeks',
      'school-age child with two weeks of progressive abdominal pain, distension, and a palpable right-lower-quadrant mass',
      'adolescent with HIV with new bulky cervical lymphadenopathy and B symptoms',
      'school-age child with intussusception found on operative reduction to have a mass at the ileocecal junction'
    ]),
    pathognomonic:[
      'Excisional biopsy demonstrates a diffuse infiltrate of medium-sized lymphocytes with a characteristic "STARRY-SKY" appearance produced by interspersed pale-staining tingible-body macrophages',
      'FISH on the lymph-node biopsy demonstrates t(8;14)(q24;q32) with rearrangement of the MYC locus',
      'Ki-67 proliferation index on the lymph-node biopsy approaches 100%, the highest proliferation rate of any human tumor',
      'Immunohistochemistry on the biopsy shows CD20+, CD10+, BCL6+, BCL2-negative neoplastic B cells, consistent with Burkitt lymphoma'
    ],
    classic:[
      'Rapidly enlarging mass that has approximately doubled in size over the past two to three weeks',
      'Serum lactate dehydrogenase and uric acid are markedly elevated, raising concern for spontaneous tumor lysis',
      'Drenching night sweats and an unintentional weight loss of 4 kg over the past month',
      'CT of the abdomen demonstrates a large ileocecal mass in the sporadic form, or imaging of the head demonstrates a destructive mandibular mass in the endemic form'
    ],
    supportive:[
      'Patient or family is from an Epstein-Barr-virus-endemic and malaria-endemic region of equatorial Africa (endemic Burkitt)',
      'Known HIV infection with poor adherence to antiretroviral therapy (immunodeficient form)',
      'No prior chemotherapy or radiation exposure'
    ],
    pe_pathognomonic:[
      'Large, firm, painless mandibular mass with displacement of the dentition (the classic endemic-Burkitt presentation)',
      'Large, firm right-lower-quadrant abdominal mass with palpable extension into the ileocecal region (the classic sporadic-Burkitt presentation)'
    ],
    pe_classic:[
      'Diffuse bulky cervical lymphadenopathy with rapidly enlarging, non-tender, firm nodes',
      'Hepatosplenomegaly with the spleen tip palpable 5 cm below the left costal margin',
      'Pallor of the conjunctivae'
    ],
    pe_supportive:[
      'Temperature 38.1 °C',
      'No bleeding or petechiae on skin examination'
    ],
    labs:{ wbc:'normal', hgb:'low', plt:'normal' },
    keyLabs:[],
    extraLabs: () => ({
      histology:'Diffuse sheets of medium-sized lymphocytes with a "starry-sky" pattern of interspersed tingible-body macrophages',
      cytogenetics:'t(8;14)(q24;q32) MYC-IgH rearrangement on FISH',
      ki67:'~100% Ki-67 proliferation index',
      cd_panel:'CD20+, CD10+, BCL6+, BCL2-negative; MYC-positive by IHC',
      ldh:randInt(900, 3200),
      uricacid:randFloat(9.0, 16.0, 1)
    }),
    extraNormals:{ histology:'reactive lymphoid hyperplasia with preserved nodal architecture', cytogenetics:'no MYC rearrangement', ki67:'low (<10%) in reactive nodes', cd_panel:'polyclonal mature B cells', ldh:'140–280 U/L', uricacid:'3.5–7.2 mg/dL' },
    differential:'dlbcl',
    clue:'Child / young adult with a RAPIDLY enlarging mass — JAW (endemic, EBV+, African) or ABDOMEN/ileocecal (sporadic, US/Europe) — + STARRY-SKY histology + t(8;14) MYC-IgH + Ki-67 ~100% → Burkitt lymphoma. Prototypical TUMOR LYSIS SYNDROME risk (may even occur spontaneously before chemo). BCL2-negative (vs follicular and DLBCL which are often BCL2+). Step-1 differential: DLBCL — older adults, may have double-hit MYC+BCL2 (worse prognosis) but lacks pure starry-sky and Ki-67 ~100%.'
  },

  // -------------------------- Hodgkin Lymphoma --------------------------
  {
    id:'hodgkin', name:'Hodgkin Lymphoma (Classical)', short:'Hodgkin', category:'Hodgkin Lymphoma',
    sex:'any', ageMin:18, ageMax:38,
    pmhPool: YOUNG_ADULT_PMH, shxPool: YOUNG_ADULT_SHX,
    defect:'Neoplastic Reed-Sternberg cells — large multinucleated B-lineage cells with prominent "owl-eye" nucleoli — embedded in a reactive inflammatory background of lymphocytes, eosinophils, plasma cells, and histiocytes. Reed-Sternberg cells are characteristically CD15+, CD30+, CD45-negative, and CD20-negative (in the classical form). Strong association with Epstein-Barr virus, particularly in the mixed-cellularity subtype.',
    inheritance:'Acquired clonal expansion of B-lineage Reed-Sternberg cells, with frequent prior Epstein-Barr virus infection (especially mixed-cellularity subtype). Bimodal age distribution: peak in young adults (15–35 yr, most often nodular-sclerosing subtype) and a second peak after age 55.',
    mechanism:'A clonal Reed-Sternberg cell — derived from a germinal-center B cell that has lost most B-cell surface markers — drives recruitment of a large reactive infiltrate through cytokines (IL-5, IL-13). The lymphoma SPREADS BY CONTIGUITY along the lymphatic chains (unlike non-Hodgkin lymphoma, which classically spreads non-contiguously). The most common subtype, nodular sclerosing, characteristically presents as a mediastinal mass in a young woman; mixed cellularity is the subtype most strongly associated with EBV; lymphocyte-rich has the best prognosis and lymphocyte-depleted has the worst.',
    diagnosticTest:'Excisional lymph-node biopsy demonstrating Reed-Sternberg cells (large, bi- or multi-nucleated cells with prominent eosinophilic "owl-eye" nucleoli) with a CD15+ / CD30+ / CD45- / CD20- immunophenotype on immunohistochemistry, set in a characteristic reactive inflammatory background',
    keyOrganism:'Epstein-Barr virus',
    organismOptions:['Epstein-Barr virus','Human T-lymphotropic virus type 1 (HTLV-1)','Human herpesvirus 8 (HHV-8 / KSHV)','Helicobacter pylori'],
    keyComplication:'B symptoms — fever, drenching night sweats, and unintentional weight loss of more than 10% of body weight — are part of the Ann Arbor staging system and confer worse prognosis. Pel-Ebstein fever, a classic cyclical fever pattern, is described in Hodgkin lymphoma.',
    complicationOptions:[
      'B symptoms (fever, drenching night sweats, ≥10% weight loss) — part of Ann Arbor staging and associated with worse prognosis',
      'Tumor lysis syndrome with hyperuricemia and acute kidney injury — characteristic of Burkitt lymphoma, not classical Hodgkin',
      'Aquagenic pruritus and erythromelalgia from JAK2-V617F driven erythrocytosis',
      'Hyperviscosity syndrome from a circulating monoclonal IgM paraprotein',
      'Disseminated intravascular coagulation from t(15;17) PML-RARA-driven acute promyelocytic leukemia'
    ],
    cc: () => rand([
      'young adult with a painless supraclavicular mass first noted while shaving',
      'young adult woman with a chest radiograph showing a bulky anterior mediastinal mass and several weeks of dry cough',
      'young adult with two months of intermittent fevers, drenching night sweats, and 6-kg weight loss',
      'young adult with intractable pruritus, drenching night sweats, and a single firm cervical lymph node',
      'young adult who reports unusual pain in a cervical lymph node minutes after drinking a glass of wine'
    ]),
    pathognomonic:[
      'Excisional lymph-node biopsy demonstrates large bi- or multi-nucleated cells with prominent eosinophilic "OWL-EYE" nucleoli (Reed-Sternberg cells) embedded in a reactive infiltrate of lymphocytes, eosinophils, and plasma cells',
      'Immunohistochemistry on the lymph-node biopsy shows Reed-Sternberg cells that are CD15-positive, CD30-positive, CD45-negative, and CD20-negative (classical Hodgkin lymphoma phenotype)',
      'The patient reports a striking history of severe pain in the affected cervical lymph node within minutes of consuming alcohol (a rare but classic finding in Hodgkin lymphoma)',
      'Chest CT in a young woman demonstrates a bulky anterior mediastinal mass with broad fibrous bands compartmentalizing nodules of lymphoid tissue (nodular-sclerosing histology)'
    ],
    classic:[
      'Painless, rubbery, mobile cervical or supraclavicular lymphadenopathy that has been slowly enlarging over the past two months',
      'Two months of intermittent fevers, drenching night sweats requiring a change of bedclothes, and unintentional weight loss of 6 kg',
      'Generalized pruritus without an obvious dermatologic cause',
      'Mediastinal widening on a chest radiograph in an otherwise well-appearing young woman, ultimately attributed to a bulky mediastinal mass'
    ],
    supportive:[
      'History of confirmed Epstein-Barr virus infectious mononucleosis in adolescence',
      'Otherwise well-appearing with no chronic medical conditions',
      'No family history of hematologic malignancy'
    ],
    pe_pathognomonic:[
      'Localized, painless, rubbery, mobile lymphadenopathy in the cervical or supraclavicular chain that has been slowly enlarging over weeks to months in an otherwise well-appearing young adult',
      'Marked pain in the affected lymph node within minutes of consuming alcohol — an uncommon but classic finding (positive predictive value for Hodgkin lymphoma)'
    ],
    pe_classic:[
      'Bulky mediastinal mass detectable on percussion and chest radiography in a young patient',
      'Diffuse non-specific excoriations from chronic pruritus',
      'Pel-Ebstein fever pattern with several days of fever alternating with several days of being afebrile'
    ],
    pe_supportive:[
      'Splenomegaly with the spleen tip palpable 3 cm below the left costal margin in advanced disease',
      'Otherwise unremarkable physical examination'
    ],
    labs:{ wbc:'high', hgb:'low', plt:'normal' },
    keyLabs:[],
    extraLabs: () => ({
      rs_cells:'Reed-Sternberg cells identified on lymph-node biopsy',
      cd_panel:'Reed-Sternberg cells CD15+ / CD30+ / CD45- / CD20- (classical Hodgkin phenotype)',
      histology: rand(['Nodular-sclerosing classical Hodgkin lymphoma (most common subtype; young adults, mediastinal mass)','Mixed-cellularity classical Hodgkin lymphoma (strongest EBV association)','Lymphocyte-rich classical Hodgkin lymphoma (best prognosis)','Lymphocyte-depleted classical Hodgkin lymphoma (worst prognosis)']),
      ldh:randInt(280, 850)
    }),
    extraNormals:{ rs_cells:'no Reed-Sternberg cells; reactive lymphoid hyperplasia', cd_panel:'polyclonal mature B and T cells', histology:'reactive lymphoid hyperplasia', ldh:'140–280 U/L' },
    differential:'dlbcl',
    clue:'Young adult (15–35) with PAINLESS cervical/supraclavicular adenopathy + B symptoms (fever, night sweats, weight loss) + PRURITUS + occasional alcohol-induced node pain → Hodgkin lymphoma. Diagnostic: REED-STERNBERG cells (CD15+ CD30+, CD45-/CD20-, "OWL EYES"). Spreads CONTIGUOUSLY along lymphatics (vs NHL = non-contiguous). Subtypes: nodular sclerosing (most common, young women, mediastinal), mixed cellularity (strongest EBV), lymphocyte-rich (best prognosis), lymphocyte-depleted (worst). Step-1 differential: DLBCL — older adults, sheets of large CD20+ B cells without RS cells.'
  },

  // -------------------------- DLBCL --------------------------
  {
    id:'dlbcl', name:'Diffuse Large B-Cell Lymphoma (DLBCL)', short:'DLBCL', category:'Aggressive Non-Hodgkin Lymphoma',
    sex:'any', ageMin:55, ageMax:80,
    pmhPool: ELDERLY_PMH, shxPool: ELDERLY_SHX,
    defect:'Heterogeneous group of aggressive mature B-cell lymphomas composed of sheets of large CD20-positive B cells; recurrent molecular events include BCL6 rearrangements (germinal-center B-cell type), and a subset has concurrent MYC and BCL2 rearrangements ("double-hit" lymphoma) which confers worse prognosis',
    inheritance:'Acquired somatic mutation in a clonal mature B-cell population (not inherited). May arise de novo or by transformation from an underlying indolent lymphoma (e.g., follicular lymphoma, CLL — "Richter transformation"). Most common non-Hodgkin lymphoma in adults.',
    mechanism:'Clonal proliferation of large transformed B cells that aggressively infiltrate nodal and extranodal sites. The aggressive behavior is balanced by curability with combined chemoimmunotherapy: R-CHOP (rituximab, cyclophosphamide, doxorubicin, vincristine, prednisone). "Double-hit" cases with concurrent MYC and BCL2 rearrangements behave more aggressively and have worse prognosis with standard therapy.',
    diagnosticTest:'Excisional lymph-node (or extranodal site) biopsy demonstrating sheets of large CD20-positive B cells effacing nodal architecture; FISH for MYC, BCL2, and BCL6 rearrangements to identify "double-hit" cases',
    keyOrganism:'',
    organismOptions:['Epstein-Barr virus','Human T-lymphotropic virus type 1 (HTLV-1)','Human herpesvirus 8 (HHV-8 / KSHV)','Helicobacter pylori'],
    keyComplication:'Transformation from an indolent lymphoma — most often Richter transformation of chronic lymphocytic leukemia (CLL) or histologic transformation of follicular lymphoma — manifesting as rapidly enlarging adenopathy, B symptoms, and a rising serum LDH',
    complicationOptions:[
      'Transformation from an indolent lymphoma (e.g., Richter transformation of CLL or histologic transformation of follicular lymphoma) signaled by rapidly enlarging adenopathy and rising LDH',
      'Tumor lysis syndrome at the initiation of chemotherapy, particularly in bulky or "double-hit" disease',
      'Aquagenic pruritus and erythromelalgia from JAK2-V617F driven erythrocytosis',
      'Hyperviscosity syndrome from a circulating monoclonal IgM paraprotein',
      'Disseminated intravascular coagulation from t(15;17) PML-RARA-driven acute promyelocytic leukemia'
    ],
    cc: () => rand([
      'older adult with a rapidly enlarging painless cervical mass over the past four weeks',
      'older adult with several weeks of progressive abdominal pain and a large palpable mass',
      'older adult with longstanding CLL who is now experiencing rapidly enlarging adenopathy, drenching night sweats, and an LDH that has risen from normal to three times the upper limit',
      'older adult with a rapidly enlarging bulky mediastinal mass and B symptoms'
    ]),
    pathognomonic:[
      'Excisional lymph-node biopsy demonstrates SHEETS of LARGE atypical B cells effacing the underlying nodal architecture, with high mitotic activity but without the "starry-sky" pattern of Burkitt lymphoma',
      'FISH on the lymph-node biopsy demonstrates rearrangements of BOTH MYC AND BCL2 — a "DOUBLE-HIT" lymphoma — conferring worse prognosis with standard therapy',
      'Immunohistochemistry shows large neoplastic B cells that are CD20-positive, CD45-positive, and lack Reed-Sternberg cells (distinguishing DLBCL from Hodgkin lymphoma)'
    ],
    classic:[
      'A rapidly enlarging, firm, painless mass that has approximately doubled in size over the past four weeks',
      'B symptoms: drenching night sweats, intermittent fevers, and unintentional weight loss of 5 kg over six weeks',
      'Serum lactate dehydrogenase is markedly elevated at 920 U/L (normal 140–280)',
      'CT of the chest, abdomen, and pelvis demonstrates bulky lymphadenopathy with extranodal involvement of the spleen'
    ],
    supportive:[
      'Pre-existing chronic lymphocytic leukemia with stable lymphocytosis until the recent change (suggesting Richter transformation)',
      'No prior cytotoxic chemotherapy or radiation exposure',
      'No family history of hematologic malignancy'
    ],
    pe_pathognomonic:[
      'A rapidly enlarging firm, fixed lymph-node mass with overlying skin erythema and partial fixation to underlying tissues — an aggressive lymphoma until proven otherwise',
      'Sudden development of a fixed nodal mass in a patient with previously stable chronic lymphocytic leukemia, raising concern for Richter transformation'
    ],
    pe_classic:[
      'Bulky cervical, supraclavicular, or axillary lymphadenopathy with rapidly enlarging, non-tender, firm nodes',
      'Hepatosplenomegaly with the spleen tip palpable 4 cm below the left costal margin',
      'Pallor of the conjunctivae'
    ],
    pe_supportive:[
      'Temperature 38.2 °C with tachycardia at 104 bpm',
      'No oral mucosal bleeding or petechiae'
    ],
    labs:{ wbc:'high', hgb:'low', plt:'normal' },
    keyLabs:[],
    extraLabs: () => ({
      histology:'Diffuse sheets of large atypical B cells effacing nodal architecture; no starry-sky pattern, no Reed-Sternberg cells',
      cd_panel:'CD20+, CD45+ large B-cell phenotype; CD15-, CD30-negative (excluding classical Hodgkin)',
      cytogenetics: rand(['BCL6 rearrangement (germinal-center type)','BCL2 rearrangement','Concurrent MYC and BCL2 rearrangements — "double-hit" lymphoma (worse prognosis)','No recurrent translocation identified']),
      ldh:randInt(450, 1400)
    }),
    extraNormals:{ histology:'reactive lymphoid hyperplasia with preserved nodal architecture', cd_panel:'polyclonal mature B and T cells', cytogenetics:'no recurrent rearrangement', ldh:'140–280 U/L' },
    differential:'burkitt',
    clue:'Older adult with a RAPIDLY enlarging mass + sheets of LARGE CD20+ B cells on biopsy + elevated LDH → DLBCL. MOST COMMON non-Hodgkin lymphoma in adults. May arise de novo or by transformation (Richter from CLL, histologic transformation from follicular). "DOUBLE-HIT" cases (MYC + BCL2) behave aggressively. Treatment: R-CHOP — often CURATIVE. Step-1 differential: Burkitt — younger patients, JAW or ABDOMINAL mass, STARRY-SKY histology, t(8;14) MYC, Ki-67 ~100%, BCL2-negative.'
  },

  // -------------------------- Follicular Lymphoma --------------------------
  {
    id:'follicular', name:'Follicular Lymphoma', short:'Follicular', category:'Indolent Non-Hodgkin Lymphoma',
    sex:'any', ageMin:50, ageMax:72,
    pmhPool: ADULT_PMH, shxPool: ADULT_SHX,
    defect:'t(14;18)(q32;q21) translocation juxtaposing the BCL2 gene on chromosome 18 with the IgH enhancer on chromosome 14 → constitutive BCL2 overexpression → impaired apoptosis of germinal-center B cells → indolent clonal expansion',
    inheritance:'Acquired somatic translocation (not inherited). Second-most common non-Hodgkin lymphoma in adults after diffuse large B-cell lymphoma; characteristically indolent, with relapsing-remitting clinical course over many years.',
    mechanism:'BCL2 overexpression blocks the mitochondrial (intrinsic) apoptotic pathway → germinal-center B cells that should normally die instead accumulate. The neoplastic cells retain the follicular architecture of normal germinal centers but the follicles lack the normal polarization (no clear light and dark zones, no tingible-body macrophages). Disease behaves indolently and is often managed with watch-and-wait or rituximab-based therapy in early stages, but it is generally INCURABLE. A subset transform histologically to diffuse large B-cell lymphoma, with rapidly enlarging adenopathy, B symptoms, and a rising LDH.',
    diagnosticTest:'Excisional lymph-node biopsy demonstrating a follicular growth pattern of CD10+ / BCL6+ / BCL2+ germinal-center B cells; FISH or PCR for t(14;18) IgH-BCL2 rearrangement',
    keyOrganism:'',
    organismOptions:[],
    keyComplication:'Histologic transformation to a more aggressive diffuse large B-cell lymphoma, signaled by rapidly enlarging adenopathy, new B symptoms, and a rising serum LDH; occurs in approximately 2–3% of patients per year',
    complicationOptions:[
      'Histologic transformation to diffuse large B-cell lymphoma, signaled by rapidly enlarging adenopathy and a rising LDH',
      'Tumor lysis syndrome at the initiation of cytotoxic chemotherapy',
      'Aquagenic pruritus and erythromelalgia from JAK2-V617F driven erythrocytosis',
      'Hyperviscosity syndrome from a circulating monoclonal IgM paraprotein',
      'Disseminated intravascular coagulation from t(15;17) PML-RARA-driven acute promyelocytic leukemia'
    ],
    cc: () => rand([
      'middle-aged adult with painless lymphadenopathy that has waxed and waned in size over the past two years',
      'middle-aged adult with new bulky adenopathy noticed at a routine physical examination, otherwise asymptomatic',
      'middle-aged adult with an incidental finding of mediastinal lymphadenopathy on a chest CT performed for a different indication',
      'middle-aged adult with chronic indolent lymphadenopathy whose recent imaging shows rapid enlargement of one nodal group, raising concern for transformation'
    ]),
    pathognomonic:[
      'Excisional lymph-node biopsy demonstrates a follicular growth pattern of monomorphic small to medium B cells without the normal polarization (no dark/light zones) and without tingible-body macrophages',
      'FISH on the lymph-node biopsy identifies t(14;18)(q32;q21) IgH-BCL2 rearrangement',
      'Immunohistochemistry on the biopsy shows CD20+, CD10+, BCL6+, and BCL2-POSITIVE neoplastic follicles (normal reactive follicles are BCL2-NEGATIVE)'
    ],
    classic:[
      'Painless, slow-growing lymphadenopathy that has been present for one to two years, characteristically WAXING AND WANING in size',
      'Absence of B symptoms — no fevers, no drenching night sweats, no significant weight loss',
      'Bone-marrow biopsy demonstrates paratrabecular lymphoid aggregates with the same clonal population (about 50% of patients have marrow involvement at diagnosis)'
    ],
    supportive:[
      'No prior chemotherapy, radiation, or known exposures',
      'Otherwise well-appearing on physical examination apart from the lymphadenopathy',
      'No family history of hematologic malignancy'
    ],
    pe_pathognomonic:[
      'Painless, slow-growing lymphadenopathy with multiple nodal groups involved and historical fluctuation in node size (waxing and waning over months in an otherwise well-appearing adult)'
    ],
    pe_classic:[
      'Diffuse, painless, rubbery, mobile lymphadenopathy in cervical, axillary, and inguinal chains',
      'Mild splenomegaly with the spleen tip palpable 3 cm below the left costal margin'
    ],
    pe_supportive:[
      'No fevers or night sweats on review of systems',
      'No oral mucosal lesions or petechiae'
    ],
    labs:{ wbc:'normal', hgb:'normal', plt:'normal' },
    keyLabs:[],
    extraLabs: () => ({
      histology:'Follicular growth pattern with monomorphic B cells; no polarization, no tingible-body macrophages',
      cytogenetics:'t(14;18)(q32;q21) — IgH-BCL2 rearrangement',
      cd_panel:'CD20+, CD10+, BCL6+, BCL2+ (BCL2+ in neoplastic follicles is the key feature; reactive follicles are BCL2-negative)',
      ldh:randInt(180, 380)
    }),
    extraNormals:{ histology:'reactive follicular hyperplasia with preserved polarization', cytogenetics:'no IgH-BCL2 rearrangement', cd_panel:'CD20+ B cells in follicles with BCL2-negative germinal centers', ldh:'140–280 U/L' },
    differential:'mantle',
    clue:'Adult with INDOLENT, painless, WAXING-AND-WANING lymphadenopathy over months to years + follicular growth pattern + BCL2+ neoplastic follicles → follicular lymphoma. Driver: t(14;18) IgH-BCL2 → impaired apoptosis. 2nd most common NHL. INCURABLE but indolent (often watch-and-wait). Histologic TRANSFORMATION to DLBCL is the feared complication. Step-1 differential: mantle-cell lymphoma — older men, MORE aggressive, t(11;14) cyclin D1+, CD5+ CD23- (vs CLL which is CD5+ CD23+).'
  },

  // -------------------------- Mantle Cell Lymphoma --------------------------
  {
    id:'mantle', name:'Mantle Cell Lymphoma', short:'Mantle Cell', category:'Aggressive Non-Hodgkin Lymphoma',
    sex:'M', ageMin:55, ageMax:75,
    pmhPool: ADULT_PMH, shxPool: ADULT_SHX,
    defect:'t(11;14)(q13;q32) translocation juxtaposing the CCND1 gene (encoding cyclin D1) on chromosome 11 with the IgH enhancer on chromosome 14 → constitutive cyclin D1 overexpression → unregulated G1→S cell-cycle progression',
    inheritance:'Acquired somatic translocation (not inherited). Strong male predominance and median age in the sixth or seventh decade.',
    mechanism:'Cyclin D1 overexpression drives unregulated cell-cycle entry of mature B cells from the mantle zone of lymphoid follicles. The neoplastic B cells co-express CD5 (like CLL) but are CD23-NEGATIVE (unlike CLL), and are positive for cyclin D1 (CCND1) by immunohistochemistry. Mantle-cell lymphoma is more aggressive than other indolent B-cell lymphomas and has a particular predilection for GI tract involvement (lymphomatous polyposis).',
    diagnosticTest:'Excisional lymph-node biopsy demonstrating a clonal CD5+ / CD20+ / CD23-negative mature B-cell population with NUCLEAR CYCLIN D1 positivity by immunohistochemistry; FISH for t(11;14) IgH-CCND1',
    keyOrganism:'',
    organismOptions:[],
    keyComplication:'Lymphomatous polyposis — extensive infiltration of the gastrointestinal tract by lymphoma producing multiple polypoid lesions, which may bleed or cause obstruction',
    complicationOptions:[
      'Lymphomatous polyposis with extensive gastrointestinal infiltration producing multiple polypoid lesions',
      'Tumor lysis syndrome at the initiation of cytotoxic chemotherapy',
      'Aquagenic pruritus and erythromelalgia from JAK2-V617F driven erythrocytosis',
      'Hyperviscosity syndrome from a circulating monoclonal IgM paraprotein',
      'Disseminated intravascular coagulation from t(15;17) PML-RARA-driven acute promyelocytic leukemia'
    ],
    cc: () => rand([
      'older man with diffuse painless lymphadenopathy and several months of fatigue',
      'older man with a routine colonoscopy demonstrating multiple polypoid lesions throughout the colon, biopsied as lymphoma',
      'older man with bulky lymphadenopathy, splenomegaly, and a peripheral lymphocytosis on CBC',
      'older man with B symptoms and rapidly enlarging cervical adenopathy'
    ]),
    pathognomonic:[
      'Immunohistochemistry on the lymph-node biopsy demonstrates strong NUCLEAR CYCLIN D1 positivity in the neoplastic B cells',
      'FISH on the lymph-node biopsy identifies t(11;14)(q13;q32) — IgH-CCND1 rearrangement',
      'Colonoscopy demonstrates multiple polypoid lesions throughout the colon ("lymphomatous polyposis"); biopsies show infiltration by clonal cyclin D1-positive B cells'
    ],
    classic:[
      'Diffuse, painless lymphadenopathy involving cervical, axillary, and inguinal chains',
      'Bulky splenomegaly with the spleen palpable 6 cm below the left costal margin',
      'Drenching night sweats and an unintentional weight loss of 5 kg',
      'Bone-marrow biopsy demonstrates infiltration by the clonal B-cell population',
      'Flow cytometry shows a clonal mature B-cell population that is CD5-POSITIVE and CD23-NEGATIVE — the opposite of the CLL profile'
    ],
    supportive:[
      'No prior cytotoxic chemotherapy or radiation exposure',
      'No family history of hematologic malignancy',
      'Recent screening colonoscopy was deferred but now strongly indicated'
    ],
    pe_pathognomonic:[
      'Diffuse lymphadenopathy plus colonoscopic evidence of multiple polypoid colonic lesions in an older man (the lymphomatous-polyposis phenotype of mantle-cell lymphoma)'
    ],
    pe_classic:[
      'Diffuse non-tender lymphadenopathy in cervical, axillary, and inguinal chains',
      'Bulky splenomegaly with the spleen palpable well below the left costal margin',
      'Pallor of the conjunctivae'
    ],
    pe_supportive:[
      'Temperature 38.1 °C with mild tachycardia',
      'Mild hepatomegaly with the liver edge palpable 3 cm below the right costal margin'
    ],
    labs:{ wbc:'high', hgb:'low', plt:'normal' },
    keyLabs:[],
    extraLabs: () => ({
      histology:'Diffuse or vaguely nodular infiltrate of small-to-medium B cells effacing nodal architecture',
      cd_panel:'CD5+ / CD20+ / CD23-NEGATIVE / cyclin D1+ mature B-cell phenotype',
      cytogenetics:'t(11;14)(q13;q32) — IgH-CCND1 rearrangement',
      ldh:randInt(280, 720)
    }),
    extraNormals:{ histology:'reactive lymphoid hyperplasia', cd_panel:'polyclonal mature B cells with CD5-negative B cells and CD23+ B cells', cytogenetics:'no IgH-CCND1 rearrangement', ldh:'140–280 U/L' },
    differential:'cll',
    clue:'Older MAN with diffuse adenopathy + splenomegaly + GI involvement (lymphomatous polyposis) + B-cell lymphoma that is CD5+ but CD23-NEGATIVE + nuclear CYCLIN D1 → mantle-cell lymphoma. Driver: t(11;14) IgH-CCND1 → cyclin D1 overexpression → unregulated G1→S. More aggressive than other indolent B-cell lymphomas. Step-1 differential: CLL — also CD5+ B-cell, but CD23-POSITIVE (mantle is CD23-negative), older patients with smudge cells, NO cyclin D1 overexpression.'
  },

  // -------------------------- MALT Lymphoma --------------------------
  {
    id:'malt', name:'MALT Lymphoma (Extranodal Marginal-Zone Lymphoma)', short:'MALT', category:'Indolent Non-Hodgkin Lymphoma',
    sex:'any', ageMin:45, ageMax:75,
    pmhPool: ADULT_PMH, shxPool: ADULT_SHX,
    defect:'Extranodal marginal-zone B-cell lymphoma of mucosa-associated lymphoid tissue (MALT); chronic antigenic stimulation drives clonal expansion in tissues that normally lack organized lymphoid tissue. Gastric MALT lymphomas often harbor the t(11;18)(q21;q21) translocation creating the BIRC3-MALT1 fusion, which is associated with resistance to Helicobacter pylori eradication.',
    inheritance:'Acquired clonal expansion driven by chronic antigenic stimulation — most often Helicobacter pylori in gastric MALT, Sjögren syndrome in salivary MALT, and Hashimoto thyroiditis in thyroid MALT',
    mechanism:'Sustained antigenic stimulation by H. pylori or by autoantigens in autoimmune disease drives reactive B-cell expansion that ultimately becomes clonal. Most gastric MALT lymphomas without t(11;18) regress completely with H. pylori eradication therapy alone — a remarkable example of cancer driven by a treatable infection. Cases with t(11;18) are typically resistant to antibiotic therapy and require chemoimmunotherapy or local radiotherapy.',
    diagnosticTest:'Endoscopic biopsy of the involved mucosa (most often gastric) demonstrating a marginal-zone B-cell infiltrate with characteristic lymphoepithelial lesions; testing for Helicobacter pylori (urea breath test, stool antigen, or biopsy-based histology / urease test); FISH for t(11;18) BIRC3-MALT1',
    keyOrganism:'Helicobacter pylori',
    organismOptions:['Helicobacter pylori','Epstein-Barr virus','Human T-lymphotropic virus type 1 (HTLV-1)','Human herpesvirus 8 (HHV-8 / KSHV)'],
    keyComplication:'Failure to regress with Helicobacter pylori eradication therapy, predicted by the presence of the t(11;18)(q21;q21) BIRC3-MALT1 translocation; transformation to diffuse large B-cell lymphoma is uncommon but reported',
    complicationOptions:[
      'Failure to regress with Helicobacter pylori eradication when the t(11;18) BIRC3-MALT1 translocation is present',
      'Histologic transformation to diffuse large B-cell lymphoma, signaled by a rapidly enlarging mass and rising LDH',
      'Aquagenic pruritus and erythromelalgia from JAK2-V617F driven erythrocytosis',
      'Hyperviscosity syndrome from a circulating monoclonal IgM paraprotein',
      'Disseminated intravascular coagulation from t(15;17) PML-RARA-driven acute promyelocytic leukemia'
    ],
    cc: () => rand([
      'middle-aged adult with several months of epigastric pain, early satiety, and mild iron-deficiency anemia, found on endoscopy to have nodular gastric mucosa',
      'middle-aged adult with Sjögren syndrome with new bilateral parotid swelling and a mass-like infiltrate on imaging',
      'middle-aged adult with Hashimoto thyroiditis with new rapid thyroid enlargement and a firm thyroid nodule',
      'middle-aged adult with chronic dyspepsia found on endoscopic biopsy to have a low-grade marginal-zone B-cell lymphoma'
    ]),
    pathognomonic:[
      'Gastric mucosal biopsy demonstrates a marginal-zone B-cell infiltrate with characteristic lymphoepithelial lesions (lymphocytes infiltrating and disrupting glandular epithelium)',
      'Urea breath test on the same patient is POSITIVE for Helicobacter pylori, providing the chronic antigenic stimulus driving the clonal expansion',
      'FISH on the gastric biopsy identifies t(11;18)(q21;q21) BIRC3-MALT1 — a finding predictive of resistance to Helicobacter pylori eradication therapy'
    ],
    classic:[
      'Several months of dyspepsia, early satiety, and mild epigastric pain partially responsive to proton-pump inhibitor therapy',
      'Endoscopy demonstrates nodular thickening of the gastric mucosa without a discrete mass; biopsies show a marginal-zone B-cell lymphoma',
      'Established Sjögren syndrome (in salivary-gland MALT) or Hashimoto thyroiditis (in thyroid MALT) as the underlying chronic antigenic stimulus',
      'CBC reveals a mild iron-deficiency anemia attributable to chronic mucosal blood loss'
    ],
    supportive:[
      'No B symptoms (no drenching night sweats, no weight loss, no fevers)',
      'No prominent peripheral lymphadenopathy',
      'No prior cytotoxic chemotherapy or radiation exposure'
    ],
    pe_pathognomonic:[
      'Mild epigastric tenderness in a patient with biopsy-proven gastric MALT lymphoma and a positive Helicobacter pylori urea breath test — an example of a lymphoma driven by a treatable bacterial infection'
    ],
    pe_classic:[
      'Mild epigastric tenderness without rebound or guarding',
      'Bilateral parotid-gland enlargement in cases of salivary-gland MALT in Sjögren syndrome',
      'Diffusely firm thyroid in cases of thyroid MALT in Hashimoto thyroiditis'
    ],
    pe_supportive:[
      'No peripheral lymphadenopathy',
      'No splenomegaly'
    ],
    labs:{ wbc:'normal', hgb:'low', plt:'normal' },
    keyLabs:[],
    extraLabs: () => ({
      histology:'Marginal-zone B-cell infiltrate with characteristic lymphoepithelial lesions on gastric mucosal biopsy',
      hpylori: rand(['POSITIVE — Helicobacter pylori detected on urea breath test and confirmed on gastric biopsy','POSITIVE — Helicobacter pylori detected on stool antigen testing','POSITIVE — Helicobacter pylori urease test on biopsy specimen']),
      cd_panel:'CD20+ / CD5- / CD10- / CD23- marginal-zone B-cell phenotype',
      cytogenetics: rand(['No t(11;18) — likely to regress with H. pylori eradication','t(11;18)(q21;q21) BIRC3-MALT1 — predicts resistance to antibiotic therapy'])
    }),
    extraNormals:{ histology:'normal gastric mucosa without lymphoid infiltrate', hpylori:'negative', cd_panel:'polyclonal mature B cells', cytogenetics:'no recurrent rearrangement' },
    differential:'follicular',
    clue:'Adult with chronic dyspepsia + gastric MUCOSAL B-cell lymphoma with LYMPHOEPITHELIAL lesions + H. PYLORI infection → MALT lymphoma. Antigenic stimulation drives clonal expansion (other sites: salivary in Sjögren, thyroid in Hashimoto). Treatment: H. pylori ERADICATION is curative in most cases — except those with t(11;18) BIRC3-MALT1, which are resistant. Step-1 differential: follicular lymphoma — t(14;18) BCL2+, NODAL disease with follicular pattern, no infectious driver.'
  },

  // -------------------------- Multiple Myeloma --------------------------
  {
    id:'mm', name:'Multiple Myeloma', short:'Myeloma', category:'Plasma-Cell Dyscrasia',
    sex:'any', ageMin:60, ageMax:82,
    pmhPool: ELDERLY_PMH, shxPool: ELDERLY_SHX,
    defect:'Clonal proliferation of malignant plasma cells in the bone marrow producing a monoclonal immunoglobulin (most commonly IgG, then IgA) and/or free light chains; preceded almost universally by monoclonal gammopathy of undetermined significance (MGUS)',
    inheritance:'Acquired somatic mutation in a clonal plasma-cell population (not inherited). Strong incidence increase with age; African-American patients have approximately twice the incidence of white patients.',
    mechanism:'Clonal plasma cells expand in the bone marrow and secrete a monoclonal immunoglobulin ("M protein") that produces the CRAB end-organ damage of multiple myeloma: hyperCalcemia (from osteoclast-activating cytokines), Renal failure (from light-chain cast nephropathy and amyloid deposition), Anemia (from marrow infiltration), and Bone lesions (lytic, "punched-out," from RANK-ligand-driven osteoclast activation; no osteoblastic response and so bone scan is often negative — skeletal survey or MRI is preferred). Free light chains (Bence-Jones proteins) are excreted in the urine. Suppression of normal plasma cells produces functional hypogammaglobulinemia → recurrent encapsulated-bacterial infections.',
    diagnosticTest:'Serum and urine protein electrophoresis with immunofixation demonstrating a monoclonal "M-spike"; serum free-light-chain assay with an abnormal κ/λ ratio; bone-marrow biopsy demonstrating ≥10% clonal plasma cells; skeletal survey, low-dose whole-body CT, or MRI to identify lytic lesions',
    keyOrganism:'Streptococcus pneumoniae',
    organismOptions:['Streptococcus pneumoniae','Haemophilus influenzae type b','Neisseria meningitidis','Epstein-Barr virus','Helicobacter pylori'],
    keyComplication:'Renal failure from light-chain cast nephropathy (myeloma kidney) — free light chains precipitate with Tamm-Horsfall protein in distal tubules, forming proteinaceous casts that obstruct nephrons and cause an interstitial inflammatory reaction',
    complicationOptions:[
      'Renal failure from light-chain cast nephropathy ("myeloma kidney"), one component of the CRAB criteria',
      'Recurrent encapsulated-bacterial infections (especially Streptococcus pneumoniae) from functional hypogammaglobulinemia',
      'Tumor lysis syndrome at the initiation of cytotoxic chemotherapy',
      'Aquagenic pruritus and erythromelalgia from JAK2-V617F driven erythrocytosis',
      'Disseminated intravascular coagulation from t(15;17) PML-RARA-driven acute promyelocytic leukemia'
    ],
    cc: () => rand([
      'older adult with several months of low back pain that is worse with movement and a compression fracture on imaging',
      'older adult with fatigue, normocytic anemia, and acute kidney injury found incidentally on routine labs',
      'older adult with several months of progressive bone pain, hypercalcemia, and a markedly elevated total serum protein',
      'older adult with recurrent pneumococcal pneumonia and a new finding of monoclonal gammopathy on serum protein electrophoresis'
    ]),
    pathognomonic:[
      'Serum protein electrophoresis demonstrates a sharp monoclonal spike ("M-spike") in the gamma region; immunofixation identifies the M protein as IgG kappa',
      'Bone-marrow biopsy demonstrates 38% clonal plasma cells with mature plasmacytoid morphology, occasional Russell bodies, and a clonal kappa light-chain restriction',
      'Skeletal survey demonstrates multiple "punched-out" lytic lesions in the calvarium and proximal long bones, characteristic of multiple myeloma (bone scan is typically negative because there is no osteoblastic response)',
      'Peripheral blood smear demonstrates marked rouleaux formation of red blood cells, consistent with the high circulating M protein'
    ],
    classic:[
      'Several months of progressive low back pain that is worse with weight bearing; lumbar radiographs reveal a vertebral compression fracture',
      'CRAB findings: serum calcium 11.8 mg/dL, creatinine 2.4 mg/dL (up from a prior baseline of 1.0), hemoglobin 8.6 g/dL, multiple lytic bone lesions on skeletal survey',
      'Total serum protein is markedly elevated at 9.8 g/dL with a low serum albumin, reflecting the high circulating M protein',
      'Urine dipstick is negative for protein, but a 24-hour urine collection identifies abundant Bence-Jones proteins (free monoclonal light chains)'
    ],
    supportive:[
      'Two episodes of community-acquired pneumococcal pneumonia in the past year, attributable to functional hypogammaglobulinemia',
      'Prior diagnosis of monoclonal gammopathy of undetermined significance (MGUS) on annual labs three years ago',
      'No prior cytotoxic chemotherapy or radiation exposure'
    ],
    pe_pathognomonic:[
      'Marked focal tenderness over a single lower-thoracic vertebra in an older adult with concurrent hypercalcemia and acute kidney injury — the typical presentation of a myeloma-related vertebral lesion'
    ],
    pe_classic:[
      'Pale conjunctivae and palms',
      'Mild generalized bone tenderness on percussion of the sternum and lower thoracic spine',
      'No peripheral lymphadenopathy',
      'No hepatosplenomegaly'
    ],
    pe_supportive:[
      'Mild kyphosis with reduced height compared with prior measurements',
      'Generalized fatigue and pallor'
    ],
    labs:{ wbc:'normal', hgb:'low', plt:'normal' },
    keyLabs:['hgb'],
    extraLabs: () => ({
      ca:randFloat(11.2, 13.5, 1),
      spep:'Monoclonal "M-spike" in the gamma region',
      upep:'Monoclonal free light chains (Bence-Jones proteins) on urine immunofixation',
      m_spike:randFloat(3.5, 7.8, 1),
      freelc:'Markedly abnormal κ/λ free-light-chain ratio',
      smear:'Marked rouleaux formation of red blood cells',
      bmbx:'≥10% clonal plasma cells on bone-marrow biopsy with light-chain restriction',
      beta2m:randFloat(4.5, 12.0, 1)
    }),
    extraNormals:{ ca:'8.5–10.5 mg/dL', spep:'normal polyclonal pattern; no M-spike', upep:'negative for monoclonal light chains', m_spike:'no detectable M protein', freelc:'normal κ/λ ratio 0.26–1.65', smear:'normal red-cell morphology without rouleaux', bmbx:'<5% normal plasma cells', beta2m:'<2.5 mg/L' },
    differential:'cll',
    clue:'OLDER adult with CRAB findings — hyperCalcemia, Renal failure, Anemia, Bone lesions (LYTIC, punched-out, NEGATIVE bone scan) + M-spike on SPEP + Bence-Jones proteins (light chains) in urine + rouleaux on smear + ≥10% clonal plasma cells in marrow → multiple myeloma. African Americans 2× incidence. Recurrent encapsulated infections (functional hypogammaglobulinemia). Preceded by MGUS. Step-1 differential: Waldenström macroglobulinemia (IgM M-spike, HYPERVISCOSITY, no lytic bone lesions); MGUS (M-spike <3 g/dL, <10% plasma cells, no CRAB).'
  },

  // -------------------------- Polycythemia Vera --------------------------
  {
    id:'pv', name:'Polycythemia Vera (PV)', short:'Polycythemia Vera', category:'Myeloproliferative Neoplasm',
    sex:'any', ageMin:55, ageMax:78,
    pmhPool: ELDERLY_PMH, shxPool: ELDERLY_SHX,
    defect:'Acquired somatic JAK2 V617F mutation (>95% of cases) — a constitutively active tyrosine kinase that mimics erythropoietin-receptor signaling and drives EPO-independent erythroid (and often myeloid and megakaryocytic) proliferation. JAK2-negative cases harbor exon-12 JAK2 mutations.',
    inheritance:'Acquired somatic mutation in a clonal hematopoietic stem cell — JAK2 V617F is sporadic and not inherited',
    mechanism:'JAK2 V617F constitutively activates JAK-STAT signaling → autonomous proliferation of the erythroid lineage despite low erythropoietin levels → polycythemia. In approximately half of patients, megakaryocyte and granulocyte lineages are also expanded (panmyelosis). Increased red-cell mass elevates whole-blood viscosity → hyperviscosity symptoms (headache, dizziness, blurred vision), erythromelalgia (burning hands and feet), aquagenic pruritus after a warm bath or shower (driven by mast-cell histamine release), and a markedly increased risk of THROMBOSIS, including the classic Budd-Chiari syndrome (hepatic-vein thrombosis).',
    diagnosticTest:'JAK2 V617F mutation testing on peripheral blood; bone-marrow biopsy demonstrating hypercellular marrow with trilineage hyperplasia; serum erythropoietin (typically LOW or undetectable, the opposite of secondary polycythemia)',
    keyOrganism:'',
    organismOptions:[],
    keyComplication:'Thrombosis — both arterial and venous, including the classic Budd-Chiari syndrome (hepatic-vein thrombosis), portal-vein thrombosis, deep-vein thrombosis, myocardial infarction, and stroke. Thrombosis is the leading cause of death in untreated PV.',
    complicationOptions:[
      'Thrombosis — both arterial and venous, including classic Budd-Chiari syndrome — is the leading cause of mortality in untreated polycythemia vera',
      'Recurrent encapsulated-bacterial infections from functional hypogammaglobulinemia',
      'Renal failure from light-chain cast nephropathy',
      'Disseminated intravascular coagulation from t(15;17) PML-RARA-driven acute promyelocytic leukemia',
      'Richter transformation to diffuse large B-cell lymphoma'
    ],
    cc: () => rand([
      'older adult with persistent intense itching that begins immediately after a hot shower',
      'older adult with intermittent burning pain in the hands and feet (erythromelalgia) and a routine CBC showing a hematocrit of 58%',
      'older adult with new abdominal pain, ascites, and hepatomegaly — abdominal Doppler reveals hepatic-vein thrombosis (Budd-Chiari syndrome)',
      'older adult with headaches, blurred vision, and a plethoric facial complexion, found on labs to have hemoglobin 20.4 g/dL'
    ]),
    pathognomonic:[
      'Patient reports intense generalized pruritus that begins minutes after a hot shower and lasts 30–60 minutes (AQUAGENIC PRURITUS, driven by histamine release from clonal basophils)',
      'JAK2 V617F mutation testing on peripheral blood is POSITIVE',
      'Serum erythropoietin is LOW or undetectable despite the elevated red-cell mass (negative feedback in primary polycythemia; serum EPO is HIGH in secondary polycythemia)',
      'Hepatic-vein Doppler imaging confirms acute thrombotic occlusion of the hepatic veins consistent with Budd-Chiari syndrome — a classic presenting complication of polycythemia vera'
    ],
    classic:[
      'CBC reveals hemoglobin 20.4 g/dL and hematocrit 62% with concurrent leukocytosis (WBC 14,000/μL) and thrombocytosis (platelets 580,000/μL), reflecting the panmyelosis of polycythemia vera',
      'Bone-marrow biopsy is markedly hypercellular (>95%) with trilineage hyperplasia and prominent atypical megakaryocytes',
      'Burning pain and erythema in the fingers and toes that improves with cooling and worsens with warmth (erythromelalgia)',
      'Plethoric facial complexion with conjunctival injection'
    ],
    supportive:[
      'No history of chronic hypoxic lung disease, recent altitude exposure, or sleep apnea',
      'Non-smoker for at least 20 years',
      'No prior cytotoxic chemotherapy or radiation exposure'
    ],
    pe_pathognomonic:[
      'Plethoric ruddy facial complexion with conjunctival injection, in combination with massive splenomegaly and a hematocrit >55% — the classic appearance of polycythemia vera',
      'Burning erythematous discoloration of the fingertips and toes that the patient reports is improved by cooling (erythromelalgia)'
    ],
    pe_classic:[
      'Massive splenomegaly with the spleen palpable 8 cm below the left costal margin',
      'Mild hepatomegaly with the liver edge palpable 3 cm below the right costal margin',
      'Conjunctival injection without scleral icterus'
    ],
    pe_supportive:[
      'No peripheral lymphadenopathy',
      'No skin rash or excoriations from chronic pruritus'
    ],
    labs:{ wbc:'high', hgb:'very_high', plt:'high' },
    keyLabs:['hgb','wbc','plt'],
    extraLabs: () => ({
      hct:randFloat(56, 68, 0),
      jak2:'POSITIVE — JAK2 V617F mutation identified',
      epo:randFloat(1.0, 3.5, 1),
      bmbx:'Markedly hypercellular marrow (>90% cellularity) with trilineage hyperplasia and atypical megakaryocytes'
    }),
    extraNormals:{ hct:'37–48% (women), 41–53% (men)', jak2:'no JAK2 mutation', epo:'4–24 mU/mL', bmbx:'age-appropriate cellularity with balanced trilineage hematopoiesis' },
    differential:'spoly',
    clue:'OLDER adult with HIGH hemoglobin/hematocrit + AQUAGENIC PRURITUS (after hot shower) + ERYTHROMELALGIA + plethoric facies + splenomegaly + THROMBOSIS (Budd-Chiari classic) → polycythemia vera. Driver: JAK2 V617F in >95%. Serum EPO is LOW (negative feedback) — KEY distinction from secondary polycythemia where EPO is HIGH. Treatment: phlebotomy + low-dose aspirin ± hydroxyurea. Step-1 differential: SECONDARY polycythemia — high EPO from hypoxia (COPD, smoking, sleep apnea, altitude) or an EPO-secreting tumor (RCC, hepatocellular, hemangioblastoma, pheochromocytoma).'
  },

  // -------------------------- Secondary Polycythemia --------------------------
  {
    id:'spoly', name:'Secondary Polycythemia', short:'Secondary Poly.', category:'Reactive Erythrocytosis',
    sex:'any', ageMin:35, ageMax:75,
    pmhPool: ADULT_PMH, shxPool: ADULT_SHX,
    defect:'Increased red-cell mass driven by ELEVATED serum erythropoietin — either physiologically appropriate (chronic hypoxia from severe COPD, obstructive sleep apnea, high-altitude residence, right-to-left cardiac shunt, carboxyhemoglobinemia from heavy smoking) or physiologically INAPPROPRIATE from autonomous erythropoietin secretion by a tumor (renal-cell carcinoma, hepatocellular carcinoma, cerebellar hemangioblastoma, pheochromocytoma, uterine leiomyoma)',
    inheritance:'Reactive process secondary to a non-neoplastic stimulus (no clonal mutation in the hematopoietic stem cell); the erythrocytosis itself is not a clonal hematopoietic disorder',
    mechanism:'Either chronic tissue hypoxia drives appropriate renal erythropoietin secretion, or a tumor secretes erythropoietin autonomously. In both cases, the elevated EPO drives expansion of the erythroid lineage alone (no panmyelosis), serum EPO is HIGH, and the JAK2 V617F mutation is ABSENT — the opposite pattern from polycythemia vera. Treatment is directed at the underlying cause: oxygen and smoking cessation in hypoxic causes, resection of the tumor in inappropriate-EPO causes.',
    diagnosticTest:'Serum erythropoietin (HIGH) and JAK2 mutation testing (NEGATIVE), with directed evaluation for the underlying cause: arterial blood gas / pulse oximetry / sleep study for hypoxic causes, abdominal imaging for an EPO-secreting tumor',
    keyOrganism:'',
    organismOptions:[],
    keyComplication:'Hyperviscosity-related thrombotic events from chronically elevated hematocrit; correction of the underlying stimulus (oxygen, treatment of sleep apnea, resection of an EPO-secreting tumor) typically resolves the erythrocytosis',
    complicationOptions:[
      'Hyperviscosity-related thrombotic events that typically resolve with treatment of the underlying hypoxic stimulus or EPO-secreting tumor',
      'Aquagenic pruritus and erythromelalgia from JAK2-V617F driven erythrocytosis',
      'Tumor lysis syndrome at the initiation of cytotoxic chemotherapy',
      'Renal failure from light-chain cast nephropathy',
      'Disseminated intravascular coagulation from t(15;17) PML-RARA-driven acute promyelocytic leukemia'
    ],
    cc: () => rand([
      'middle-aged adult with longstanding heavy tobacco use and severe COPD found on routine labs to have hemoglobin 18.6 g/dL and hematocrit 56%',
      'middle-aged adult with obstructive sleep apnea (poorly adherent to CPAP) and a hematocrit of 54% on routine labs',
      'middle-aged adult with newly diagnosed renal-cell carcinoma found incidentally to have hemoglobin 19.2 g/dL with a paraneoplastic erythrocytosis',
      'older adult who recently relocated to a high-altitude region and is now found to have a hematocrit of 53% with no other abnormalities'
    ]),
    pathognomonic:[
      'Serum erythropoietin is markedly ELEVATED at 78 mU/mL (normal 4–24), pointing away from polycythemia vera (in which EPO is suppressed)',
      'JAK2 V617F mutation testing on peripheral blood is NEGATIVE',
      'Arterial blood gas on room air demonstrates chronic resting hypoxemia (PaO2 54 mmHg, SaO2 88%) attributable to severe COPD, providing the appropriate physiologic stimulus for erythropoietin secretion',
      'Abdominal CT in the same patient demonstrates a 6-cm enhancing solid mass in the upper pole of the right kidney, consistent with renal-cell carcinoma — an EPO-secreting tumor producing paraneoplastic erythrocytosis'
    ],
    classic:[
      'CBC reveals hemoglobin 19.2 g/dL and hematocrit 56% with NORMAL leukocyte and platelet counts (no panmyelosis, in contrast with polycythemia vera)',
      'Heavy ongoing tobacco use (1.5 packs daily for 35 years) with chronic productive cough consistent with COPD',
      'Witnessed loud snoring with apneic pauses and excessive daytime sleepiness, with subsequent polysomnography confirming severe obstructive sleep apnea',
      'No splenomegaly on physical examination'
    ],
    supportive:[
      'No aquagenic pruritus or erythromelalgia',
      'No history of thrombotic events',
      'No prior diagnosis of polycythemia vera or other myeloproliferative neoplasm'
    ],
    pe_pathognomonic:[
      'Plethoric ruddy facial complexion WITHOUT splenomegaly in a heavy smoker with severe COPD — the typical appearance of secondary polycythemia from chronic hypoxia'
    ],
    pe_classic:[
      'Conjunctival injection without scleral icterus',
      'Decreased breath sounds and prolonged expiratory phase with scattered wheezes consistent with COPD',
      'Mild cyanosis of the nail beds in chronic hypoxic states'
    ],
    pe_supportive:[
      'No peripheral lymphadenopathy',
      'No skin excoriations or rash',
      'No hepatosplenomegaly'
    ],
    labs:{ wbc:'normal', hgb:'very_high', plt:'normal' },
    keyLabs:['hgb'],
    extraLabs: () => ({
      hct:randFloat(54, 64, 0),
      jak2:'NEGATIVE — no JAK2 V617F mutation',
      epo:randFloat(35, 110, 1),
      abg:'Chronic resting hypoxemia on room air with mild compensated respiratory acidosis'
    }),
    extraNormals:{ hct:'37–48% (women), 41–53% (men)', jak2:'no JAK2 mutation', epo:'4–24 mU/mL', abg:'pH 7.35–7.45, PaO2 80–100 mmHg, SaO2 ≥95%' },
    differential:'pv',
    clue:'Adult with elevated hemoglobin/hematocrit but NO splenomegaly, NO aquagenic pruritus, NO erythromelalgia, NORMAL WBC and platelets → secondary polycythemia. Serum EPO HIGH (vs LOW in PV). JAK2 V617F NEGATIVE. Causes: chronic HYPOXIA (COPD, sleep apnea, altitude, R-to-L shunt) drives APPROPRIATE EPO; tumors (RCC, hepatocellular ca., hemangioblastoma, pheo, uterine leiomyoma) cause INAPPROPRIATE paraneoplastic EPO secretion. Step-1 differential: polycythemia vera — LOW EPO, JAK2+, splenomegaly, panmyelosis, aquagenic pruritus, erythromelalgia, Budd-Chiari.'
  },

  // -------------------------- Adult T-cell Leukemia/Lymphoma --------------------------
  {
    id:'atll', name:'Adult T-cell Leukemia/Lymphoma (ATLL)', short:'ATLL', category:'Chronic Lymphoid Neoplasm',
    sex:'any', ageMin:40, ageMax:70,
    pmhPool: ADULT_PMH, shxPool: ADULT_SHX,
    defect:'Aggressive clonal CD4+ T-cell neoplasm driven by chronic infection with the retrovirus human T-lymphotropic virus type 1 (HTLV-1); viral oncoproteins Tax and HBZ drive proliferation and impair tumor-suppressor function',
    inheritance:'Acquired clonal expansion driven by an oncogenic viral infection (HTLV-1); transmission is vertical (breastfeeding is the most efficient route), sexual, or parenteral. HTLV-1 is endemic in southwestern Japan, the Caribbean basin, and parts of West Africa and South America; lifetime risk of ATLL in an HTLV-1-infected individual is approximately 2–5%, with a typical latency of decades.',
    mechanism:'HTLV-1 integrates into the host CD4+ T-cell genome and expresses the Tax oncoprotein, which activates NF-κB and represses tumor-suppressor function. After decades of latency, a clonal CD4+ T-cell population emerges with characteristic multilobulated "FLOWER CELLS" on peripheral blood smear. Malignant cells produce parathyroid-hormone-related peptide (PTHrP) and other osteoclast-activating factors → marked HYPERCALCEMIA with lytic bone lesions, a hallmark of the disease.',
    diagnosticTest:'HTLV-1 serology (anti-HTLV-1 antibody by enzyme immunoassay, confirmed by Western blot or PCR for HTLV-1 proviral DNA); peripheral-blood flow cytometry demonstrating clonal CD4+ / CD25+ T cells with characteristic multilobulated "flower-cell" morphology on smear',
    keyOrganism:'Human T-lymphotropic virus type 1 (HTLV-1)',
    organismOptions:['Human T-lymphotropic virus type 1 (HTLV-1)','Epstein-Barr virus','Human herpesvirus 8 (HHV-8 / KSHV)','Helicobacter pylori'],
    keyComplication:'Severe hypercalcemia driven by tumor-produced parathyroid-hormone-related peptide (PTHrP) and other osteoclast-activating cytokines, frequently accompanied by lytic bone lesions and acute kidney injury at presentation',
    complicationOptions:[
      'Severe hypercalcemia from tumor-produced parathyroid-hormone-related peptide (PTHrP) and lytic bone lesions',
      'Aquagenic pruritus and erythromelalgia from JAK2-V617F driven erythrocytosis',
      'Renal failure from light-chain cast nephropathy',
      'Disseminated intravascular coagulation from t(15;17) PML-RARA-driven acute promyelocytic leukemia',
      'Hyperviscosity syndrome from a circulating monoclonal IgM paraprotein'
    ],
    cc: () => rand([
      'middle-aged adult of Japanese ancestry with new-onset hypercalcemia, lytic bone lesions, and a peripheral lymphocytosis',
      'middle-aged adult born in the Caribbean with diffuse lymphadenopathy, hepatosplenomegaly, and an infiltrative skin rash',
      'middle-aged adult with severe hypercalcemia and an atypical lymphocytosis on smear notable for cells with multilobulated nuclei ("flower cells")',
      'middle-aged adult with HTLV-1 seropositivity discovered during blood-donor screening, now with new diffuse lymphadenopathy and skin lesions'
    ]),
    pathognomonic:[
      'Peripheral blood smear demonstrates atypical CD4+ T cells with characteristic multilobulated ("FLOWER CELL") nuclei',
      'HTLV-1 serology by enzyme immunoassay is reactive and confirmed positive by Western blot; HTLV-1 proviral DNA is detected by PCR on peripheral blood',
      'Flow cytometry on peripheral blood identifies a clonal CD4+ / CD25+ T-cell population',
      'Skeletal survey demonstrates multiple lytic bone lesions, and serum parathyroid-hormone-related peptide (PTHrP) is markedly elevated despite a suppressed intact parathyroid hormone'
    ],
    classic:[
      'Diffuse painless lymphadenopathy in cervical, axillary, and inguinal chains',
      'Marked hypercalcemia (serum calcium 13.8 mg/dL) with acute kidney injury attributable to hypercalcemic nephropathy',
      'Infiltrative skin rash with plaques and nodules involving the trunk and extremities',
      'CBC reveals an atypical lymphocytosis with WBC 28,000/μL'
    ],
    supportive:[
      'Patient is of Japanese, Caribbean, West African, or South American ancestry, or has spent extended time in an HTLV-1-endemic region',
      'Was breastfed in childhood by a mother who later screened positive for HTLV-1',
      'No prior cytotoxic chemotherapy or radiation exposure'
    ],
    pe_pathognomonic:[
      'Infiltrative skin plaques and nodules in a patient of Japanese or Caribbean ancestry with concurrent lymphadenopathy, hepatosplenomegaly, and laboratory-confirmed hypercalcemia from PTHrP — the classic ATLL constellation'
    ],
    pe_classic:[
      'Diffuse non-tender lymphadenopathy in cervical, axillary, and inguinal chains',
      'Hepatosplenomegaly with the spleen palpable 5 cm below the left costal margin',
      'Infiltrative skin plaques and nodules involving the trunk'
    ],
    pe_supportive:[
      'Mild dehydration with dry mucous membranes (consistent with hypercalcemic nephropathy)',
      'Otherwise unremarkable cardiopulmonary examination'
    ],
    labs:{ wbc:'high', hgb:'normal', plt:'normal' },
    keyLabs:['wbc'],
    extraLabs: () => ({
      ca:randFloat(12.8, 15.6, 1),
      smear:'Atypical CD4+ T cells with characteristic multilobulated ("flower cell") nuclei',
      htlv:'POSITIVE — HTLV-1 antibody by enzyme immunoassay confirmed by Western blot; HTLV-1 proviral DNA detected by PCR',
      flow:'Clonal CD4+ / CD25+ T-cell population',
      ldh:randInt(450, 1500)
    }),
    extraNormals:{ ca:'8.5–10.5 mg/dL', smear:'normal lymphocyte morphology', htlv:'negative', flow:'polyclonal mature T-cell population', ldh:'140–280 U/L' },
    differential:'mf',
    clue:'Adult of Japanese, Caribbean, or West African ancestry with lymphadenopathy + skin plaques + hepatosplenomegaly + SEVERE HYPERCALCEMIA + LYTIC bone lesions (PTHrP-mediated) + atypical CD4+ T cells with multilobulated FLOWER nuclei on smear → ATLL. Driver: HTLV-1 retrovirus (endemic Japan, Caribbean, West Africa). Vertical transmission via breastfeeding. CD4+/CD25+ flow. Step-1 differential: mycosis fungoides / Sézary — also CD4+ T-cell neoplasm, but skin-predominant (patches → plaques → tumors), Pautrier microabscesses in epidermis, no HTLV-1, no hypercalcemia.'
  },

  // -------------------------- Mycosis Fungoides / Sézary --------------------------
  {
    id:'mf', name:'Mycosis Fungoides / Sézary Syndrome', short:'MF / Sézary', category:'Chronic Lymphoid Neoplasm',
    sex:'any', ageMin:45, ageMax:75,
    pmhPool: ADULT_PMH, shxPool: ADULT_SHX,
    defect:'Cutaneous T-cell lymphoma — clonal mature CD4-positive (helper) T cells with cerebriform / lobulated nuclei that infiltrate the epidermis. The leukemic variant in which malignant cells circulate in the peripheral blood is called Sézary syndrome.',
    inheritance:'Acquired clonal expansion of a mature CD4+ T-cell population (not inherited); not directly virus-driven, though some cases may have ancillary viral or environmental associations',
    mechanism:'Clonal CD4+ T cells infiltrate the skin epidermis, where they form small intra-epidermal collections of atypical lymphocytes around dendritic cells known as PAUTRIER microabscesses — the histologic hallmark of mycosis fungoides. Disease typically progresses through stages over years: patches (flat scaly lesions, often in sun-protected "bathing-trunk" distribution) → plaques (raised, well-demarcated) → tumors (nodular, sometimes ulcerated). When the clone spills into the peripheral blood it produces Sézary syndrome — generalized erythroderma, lymphadenopathy, and circulating Sézary cells (cerebriform CD4+ T cells).',
    diagnosticTest:'Skin punch biopsy demonstrating an epidermotropic infiltrate of atypical CD4+ T cells with characteristic Pautrier microabscesses; PCR analysis of the T-cell receptor (TCR) gene to confirm clonal rearrangement; in Sézary syndrome, peripheral-blood flow cytometry identifies circulating Sézary cells (CD4+/CD7-/CD26-)',
    keyOrganism:'',
    organismOptions:[],
    keyComplication:'Progression from limited patches and plaques to disseminated tumor-stage disease, often with secondary bacterial skin infections from impaired epidermal barrier function; Sézary syndrome carries the worst prognosis',
    complicationOptions:[
      'Progression to tumor-stage disease with disseminated cutaneous tumors and superimposed bacterial skin infection',
      'Severe hypercalcemia from tumor-produced parathyroid-hormone-related peptide and lytic bone lesions',
      'Renal failure from light-chain cast nephropathy',
      'Disseminated intravascular coagulation from t(15;17) PML-RARA-driven acute promyelocytic leukemia',
      'Hyperviscosity syndrome from a circulating monoclonal IgM paraprotein'
    ],
    cc: () => rand([
      'middle-aged adult with several years of pruritic scaly patches on sun-protected areas of the trunk and buttocks (the "bathing-trunk" distribution)',
      'older adult with new generalized erythroderma involving more than 80% of body-surface area, peripheral lymphadenopathy, and circulating atypical lymphocytes',
      'middle-aged adult with chronic patches that have progressed over years to thicker plaques and now several ulcerated tumors on the trunk',
      'older adult with intractable pruritus and erythroderma found on flow cytometry to have a clonal CD4+/CD7-/CD26- T-cell population in peripheral blood'
    ]),
    pathognomonic:[
      'Skin punch biopsy demonstrates an epidermotropic infiltrate of atypical CD4+ T cells with characteristic intra-epidermal clusters of lymphocytes (PAUTRIER MICROABSCESSES) — the histologic hallmark of mycosis fungoides',
      'PCR analysis of the T-cell receptor (TCR) gene on the skin biopsy demonstrates a clonal TCR-γ rearrangement',
      'Peripheral-blood smear demonstrates atypical lymphocytes with CEREBRIFORM (convoluted) nuclei — Sézary cells — in a patient with concurrent erythroderma',
      'Flow cytometry on peripheral blood identifies a clonal CD4-positive / CD7-negative / CD26-negative T-cell population in a patient with erythroderma — the diagnostic phenotype of Sézary syndrome'
    ],
    classic:[
      'Multi-year history of progressive, pruritic, slowly enlarging scaly patches that have evolved into raised plaques and a few nodular tumors',
      'Patches involve sun-protected regions of the trunk and buttocks in a "bathing-trunk" distribution',
      'Generalized erythroderma involving >80% of body-surface area with diffuse scaling and intractable pruritus (Sézary syndrome)',
      'Diffuse non-tender lymphadenopathy with mildly enlarged cervical, axillary, and inguinal nodes'
    ],
    supportive:[
      'No prior systemic chemotherapy or radiation exposure',
      'No occupational chemical exposures',
      'No family history of cutaneous lymphoma'
    ],
    pe_pathognomonic:[
      'Multiple well-demarcated erythematous scaly patches and plaques on sun-protected areas of the trunk and buttocks in a "bathing-trunk" distribution, with biopsy demonstrating Pautrier microabscesses — the classic appearance of mycosis fungoides',
      'Diffuse erythroderma involving more than 80% of body-surface area accompanied by lymphadenopathy and circulating Sézary cells — Sézary syndrome'
    ],
    pe_classic:[
      'Scaly, well-demarcated erythematous patches on the trunk and buttocks with overlying fine scale',
      'Several raised, indurated plaques on the inner thighs and lower abdomen',
      'Diffuse non-tender lymphadenopathy in cervical and axillary chains'
    ],
    pe_supportive:[
      'Diffuse pruritus with multiple linear excoriations',
      'Palmoplantar hyperkeratosis with associated fissuring in advanced disease'
    ],
    labs:{ wbc:'high', hgb:'normal', plt:'normal' },
    keyLabs:[],
    extraLabs: () => ({
      skin_bx:'Epidermotropic infiltrate of atypical CD4+ T cells with characteristic Pautrier microabscesses',
      tcr_gene:'POSITIVE — clonal T-cell receptor gamma gene rearrangement detected by PCR',
      flow:'Clonal CD4+ / CD7-negative / CD26-negative T-cell population in peripheral blood (Sézary syndrome)',
      smear:'Atypical lymphocytes with cerebriform (convoluted) nuclei — Sézary cells'
    }),
    extraNormals:{ skin_bx:'normal epidermis with no atypical infiltrate', tcr_gene:'polyclonal TCR pattern', flow:'polyclonal mature T-cell population', smear:'normal lymphocyte morphology' },
    differential:'atll',
    clue:'Adult with CHRONIC pruritic scaly PATCHES (bathing-trunk distribution) → PLAQUES → TUMORS over years + Pautrier microabscesses on skin biopsy → mycosis fungoides. CUTANEOUS T-cell lymphoma (CD4+). LEUKEMIC variant = SÉZARY syndrome — erythroderma + circulating CEREBRIFORM Sézary cells (CD4+/CD7-/CD26-). Step-1 differential: ATLL — also CD4+ T-cell neoplasm but HTLV-1-driven, hypercalcemia with lytic bone lesions, multilobulated "flower cells" in blood, more aggressive course.'
  }
];
