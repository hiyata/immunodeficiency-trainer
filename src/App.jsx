import { useState } from 'react';
import { MODES } from './data/modes.js';
import { generateRound } from './utils/generators.js';
import { fmtLab, LAB_LABELS, SPECIAL_LABEL, SPECIAL_UNIT, capitalize } from './data/labs.js';
import { ModePicker } from './components/ModePicker.jsx';
import { Section } from './components/Section.jsx';
import { Vital } from './components/Vital.jsx';
import { LysosomalQuiz } from './components/LysosomalQuiz.jsx';

// =========================================================================
// GLOBAL STYLES
// =========================================================================
const styles = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,800&family=Lora:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
    body { margin:0; }
    .paper { background-color:#f3ece0; background-image: radial-gradient(circle at 25% 35%, rgba(139,38,53,0.04) 0, transparent 60%), radial-gradient(circle at 80% 70%, rgba(45,74,62,0.04) 0, transparent 55%), repeating-linear-gradient(0deg, rgba(0,0,0,0.014) 0 1px, transparent 1px 4px); font-family:'Lora',Georgia,serif; color:#1f1812; min-height:100vh; }
    .display { font-family:'Fraunces','Playfair Display',Georgia,serif; font-weight:800; letter-spacing:-0.02em; }
    .mono { font-family:'JetBrains Mono',ui-monospace,monospace; }
    .stamp { font-family:'Fraunces',serif; font-weight:800; letter-spacing:0.18em; text-transform:uppercase; border:2px solid currentColor; padding:4px 10px; display:inline-block; transform:rotate(-2deg); }
    .panel { background:rgba(253,248,238,0.85); border:1px solid rgba(31,24,18,0.18); }
    .accent-rule { background:linear-gradient(90deg,#8b2635 0 22%, transparent 22%); height:6px; }
    .opt:hover:not(:disabled) { background:rgba(139,38,53,0.06); }
    .opt-correct { background:rgba(45,120,80,0.18) !important; border-color:#2d784e !important; }
    .opt-wrong { background:rgba(160,30,40,0.14) !important; border-color:#a01b28 !important; }
    .pulse-dot { animation:pulse 1.6s ease-in-out infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
    .case-fade { animation:fadeIn 0.45s ease; }
    @keyframes fadeIn { from {opacity:0; transform:translateY(6px)} to {opacity:1; transform:none} }
    .depth-tag { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; padding:2px 7px; border:1px solid currentColor; border-radius:2px; }
  `}</style>
);

// =========================================================================
// APP
// =========================================================================
export default function App() {
  const [modeId, setModeId] = useState(null);
  const [round, setRound] = useState(null);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ right:0, wrong:0 });
  const [showRef, setShowRef] = useState(false);

  const mode = MODES.find(m => m.id === modeId);

  const startMode = (id) => {
    setModeId(id);
    setSelected(null);
    setRevealed(false);
    setScore({ right:0, wrong:0 });
    setShowRef(false);
    if (id === 'lysosomal') { setRound(null); return; }
    const m = MODES.find(x => x.id === id);
    setRound(generateRound(m));
  };

  const goHome = () => {
    setModeId(null);
    setRound(null);
    setSelected(null);
    setRevealed(false);
  };

  // Mode picker view
  if (!modeId) {
    return (
      <>
        {styles}
        <ModePicker onPick={startMode} />
      </>
    );
  }

  // Lysosomal diagram quiz (standalone, no round needed)
  if (modeId === 'lysosomal') {
    return (
      <>
        {styles}
        <LysosomalQuiz onGoHome={goHome} />
      </>
    );
  }

  if (!round) {
    return (
      <>
        {styles}
        <ModePicker onPick={startMode} />
      </>
    );
  }

  const { caseData, syndrome, question } = round;
  const { patient, vitals, labs, extraLabs } = caseData;

  const answer = (opt) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    setScore(prev => opt.correct ? { ...prev, right: prev.right+1 } : { ...prev, wrong: prev.wrong+1 });
  };
  const next = () => { setRound(generateRound(mode)); setSelected(null); setRevealed(false); };

  const correct = revealed && selected?.correct;
  const total = score.right + score.wrong;
  const hasLabs = Object.keys(labs).length > 0 || (extraLabs && Object.keys(extraLabs).length > 0);
  const correctOption = question.options.find(o => o.correct);
  const questionTypeLabel = {
    diagnosis:'Diagnosis',
    defect:'Molecular / genetic defect',
    inheritance:'Inheritance pattern',
    organism:'Organism susceptibility',
    test:'Confirmatory test',
    cardiac:'Cardiac association',
    complication:'Complication / association',
    specific:'Most specific finding',
    differential:'Differential diagnosis'
  }[question.type];

  return (
    <>
      {styles}

      <div className="paper">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <header className="flex items-end justify-between pb-3 mb-2" style={{borderBottom:'2px solid #1f1812'}}>
            <div>
              <div className="text-xs mono uppercase tracking-widest" style={{color:'#8b2635'}}>Wayne State University School of Medicine · Trainer</div>
              <h1 className="display text-5xl mt-1" style={{color:'#1f1812'}}>Differential <span style={{color:'#8b2635'}}>·</span> {mode.headerLabel}</h1>
              <div className="text-sm italic mt-1" style={{color:'#5a4a3a'}}>A procedurally generated patient encounter quiz</div>
            </div>
            <div className="text-right">
              <div className="mono text-xs uppercase tracking-widest" style={{color:'#5a4a3a'}}>Score</div>
              <div className="display text-3xl"><span style={{color:'#2d784e'}}>{score.right}</span><span style={{color:'#5a4a3a'}}> / </span><span>{total}</span></div>
              <div className="flex gap-3 justify-end mt-1">
                <button onClick={()=>setShowRef(!showRef)} className="mono text-xs underline" style={{color:'#8b2635', background:'none', border:'none', cursor:'pointer'}}>
                  {showRef ? 'hide' : 'show'} list
                </button>
                <button onClick={goHome} className="mono text-xs underline" style={{color:'#8b2635', background:'none', border:'none', cursor:'pointer'}}>
                  change topic
                </button>
              </div>
            </div>
          </header>
          <div className="accent-rule mb-6"></div>

          {showRef && (
            <div className="panel rounded p-4 mb-6 text-sm">
              <div className="mono uppercase tracking-widest text-xs mb-2" style={{color:'#8b2635'}}>Reference · all conditions in this topic</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5">
                {mode.syndromes.map(s =>
                  <div key={s.id} className="text-sm">
                    <span className="display" style={{color:'#1f1812', fontWeight:600}}>{s.short}</span>
                    <span className="mono text-xs ml-2" style={{color:'#7a6a55'}}>· {s.category} · {s.inheritance}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="case-fade" key={caseData.id}>
            <div className="panel rounded p-5 mb-5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <div>
                <div className="mono text-xs uppercase tracking-widest" style={{color:'#5a4a3a'}}>Patient</div>
                <div className="display text-3xl">{patient.name}</div>
              </div>
              <div className="ml-auto flex flex-wrap gap-x-6 gap-y-1 text-sm items-center">
                <div><span className="mono uppercase text-xs tracking-widest" style={{color:'#5a4a3a'}}>Age </span> {patient.ageStr}</div>
                <div><span className="mono uppercase text-xs tracking-widest" style={{color:'#5a4a3a'}}>Sex </span> {patient.sex}</div>
                <div><span className="mono uppercase text-xs tracking-widest" style={{color:'#5a4a3a'}}>MRN </span> <span className="mono">{caseData.id}</span></div>
                <div className="depth-tag" style={{color:'#8b2635'}}>{caseData.depth} vignette</div>
              </div>
            </div>

            <Section title="Chief Complaint">
              <p className="italic" style={{color:'#1f1812'}}>"{caseData.cc}"</p>
            </Section>

            <Section title="History of Present Illness">
              <p>
                {patient.name} is a {patient.ageStr} {patient.sexWord} brought in by {patient.guardian} for evaluation. {capitalize(patient.pronoun)} presents with {caseData.cc}.
              </p>
              <ul className="list-none mt-3 space-y-1.5">
                {caseData.hpi.map((h,i) =>
                  <li key={i} className="flex gap-2"><span style={{color:'#8b2635'}}>›</span><span>{h}</span></li>
                )}
              </ul>
            </Section>

            {(caseData.pmh.length || caseData.shx.length) ? (
              <div className="grid md:grid-cols-2 gap-4 mb-2">
                {caseData.pmh.length > 0 && (
                  <Section title="Past Medical / Other">
                    <ul className="list-none space-y-1 text-sm">
                      {caseData.pmh.map((h,i) => <li key={i}>· {h}</li>)}
                    </ul>
                  </Section>
                )}
                {caseData.shx.length > 0 && (
                  <Section title="Social / Family">
                    <ul className="list-none space-y-1 text-sm">
                      {caseData.shx.map((h,i) => <li key={i}>· {h}</li>)}
                    </ul>
                  </Section>
                )}
              </div>
            ) : null}

            <Section title="Vital Signs">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mono text-sm">
                <Vital label="Temp" value={`${vitals.temp} °C`} flag={vitals.temp >= 38.0} />
                <Vital label="HR" value={`${vitals.hr} bpm`} pulse={vitals.hr > 130}/>
                <Vital label="RR" value={`${vitals.rr} /min`}/>
                <Vital label="BP" value={vitals.bp}/>
                <Vital label="SpO₂" value={`${vitals.spo2}%`} flag={vitals.spo2 < 95}/>
              </div>
            </Section>

            <Section title="Physical Examination">
              <ul className="list-none space-y-1.5 text-sm">
                {caseData.pe.map((h,i) => <li key={i}>· {h}</li>)}
              </ul>
            </Section>

            {hasLabs ? (
              <Section title={caseData.labMode === 'few' ? 'Selected Laboratory Studies' : caseData.labMode === 'partial' ? 'Initial Laboratory Studies' : caseData.labMode === 'none' ? 'Additional Studies' : 'Laboratory Studies'}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm mono">
                    <thead>
                      <tr style={{borderBottom:'2px solid #1f1812'}}>
                        <th className="text-left py-1.5 pr-2 uppercase tracking-widest text-xs" style={{color:'#5a4a3a'}}>Test</th>
                        <th className="text-left py-1.5 pr-2 uppercase tracking-widest text-xs" style={{color:'#5a4a3a'}}>Result</th>
                        <th className="text-left py-1.5 pr-2 uppercase tracking-widest text-xs" style={{color:'#5a4a3a'}}>Reference</th>
                        <th className="text-left py-1.5 uppercase tracking-widest text-xs" style={{color:'#5a4a3a'}}>Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(labs).map((k) => {
                        const f = fmtLab(k, labs[k]);
                        const flagStyle = f.status==='low' ? {color:'#a01b28', fontWeight:700} : f.status==='high' ? {color:'#a05a1b', fontWeight:700} : {color:'#7a6a55'};
                        return (
                          <tr key={k} style={{borderBottom:'1px dotted rgba(31,24,18,0.18)'}}>
                            <td className="py-1.5 pr-2" style={{fontFamily:'Lora,serif'}}>{LAB_LABELS[k]}</td>
                            <td className="py-1.5 pr-2"><span style={flagStyle}>{f.display}</span></td>
                            <td className="py-1.5 pr-2 text-xs" style={{color:'#7a6a55'}}>{f.ref}</td>
                            <td className="py-1.5"><span style={flagStyle}>{f.status==='low'?'L': f.status==='high'?'H':' '}</span></td>
                          </tr>
                        );
                      })}
                      {extraLabs && Object.keys(extraLabs).map(k => (
                        <tr key={k} style={{borderBottom:'1px dotted rgba(31,24,18,0.18)'}}>
                          <td className="py-1.5 pr-2" style={{fontFamily:'Lora,serif'}}>{SPECIAL_LABEL[k] || k}</td>
                          <td className="py-1.5 pr-2"><span style={{color:'#a01b28', fontWeight:700}}>{String(extraLabs[k])}{SPECIAL_UNIT[k]||''}</span></td>
                          <td className="py-1.5 pr-2 text-xs" style={{color:'#7a6a55'}}>{caseData.extraNormals[k]||''}</td>
                          <td className="py-1.5"><span style={{color:'#a01b28', fontWeight:700}}>★</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            ) : (
              <Section title="Laboratory Studies">
                <p className="italic text-sm" style={{color:'#7a6a55'}}>Laboratory workup is pending at the time of evaluation.</p>
              </Section>
            )}
          </div>

          <div className="mt-6 mb-3">
            <div className="mono text-xs uppercase tracking-widest mb-1" style={{color:'#8b2635'}}>Question · {questionTypeLabel}</div>
            <div className="display text-2xl" style={{color:'#1f1812'}}>{question.prompt}</div>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5">
            {question.options.map((o,i) => {
              const isSelected = selected === o;
              let cls = 'opt';
              const style = { borderColor:'rgba(31,24,18,0.25)' };
              if (revealed) {
                if (o.correct) cls += ' opt-correct';
                else if (isSelected) cls += ' opt-wrong';
              }
              return (
                <button key={i} onClick={()=>answer(o)} disabled={revealed}
                  className={`${cls} text-left p-3.5 rounded border-2 transition`} style={style}>
                  <div className="display text-base" style={{fontWeight:600}}>{o.label}</div>
                  {o.sub && <div className="mono text-xs uppercase tracking-widest mt-0.5" style={{color:'#7a6a55'}}>{o.sub}</div>}
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className="mt-6 panel rounded p-5 border-2 case-fade" style={{borderColor: correct ? '#2d784e' : '#a01b28'}}>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="stamp" style={{color: correct ? '#2d784e' : '#a01b28'}}>{correct ? 'Correct' : 'Incorrect'}</span>
                <span className="display text-xl">{syndrome.name}</span>
              </div>

              {!correct && (
                <div className="text-sm mt-2 mb-2">
                  <span className="mono uppercase tracking-widest text-xs" style={{color:'#5a4a3a'}}>Correct answer · </span>
                  <span style={{fontWeight:600}}>{correctOption.label}</span>
                </div>
              )}

              <div className="text-sm leading-relaxed mt-3 grid md:grid-cols-2 gap-x-6 gap-y-2">
                <div>
                  <div className="mono uppercase tracking-widest text-xs mb-1" style={{color:'#8b2635'}}>Mechanism</div>
                  <div>{syndrome.mechanism}</div>
                </div>
                <div>
                  <div className="mono uppercase tracking-widest text-xs mb-1" style={{color:'#8b2635'}}>Inheritance</div>
                  <div>{syndrome.inheritance}</div>
                </div>
                <div>
                  <div className="mono uppercase tracking-widest text-xs mb-1" style={{color:'#8b2635'}}>Defect</div>
                  <div>{syndrome.defect}</div>
                </div>
                <div>
                  <div className="mono uppercase tracking-widest text-xs mb-1" style={{color:'#8b2635'}}>Confirmatory test</div>
                  <div>{syndrome.diagnosticTest}</div>
                </div>
              </div>

              <div className="text-sm leading-relaxed mt-4 pt-3" style={{borderTop:'1px dotted rgba(31,24,18,0.25)'}}>
                <span className="mono uppercase tracking-widest text-xs" style={{color:'#8b2635'}}>Key teaching point </span>
                <p className="mt-1">{caseData.clue}</p>
              </div>

              <div className="mt-4 flex gap-3 items-center flex-wrap">
                <button onClick={next} className="display px-5 py-2 text-base"
                  style={{background:'#1f1812', color:'#f3ece0', borderRadius:'2px', fontWeight:700, letterSpacing:'0.02em', border:'none', cursor:'pointer'}}>
                  Next case →
                </button>
                <span className="mono text-xs" style={{color:'#7a6a55'}}>
                  Running accuracy: <span style={{color: correct ? '#2d784e' : '#1f1812'}}>{total>0 ? Math.round((score.right/total)*100) : 0}%</span>
                </span>
              </div>
            </div>
          )}

          {!revealed && (
            <div className="mt-6 flex justify-end">
              <button onClick={next} className="mono text-xs underline" style={{color:'#7a6a55', background:'none', border:'none', cursor:'pointer'}}>
                skip · generate new case
              </button>
            </div>
          )}

          <footer className="mt-12 pt-4 mono text-xs flex justify-between" style={{color:'#7a6a55', borderTop:'1px solid rgba(31,24,18,0.3)'}}>
            <span>Confidential · Teaching File · For educational use only</span>
            <span>Case {caseData.id}</span>
          </footer>
        </div>
      </div>
    </>
  );
}
