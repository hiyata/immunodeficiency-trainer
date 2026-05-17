// =============================================================================
// coag.js — Hemostasis & Coagulation Disorders
// Exports: COAG_DISORDERS, generateCoagCase
//
// Each disorder:
//   id, name, category
//   factor  — deficient/dysfunctional protein or factor (null = skip factor Q)
//   treatment — drug or intervention (use 'None' when none is needed)
//   genPanel() — returns { pt, ptt, platelets (×10³/μL), bleedingTime, morphology, dDimer (null if not shown) }
//   vignettes[] — short clinical paragraphs (one picked randomly)
//   teachingPoint — shown in the feedback panel
// =============================================================================

import { rand, randInt, randFloat } from '../utils/random.js';

export const COAG_DISORDERS = [
  {
    id: 'hemophilia_a',
    name: 'Hemophilia A',
    category: 'intrinsic pathway',
    factor: 'Factor VIII',
    treatment: 'Desmopressin',
    genPanel: () => ({
      pt: randFloat(11, 14, 1),
      ptt: randInt(52, 90),
      platelets: randInt(180, 380),
      bleedingTime: randFloat(2, 7, 1),
      morphology: 'Normal',
      dDimer: null,
    }),
    vignettes: [
      'An 8-year-old boy is brought to the ED after a minor fall from his bicycle. His right knee is swollen, warm, and tender with limited range of motion. His mother reports three similar joint bleeds in the past year. His maternal uncle has a documented bleeding disorder.',
      'A 16-year-old male presents with prolonged bleeding following a tooth extraction that did not respond to local pressure or packing. He reports easy bruising with minor trauma throughout his childhood.',
      'A 22-year-old male is referred after developing a large, tense hematoma in his right thigh following a minor muscle strain during recreational soccer. He required transfusion after a prior knee surgery at age 14.',
    ],
    teachingPoint: 'Hemophilia A is an X-linked recessive deficiency of Factor VIII (intrinsic pathway). PTT is prolonged; PT and platelet function are normal. Mild disease is treated with desmopressin (DDAVP), which releases stored vWF and Factor VIII from endothelial cells. Severe disease requires Factor VIII concentrate.',
  },
  {
    id: 'hemophilia_b',
    name: 'Hemophilia B',
    category: 'intrinsic pathway',
    factor: 'Factor IX',
    treatment: 'Factor IX',
    genPanel: () => ({
      pt: randFloat(11, 14, 1),
      ptt: randInt(54, 92),
      platelets: randInt(175, 375),
      bleedingTime: randFloat(2, 7, 1),
      morphology: 'Normal',
      dDimer: null,
    }),
    vignettes: [
      'A 10-year-old boy presents with persistent bleeding from his gums after losing a tooth. His parents report that a maternal cousin required factor replacement therapy as a child.',
      'A 6-year-old male is brought in for recurrent swollen, painful ankle and knee joints following minor play activities. His CBC is unremarkable except for a coagulation abnormality on the pre-op screen.',
      'A 19-year-old male develops a large retroperitoneal hematoma after a minor motor vehicle collision with no obvious abdominal injury on CT.',
    ],
    teachingPoint: 'Hemophilia B (Christmas disease) is an X-linked recessive deficiency of Factor IX. Lab pattern is identical to Hemophilia A — prolonged PTT, normal PT and bleeding time — and is distinguishable only by specific factor assay. Treated with recombinant Factor IX concentrate.',
  },
  {
    id: 'vwd',
    name: 'Von Willebrand Disease',
    category: 'platelet adhesion',
    factor: 'vWF',
    treatment: 'Desmopressin',
    genPanel: () => ({
      pt: randFloat(11, 14, 1),
      ptt: randInt(35, 52),
      platelets: randInt(150, 360),
      bleedingTime: randFloat(10, 20, 1),
      morphology: 'Normal',
      dDimer: null,
    }),
    vignettes: [
      'A 17-year-old female presents with menorrhagia since menarche requiring multiple pad changes per hour, and frequent epistaxis. Her mother has a history of heavy periods and nosebleeds.',
      'A 24-year-old female presents with excessive bleeding following a routine dental procedure that was not controlled by local measures. She reports a lifelong history of heavy menses and prolonged bleeding after minor cuts.',
      'A 31-year-old female presents with prolonged oozing from a skin biopsy site. She reports requiring transfusion after a prior surgery. Her father had similar bleeding episodes.',
    ],
    teachingPoint: 'Von Willebrand Disease is the most common inherited bleeding disorder. vWF mediates platelet adhesion to subendothelium (via GPIb) and acts as a carrier for Factor VIII. Deficiency causes ↑bleeding time (platelet plug defect) and mildly ↑PTT (due to ↓Factor VIII). PT is normal. Desmopressin (DDAVP) releases vWF from endothelial Weibel-Palade bodies and is effective in Type 1 vWD.',
  },
  {
    id: 'dic',
    name: 'DIC',
    category: 'consumption coagulopathy',
    factor: null,
    treatment: 'FFP',
    genPanel: () => ({
      pt: randInt(22, 42),
      ptt: randInt(58, 105),
      platelets: randInt(15, 75),
      bleedingTime: randInt(15, 25),
      morphology: 'Schistocytes',
      dDimer: randFloat(5, 22, 1),
    }),
    vignettes: [
      'A 38-year-old woman in the ICU develops diffuse oozing from IV catheter sites and hematuria 10 hours after an emergency cesarean section for placental abruption. She required 4 units of pRBCs intraoperatively.',
      'A 55-year-old male with metastatic prostate cancer presents with spontaneous ecchymoses over his trunk, gum bleeding, and blood oozing from a peripheral IV site.',
      'A 29-year-old male in septic shock from Gram-negative bacteremia develops purpuric skin lesions, petechiae, gingival bleeding, and hematuria over six hours.',
      'A 42-year-old female is brought in obtunded with a snakebite wound on her left ankle. She has diffuse bruising and persistent oozing from her IV sites.',
    ],
    teachingPoint: 'DIC is widespread simultaneous activation of coagulation and fibrinolysis — paradoxical bleeding and thrombosis. All coag studies are abnormal: ↑PT, ↑PTT, ↓platelets, ↑bleeding time, schistocytes on smear, and markedly ↑D-dimer with ↓fibrinogen. The markedly elevated D-dimer is the key distinguisher from TTP (in which D-dimer is normal or only mildly elevated). Treat the underlying cause; replace factors with FFP and cryoprecipitate.',
  },
  {
    id: 'ttp',
    name: 'TTP',
    category: 'thrombotic microangiopathy',
    factor: 'ADAMTS13',
    treatment: 'Plasmapheresis',
    genPanel: () => ({
      pt: randFloat(11, 15, 1),
      ptt: randInt(25, 40),
      platelets: randInt(8, 52),
      bleedingTime: randInt(15, 30),
      morphology: 'Schistocytes',
      dDimer: randFloat(0.3, 0.9, 1),
    }),
    vignettes: [
      'A 28-year-old female presents with confusion, headache, and a petechial rash over her lower extremities. She is febrile to 38.9°C. Labs show Hgb 7.1 g/dL and BUN 26 mg/dL with a mildly elevated creatinine.',
      'A 35-year-old female presents with two days of severe headache, blurry vision, and purpuric skin lesions. She is noted to be disoriented during the exam. Creatinine is 1.4 mg/dL.',
      'A 31-year-old woman who recently started ticlopidine following a coronary stent develops sudden-onset confusion and a purpuric rash. The peripheral smear is flagged by the lab.',
    ],
    teachingPoint: 'TTP is caused by severe deficiency of ADAMTS13 (the metalloprotease that cleaves ultra-large vWF multimers), leading to platelet microthrombi in small vessels. Classic pentad: microangiopathic hemolytic anemia (schistocytes), thrombocytopenia, fever, neurologic changes, and renal failure. Unlike DIC: PT and PTT are NORMAL and D-dimer is normal or only mildly elevated. Emergency treatment is plasma exchange (plasmapheresis).',
  },
  {
    id: 'itp',
    name: 'ITP',
    category: 'immune thrombocytopenia',
    factor: null,
    treatment: 'IVIG',
    genPanel: () => ({
      pt: randFloat(11, 14, 1),
      ptt: randInt(25, 35),
      platelets: randInt(8, 60),
      bleedingTime: randInt(10, 22),
      morphology: 'Normal',
      dDimer: null,
    }),
    vignettes: [
      'A 6-year-old girl presents with petechiae and multiple bruises over her trunk and lower extremities, two weeks after recovering from a viral upper respiratory illness. There is no lymphadenopathy or splenomegaly.',
      'A 28-year-old female with known SLE presents with easy bruising and diffuse petechiae for one week. She is afebrile. Peripheral smear shows no schistocytes.',
      'A 35-year-old female presents with heavy menstrual bleeding and spontaneous gum bleeding. She is otherwise healthy, takes no medications, and the exam is unremarkable.',
    ],
    teachingPoint: 'ITP is immune-mediated platelet destruction via IgG autoantibodies (most commonly targeting GPIIb/IIIa), causing isolated thrombocytopenia with prolonged bleeding time. PT and PTT are normal. No schistocytes — this distinguishes ITP from TTP, HUS, and DIC. In children, often self-limited post-viral. In adults, chronic. IVIG is preferred when a rapid response is needed (surgery, severe bleeding); corticosteroids are first-line for non-urgent cases.',
  },
  {
    id: 'vitk_def',
    name: 'Vitamin K Deficiency',
    category: 'coagulation factor synthesis',
    factor: null,
    treatment: 'Vitamin K',
    genPanel: () => ({
      pt: randInt(22, 38),
      ptt: randInt(46, 78),
      platelets: randInt(185, 390),
      bleedingTime: randFloat(2, 8, 1),
      morphology: 'Normal',
      dDimer: null,
    }),
    vignettes: [
      'A 4-week-old breastfed infant presents with bleeding from the umbilical stump and oozing from the circumcision site. His parents declined the neonatal vitamin K injection at birth.',
      'A 65-year-old male with obstructive jaundice from a pancreatic head mass presents with spontaneous bruising and gum bleeding. He has been on broad-spectrum antibiotics for three weeks with minimal oral intake.',
      'A 58-year-old female with Crohn\'s disease involving the terminal ileum presents with easy bruising and heavy menses. She has been on long-term antibiotics and reports poor appetite.',
    ],
    teachingPoint: 'Vitamin K is required for γ-carboxylation of Factors II, VII, IX, and X (and proteins C and S). PT rises first because Factor VII has the shortest half-life (~6 hours). Both PT and PTT are elevated in significant deficiency. Platelets and bleeding time are normal. Causes: neonates (no gut flora, low stores, breast milk low in K), malabsorption, biliary obstruction, prolonged antibiotics. Treat with vitamin K supplementation.',
  },
  {
    id: 'heparin',
    name: 'Heparin Toxicity',
    category: 'anticoagulant drug',
    factor: null,
    treatment: 'Protamine',
    genPanel: () => ({
      pt: randFloat(11, 14, 1),
      ptt: randInt(78, 135),
      platelets: randInt(155, 385),
      bleedingTime: randFloat(2, 8, 1),
      morphology: 'Normal',
      dDimer: null,
    }),
    vignettes: [
      'A 68-year-old male receiving unfractionated heparin infusion for a pulmonary embolism develops hematuria and oozing from venipuncture sites. His aPTT returns critically elevated.',
      'A 55-year-old female undergoing cardiopulmonary bypass receives high-dose unfractionated heparin. Postoperatively she has persistent, brisk bleeding from mediastinal chest tubes that does not respond to surgical pressure.',
      'A 72-year-old male on heparin drip for acute coronary syndrome is noted to have blood-tinged nasogastric tube output and gross hematuria. Nursing notes a critically elevated aPTT from one hour ago.',
    ],
    teachingPoint: 'Unfractionated heparin potentiates antithrombin III, inhibiting thrombin (IIa) and Factor Xa. It is monitored by aPTT (target 60–100 sec). In toxicity: PT is normal (extrinsic pathway unaffected) while PTT is markedly prolonged. Platelet count and bleeding time are normal. Reversal is with protamine sulfate, which binds and neutralizes heparin by forming a stable complex.',
  },
  {
    id: 'warfarin',
    name: 'Warfarin Toxicity',
    category: 'anticoagulant drug',
    factor: null,
    treatment: 'Vitamin K',
    genPanel: () => ({
      pt: randInt(24, 55),
      ptt: randInt(28, 45),
      platelets: randInt(175, 385),
      bleedingTime: randFloat(2, 9, 1),
      morphology: 'Normal',
      dDimer: null,
    }),
    vignettes: [
      'A 72-year-old male on long-term warfarin for atrial fibrillation presents with gross hematuria and epistaxis. He recently started trimethoprim-sulfamethoxazole for a UTI two weeks ago.',
      'A 68-year-old female on warfarin for a DVT is found to have an INR of 8.4 on routine labs. She has mild gum bleeding but no major hemorrhage or neurologic symptoms.',
      'A 75-year-old male on warfarin for a mechanical heart valve presents with large spontaneous ecchymoses and hematuria after his cardiologist added a new medication last month.',
    ],
    teachingPoint: 'Warfarin inhibits VKORC1 (vitamin K epoxide reductase), blocking regeneration of active vitamin K and impairing synthesis of Factors II, VII, IX, X and proteins C and S. PT/INR is elevated prominently (Factor VII shortest t½); PTT is normal to mildly prolonged. Monitoring: PT/INR. Reversal: Vitamin K for non-urgent; 4-factor PCC or FFP for urgent reversal.',
  },
  {
    id: 'bernard_soulier',
    name: 'Bernard-Soulier',
    category: 'platelet adhesion',
    factor: 'GPIb',
    treatment: 'Platelet transfusion',
    genPanel: () => ({
      pt: randFloat(11, 14, 1),
      ptt: randInt(25, 35),
      platelets: randInt(30, 100),
      bleedingTime: randInt(15, 30),
      morphology: 'Giant platelets',
      dDimer: null,
    }),
    vignettes: [
      'A 5-year-old girl presents with recurrent nosebleeds and gum bleeding since infancy. Peripheral blood smear shows markedly enlarged platelets. Her platelet count is moderately low.',
      'A 12-year-old female has had mucocutaneous bleeding, epistaxis, and easy bruising throughout childhood. Her younger sibling has similar symptoms. The smear reveals abnormally large platelets.',
      'A 9-year-old boy with a history of heavy bleeding after minor injuries presents with a prolonged nosebleed unresponsive to local pressure. The lab flags the smear for large, dysmorphic platelets.',
    ],
    teachingPoint: 'Bernard-Soulier Syndrome is an autosomal recessive deficiency of GPIb (the platelet receptor that binds vWF, enabling platelet adhesion to damaged subendothelium). Results in thrombocytopenia with giant platelets, markedly prolonged bleeding time, and normal PT/PTT. Key distinction from Glanzmann: Bernard-Soulier has ↓platelet count and giant platelets; Glanzmann has normal platelet count and normal morphology. Treat with platelet transfusion for significant bleeding.',
  },
  {
    id: 'glanzmann',
    name: 'Glanzmann Thrombasthenia',
    category: 'platelet aggregation',
    factor: 'GPIIb/IIIa',
    treatment: 'Platelet transfusion',
    genPanel: () => ({
      pt: randFloat(11, 14, 1),
      ptt: randInt(25, 35),
      platelets: randInt(180, 390),
      bleedingTime: randInt(16, 30),
      morphology: 'Normal',
      dDimer: null,
    }),
    vignettes: [
      'A 7-year-old girl presents with prolonged bleeding after minor cuts and petechiae. Her platelet count and morphology are normal on CBC. Platelet aggregation studies show failure to aggregate with ADP, epinephrine, and collagen but normal ristocetin aggregation.',
      'A 4-year-old girl of consanguineous Middle Eastern parents presents with mucocutaneous bleeding, epistaxis, and gum bleeding since early childhood. Her CBC and peripheral smear are unremarkable.',
      'A 6-year-old female with heavy bleeding at circumcision and prolonged nosebleeds presents with petechiae. Platelet count is 230 ×10³/μL. Aggregation studies with multiple agonists are markedly impaired.',
    ],
    teachingPoint: 'Glanzmann Thrombasthenia is an autosomal recessive deficiency of GPIIb/IIIa (integrin αIIbβ3), the fibrinogen receptor required for platelet aggregation. Platelets adhere normally (GPIb intact) but cannot aggregate. Result: normal platelet count, normal morphology, markedly prolonged bleeding time, normal PT/PTT. Platelets fail to aggregate with ADP/collagen/epinephrine but aggregate normally with ristocetin. Treat with platelet transfusion.',
  },
  {
    id: 'factor_xii',
    name: 'Factor XII Deficiency',
    category: 'intrinsic pathway',
    factor: 'Factor XII',
    treatment: 'None',
    genPanel: () => ({
      pt: randFloat(11, 14, 1),
      ptt: randInt(88, 160),
      platelets: randInt(185, 395),
      bleedingTime: randFloat(2, 8, 1),
      morphology: 'Normal',
      dDimer: null,
    }),
    vignettes: [
      'A 45-year-old male undergoes routine pre-operative labs before an elective knee replacement. He has no personal or family history of bleeding and has had prior surgeries without complications. His labs return with an unexpected finding.',
      'A 55-year-old male is referred for an incidentally discovered coagulation abnormality on a pre-employment physical. He has never had a bleeding episode. Physical exam is unremarkable.',
      'A 50-year-old male presents for pre-admission testing before a cholecystectomy. He denies any bleeding tendencies. His surgeon is puzzled by an isolated, markedly elevated PTT on his routine panel.',
    ],
    teachingPoint: 'Factor XII (Hageman factor) deficiency causes a markedly prolonged PTT with normal PT, normal platelet count, and — critically — NO clinical bleeding. Factor XII initiates contact activation in vitro (the lab tube) but is not required for hemostasis in vivo. Paradox: Mr. Hageman (the index patient) died of a pulmonary embolism, not bleeding. No treatment is required.',
  },
  {
    id: 'factor_vii',
    name: 'Factor VII Deficiency',
    category: 'extrinsic pathway',
    factor: 'Factor VII',
    treatment: 'Factor VIIa',
    genPanel: () => ({
      pt: randInt(22, 42),
      ptt: randInt(25, 35),
      platelets: randInt(180, 390),
      bleedingTime: randFloat(2, 9, 1),
      morphology: 'Normal',
      dDimer: null,
    }),
    vignettes: [
      'A 28-year-old female with a family history of a bleeding disorder presents with easy bruising and prolonged bleeding after minor cuts. Her father reportedly has a similar condition. Pre-surgical labs reveal an isolated coagulation abnormality.',
      'A 6-year-old boy is found to have an isolated prolonged PT on pre-operative screening before tonsillectomy. He has a history of mild epistaxis but no hemarthroses. His mother denies a family bleeding history.',
      'A 22-year-old female presents for evaluation of heavy menstrual bleeding and prolonged post-dental-extraction bleeding since childhood. Her aPTT is normal but another coagulation parameter is elevated.',
    ],
    teachingPoint: 'Factor VII deficiency causes an isolated prolonged PT because Factor VII is only in the extrinsic pathway (tissue factor + VII activate Factor X). PTT is normal — the intrinsic and common pathways are intact. Rare autosomal recessive disorder. Treat with recombinant Factor VIIa (NovoSeven) or FFP. Memory hook: PT monitors the extrinsic pathway (Factor VII, warfarin, early vitamin K deficiency).',
  },
];

export function generateCoagCase(disorder) {
  return {
    vignette: rand(disorder.vignettes),
    panel: disorder.genPanel(),
  };
}
