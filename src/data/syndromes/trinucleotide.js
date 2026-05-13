// =============================================================================
// syndromes/trinucleotide.js — Trinucleotide repeat expansion disorders
// Exports: SYNDROMES_TRINUCLEOTIDE
//
// Each syndrome object schema (in addition to shared fields):
//   keyCardiac (string), cardiacOptions (string[]),
//   keyComplication (string), complicationOptions (string[]),
//   pmhPool? (array), shxPool? (array)
// =============================================================================

import { rand, randInt, randFloat } from '../../utils/random.js';
import { RH_PMH, RH_SHX } from '../patient.js';

export const SYNDROMES_TRINUCLEOTIDE = [
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
    clue:'Middle-aged adult with progressive gait ataxia + scanning dysarthria + cerebellar dysmetria + ± pyramidal signs + AUTOSOMAL DOMINANT family history of adult-onset ataxia → Spinocerebellar ataxia (SCA). AD CAG polyglutamine expansion in one of several genes (ATXN1/2/3/6/7; CACNA1A for SCA6); SCA3 (Machado-Joseph) is the most common subtype worldwide. ANTICIPATION (paternal transmission > maternal). MRI: cerebellar + pontine atrophy ± "hot cross bun" sign (SCA2/3).'
  }
];
