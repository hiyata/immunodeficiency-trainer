import { BASELINE_PARAMS, CHANNEL_ROLES, SIMILAR_CHANNEL_GROUPS } from '../data/cardio.js';

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const pct = (x) => clamp(x / 100, 0, 2);

export function parseDrugKey(key) {
  const m = key.match(/^(.*?)(?:\s*\((.*)\))?$/);
  return { name: (m?.[1] || key).trim(), kind: (m?.[2] || '').trim() };
}

export function areSimilarChannels(ch1, ch2) {
  for (const group of SIMILAR_CHANNEL_GROUPS) {
    if (group.includes(ch1) && group.includes(ch2)) return true;
  }
  return false;
}

export function describeParamDirections(modParams) {
  const diffs = Object.entries(modParams)
    .filter(([k]) => k in BASELINE_PARAMS)
    .map(([k, v]) => ({ k, delta: v - 100 }))
    .filter((x) => Math.abs(x.delta) >= 15)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 6);
  if (!diffs.length) return ['No major changes.'];
  return diffs.map(({ k, delta }) => {
    const dir = delta > 0 ? '↑' : '↓';
    const role = CHANNEL_ROLES[k] || k;
    return `${dir}${k} (${role})`;
  });
}

export function plainTakeaways(baseM, curM) {
  if (!baseM || !curM) return [];
  const out = [];
  const dAPD = curM.apd90 - baseM.apd90;
  const dDV = curM.dvdtMax - baseM.dvdtMax;
  const dCycle = curM.cycle - baseM.cycle;

  if (Math.abs(dAPD) >= 10) out.push(`Repolarization time: ${dAPD > 0 ? 'longer' : 'shorter'}`);
  if (Math.abs(dDV) >= 0.5) out.push(`Upstroke: ${dDV > 0 ? 'steeper' : 'blunter'}`);
  if (Math.abs(dCycle) >= 20) out.push(`Rate: ${dCycle > 0 ? 'slower' : 'faster'}`);
  return out.length ? out : ['Overall shape: about the same'];
}

/* ---------------- AP generator ---------------- */
export function generateAP(cellId, params) {
  const isPacemaker = cellId === 'sa';
  let t0 = 2, t1 = 8, t2 = 180, t3 = 120, t4 = 100, vmax = 30, vrest = -85;
  const kINa = pct(params.INa), kICaL = pct(params.ICaL), kIto = pct(params.Ito),
        kIKr = pct(params.IKr), kIKs = pct(params.IKs), kIK1 = pct(params.IK1),
        kIf = pct(params.If), kICaT = pct(params.ICaT), kIK_ACh = pct(params.IK_ACh), kPump = pct(params.NaKATPase);

  if (isPacemaker) {
    t1 = 0; t2 = 0;
    const kK = 0.6 * kIKr + 0.4 * kIKs;
    t0 = 15 / clamp(kICaL, 0.2, 2);
    vmax = 20 * kICaL - 5 * (kK - 1);
    t3 = 150 / clamp(kK, 0.2, 2);
    const slope = 0.45 * kIf + 0.25 * kICaT - 0.35 * (kIK_ACh - 1) - 0.15 * (kK - 1);
    t4 = clamp(220 / clamp(1 + slope, 0.2, 3), 60, 600);
    const vrestBase = -65;
    vrest = vrestBase - 2 * (kPump - 1) + 2 * (1 - kIK1) + 6 * (1 - kK);
  } else {
    t0 = clamp(2 / clamp(kINa, 0.2, 2), 0.5, 6); vmax = 30 * clamp(kINa, 0.4, 1.6);
    t1 = clamp(8 * (0.6 + 0.4 * kIto), 2, 18);
    const kK = 0.6 * kIKr + 0.4 * kIKs; t2 = clamp(180 * (kICaL / clamp(kK, 0.3, 2)), 40, 400);
    t3 = clamp(120 / clamp(kK, 0.3, 2), 30, 300);
    vrest = -85 - 4 * (kPump - 1) + 5 * (1 - kIK1);
    if (cellId === 'purkinje') {
      const s = 0.1 * (kIf - 1) + 0.05 * (kICaT - 1);
      t4 = clamp(100 / clamp(1 + s, 0.3, 2), 40, 300);
    }
  }

  const data = []; const push = (t, v) => data.push({ t: Math.round(t * 10) / 10, v });
  const segs = []; let tA = 0; const vTh = isPacemaker ? -40 : -60;

  if (params && typeof params.__targetCycle === 'number') {
    const baseCycle = t4 + t0 + (isPacemaker ? 0 : (t1 + t2)) + t3;
    t4 = clamp(t4 + (params.__targetCycle - baseCycle), 20, 1200);
  }

  // phase 4
  const n4 = Math.max(5, Math.round(t4 / 2));
  for (let i = 0; i <= n4; i++) { const f = i / n4; push(tA + f * t4, vrest + (vTh - vrest) * f); }
  segs.push({ phase: 4, tStart: tA, tEnd: tA + t4 }); tA += t4;

  // phase 0
  const n0 = Math.max(5, Math.round(t0 / 0.5));
  for (let i = 0; i <= n0; i++) { const f = i / n0; push(tA + f * t0, vTh + (vmax - vTh) * (1 - Math.pow(1 - f, 3))); }
  segs.push({ phase: 0, tStart: tA, tEnd: tA + t0 }); tA += t0;

  if (!isPacemaker) {
    // phase 1
    const notch = vmax - 20 * kIto, n1 = Math.max(3, Math.round(t1 / 0.5));
    for (let i = 0; i <= n1; i++) { const f = i / n1; push(tA + f * t1, vmax + (notch - vmax) * f); }
    segs.push({ phase: 1, tStart: tA, tEnd: tA + t1 }); tA += t1;

    // phase 2
    const plateau = -5 + 10 * (kICaL - (0.6 * kIKr + 0.4 * kIKs)), n2 = Math.max(10, Math.round(t2 / 2));
    for (let i = 0; i <= n2; i++) { const f = i / n2; push(tA + f * t2, notch + (plateau - notch) * (1 - Math.cos(Math.PI * f)) / 2); }
    segs.push({ phase: 2, tStart: tA, tEnd: tA + t2 }); tA += t2;
  }

  // phase 3
  const vEnd = vrest, vStart = isPacemaker ? vmax : (data[data.length - 1]?.v ?? vmax);
  const n3 = Math.max(10, Math.round(t3 / 2));
  for (let i = 0; i <= n3; i++) { const f = i / n3; push(tA + f * t3, vStart + (vEnd - vStart) * (1 - Math.cos(Math.PI * f)) / 2); }
  segs.push({ phase: 3, tStart: tA, tEnd: tA + t3 }); tA += t3;

  const marks = segs.map((s) => {
    const mid = (s.tStart + s.tEnd) / 2; let nearest = data[0];
    for (let i = 1; i < data.length; i++) { if (Math.abs(data[i].t - mid) < Math.abs(nearest.t - mid)) nearest = data[i]; }
    return { label: `Phase ${s.phase}`, t: nearest.t, v: nearest.v };
  }).filter((m) => !(cellId === 'sa' && (m.label === 'Phase 1' || m.label === 'Phase 2')));

  return { data, marks, segs };
}

