import { useMemo, useState } from 'react';

const allOptions = {
  product: ["GM₁", "GM₂", "Glucocerebroside", "Ceramide trihexoside", "Sulfatides", "Galactocerebroside", "Ceramide", "Sphingomyelin"],
  enzyme:  ["Hexosaminidase A", "α-galactosidase A", "Arylsulfatase A", "Glucocerebrosidase", "Galactocerebrosidase", "Sphingomyelinase"],
  disease: ["Tay-Sachs disease", "Fabry disease", "Metachromatic leukodystrophy", "Gaucher disease", "Krabbe disease", "Niemann-Pick disease"],
};

const targets = [
  { type:"product", answer:"GM₁",                  x:90,   y:214, w:115, h:62 },
  { type:"product", answer:"GM₂",                  x:480,  y:214, w:120, h:62 },
  { type:"product", answer:"Glucocerebroside",      x:620,  y:430, w:345, h:70 },
  { type:"product", answer:"Ceramide trihexoside",  x:1020, y:214, w:360, h:70 },
  { type:"product", answer:"Sulfatides",            x:110,  y:430, w:220, h:70 },
  { type:"product", answer:"Galactocerebroside",    x:35,   y:760, w:390, h:70 },
  { type:"product", answer:"Ceramide",              x:730,  y:760, w:205, h:70 },
  { type:"product", answer:"Sphingomyelin",         x:1195, y:760, w:285, h:70 },
  { type:"enzyme",  answer:"Hexosaminidase A",      x:215,  y:185, w:260, h:50 },
  { type:"enzyme",  answer:"α-galactosidase A",     x:1025, y:315, w:345, h:50 },
  { type:"enzyme",  answer:"Arylsulfatase A",       x:300,  y:585, w:275, h:50 },
  { type:"enzyme",  answer:"Glucocerebrosidase",    x:835,  y:585, w:345, h:50 },
  { type:"enzyme",  answer:"Galactocerebrosidase",  x:430,  y:740, w:335, h:50 },
  { type:"enzyme",  answer:"Sphingomyelinase",      x:940,  y:740, w:310, h:50 },
  { type:"disease", answer:"Tay-Sachs disease",             x:235,  y:68,  w:220, h:55 },
  { type:"disease", answer:"Fabry disease",                 x:1270, y:318, w:230, h:60 },
  { type:"disease", answer:"Metachromatic leukodystrophy",  x:50,   y:572, w:230, h:80 },
  { type:"disease", answer:"Gaucher disease",               x:590,  y:585, w:230, h:65 },
  { type:"disease", answer:"Krabbe disease",                x:480,  y:800, w:230, h:65 },
  { type:"disease", answer:"Niemann-Pick disease",          x:930,  y:800, w:260, h:70 },
];

function shuffleArray(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function buildOptions(target) {
  const pool = allOptions[target.type].filter(c => c !== target.answer);
  const n = Math.min(6, allOptions[target.type].length);
  return shuffleArray([target.answer, ...shuffleArray(pool).slice(0, n - 1)]);
}

function titleForType(type) {
  if (type === 'product') return 'Accumulated product';
  if (type === 'enzyme')  return 'Deficient enzyme';
  return 'Storage disease';
}

function DiseaseBox({ x, y, lines, width = 240 }) {
  const textLines = Array.isArray(lines) ? lines : [lines];
  const height = Math.max(58, 34 + textLines.length * 18);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width={width} height={height} rx="7" fill="#fdf8ee" stroke="#64748b" />
      <circle cx="25" cy="25" r="12" fill="#dff4ff" stroke="#7aa6b8" strokeWidth="3" />
      <line x1="35" y1="35" x2="52" y2="52" stroke="#0f172a" strokeWidth="7" />
      <text x="65" y="20" fontSize="16" fontWeight="700" fill="#111827">Deficient in</text>
      {textLines.map((line, i) => (
        <text key={i} x="65" y={40 + i * 18} fontSize="17" fontWeight="900" fill="#111827">{line}</text>
      ))}
      <text x="48" y="32" fontSize="28" fontWeight="900" fill="#8b2635">↓</text>
    </g>
  );
}

