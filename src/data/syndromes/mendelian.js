// =============================================================================
// syndromes/mendelian.js — Inherited multisystem (single-gene Mendelian) disorders
// Exports: SYNDROMES_MENDELIAN
//
// Each syndrome object schema (in addition to shared fields):
//   keyCardiac (string), cardiacOptions (string[]),
//   keyComplication (string), complicationOptions (string[]),
//   pmhPool? (array), shxPool? (array)
// =============================================================================

import { rand, randInt } from '../../utils/random.js';
import { PEDIATRIC_PMH, PEDIATRIC_SHX, RH_PMH, RH_SHX } from '../patient.js';

export const SYNDROMES_MENDELIAN = [
  {
    id:'cf', name:'Cystic Fibrosis', short:'CF', category:'CFTR Channelopathy',
    sex:'any', ageMin:0.3, ageMax:8,
    pmhPool: PEDIATRIC_PMH, shxPool: PEDIATRIC_SHX,
    defect:'CFTR loss-of-function',
    inheritance:'Autosomal recessive — both parents must be carriers; carrier frequency is approximately 1 in 25 in individuals of Northern European descent',
    mechanism:'Defective apical CFTR chloride conductance. In the airway and pancreatic-duct epithelia, loss of Cl⁻ secretion produces dehydrated, viscous mucous → impaired mucociliary clearance and ductal plugging. In the sweat gland, the same defect impairs Cl⁻ (and Na⁺) reabsorption from the duct lumen, producing pathologically elevated sweat chloride and "salty" sweat.',
    diagnosticTest:'Sweat chloride and CFTR mutation analysis',
    keyOrganism:'Pseudomonas aeruginosa',
    organismOptions:[
      'Pseudomonas aeruginosa',
      'Staphylococcus aureus',
      'Haemophilus influenzae (non-typeable)',
      'Burkholderia cepacia complex',
      'Aspergillus fumigatus',
      'Streptococcus pneumoniae'
    ],
    keyCardiac:'',
    cardiacOptions:[],
    keyComplication:'Exocrine pancreatic insufficiency',
    complicationOptions:[
      'Exocrine pancreatic insufficiency',
      'Congenital absence of the vas deferens',
      'Meconium ileus',
      'Coarse facial features with corneal clouding',
      'Spontaneous aortic dissection'
    ],
    cc: () => rand([
      'infant with persistent cough, frequent loose stools, and failure to thrive',
      'toddler with recurrent pneumonia and a positive newborn screening result',
      'school-age boy with chronic productive cough, nasal polyps, and digital clubbing',
      'newborn with bilious vomiting and an abdominal radiograph showing distal small-bowel obstruction'
    ]),
    pathognomonic:[
      'Quantitative pilocarpine iontophoresis demonstrates a sweat chloride of 92 mEq/L on two separate determinations (diagnostic threshold ≥60 mEq/L)',
      'Newborn screen demonstrated markedly elevated immunoreactive trypsinogen (IRT) prompting subsequent CFTR mutation analysis, which revealed homozygosity for the ΔF508 deletion',
      'Mother reports that when she kisses the patient on the forehead his skin tastes notably salty',
      'Sputum culture has grown mucoid Pseudomonas aeruginosa on three separate occasions over the past year'
    ],
    classic:[
      'History of meconium ileus diagnosed on day-of-life 2 requiring water-soluble contrast enema for relief',
      'Recurrent lower respiratory tract infections requiring intravenous antibiotics — the patient has been admitted three times in the past year for "pulmonary exacerbations"',
      'Bulky, foul-smelling, greasy stools occurring three to five times per day',
      'Weight and height tracking below the 3rd percentile despite a reportedly voracious appetite',
      'Chest CT shows bilateral upper-lobe-predominant bronchiectasis with mucus plugging',
      'Stool elastase is markedly low (<50 μg/g; normal >200) consistent with exocrine pancreatic insufficiency'
    ],
    supportive:[
      'Maternal grandfather also had "lung troubles" his whole life and died in his 40s of pneumonia',
      'Currently on pancreatic enzyme replacement with meals and fat-soluble vitamin supplementation',
      'No prior gastrointestinal surgery apart from the contrast enema in infancy'
    ],
    pe_pathognomonic:[
      'Skin tastes notably salty when kissed (reported by the parent and confirmed on examination)',
      'Bilateral nasal polyps obstructing the middle meatus on anterior rhinoscopy',
      'Marked digital clubbing of all twenty digits with loss of the Lovibond angle'
    ],
    pe_classic:[
      'Diffuse coarse crackles with scattered expiratory wheezing on auscultation of the lung fields',
      'Abdomen is mildly distended with hyperactive bowel sounds; the liver edge is palpable 2 cm below the right costal margin',
      'Weight and height plot below the 3rd percentile for age on the growth curve',
      'Increased anteroposterior chest diameter ("barrel chest") with mild pectus carinatum'
    ],
    pe_supportive:[
      'Skin examination is otherwise unremarkable apart from the salty residue',
      'No coarsening of facial features; no organomegaly beyond the noted hepatomegaly'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: () => ({ sweat: randInt(78, 112), irt: randInt(180, 320) }),
    extraNormals:{ sweat:'<30 mEq/L is normal; 30–59 indeterminate; ≥60 diagnostic of CF', irt:'<60 ng/mL on newborn screen' },
    differential:'',
    clue:'Infant/child with recurrent sinopulmonary infections (S. aureus → Pseudomonas) + pancreatic insufficiency (steatorrhea, failure to thrive, ADEK deficiency) + meconium ileus history + nasal polyps + clubbing + SALTY skin → Cystic fibrosis. AUTOSOMAL RECESSIVE CFTR mutation (chr 7q31.2); ΔF508 (~70% of mutations) is a Class II misfolding mutation — protein retained in ER and degraded by proteasome. Sweat Cl⁻ ≥60 mEq/L diagnostic. Newborn screen: elevated IRT. Adult complications: CBAVD → male infertility, CF-related diabetes, nasal polyps, distal intestinal obstruction syndrome.'
  },
  {
    id:'hurler', name:'Hurler Syndrome (MPS I-H)', short:'Hurler', category:'Lysosomal Storage Disease',
    sex:'any', ageMin:1.0, ageMax:5.0,
    pmhPool: PEDIATRIC_PMH, shxPool: PEDIATRIC_SHX,
    defect:'α-L-iduronidase deficiency',
    inheritance:'Autosomal recessive — both copies of IDUA must carry pathogenic variants for the severe (Hurler) phenotype',
    mechanism:'Deficient α-L-iduronidase cannot remove terminal α-L-iduronic acid residues from dermatan and heparan sulfate. Undegraded glycosaminoglycans accumulate in lysosomes of fibroblasts, hepatocytes, splenocytes, chondrocytes, cardiac valves, corneal stroma, and CNS neurons → multisystem disease that is fatal in the first decade without treatment.',
    diagnosticTest:'Leukocyte α-L-iduronidase enzyme activity',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'Mitral and aortic valve thickening',
    cardiacOptions:[
      'Mitral and aortic valve thickening',
      'Concentric hypertrophic cardiomyopathy',
      'Bicuspid aortic valve with coarctation',
      'Complete atrioventricular septal defect',
      'Spontaneous arterial dissection'
    ],
    keyComplication:'Death from cardiorespiratory failure',
    complicationOptions:[
      'Death from cardiorespiratory failure',
      'Spontaneous arterial rupture',
      'Increased risk of acute lymphoblastic leukemia',
      'Sudden cardiac death from ventricular arrhythmia',
      'Early-onset Alzheimer disease'
    ],
    cc: () => rand([
      'toddler with progressive coarsening of the facial features and developmental regression',
      'toddler followed by ophthalmology for bilateral corneal clouding with new joint stiffness',
      'preschooler with hepatosplenomegaly, recurrent ear infections, and a "gargoyle-like" facial appearance',
      'toddler with developmental regression, hepatosplenomegaly, and short stature'
    ]),
    pathognomonic:[
      'Leukocyte α-L-iduronidase activity is markedly reduced at 0.4 nmol/h/mg protein (normal 30–100)',
      'Quantitative urinary glycosaminoglycan analysis shows markedly elevated total GAGs with a predominance of dermatan sulfate and heparan sulfate on two-dimensional electrophoresis',
      'Slit-lamp examination demonstrates bilateral diffuse stromal corneal clouding obscuring iris detail',
      'Skeletal survey demonstrates the classic features of dysostosis multiplex: thickened diaphyses, ovoid vertebral bodies, anterior beaking of the lumbar vertebrae with a gibbus deformity at the thoracolumbar junction, J-shaped sella turcica, and proximal tapering of the metacarpals'
    ],
    classic:[
      'Onset of symptoms between 6 and 18 months of age following an apparently normal initial development',
      'Progressive coarsening of the facial features with frontal bossing, depressed nasal bridge, macroglossia, and a persistently open mouth',
      'Developmental regression after the second birthday — the patient has lost previously-acquired words and motor milestones',
      'Hepatosplenomegaly with the liver edge palpable 5 cm and the spleen tip 4 cm below their respective costal margins',
      'Joint stiffness producing a "claw-hand" deformity with restricted finger extension',
      'Recurrent otitis media with persistent middle-ear effusions and conductive hearing loss; recurrent upper-airway obstruction during sleep'
    ],
    supportive:[
      'Mother and father are both healthy; the patient has an unaffected older sister, age 7',
      'No known consanguinity reported by the family',
      'Birth was uncomplicated at 39 weeks with appropriate birth weight'
    ],
    pe_pathognomonic:[
      'Bilateral diffuse stromal corneal clouding obscuring iris detail on slit-lamp examination',
      'Coarse facial features with frontal bossing, depressed nasal bridge, hypertelorism, macroglossia, and a persistently open mouth',
      'Gibbus deformity (angular kyphosis) at the thoracolumbar junction palpable on inspection of the back'
    ],
    pe_classic:[
      'Hepatosplenomegaly — liver edge 5 cm and spleen 4 cm below their respective costal margins',
      'Bilateral "claw-hand" deformity with marked restriction of finger extension and short, broad fingers',
      'Holosystolic murmur at the apex radiating to the axilla, consistent with mitral regurgitation',
      'Short stature, with height at the 1st percentile despite normal birth length',
      'Bilateral umbilical and inguinal hernias'
    ],
    pe_supportive:[
      'Thickened, coarse scalp hair with low frontal hairline',
      'Hirsute appearance over the back and shoulders'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: () => ({ enzyme:'α-L-iduronidase activity markedly reduced (<5% of normal)', gags:'Elevated total urinary GAGs with predominant dermatan sulfate and heparan sulfate' }),
    extraNormals:{ enzyme:'normal leukocyte α-L-iduronidase activity 30–100 nmol/h/mg protein', gags:'urinary GAGs age-appropriate' },
    differential:'hunter',
    clue:'Toddler (1–5 yr) of either sex with COARSE FACIES + corneal CLOUDING + hepatosplenomegaly + dysostosis multiplex (gibbus at thoracolumbar junction) + claw-hand + cardiac valve disease + developmental regression → Hurler syndrome (MPS I-H). AUTOSOMAL RECESSIVE α-L-iduronidase deficiency (IDUA, chr 4) → accumulation of dermatan + heparan sulfate. Death from cardiorespiratory failure by age 10 if untreated; ERT (laronidase) and HSCT before age 2 are effective. Step 1 differential: Hunter (MPS II) — X-linked recessive (boys only), iduronate-2-sulfatase deficiency, NO corneal clouding, pebbling skin papules.'
  },
  {
    id:'hunter', name:'Hunter Syndrome (MPS II)', short:'Hunter', category:'Lysosomal Storage Disease',
    sex:'M', ageMin:2.0, ageMax:6.0,
    pmhPool: PEDIATRIC_PMH, shxPool: PEDIATRIC_SHX,
    defect:'Iduronate-2-sulfatase deficiency',
    inheritance:'X-linked recessive — predominantly affects males; rare female cases have been reported with skewed X-inactivation',
    mechanism:'Deficient iduronate-2-sulfatase cannot remove the 2-O-sulfate group from iduronate-2-sulfate residues in dermatan and heparan sulfate. Undegraded GAGs accumulate in lysosomes throughout the body. The phenotype overlaps that of Hurler (MPS I) but with two key differences: corneal clouding is ABSENT and progression is generally slower.',
    diagnosticTest:'Leukocyte iduronate-2-sulfatase enzyme activity',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'Mitral and aortic valve thickening',
    cardiacOptions:[
      'Mitral and aortic valve thickening',
      'Concentric hypertrophic cardiomyopathy',
      'Bicuspid aortic valve with coarctation',
      'Complete atrioventricular septal defect',
      'Spontaneous arterial dissection'
    ],
    keyComplication:'Progressive mixed hearing loss',
    complicationOptions:[
      'Progressive mixed hearing loss',
      'Bilateral corneal clouding',
      'Spontaneous arterial rupture',
      'Acute lymphoblastic leukemia',
      'Premature ovarian failure'
    ],
    cc: () => rand([
      'preschool boy with progressive coarsening of facial features, joint stiffness, and worsening hearing',
      'preschool boy with developmental regression, hepatosplenomegaly, and marked behavioral aggression',
      'preschool boy referred for evaluation of "Hurler-like" features but normal corneas on ophthalmologic exam',
      'preschool boy with hepatosplenomegaly, coarse facies, and recurrent ear infections'
    ]),
    pathognomonic:[
      'Leukocyte iduronate-2-sulfatase activity is markedly reduced at 0.6 nmol/h/mg protein with NORMAL α-L-iduronidase activity (which excludes Hurler syndrome)',
      'Multiple ivory-colored, firm, "pebble-like" papules are present in a reticular pattern over the scapulae and the lateral aspects of the upper arms bilaterally',
      'Slit-lamp examination demonstrates clear corneas bilaterally with no stromal opacity (a key distinguishing feature from Hurler syndrome)',
      'Skeletal survey shows dysostosis multiplex without the prominent gibbus deformity characteristic of Hurler'
    ],
    classic:[
      'Onset of symptoms after age 2 following apparently normal early development',
      'Progressive coarsening of the facial features with depressed nasal bridge, macroglossia, and an open-mouth posture',
      'Hepatosplenomegaly with the liver edge palpable 4 cm and the spleen 3 cm below their respective costal margins',
      'Joint stiffness with restricted shoulder, hip, and finger extension',
      'Progressive bilateral hearing loss with mixed sensorineural and conductive components',
      'A history of his maternal uncle dying at age 14 with a similar clinical picture; the patient\'s mother is healthy'
    ],
    supportive:[
      'Behavioral problems including aggression, hyperactivity, and disruptive behavior reported at preschool',
      'Recurrent otitis media with tympanostomy tubes placed at ages 2 and 4',
      'Mother is the only daughter of two unaffected parents; the family is otherwise reportedly healthy'
    ],
    pe_pathognomonic:[
      'Multiple ivory-colored, firm, "pebble-like" papules in a reticular pattern over the scapulae and posterior axillary lines bilaterally',
      'CLEAR corneas bilaterally on slit-lamp examination — no stromal opacity (a key distinguishing feature from Hurler syndrome)',
      'Coarse facial features with frontal bossing, depressed nasal bridge, macroglossia, and an open-mouth posture'
    ],
    pe_classic:[
      'Hepatosplenomegaly — liver edge 4 cm and spleen 3 cm below their respective costal margins',
      'Joint stiffness with restricted range of motion at the shoulders, hips, elbows, and fingers',
      'Holosystolic murmur at the apex radiating to the axilla, consistent with mitral regurgitation',
      'Short stature, with height at the 5th percentile for age'
    ],
    pe_supportive:[
      'Thickened, coarse scalp hair with synophrys (a single fused eyebrow)',
      'Bilateral umbilical and inguinal hernias'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: () => ({ enzyme:'Iduronate-2-sulfatase activity markedly reduced (<5% of normal); α-L-iduronidase activity normal', gags:'Elevated total urinary GAGs with predominant dermatan sulfate and heparan sulfate' }),
    extraNormals:{ enzyme:'normal leukocyte iduronate-2-sulfatase activity 100–300 nmol/h/mg protein', gags:'urinary GAGs age-appropriate' },
    differential:'hurler',
    clue:'Preschool BOY (X-linked) with coarse facies + hepatosplenomegaly + dysostosis multiplex + joint stiffness + CLEAR corneas (NOT cloudy) + ivory "pebbling" papules over scapulae (pathognomonic) + aggressive behavior + maternal-family history of similarly-affected males → Hunter syndrome (MPS II). The ONLY X-LINKED RECESSIVE MPS — iduronate-2-sulfatase deficiency (IDS, Xq28) → accumulation of dermatan + heparan sulfate. Step 1 differential: Hurler (MPS I) — AR, α-L-iduronidase deficiency, WITH corneal clouding, no skin pebbling, both sexes, earlier and more severe progression.'
  },
  {
    id:'ceds', name:'Ehlers-Danlos Syndrome — Classical Type (cEDS)', short:'cEDS', category:'Connective Tissue Disorder',
    sex:'any', ageMin:8, ageMax:25,
    pmhPool: RH_PMH, shxPool: RH_SHX,
    defect:'COL5A1 haploinsufficiency',
    inheritance:'Autosomal dominant — half of the offspring of an affected parent are affected; sporadic de novo mutations also occur',
    mechanism:'Type V collagen is a quantitatively minor fibril-forming collagen that nucleates and regulates the diameter of type I collagen fibrils in skin, tendons, ligaments, and other soft tissues. Loss of one functional COL5A1 allele (haploinsufficiency) yields disorganized, abnormally large collagen fibrils with markedly reduced tensile strength.',
    diagnosticTest:'Clinical criteria and COL5A1 sequencing',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'',
    cardiacOptions:[],
    keyComplication:'Recurrent joint dislocations',
    complicationOptions:[
      'Recurrent joint dislocations',
      'Spontaneous arterial rupture',
      'Progressive corneal clouding',
      'Death from cardiorespiratory failure',
      'Chronic Pseudomonas colonization'
    ],
    cc: () => rand([
      'adolescent with unusually stretchy skin that bruises easily and several poorly-healing scars',
      'adolescent with recurrent shoulder and patellar dislocations and chronic joint pain',
      'young adult with a lifelong history of poorly-healing scars and joint hypermobility',
      'adolescent referred for evaluation of "double-jointedness" and a recent diagnosis of dysautonomia'
    ]),
    pathognomonic:[
      'Skin can be stretched 4–5 cm at the volar surface of the forearm and returns slowly to baseline ("rubbery" hyperextensibility)',
      'Atrophic "cigarette-paper" scars are visible over the knees, elbows, shins, and forehead — these are thin, papyraceous, and widened well beyond the size of the original injury',
      'Sequencing of COL5A1 identified a heterozygous loss-of-function variant (c.1502+1G>A, splice donor)'
    ],
    classic:[
      'Lifelong history of poor wound healing — small lacerations of the forehead and chin in childhood healed into widened, depressed, papyraceous scars despite appropriate suturing',
      'Recurrent atraumatic dislocations of the right shoulder (six separate events) and patellae bilaterally (three events)',
      'Easy bruising — extensive ecchymoses appear after trivial pressure or unrecognized trauma',
      'Beighton hypermobility score of 8 out of 9',
      'Mother and one maternal aunt have a similar phenotype of hyperextensible skin and frequent joint dislocations'
    ],
    supportive:[
      'No history of cardiac, gastrointestinal, or arterial complications to date',
      'Otherwise healthy; growth and development have been normal',
      'No known consanguinity in the family'
    ],
    pe_pathognomonic:[
      'Marked skin hyperextensibility — pinched volar forearm skin stretches 4–5 cm before springing back',
      'Multiple atrophic "cigarette-paper" scars over the forehead, knees, elbows, and shins — widened, thin, and depressed',
      'Beighton hypermobility score 8/9: passive thumb-to-forearm apposition bilaterally, 5th-finger metacarpophalangeal hyperextension >90° bilaterally, elbow hyperextension >10° bilaterally, knee hyperextension >10° bilaterally, palms-flat-to-floor on forward flexion with knees straight'
    ],
    pe_classic:[
      'Numerous ecchymoses of varying age over the lower extremities and forearms without a recalled history of trauma',
      'Resting reflexes and neurologic examination are otherwise normal',
      'Cardiac auscultation is unremarkable with no murmur or click',
      'Mild pes planus bilaterally with hyperextensible distal interphalangeal joints'
    ],
    pe_supportive:[
      'Soft, velvety skin texture on palpation of the dorsal forearm',
      'Several molluscoid pseudotumors are palpable over the elbows and knees'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: () => ({ collagen:'Heterozygous loss-of-function variant in COL5A1 (type V collagen) identified by targeted sequencing' }),
    extraNormals:{ collagen:'no pathogenic variants in collagen genes' },
    differential:'veds',
    clue:'Adolescent / young adult with hyperextensible "stretchy" skin + ATROPHIC "cigarette-paper" scars + generalized joint hypermobility (Beighton ≥5) + recurrent dislocations + easy bruising + AD family history → Classical EDS. AUTOSOMAL DOMINANT haploinsufficiency of TYPE V collagen (COL5A1 > COL5A2) → poorly-organized type I collagen fibrils. Step 1 differential: Vascular EDS — COL3A1 (type III collagen), arterial/sigmoid/uterine rupture, thin translucent skin with visible veins, LIMITED joint hypermobility (digits only).'
  },
  {
    id:'veds', name:'Ehlers-Danlos Syndrome — Vascular Type (vEDS)', short:'vEDS', category:'Connective Tissue Disorder',
    sex:'any', ageMin:14, ageMax:38,
    pmhPool: RH_PMH, shxPool: RH_SHX,
    defect:'COL3A1 dominant-negative mutation',
    inheritance:'Autosomal dominant; approximately 50% of cases arise from de novo mutations. Median life expectancy is approximately 50 years; major vascular events typically occur before age 40.',
    mechanism:'Type III collagen is a major structural component of distensible tissues — arterial walls, the gastrointestinal tract, and the uterus. Most pathogenic COL3A1 variants produce a structurally abnormal pro-α1(III) chain that disrupts triple-helix formation (dominant-negative) → markedly reduced tensile strength of vascular and visceral connective tissue → spontaneous rupture.',
    diagnosticTest:'COL3A1 sequencing',
    keyOrganism:'',
    organismOptions:[],
    keyCardiac:'',
    cardiacOptions:[],
    keyComplication:'Spontaneous arterial or visceral rupture',
    complicationOptions:[
      'Spontaneous arterial or visceral rupture',
      'Recurrent joint dislocations',
      'Progressive corneal clouding',
      'Bilateral posterior subcapsular cataracts',
      'Chronic Pseudomonas colonization'
    ],
    cc: () => rand([
      'young adult brought to the emergency department with sudden severe left-flank pain and hypotension — CT angiography demonstrates a ruptured splenic artery aneurysm',
      'young adult with sudden severe left lower quadrant abdominal pain and free intraperitoneal air on CT, consistent with spontaneous sigmoid colon perforation',
      'young adult evaluated after a sibling died unexpectedly of a "vascular event" at age 32',
      'young adult woman in the third trimester of pregnancy with sudden hypotension and abdominal pain — found to have uterine rupture'
    ]),
    pathognomonic:[
      'Sequencing of COL3A1 demonstrates a heterozygous glycine substitution within the triple-helical domain (c.2032G>A, p.Gly678Ser)',
      'CT angiography of the abdomen demonstrates active extravasation from a ruptured splenic artery aneurysm with associated hemoperitoneum',
      'CT of the abdomen demonstrates free intraperitoneal air with a sigmoid colon perforation in the absence of diverticular disease',
      'Echocardiography shows mild dilation of the aortic root at 4.2 cm with a normal valve'
    ],
    classic:[
      'Skin of the chest and abdomen is thin and translucent with prominent visible venous markings (the "see-through" skin of vEDS)',
      'Sudden severe abdominal pain at age 24 with rapid hemodynamic deterioration, ultimately attributed to a spontaneous splenic-artery rupture',
      'Easy bruising — extensive ecchymoses appear after trivial pressure or unrecognized trauma',
      'A father who died unexpectedly at age 38 of a "blood-vessel rupture" of unclear etiology',
      'No history of joint hypermobility apart from passive hyperextension of the small joints of the fingers',
      'History of multiple cigarette-paper scars but to a much lesser degree than seen in classical EDS'
    ],
    supportive:[
      'No prior surgical history apart from the current emergency exploration',
      'No history of unusual joint dislocations',
      'Mother is healthy; father died at age 38 of presumed "aortic aneurysm rupture"'
    ],
    pe_pathognomonic:[
      'Skin of the chest, abdomen, and lower extremities is thin and translucent — superficial venous markings are easily visible without venous distention',
      'Characteristic facial features: thin pinched nose with a narrow alar base, thin upper lip, prominent eyes with hollowing of the cheeks, and small ears with absent earlobes',
      'Acrogeria: the skin of the dorsum of the hands appears prematurely aged with prominent visible veins and tendon outlines'
    ],
    pe_classic:[
      'Extensive ecchymoses of varying age over the abdomen, flanks, and extremities without a recalled history of trauma',
      'Cardiac examination demonstrates a soft mid-systolic click at the apex (mitral valve prolapse)',
      'Joint examination shows hypermobility limited to the small joints of the fingers (Beighton score 2/9, all in the digits); the larger joints are normal',
      'Mild skin hyperextensibility on the volar forearm — much less than seen in classical EDS'
    ],
    pe_supportive:[
      'Several molluscoid pseudotumors are noted over both knees',
      'Mild kyphoscoliosis'
    ],
    labs:{},
    keyLabs:[],
    extraLabs: () => ({ collagen:'Heterozygous glycine-substitution variant in COL3A1 (type III collagen) identified by targeted sequencing — dominant-negative mechanism' }),
    extraNormals:{ collagen:'no pathogenic variants in collagen genes' },
    differential:'ceds',
    clue:'Young adult presenting with SPONTANEOUS arterial rupture, sigmoid colon perforation, or uterine rupture in pregnancy + THIN TRANSLUCENT skin with visible veins + characteristic facies (thin nose/lips, prominent eyes, hollow cheeks, acrogeria) + extensive easy bruising + AD family history of early "vascular events" + MINIMAL joint hypermobility (digits only) → Vascular EDS. AUTOSOMAL DOMINANT COL3A1 (type III collagen) mutation, typically a dominant-negative glycine substitution. The most lethal EDS subtype; median life expectancy ~50 yr. Step 1 differential: Classical EDS — COL5A1/COL5A2 (type V collagen), prominent skin hyperextensibility + generalized hypermobility + cigarette-paper scars, no major vascular fragility.'
  }
];
