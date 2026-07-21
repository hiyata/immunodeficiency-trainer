import { MODES } from '../data/modes.js';

export function ModePicker({ onPick }) {
  return (
    <div className="paper">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <header className="pb-3 mb-2" style={{borderBottom:'2px solid #1f1812'}}>
          <div className="text-xs mono uppercase tracking-widest" style={{color:'#8b2635'}}>Wayne State University School of Medicine · Trainer</div>
          <h1 className="display text-5xl mt-1" style={{color:'#1f1812'}}>Differential <span style={{color:'#8b2635'}}>·</span> Choose a Topic</h1>
          <div className="text-sm italic mt-1" style={{color:'#5a4a3a'}}>Each topic generates randomized USMLE Step 1 style cases</div>
        </header>
        <div className="accent-rule mb-8"></div>

        <div className="grid md:grid-cols-2 gap-5">
          {MODES.map(m => (
            <button key={m.id} onClick={()=>onPick(m.id)} className="panel rounded p-6 text-left transition opt"
              style={{border:'2px solid rgba(31,24,18,0.25)', cursor:'pointer', background:'rgba(253,248,238,0.85)'}}>
              <div className="mono text-xs uppercase tracking-widest mb-2" style={{color:'#8b2635'}}>{m.syndromes.length} conditions</div>
              <div className="display text-3xl mb-2" style={{color:'#1f1812'}}>{m.name}</div>
              <div className="text-sm leading-relaxed" style={{color:'#5a4a3a'}}>{m.blurb}</div>
              <div className="mt-4 mono text-xs uppercase tracking-widest" style={{color:'#1f1812'}}>Start →</div>
            </button>
          ))}
          <button onClick={()=>onPick('lysosomal')} className="panel rounded p-6 text-left transition opt"
            style={{border:'2px solid rgba(31,24,18,0.25)', cursor:'pointer', background:'rgba(253,248,238,0.85)'}}>
            <div className="mono text-xs uppercase tracking-widest mb-2" style={{color:'#8b2635'}}>Diagram · 6 diseases · 20 labels</div>
            <div className="display text-3xl mb-2" style={{color:'#1f1812'}}>Lysosomal Storage Diseases</div>
            <div className="text-sm leading-relaxed" style={{color:'#5a4a3a'}}>
              Identify hidden products, enzymes, and diseases on a sphingolipid degradation pathway diagram.
              Covers Tay-Sachs, Fabry, Gaucher, Krabbe, Niemann-Pick, and metachromatic leukodystrophy.
            </div>
            <div className="mt-4 mono text-xs uppercase tracking-widest" style={{color:'#1f1812'}}>Start →</div>
          </button>
          <button onClick={()=>onPick('rbc')} className="panel rounded p-6 text-left transition opt"
            style={{border:'2px solid rgba(31,24,18,0.25)', cursor:'pointer', background:'rgba(253,248,238,0.85)'}}>
            <div className="mono text-xs uppercase tracking-widest mb-2" style={{color:'#8b2635'}}>Visual MCQ · 15 morphologies</div>
            <div className="display text-3xl mb-2" style={{color:'#1f1812'}}>RBC Morphology</div>
            <div className="text-sm leading-relaxed" style={{color:'#5a4a3a'}}>
              Identify peripheral smear findings and their clinical associations.
              Covers acanthocytes, echinocytes, schistocytes, sickle cells, target cells, inclusion bodies, and more.
            </div>
            <div className="mt-4 mono text-xs uppercase tracking-widest" style={{color:'#1f1812'}}>Start →</div>
          </button>
          <button onClick={()=>onPick('cardio')} className="panel rounded p-6 text-left transition opt"
            style={{border:'2px solid rgba(31,24,18,0.25)', cursor:'pointer', background:'rgba(253,248,238,0.85)'}}>
            <div className="mono text-xs uppercase tracking-widest mb-2" style={{color:'#8b2635'}}>Sandbox · Explore + Quiz</div>
            <div className="display text-3xl mb-2" style={{color:'#1f1812'}}>Cardiac Physiology</div>
            <div className="text-sm leading-relaxed" style={{color:'#5a4a3a'}}>
              Explore how ion channels, drugs, and pacing shape the cardiac action potential and ECG,
              then quiz yourself on identifying channel and drug effects from the trace.
            </div>
            <div className="mt-4 mono text-xs uppercase tracking-widest" style={{color:'#1f1812'}}>Start →</div>
          </button>
        </div>

        <footer className="mt-16 pt-4 mono text-xs flex justify-between" style={{color:'#7a6a55', borderTop:'1px solid rgba(31,24,18,0.3)'}}>
          <span>Confidential · Teaching File · For educational use only</span>
          <span>v3</span>
        </footer>
      </div>
    </div>
  );
}
