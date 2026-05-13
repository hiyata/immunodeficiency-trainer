// =============================================================================
// patient.js — Name arrays and demographic PMH/SHX pools
// Exports: FIRST_M, FIRST_F, LAST,
//          RH_PMH, RH_SHX,
//          NEONATAL_PMH, NEONATAL_SHX,
//          PEDIATRIC_PMH, PEDIATRIC_SHX,
//          ADOLESCENT_PMH, ADOLESCENT_SHX,
//          ADULT_PMH, ADULT_SHX,
//          ELDERLY_PMH, ELDERLY_SHX,
//          CHILD_HEALTHY_PMH, CHILD_HEALTHY_SHX,
//          YOUNG_ADULT_PMH, YOUNG_ADULT_SHX
// =============================================================================

export const FIRST_M = ['James','William','Lucas','Ethan','Mason','Noah','Liam','Oliver','Daniel','Henry','Aiden','Caleb','Owen','Wyatt','Sebastian','Marcus','Theo','Jamal','Andre','Diego','Kenji','Arjun','Malik','Dmitri','Finn','Mateo','Hiroshi', 'Gwimbly'];
export const FIRST_F = ['Emma','Sophia','Olivia','Ava','Charlotte','Mia','Amelia','Harper','Evelyn','Abigail','Eloise','Nora','Lila','Maya','Aisha','Priya','Lucia','Zara','Naomi','Imani','Sienna','Yuki','Elena','Camila','Freya','Anika','Beatriz'];
export const LAST = ['Patel','Garcia','Kim','Nguyen','Okafor','Rodriguez','Martinez','Johnson','Williams','Brown','Tanaka','Singh','O\'Brien','Cohen','Andersen','Petrov','Hassan','Reyes','Mbeki','Schmidt','Liu','Romano','Bishara','Larsson','Dubois','Park','Nakamura'];

// Past medical / social pools for older children & adults (immunodeficiency mode)
export const RH_PMH = ['Wears glasses for mild myopia','Mild seasonal allergies','Right ankle sprain last fall, fully resolved','No known drug allergies','Wisdom teeth extracted last year','Has braces','Lactose intolerant','Birth: spontaneous vaginal delivery at 39 weeks, uncomplicated'];
export const RH_SHX = ['Lives at home with parents and one younger sibling','Plays soccer on the school team','Family owns a Labrador retriever','Mother is an accountant, father is a high-school teacher','Father is a firefighter, mother is a nurse','In the school chess club','Recently returned from a beach vacation in Florida','Honor roll student','Plays clarinet in the school band','Has a pet goldfish named Captain'];