export function computeMetrics(curve) {
  const pts = curve.data || curve; if (!pts.length) return { apd90: 0, dvdtMax: 0, cycle: 0 };
  const vrest = pts[0].v; const vmax = pts.reduce((m, p) => Math.max(m, p.v), -Infinity);
  const v90 = vrest + 0.1 * (vmax - vrest); const up = pts.findIndex((p) => p.v > v90);
  let down = pts.length - 1; for (let i = pts.length - 1; i >= 0; i--) { if (pts[i].v > v90) { down = i; break; } }
  const apd90 = (up >= 0 && down > up) ? (pts[down].t - pts[up].t) : 0;
  let dvdtMax = 0; for (let i = 1; i < pts.length; i++) { const dv = pts[i].v - pts[i - 1].v; const dt = pts[i].t - pts[i - 1].t || 1e-6; dvdtMax = Math.max(dv / dt, dvdtMax); }
  const cycle = pts[pts.length - 1].t;
  return { apd90: Math.round(apd90), dvdtMax: Math.round(dvdtMax * 100) / 100, cycle: Math.round(cycle) };
}

/* ---------------- ECG synthesizer (smooth, zero-mean) ---------------- */
function gaussian(x, mu, sigma, amp) { const z = (x - mu) / sigma; return amp * Math.exp(-0.5 * z * z); }

export function generateECGSeries({ rr, pr, qrs, qt, beats = 3, fs = 1000 }) {
  rr = clamp(rr, 300, 2000); pr = clamp(pr, 100, 260);
  qrs = clamp(qrs, 70, 160); qt = clamp(qt, 280, 520);

  const dt = 1000 / fs;
  const oneBeat = [], nBeat = Math.round(rr / dt);

  for (let i = 0; i < nBeat; i++) {
    const tb = i * dt;
    const pC = Math.max(0.11 * rr, pr - 0.5 * qrs);
    const qrsC = pr;
    const tStart = qrsC + qrs;
    const tC = tStart + 0.45 * (qt - qrs);

    const pS = 0.05 * rr;
    const qS = 0.12 * qrs, rS = 0.09 * qrs, sS = 0.10 * qrs;
    const tS = 0.22 * (qt - qrs);

    let v = 0;
    v += gaussian(tb, pC, pS, 0.12);
    v += gaussian(tb, qrsC - 0.20 * qrs, qS, -0.25);
    v += gaussian(tb, qrsC, rS, 1.00);
    v += gaussian(tb, qrsC + 0.25 * qrs, sS, -0.35);
    v += gaussian(tb, tC, tS, 0.35);

    oneBeat.push(v);
  }
  const mean = oneBeat.reduce((a, b) => a + b, 0) / oneBeat.length;
  for (let i = 0; i < oneBeat.length; i++) oneBeat[i] -= mean;

  const data = [];
  for (let b = 0; b < beats; b++) {
    for (let i = 0; i < nBeat; i++) {
      const t_s = (b * rr + i * dt) / 1000;
      data.push({ t: Number(t_s.toFixed(3)), v: oneBeat[i] });
    }
  }
  return data;
}
