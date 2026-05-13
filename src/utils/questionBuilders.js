import { rand, pick, shuffle } from './random.js';

export function buildDiagnosisQ(syndrome, pool, fallbacks) {
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

export function buildDefectQ(syndrome, pool, fallbacks) {
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

export function buildInheritanceQ(syndrome) {
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
    'Acquired somatic mutation in a clonal hematopoietic stem-cell population (not inherited)',
    'Acquired clonal expansion driven by an oncogenic viral infection',
    'Reactive process secondary to a non-neoplastic stimulus (no clonal mutation)',
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
    (t.includes('viral') || t.includes('htlv') || t.includes('ebv-driven')) ? 'Acquired clonal expansion driven by an oncogenic viral infection' :
    (t.includes('reactive') || t.includes('secondary to')) ? 'Reactive process secondary to a non-neoplastic stimulus (no clonal mutation)' :
    (t.includes('somatic') || t.includes('acquired') || t.includes('clonal')) ? 'Acquired somatic mutation in a clonal hematopoietic stem-cell population (not inherited)' :
    'Sporadic / unknown';
  const distractorPool = labels.filter(l => l !== correctLabel);
  const distractors = pick(distractorPool, 4);
  const opts = shuffle([
    { label: correctLabel, correct: true },
    ...distractors.map(l => ({ label: l, correct: false }))
  ]);
  return { type:'inheritance', prompt:'What is the most likely mechanism or pattern of inheritance for this disorder?', options: opts };
}

export function buildOrganismQ(syndrome, pool) {
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

export function buildTestQ(syndrome, pool, fallbacks) {
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

export function buildCardiacQ(syndrome, pool, fallbacks) {
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

export function buildComplicationQ(syndrome, pool, fallbacks) {
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

export function buildSpecificQ(syndrome, pool) {
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

export function buildDifferentialQ(syndrome, pool) {
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

export function getValidQuestionTypes(syndrome, pool) {
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

export function pickQuestionType(syndrome, pool) {
  const valid = getValidQuestionTypes(syndrome, pool);
  const total = valid.reduce((a,t)=>a+t.weight, 0);
  let r = Math.random()*total;
  for (const t of valid) { r -= t.weight; if (r <= 0) return t.id; }
  return 'diagnosis';
}

export function buildQuestion(syndrome, pool, fallbacks) {
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