// Newborn-appropriate pools (trisomy mode)
export const NEONATAL_PMH = [
  'Birth: spontaneous vaginal delivery at 38+2 weeks gestation',
  'Birth: cesarean delivery for non-reassuring fetal heart tracing at 37+5 weeks',
  'Apgar scores 7 and 9 at 1 and 5 minutes',
  'Apgar scores 4 and 6 at 1 and 5 minutes — required brief positive-pressure ventilation in the delivery room',
  'Routine vitamin K, erythromycin eye ointment, and hepatitis B vaccine administered at birth',
  'Newborn metabolic and hearing screens are pending at the time of evaluation',
  'No known drug allergies'
];
export const NEONATAL_SHX = [
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
export const PEDIATRIC_PMH = [
  'Term birth via spontaneous vaginal delivery at 39 weeks; appropriate for gestational age',
  'Routine immunizations are up to date through the 12-month visit',
  'Newborn metabolic and hearing screens were normal',
  'No known drug allergies',
  'Followed in early intervention since 9 months of age for global developmental delay',
  'One prior emergency department visit at 14 months for febrile illness, no admission',
  'Mild eczema managed with emollients'
];
export const PEDIATRIC_SHX = [
  'Lives at home with both parents and an older sister, age 5, who is healthy and developmentally appropriate',
  'Cared for by maternal grandmother during the day while parents are at work',
  'Attends a community-based early-intervention program three afternoons per week',
  'Mother is a pediatric nurse; father is a software engineer',
  'No tobacco smoke or other environmental exposures in the home',
  'Family recently moved from a different state; this is the first visit with the current pediatrician',
  'Family has one indoor cat; no other pets'
];

// Adolescent / young-adult pools (Klinefelter, Turner)
export const ADOLESCENT_PMH = [
  'Immunizations are up to date including HPV and meningococcal series',
  'No known drug allergies',
  'Mild seasonal allergic rhinitis managed with cetirizine as needed',
  'One prior dental extraction under local anesthesia, uncomplicated',
  'No prior hospitalizations',
  'Annual well-adolescent visits at the pediatrician\'s office have otherwise been unremarkable',
  'Routine hearing and vision screens at school were within normal limits'
];
export const ADOLESCENT_SHX = [
  'Lives at home with both parents and one younger sibling',
  'In the 9th grade at the local public high school; grades are average',
  'Active in the school marching band',
  'Mother is a paralegal; father is a small-business owner',
  'Denies use of alcohol, tobacco, or recreational drugs',
  'No current sexual activity reported',
  'Family pet is a Labrador retriever; no other significant environmental exposures'
];

// Adult pools (Huntington, SCA, myotonic dystrophy, adult-onset disorders)
export const ADULT_PMH = [
  'Hypertension controlled on amlodipine 5 mg daily',
  'No known drug allergies',
  'Prior cholecystectomy at age 38 without complications',
  'Routine colorectal cancer screening was negative two years ago',
  'No prior hospitalizations apart from an uncomplicated childbirth',
  'Annual physical examinations have been unremarkable until the current presentation',
  'Mild gastroesophageal reflux managed with as-needed omeprazole'
];
export const ADULT_SHX = [
  'Married for 18 years; has two healthy children, ages 14 and 12',
  'Works as an accountant at a regional firm',
  'Drinks one or two glasses of wine on weekends; denies tobacco or illicit drug use',
  'Lives with their spouse in a single-family home in the suburbs',
  'Father, age 68, has hypertension; mother, age 65, is well',
  'No recent travel outside the United States',
  'Exercises by walking the family dog daily; no formal sports'
];

// Elderly pools (hematologic malignancies — CLL, multiple myeloma, polycythemia vera, etc.)
export const ELDERLY_PMH = [
  'Hypertension well controlled on losartan 50 mg daily',
  'Hyperlipidemia on atorvastatin 20 mg nightly',
  'Type 2 diabetes mellitus controlled with metformin (HbA1c 6.8% three months ago)',
  'Mild osteoarthritis of the knees managed with as-needed acetaminophen',
  'Cataract extraction with intraocular lens placement two years ago, uncomplicated',
  'Benign prostatic hyperplasia on tamsulosin',
  'Annual colonoscopy three years ago with two tubular adenomas removed; surveillance recommended in five years',
  'No known drug allergies',
  'Up to date on age-appropriate vaccinations including pneumococcal and zoster'
];
export const ELDERLY_SHX = [
  'Retired schoolteacher; married to current spouse for 42 years',
  'Lives with spouse in a single-family home; both ambulatory and independent in activities of daily living',
  'Drinks one or two glasses of wine on weekends; denies tobacco use after quitting 25 years ago',
  'Former smoker — 30 pack-year history, quit at age 58',
  'Walks two miles daily for exercise',
  'Three adult children, all in good health; six grandchildren',
  'Active in a community senior center and a faith community',
  'No recent travel outside the United States'
];

// Healthy school-age child pools (ALL, Burkitt lymphoma)
export const CHILD_HEALTHY_PMH = [
  'Routine immunizations are up to date for age',
  'Newborn metabolic and hearing screens were normal',
  'No known drug allergies',
  'Birth was a term, spontaneous vaginal delivery without complications',
  'Has met all developmental milestones at appropriate ages',
  'Two prior pediatrician visits in the past year for routine viral upper respiratory illnesses',
  'No hospitalizations or surgical procedures',
  'Wears prescription glasses for mild myopia'
];
export const CHILD_HEALTHY_SHX = [
  'Lives at home with both parents and an older sibling in good health',
  'In the second grade at the local public elementary school; grades and behavior are reportedly excellent',
  'Plays on a youth soccer team in the fall and spring',
  'Family has one indoor dog; no other pets',
  'Mother is a graphic designer; father teaches high-school history',
  'No tobacco smoke or other environmental exposures in the home',
  'Has not traveled outside the United States',
  'No family history of childhood cancer or known cancer-predisposition syndromes'
];

// Young-adult pool (Hodgkin lymphoma, Burkitt in adolescents)
export const YOUNG_ADULT_PMH = [
  'No chronic medical conditions; baseline state of health',
  'No known drug allergies',
  'Annual physical examinations have been unremarkable until the current presentation',
  'Routine vaccinations including HPV and meningococcal series are up to date',
  'Prior elective wisdom-tooth extraction under local anesthesia, uncomplicated',
  'Mild seasonal allergic rhinitis managed with as-needed loratadine',
  'No prior hospitalizations'
];
export const YOUNG_ADULT_SHX = [
  'College student majoring in business administration; lives in a campus apartment',
  'Recent graduate working in entry-level finance; lives in a shared apartment with two roommates',
  'Drinks alcohol socially on weekends; denies tobacco or recreational drug use',
  'Sexually active with one current partner; uses barrier protection',
  'Plays recreational basketball with a local league',
  'No recent travel outside the United States',
  'Parents are both in good health; no family history of malignancy'
];
