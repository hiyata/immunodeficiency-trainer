import { rand, randInt, randFloat, pick, weighted, caseId, shuffle } from './random.js';
import { FIRST_M, FIRST_F, LAST } from '../data/patient.js';
import { genVal } from '../data/labs.js';
import { buildQuestion } from './questionBuilders.js';

export function generateCase(syndrome, mode) {
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

export function generateRound(mode) {
  const syndrome = rand(mode.syndromes);
  const caseData = generateCase(syndrome, mode);
  const question = buildQuestion(syndrome, mode.syndromes, mode.fallbacks);
  return { caseData, syndrome, question };
}