function Diagram({ target, showAnswer }) {
  return (
    <div style={{width:'100%', overflowX:'auto', borderRadius:'8px', border:'1px solid rgba(31,24,18,0.18)', background:'#fff'}}>
      <svg viewBox="0 0 1536 938" style={{display:'block', minWidth:'1000px'}} role="img" aria-label="Lysosomal storage diseases pathway diagram">
        <defs>
          <linearGradient id="lsd-bg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="63%" stopColor="#eff9ff" />
            <stop offset="100%" stopColor="#86cef0" />
          </linearGradient>
          <marker id="lsd-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="black" />
          </marker>
        </defs>

        <rect width="1536" height="938" fill="url(#lsd-bg)" />
        <text x="768" y="68" textAnchor="middle" fontSize="44" fontWeight="900" fill="black">Lysosomal storage diseases</text>

        <g stroke="black" strokeWidth="4" fill="none" markerEnd="url(#lsd-arrow)">
          <line x1="220" y1="235" x2="465" y2="235" />
          <line x1="545" y1="270" x2="660" y2="430" />
          <line x1="1045" y1="270" x2="935" y2="430" />
          <line x1="820" y1="500" x2="820" y2="755" />
          <line x1="278" y1="485" x2="278" y2="755" />
          <line x1="420" y1="782" x2="710" y2="782" />
          <line x1="1180" y1="782" x2="930" y2="782" />
        </g>

        <text x="112" y="248" fontSize="40" fontWeight="900">GM₁</text>
        <text x="485" y="248" fontSize="40" fontWeight="900">GM₂</text>
        <text x="638" y="470" fontSize="39" fontWeight="900">Glucocerebroside</text>
        <text x="1030" y="248" fontSize="39" fontWeight="900">Ceramide trihexoside</text>
        <text x="116" y="467" fontSize="39" fontWeight="900">Sulfatides</text>
        <text x="32"  y="795" fontSize="39" fontWeight="900">Galactocerebroside</text>
        <text x="732" y="807" fontSize="39" fontWeight="900">Ceramide</text>
        <text x="1205" y="805" fontSize="39" fontWeight="900">Sphingomyelin</text>

        <text x="220" y="218" fontSize="29" fontWeight="500" fill="#1692f2">Hexosaminidase A</text>
        <text x="1028" y="335" fontSize="29" fontWeight="500" fill="#1692f2">α-galactosidase A</text>
        <text x="300"  y="615" fontSize="29" fontWeight="500" fill="#1692f2">Arylsulfatase A</text>
        <text x="850"  y="615" fontSize="29" fontWeight="500" fill="#1692f2">Glucocerebrosidase</text>
        <text x="435"  y="770" fontSize="29" fontWeight="500" fill="#1692f2">Galactocerebrosidase</text>
        <text x="945"  y="770" fontSize="29" fontWeight="500" fill="#1692f2">Sphingomyelinase</text>

        <DiseaseBox x={235}  y={70}  lines="Tay-Sachs disease" />
        <DiseaseBox x={1278} y={318} lines="Fabry disease" />
        <DiseaseBox x={50}   y={572} width={295} lines={["Metachromatic", "leukodystrophy"]} />
        <DiseaseBox x={592}  y={585} lines="Gaucher disease" />
        <DiseaseBox x={475}  y={803} lines="Krabbe disease" />
        <DiseaseBox x={930}  y={803} width={285} lines={["Niemann-Pick", "disease"]} />

        <g key={`${target.type}-${target.answer}`}>
          <rect
            x={target.x} y={target.y} width={target.w} height={target.h}
            rx="12" fill="#1f1812" stroke="#f3ece0" strokeWidth="4"
          />
          <text
            x={target.x + target.w / 2} y={target.y + target.h / 2 + 10}
            textAnchor="middle"
            fontSize={showAnswer ? "22" : "38"}
            fontWeight="900"
            fill="#f3ece0"
          >
            {showAnswer ? target.answer : "?"}
          </text>
        </g>
      </svg>
    </div>
  );
}

