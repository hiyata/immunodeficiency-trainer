import { useMemo, useState } from 'react';
import { BASELINE_PARAMS, CELL_TYPES, DRUG_PRESETS, ENV_PRESETS, PHASE_GROUPS, CHANNEL_LABELS } from '../../data/cardio.js';
import { clamp, pct, generateAP, computeMetrics, generateECGSeries } from '../../utils/cardioModel.js';
import { TraceChart } from './TraceChart.jsx';

const fieldLabel = { fontFamily: "'JetBrains Mono',monospace", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a4a3a' };
const selectStyle = {
  width: '100%', border: '2px solid rgba(31,24,18,0.25)', borderRadius: 4, padding: '6px 8px',
  fontFamily: "'Lora',serif", fontSize: 14, background: 'rgba(253,248,238,0.9)', color: '#1f1812',
};
const numberStyle = { ...selectStyle, width: 70, fontFamily: "'JetBrains Mono',monospace" };

export function CardioExplore() {
  const [cellTypeId, setCellTypeId] = useState('ventricular');
  const [params, setParams] = useState({ ...BASELINE_PARAMS });
  const [ko, setKo] = useState({});
  const [preset, setPreset] = useState('None');
  const [envPreset, setEnvPreset] = useState('None');
  const [showBaseline, setShowBaseline] = useState(true);
  const [bpm, setBpm] = useState(60);

  const cell = useMemo(() => CELL_TYPES.find((c) => c.id === cellTypeId) || CELL_TYPES[0], [cellTypeId]);

  const buildParamsFor = (id, useCurrent = true) => {
    const base = useCurrent ? { ...params } : { ...BASELINE_PARAMS };
    const apply = (obj, map) => { const out = { ...obj }; Object.entries(map).forEach(([k, v]) => { if (k in out) out[k] = Math.round(out[k] * (v / 100)); }); return out; };
    const env = useCurrent ? (ENV_PRESETS[envPreset] || {}) : {};
    const drug = useCurrent ? (DRUG_PRESETS[preset] || {}) : {};
    const out = apply(apply(base, env), drug);
    if (useCurrent) Object.keys(ko).forEach((k) => { if (ko[k]) out[k] = 0; });
    const mask = CELL_TYPES.find((c) => c.id === id)?.uses || {};
    Object.keys(out).forEach((k) => { if (!mask[k]) out[k] = 0; });
    if (id !== 'sa' && id !== 'purkinje') out.__targetCycle = clamp(60000 / Math.max(20, Math.min(220, bpm)), 250, 3000);
    return out;
  };

  const baseline = useMemo(() => {
    const base = { ...BASELINE_PARAMS };
    if (cell.id !== 'sa' && cell.id !== 'purkinje') base.__targetCycle = 60000 / bpm;
    return generateAP(cell.id, base);
  }, [cell.id, bpm]);

  const modified = useMemo(() => generateAP(cell.id, buildParamsFor(cell.id, true)), [cell.id, params, preset, envPreset, ko, bpm]);

  const baseMetrics = useMemo(() => computeMetrics(baseline), [baseline]);
  const curMetrics = useMemo(() => computeMetrics(modified), [modified]);

  const intervalsFromParams = (useCurrent) => {
    const saAP = generateAP('sa', buildParamsFor('sa', useCurrent));
    const atrAP = generateAP('atrial', buildParamsFor('atrial', useCurrent));
    const ventAP = generateAP('ventricular', buildParamsFor('ventricular', useCurrent));
    const saM = computeMetrics(saAP), atrM = computeMetrics(atrAP), ventM = computeMetrics(ventAP);

    const rr_ms = (saM.cycle > 0 ? saM.cycle : clamp(60000 / Math.max(20, Math.min(220, bpm)), 250, 3000));
    const kICaL_atrial = pct((buildParamsFor('atrial', useCurrent).ICaL ?? 100));
    const kIKAch_atrial = pct((buildParamsFor('atrial', useCurrent).IK_ACh ?? 100));
    const pr_ms = clamp(160 + 40 * (1 - kICaL_atrial) + 30 * (kIKAch_atrial - 1), 100, 260);
    const qrs_ms = clamp(90 + 6 * (12 - clamp(ventM.dvdtMax, 2, 20)), 70, 160);
    const qt_ms = clamp(ventM.apd90 + 40, 280, 520);
    return { rr: rr_ms, pr: pr_ms, qrs: qrs_ms, qt: qt_ms };
  };

  const intsMod = useMemo(() => intervalsFromParams(true), [params, preset, envPreset, ko, bpm]);
  const intsBase = useMemo(() => intervalsFromParams(false), [bpm]);

  const ecgData = useMemo(() => generateECGSeries({ ...intsMod, beats: 3, fs: 1000 }), [intsMod.rr, intsMod.pr, intsMod.qrs, intsMod.qt]);
  const ecgBaseline = useMemo(() => generateECGSeries({ ...intsBase, beats: 3, fs: 1000 }), [intsBase.rr, intsBase.pr, intsBase.qrs, intsBase.qt]);

  function resetAll() { setParams({ ...BASELINE_PARAMS }); setKo({}); setPreset('None'); setEnvPreset('None'); setBpm(60); }

  const repolDir = curMetrics.apd90 - baseMetrics.apd90;
  const upstrokeDir = curMetrics.dvdtMax - baseMetrics.dvdtMax;
  const rateDir = curMetrics.cycle - baseMetrics.cycle;
  const dirWord = (d, pos, neg) => Math.abs(d) < (pos === 'Rate' ? 20 : (pos === 'Upstroke' ? 0.5 : 10)) ? 'about the same' : (d > 0 ? pos : neg);

  const apSeries = [
    ...(showBaseline ? [{ data: baseline.data.map((p) => ({ x: p.t, y: p.v })), stroke: 'rgba(31,24,18,0.32)', strokeWidth: 2, dash: '6 4' }] : []),
    { data: modified.data.map((p) => ({ x: p.t, y: p.v })), stroke: '#8b2635', strokeWidth: 2.5 },
  ];
  const ecgSeries = [
    ...(showBaseline ? [{ data: ecgBaseline.map((p) => ({ x: p.t, y: p.v })), stroke: 'rgba(31,24,18,0.32)', strokeWidth: 1.5, dash: '6 4' }] : []),
    { data: ecgData.map((p) => ({ x: p.t, y: p.v })), stroke: '#8b2635', strokeWidth: 2 },
  ];

  return (
    <div className="grid md:grid-cols-[340px_1fr] gap-8">
      {/* Controls */}
      <section>
        <div className="mono text-xs uppercase tracking-widest mb-2" style={{ color: '#8b2635' }}>Controls</div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div style={fieldLabel} className="mb-1">Cell type</div>
              <select style={selectStyle} value={cellTypeId} onChange={(e) => setCellTypeId(e.target.value)}>
                {CELL_TYPES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <div style={fieldLabel} className="mb-1">Drug preset</div>
              <select style={selectStyle} value={preset} onChange={(e) => setPreset(e.target.value)}>
                {Object.keys(DRUG_PRESETS).map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <div style={fieldLabel} className="mb-1">Environment</div>
              <select style={selectStyle} value={envPreset} onChange={(e) => setEnvPreset(e.target.value)}>
                {Object.keys(ENV_PRESETS).map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <div style={fieldLabel} className="mb-1">Pacing · {bpm} bpm</div>
              <input type="range" min="20" max="220" step="1" value={bpm} style={{ width: '100%', accentColor: '#8b2635' }} onChange={(e) => setBpm(+e.target.value)} />
            </div>
          </div>

          <button onClick={resetAll} className="mono text-xs underline self-start" style={{ color: '#8b2635', background: 'none', border: 'none', cursor: 'pointer' }}>
            reset all
          </button>

          <div className="accent-rule" style={{ height: 3 }}></div>

          {PHASE_GROUPS.map((g) => {
            const keys = g.keys.filter((k) => cell.uses[k]);
            if (!keys.length) return null;
            return (
              <details key={g.label} open>
                <summary style={fieldLabel} className="cursor-pointer" >{g.label}</summary>
                <div className="flex flex-col gap-3 pt-2">
                  {keys.map((key) => (
                    <div key={key}>
                      <div className="flex items-center justify-between">
                        <div className="display text-sm" style={{ fontWeight: 600, color: '#1f1812' }}>{CHANNEL_LABELS[key]}</div>
                        <label className="mono" style={{ fontSize: 11, color: '#5a4a3a' }}>
                          <input type="checkbox" checked={!!ko[key]} onChange={(e) => setKo({ ...ko, [key]: e.target.checked })} /> KO
                        </label>
                      </div>
                      <div className="flex gap-2 items-center mt-1">
                        <input type="range" min="0" max="200" step="5" disabled={!!ko[key]}
                          value={ko[key] ? 0 : (params[key] ?? 100)} style={{ width: '100%', accentColor: '#8b2635' }}
                          onChange={(e) => setParams({ ...params, [key]: +e.target.value })} />
                        <input type="number" min="0" max="200" step="5" disabled={!!ko[key]}
                          value={ko[key] ? 0 : (params[key] ?? 100)} style={numberStyle}
                          onChange={(e) => setParams({ ...params, [key]: clamp(+e.target.value || 0, 0, 200) })} />
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            );
          })}

          <label className="mono flex items-center gap-2" style={{ fontSize: 12, color: '#5a4a3a' }}>
            <input type="checkbox" checked={showBaseline} onChange={(e) => setShowBaseline(e.target.checked)} /> Show baseline
          </label>
        </div>
      </section>

      {/* Traces */}
      <section>
        <div className="panel rounded p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="display text-xl" style={{ color: '#1f1812' }}>Action Potential</div>
            <div className="flex gap-4 mono text-xs" style={{ color: '#5a4a3a' }}>
              <span><span style={{ display: 'inline-block', width: 18, height: 2, background: '#8b2635', verticalAlign: 'middle', marginRight: 4 }}></span>Modified</span>
              {showBaseline && <span><span style={{ display: 'inline-block', width: 18, height: 0, borderTop: '2px dashed rgba(31,24,18,0.4)', verticalAlign: 'middle', marginRight: 4 }}></span>Baseline</span>}
            </div>
          </div>
          <TraceChart series={apSeries} yDomain={[-100, 50]} xLabel="time (ms)" yLabel="mV" refLineY={-85} height={340} />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="panel rounded p-3">
            <div style={fieldLabel}>Repolarization</div>
            <div className="display text-base mt-1" style={{ color: '#1f1812' }}>{dirWord(repolDir, 'longer', 'shorter')}</div>
          </div>
          <div className="panel rounded p-3">
            <div style={fieldLabel}>Upstroke</div>
            <div className="display text-base mt-1" style={{ color: '#1f1812' }}>{dirWord(upstrokeDir, 'steeper', 'blunter')}</div>
          </div>
          <div className="panel rounded p-3">
            <div style={fieldLabel}>Rate</div>
            <div className="display text-base mt-1" style={{ color: '#1f1812' }}>{dirWord(rateDir, 'slower', 'faster')}</div>
          </div>
        </div>

        <div className="accent-rule my-6" style={{ height: 3 }}></div>

        <div className="panel rounded p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="display text-xl" style={{ color: '#1f1812' }}>ECG · Lead II (synthetic)</div>
            <div className="flex gap-4 mono text-xs" style={{ color: '#5a4a3a' }}>
              <span><span style={{ display: 'inline-block', width: 18, height: 2, background: '#8b2635', verticalAlign: 'middle', marginRight: 4 }}></span>Modified</span>
              {showBaseline && <span><span style={{ display: 'inline-block', width: 18, height: 0, borderTop: '2px dashed rgba(31,24,18,0.4)', verticalAlign: 'middle', marginRight: 4 }}></span>Baseline</span>}
            </div>
          </div>
          <TraceChart series={ecgSeries} yDomain={[-1.2, 1.4]} xLabel="time (s)" yLabel="mV" xTickFormat={(v) => v.toFixed(1)} yTickFormat={(v) => v.toFixed(1)} height={220} />
        </div>
      </section>
    </div>
  );
}
