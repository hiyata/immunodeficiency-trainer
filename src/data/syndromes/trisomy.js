// =============================================================================
// syndromes/trisomy.js — Chromosomal, imprinting, and sex-chromosome disorders
// Exports: SYNDROMES_TRISOMY
//
// Each syndrome object schema (in addition to the shared fields):
//   keyCardiac (string), cardiacOptions (string[]),
//   keyComplication (string), complicationOptions (string[]),
//   pmhPool? (array), shxPool? (array)
//   (extraLabs receives the patient object for karyotype sex-matching)
// =============================================================================

import { rand, randInt, randFloat } from '../../utils/random.js';
import { PEDIATRIC_PMH, PEDIATRIC_SHX, ADOLESCENT_PMH, ADOLESCENT_SHX } from '../patient.js';

export const SYNDROMES_TRISOMY = [
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
    id:'klinefelter', name:'Klinefelter Syndrome (47,XXY)', short:'Klinefelter', category:'Sex Chromosome Aneuploidy',
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