const FILTER_MODES = ['all', 'disease', 'product', 'enzyme'];

export function LysosomalQuiz({ onGoHome }) {
  const [target, setTarget]       = useState(() => targets[Math.floor(Math.random() * targets.length)]);
  const [options, setOptions]     = useState(() => buildOptions(targets[Math.floor(Math.random() * targets.length)]));
  const [selected, setSelected]   = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [filter, setFilter]       = useState('all');
  const [score, setScore]         = useState({ right: 0, total: 0 });

  // keep options in sync with first target
  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    setOptions(buildOptions(target));
    setInitialized(true);
  }

  const pool = useMemo(
    () => filter === 'all' ? targets : targets.filter(t => t.type === filter),
    [filter]
  );

  function nextQuestion(nextFilter = filter) {
    const p = nextFilter === 'all' ? targets : targets.filter(t => t.type === nextFilter);
    const next = p[Math.floor(Math.random() * p.length)];
    setTarget(next);
    setOptions(buildOptions(next));
    setSelected(null);
    setShowAnswer(false);
  }

  function choose(choice) {
    if (selected) return;
    setSelected(choice);
    setScore(s => ({ right: s.right + (choice === target.answer ? 1 : 0), total: s.total + 1 }));
  }

  function changeFilter(f) {
    setFilter(f);
    nextQuestion(f);
  }

  const correct = selected === target.answer;

  return (
    <div className="paper">
      <div style={{maxWidth:'1600px', margin:'0 auto', padding:'2rem 1.5rem'}}>

        <header className="flex items-end justify-between pb-3 mb-2" style={{borderBottom:'2px solid #1f1812'}}>
          <div>
            <div className="text-xs mono uppercase tracking-widest" style={{color:'#8b2635'}}>Wayne State University School of Medicine · Trainer</div>
            <h1 className="display text-5xl mt-1" style={{color:'#1f1812'}}>Differential <span style={{color:'#8b2635'}}>·</span> Lysosomal Storage</h1>
            <div className="text-sm italic mt-1" style={{color:'#5a4a3a'}}>A black box hides one label — identify the product, enzyme, or disease</div>
          </div>
          <div className="text-right">
            <div className="mono text-xs uppercase tracking-widest" style={{color:'#5a4a3a'}}>Score</div>
            <div className="display text-3xl">
              <span style={{color:'#2d784e'}}>{score.right}</span>
              <span style={{color:'#5a4a3a'}}> / </span>
              <span>{score.total}</span>
            </div>
            <div className="flex gap-3 justify-end mt-1">
              <button onClick={() => setScore({ right:0, total:0 })} className="mono text-xs underline"
                style={{color:'#8b2635', background:'none', border:'none', cursor:'pointer'}}>
                reset score
              </button>
              <button onClick={onGoHome} className="mono text-xs underline"
                style={{color:'#8b2635', background:'none', border:'none', cursor:'pointer'}}>
                change topic
              </button>
            </div>
          </div>
        </header>
        <div className="accent-rule mb-6" />

        <div style={{display:'grid', gridTemplateColumns:'minmax(0,1fr) 360px', gap:'1.5rem', alignItems:'start'}}>

          {/* Diagram */}
          <div className="panel rounded p-3">
            <Diagram target={target} showAnswer={showAnswer} />
          </div>

          {/* Question panel */}
          <div className="panel rounded p-5 space-y-4">

            {/* What is hidden */}
            <div className="flex items-baseline justify-between">
              <div>
                <div className="mono text-xs uppercase tracking-widest" style={{color:'#5a4a3a'}}>What is hidden?</div>
                <div className="display text-2xl mt-0.5" style={{color:'#1f1812'}}>{titleForType(target.type)}</div>
              </div>
              <div className="mono text-xs uppercase tracking-widest px-2 py-1"
                style={{border:'1px solid rgba(31,24,18,0.3)', borderRadius:'2px', color:'#5a4a3a'}}>
                {pool.length} cards
              </div>
            </div>

            {/* Filter buttons */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem'}}>
              {FILTER_MODES.map(f => (
                <button key={f} onClick={() => changeFilter(f)}
                  className="mono text-xs uppercase tracking-widest py-2 px-3 rounded"
                  style={{
                    border: '2px solid rgba(31,24,18,0.25)',
                    cursor: 'pointer',
                    background: filter === f ? '#1f1812' : 'rgba(253,248,238,0.85)',
                    color:  filter === f ? '#f3ece0'  : '#1f1812',
                    fontWeight: filter === f ? 700 : 400,
                  }}>
                  {f === 'all' ? 'Mixed' : f}
                </button>
              ))}
            </div>

            {/* Options */}
            <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
              {options.map(choice => {
                const isSelected   = selected === choice;
                const isCorrect    = choice === target.answer;
                const revealRight  = selected && isCorrect;
                const revealWrong  = isSelected && !isCorrect;
                let cls = 'opt';
                if (revealRight) cls += ' opt-correct';
                if (revealWrong) cls += ' opt-wrong';
                return (
                  <button key={choice} onClick={() => choose(choice)} disabled={!!selected}
                    className={`${cls} text-left p-3 rounded`}
                    style={{
                      border: '2px solid rgba(31,24,18,0.25)',
                      background: 'rgba(253,248,238,0.85)',
                      cursor: selected ? 'default' : 'pointer',
                      transition: 'background 0.15s',
                      display:'flex', alignItems:'center', gap:'0.5rem',
                    }}>
                    <span style={{width:'1.25rem', flexShrink:0, color: revealRight ? '#2d784e' : revealWrong ? '#a01b28' : 'transparent'}}>
                      {revealRight ? '✓' : revealWrong ? '✗' : '·'}
                    </span>
                    <span className="display" style={{fontWeight:600, fontSize:'1rem'}}>{choice}</span>
                  </button>
                );
              })}
            </div>

            {/* Result banner */}
            {selected && (
              <div className="panel rounded p-3 case-fade" style={{borderLeft:`3px solid ${correct ? '#2d784e' : '#a01b28'}`}}>
                <div className="display" style={{fontWeight:700, color: correct ? '#2d784e' : '#a01b28'}}>
                  {correct ? 'Correct.' : 'Not quite.'}
                </div>
                <div className="text-sm mt-0.5" style={{color:'#5a4a3a'}}>
                  Answer: <span style={{fontWeight:600, color:'#1f1812'}}>{target.answer}</span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{display:'flex', gap:'0.5rem'}}>
              <button onClick={() => nextQuestion()}
                className="display flex-1 py-2 px-4 text-base"
                style={{background:'#1f1812', color:'#f3ece0', borderRadius:'2px', fontWeight:700,
                  letterSpacing:'0.02em', border:'none', cursor:'pointer'}}>
                Next →
              </button>
              <button onClick={() => setShowAnswer(v => !v)}
                className="mono text-xs py-2 px-3 rounded"
                style={{border:'2px solid rgba(31,24,18,0.25)', background:'rgba(253,248,238,0.85)',
                  cursor:'pointer', color:'#1f1812'}}>
                {showAnswer ? 'Hide' : 'Reveal'}
              </button>
            </div>

            {!selected && (
              <div style={{textAlign:'right'}}>
                <button onClick={() => nextQuestion()} className="mono text-xs underline"
                  style={{color:'#7a6a55', background:'none', border:'none', cursor:'pointer'}}>
                  skip · next question
                </button>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 pt-4 mono text-xs flex justify-between"
          style={{color:'#7a6a55', borderTop:'1px solid rgba(31,24,18,0.3)'}}>
          <span>Confidential · Teaching File · For educational use only</span>
          <span>6 diseases · 20 labels</span>
        </footer>
      </div>
    </div>
  );
}
