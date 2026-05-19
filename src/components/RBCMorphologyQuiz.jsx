import { useState, useMemo } from 'react';

// =========================================================================
// DATA
// =========================================================================
const CELLS = [
  {
    id: 'acanthocyte',
    name: 'Acanthocyte',
    associations: ['Abetalipoproteinemia', 'Severe liver disease', 'Vitamin E deficiency'],
    note: 'Few irregular, unevenly spaced projections of varying length',
  },
  {
    id: 'echinocyte',
    name: 'Echinocyte (Burr cell)',
    associations: ['End-stage renal disease', 'Pyruvate kinase deficiency', 'Uremia'],
    note: 'Many uniform, evenly spaced short projections (crenation)',
  },
  {
    id: 'dacrocyte',
    name: 'Dacrocyte (Teardrop cell)',
    associations: ['Primary myelofibrosis', 'Bone marrow infiltration', 'Myelophthisic anemia'],
    note: 'Elongated teardrop shape squeezed out of fibrotic marrow',
  },
  {
    id: 'schistocyte',
    name: 'Schistocyte (Helmet cell)',
    associations: ['Microangiopathic hemolytic anemia (MAHA)', 'TTP/HUS', 'DIC', 'HELLP syndrome'],
    note: 'Fragmented RBC from mechanical shearing in fibrin strands',
  },
  {
    id: 'degmacyte',
    name: 'Degmacyte (Bite cell)',
    associations: ['G6PD deficiency', 'Oxidative hemolysis'],
    note: 'Heinz bodies removed by splenic macrophages leave a "bitten" gap',
  },
  {
    id: 'elliptocyte',
    name: 'Elliptocyte',
    associations: ['Hereditary elliptocytosis', 'Iron deficiency anemia', 'Thalassemia'],
    note: 'Oval due to spectrin mutation preventing membrane recovery',
  },
  {
    id: 'spherocyte',
    name: 'Spherocyte',
    associations: ['Hereditary spherocytosis', 'Autoimmune hemolytic anemia'],
    note: 'Loss of central pallor; membrane lost while passing through spleen',
  },
  {
    id: 'macroovalocyte',
    name: 'Macro-ovalocyte',
    associations: ['Megaloblastic anemia', 'Folate deficiency', 'Vitamin B12 deficiency'],
    note: 'Large oval cell from impaired DNA synthesis in RBC precursors',
  },
  {
    id: 'targetcell',
    name: 'Target cell (Codocyte)',
    associations: ['HbC disease', 'Thalassemia', 'Liver disease', 'Asplenia'],
    note: 'Excess membrane relative to cell volume creates bullseye pattern',
  },
  {
    id: 'sicklecell',
    name: 'Sickle cell (Drepanocyte)',
    associations: ['Sickle cell anemia (HbSS)', 'HbSC disease'],
    note: 'HbS polymerizes under low O₂; rigid crescent blocks microvasculature',
  },
  {
    id: 'howelljolly',
    name: 'Howell-Jolly body',
    associations: ['Functional asplenia', 'Sickle cell disease', 'Post-splenectomy'],
    note: 'Nuclear remnant not cleared without a functioning spleen',
  },
  {
    id: 'basophilicstipple',
    name: 'Basophilic stippling',
    associations: ['Lead poisoning', 'Sideroblastic anemia', 'Thalassemia'],
    note: 'Aggregated ribosomes; lead inhibits 5-ALA dehydratase and heme synthesis',
  },
  {
    id: 'heinzbody',
    name: 'Heinz body',
    associations: ['G6PD deficiency', 'Oxidative stress hemolysis'],
    note: 'Denatured/oxidized hemoglobin precipitate attached to cell membrane',
  },
  {
    id: 'pappenheimer',
    name: 'Pappenheimer body (Siderocyte)',
    associations: ['Sideroblastic anemia', 'Post-splenectomy', 'Hemolytic anemia'],
    note: 'Iron-containing mitochondrial granules in clusters near cell periphery',
  },
  {
    id: 'ringedsideroblast',
    name: 'Ring sideroblast',
    associations: ['Sideroblastic anemia', 'Lead poisoning', 'Myelodysplastic syndrome', 'Chronic alcohol overuse'],
    note: 'Iron-laden mitochondria encircle ≥ 1/3 of nucleus in nucleated RBC precursor',
  },
];

// =========================================================================
// SVG PATH BUILDERS
// =========================================================================
function buildEchiPath(cx = 100, cy = 100) {
  const n = 24, r1 = 57, r2 = 46;
  let d = '';
  for (let i = 0; i < n; i++) {
    const a1 = (i / n) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2;
    d += (i === 0 ? 'M' : 'L') + `${(cx + Math.cos(a1) * r1).toFixed(1)},${(cy + Math.sin(a1) * r1).toFixed(1)} `;
    d += `L${(cx + Math.cos(a2) * r2).toFixed(1)},${(cy + Math.sin(a2) * r2).toFixed(1)} `;
  }
  return d + 'Z';
}

function buildAcanthoPath(cx = 100, cy = 100) {
  // [angle_deg, inner_r, outer_r] — irregular, uneven spacing
  const spurs = [
    [0, 46, 70], [40, 51, 56], [78, 43, 74], [118, 50, 59],
    [160, 43, 69], [204, 51, 57], [244, 43, 73], [288, 50, 61], [330, 45, 67],
  ];
  const hw = 0.21;
  let d = '';
  spurs.forEach(([ang, inner, outer], i) => {
    const a = (ang * Math.PI) / 180;
    const b1x = (cx + Math.cos(a - hw) * inner).toFixed(1);
    const b1y = (cy + Math.sin(a - hw) * inner).toFixed(1);
    const tx = (cx + Math.cos(a) * outer).toFixed(1);
    const ty = (cy + Math.sin(a) * outer).toFixed(1);
    const b2x = (cx + Math.cos(a + hw) * inner).toFixed(1);
    const b2y = (cy + Math.sin(a + hw) * inner).toFixed(1);
    d += (i === 0 ? `M${b1x},${b1y}` : `L${b1x},${b1y}`) + ` L${tx},${ty} L${b2x},${b2y} `;
  });
  return d + 'Z';
}

// =========================================================================
// RBC DRAWING
// =========================================================================
function RBCDrawing({ type }) {
  const red = '#cf3d2e';
  const darkRed = '#a82d25';
  const lightRed = '#e86f55';
  const purple = '#7a3ca5';
  const blue = '#4c69aa';
  const iron = '#315b9d';

  const gId = `rg-${type}`;
  const pId = `rp-${type}`;
  const paleId = `rpale-${type}`;

  const defs = (
    <defs>
      <radialGradient id={gId} cx="50%" cy="40%" r="58%">
        <stop offset="0%" stopColor={lightRed} />
        <stop offset="38%" stopColor={red} />
        <stop offset="100%" stopColor={darkRed} />
      </radialGradient>
      <radialGradient id={pId} cx="50%" cy="46%" r="50%">
        <stop offset="0%" stopColor="#fad8cc" stopOpacity="0.95" />
        <stop offset="58%" stopColor="#e6614b" stopOpacity="0.3" />
        <stop offset="100%" stopColor={red} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={paleId} cx="50%" cy="40%" r="58%">
        <stop offset="0%" stopColor="#e8c4bc" />
        <stop offset="100%" stopColor="#c0888080" />
      </radialGradient>
      <radialGradient id={`rhl-${type}`} cx="30%" cy="30%" r="50%">
        <stop offset="0%" stopColor={lightRed} stopOpacity="0.35" />
        <stop offset="100%" stopColor={lightRed} stopOpacity="0" />
      </radialGradient>
    </defs>
  );

  const disc = (r = 58) => (
    <>
      <circle cx="100" cy="100" r={r} fill={`url(#${gId})`} />
      <circle cx="100" cy="100" r={Math.round(r * 0.52)} fill={`url(#${pId})`} />
    </>
  );

  // Stipple dots — seeded so they're stable per render
  const stippleDots = Array.from({ length: 28 }, (_, i) => {
    const ang = (i / 28) * Math.PI * 2;
    const r = 14 + ((i * 19) % 36);
    const jx = ((i * 37) % 20) - 10;
    const jy = ((i * 53) % 20) - 10;
    return (
      <circle
        key={i}
        cx={100 + Math.cos(ang) * r + jx}
        cy={100 + Math.sin(ang) * r + jy}
        r={1.4 + (i % 3) * 0.5}
        fill={purple}
        opacity="0.88"
      />
    );
  });

  const shapes = {
    // ---- SHAPE ABNORMALITIES ----
    acanthocyte: (
      <>
        <path d={buildAcanthoPath()} fill={`url(#${gId})`} />
        <circle cx="100" cy="100" r="28" fill={`url(#${pId})`} opacity="0.65" />
      </>
    ),

    echinocyte: (
      <>
        <path d={buildEchiPath()} fill={`url(#${gId})`} />
        <circle cx="100" cy="100" r="27" fill={`url(#${pId})`} opacity="0.6" />
      </>
    ),

    // Teardrop — pointed top, round base, shifted slightly right
    dacrocyte: (
      <path
        d="M 104 26 C 132 52 155 80 150 114 C 145 150 122 168 96 162 C 68 155 52 128 60 100 C 68 72 88 52 104 26 Z"
        fill={`url(#${gId})`}
      />
    ),

    // Helmet/triangular fragment with jagged torn edge at bottom
    schistocyte: (
      <g>
        <path
          d="M 46 100 Q 52 54 100 44 Q 148 54 156 100 Q 138 112 120 104 L 108 116 L 94 102 L 80 114 L 64 106 Z"
          fill={`url(#${gId})`}
        />
        <path
          d="M 46 100 L 64 106 L 80 114 L 94 102 L 108 116 L 120 104 L 138 112 L 156 100"
          fill="none"
          stroke={darkRed}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>
    ),

    // Bite taken out of the right side
    degmacyte: (
      <g>
        <path
          d="M 58 68 C 74 42 116 34 142 60 C 164 80 164 118 142 138 C 118 162 76 162 58 136 C 40 112 42 88 58 68 Z"
          fill={`url(#${gId})`}
        />
        {/* White bite area */}
        <circle cx="152" cy="65" r="32" fill="#f5f3ee" />
        <path
          d="M 142 60 C 164 80 164 118 142 138"
          fill="none"
          stroke="rgba(180,160,140,0.4)"
          strokeWidth="1"
        />
      </g>
    ),

    elliptocyte: (
      <g transform="rotate(-6 100 100)">
        <ellipse cx="100" cy="100" rx="44" ry="74" fill={`url(#${gId})`} />
        <ellipse cx="100" cy="100" rx="22" ry="46" fill={`url(#${pId})`} opacity="0.6" />
      </g>
    ),

    // Sphere — NO central pallor; add specular highlight instead
    spherocyte: (
      <>
        <circle cx="100" cy="100" r="54" fill={`url(#${gId})`} />
        <circle cx="82" cy="82" r="16" fill={`url(#rhl-${type})`} />
      </>
    ),

    macroovalocyte: (
      <g transform="rotate(-7 100 100)">
        <ellipse cx="100" cy="100" rx="55" ry="73" fill={`url(#${gId})`} />
        <ellipse cx="100" cy="100" rx="28" ry="42" fill={`url(#${pId})`} opacity="0.45" />
      </g>
    ),

    // Bullseye: three concentric bands
    targetcell: (
      <g>
        <circle cx="100" cy="100" r="62" fill={`url(#${gId})`} />
        <circle cx="100" cy="100" r="46" fill="#eeaa92" />
        <circle cx="100" cy="100" r="26" fill={red} />
        <circle cx="100" cy="100" r="11" fill="#f09a7e" opacity="0.5" />
      </g>
    ),

    // Thin crescent/banana sickle
    sicklecell: (
      <path
        d="M 118 28 C 150 48 164 88 158 128 C 152 162 134 178 112 180 C 130 158 136 128 128 96 C 120 66 106 46 118 28 Z"
        fill={`url(#${gId})`}
      />
    ),

    // ---- INCLUSION BODIES ----
    howelljolly: (
      <>
        {disc()}
        <circle cx="120" cy="76" r="9.5" fill={purple} />
        <circle cx="120" cy="76" r="4" fill="#a265cc" opacity="0.55" />
      </>
    ),

    basophilicstipple: (
      <>
        {disc()}
        {stippleDots}
      </>
    ),

    // Pale RBC, blue-staining precipitates at membrane margin
    heinzbody: (
      <>
        <circle cx="100" cy="100" r="58" fill={`url(#${paleId})`} />
        <circle cx="100" cy="100" r="30" fill="#edd6ce" opacity="0.45" />
        <circle cx="140" cy="72" r="10" fill={blue} opacity="0.9" />
        <circle cx="60" cy="115" r="7.5" fill={blue} opacity="0.8" />
        <circle cx="125" cy="138" r="6" fill={blue} opacity="0.7" />
      </>
    ),

    // Small iron granule clusters (siderocytes) — lower right quadrant
    pappenheimer: (
      <>
        <circle cx="100" cy="100" r="58" fill={`url(#${paleId})`} />
        <circle cx="100" cy="100" r="30" fill={`url(#${pId})`} opacity="0.4" />
        {[[120, 122], [130, 114], [114, 132], [138, 124], [126, 136], [138, 136]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.8 + (i % 2) * 0.6} fill={iron} />
        ))}
      </>
    ),

    // Nucleated RBC precursor with iron granules encircling nucleus
    ringedsideroblast: (
      <>
        <ellipse cx="100" cy="104" rx="60" ry="56" fill="#ddb2a8" />
        <circle cx="100" cy="104" r="32" fill={purple} opacity="0.88" />
        <circle cx="100" cy="104" r="18" fill="#9a5ec0" opacity="0.5" />
        {Array.from({ length: 20 }, (_, i) => {
          const a = (i / 20) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={(100 + Math.cos(a) * 44).toFixed(1)}
              cy={(104 + Math.sin(a) * 40).toFixed(1)}
              r="3.2"
              fill={iron}
            />
          );
        })}
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      role="img"
      aria-label={`${type} RBC morphology drawing`}
    >
      {defs}
      {shapes[type] ?? disc()}
    </svg>
  );
}

// =========================================================================
// QUIZ LOGIC
// =========================================================================
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ALL_NAMES = CELLS.map(c => c.name);
const ALL_ASSOC = [...new Set(CELLS.flatMap(c => c.associations))];

function buildQuestion(cell) {
  const nameMode = Math.random() < 0.5;
  if (nameMode) {
    const distractors = shuffle(ALL_NAMES.filter(n => n !== cell.name)).slice(0, 5);
    return {
      prompt: 'What is this RBC morphology called?',
      correct: cell.name,
      options: shuffle([cell.name, ...distractors]),
    };
  }
  const correct = cell.associations[Math.floor(Math.random() * cell.associations.length)];
  const distractors = shuffle(ALL_ASSOC.filter(a => !cell.associations.includes(a))).slice(0, 5);
  return {
    prompt: 'Which condition is this morphology associated with?',
    correct,
    options: shuffle([correct, ...distractors]),
  };
}

// =========================================================================
// QUIZ COMPONENT
// =========================================================================
export function RBCMorphologyQuiz({ onGoHome }) {
  const [order] = useState(() => shuffle(CELLS));
  const [idx, setIdx] = useState(0);
  const [seed, setSeed] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ right: 0, wrong: 0 });

  const cell = order[idx];

  const question = useMemo(() => buildQuestion(cell), [idx, seed]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = score.right + score.wrong;
  const accuracy = total > 0 ? Math.round((score.right / total) * 100) : null;

  function pick(opt) {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    setScore(prev =>
      opt === question.correct
        ? { ...prev, right: prev.right + 1 }
        : { ...prev, wrong: prev.wrong + 1 }
    );
  }

  function next() {
    setSelected(null);
    setRevealed(false);
    setSeed(s => s + 1);
    setIdx(i => (i + 1) % order.length);
  }

  function restart() {
    setIdx(0);
    setSeed(0);
    setSelected(null);
    setRevealed(false);
    setScore({ right: 0, wrong: 0 });
  }

  const correct = revealed && selected === question.correct;

  return (
    <div className="paper">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <header className="flex items-end justify-between pb-3 mb-2" style={{ borderBottom: '2px solid #1f1812' }}>
          <div>
            <div className="text-xs mono uppercase tracking-widest" style={{ color: '#8b2635' }}>
              Wayne State University School of Medicine · Trainer
            </div>
            <h1 className="display text-5xl mt-1" style={{ color: '#1f1812' }}>
              RBC <span style={{ color: '#8b2635' }}>·</span> Morphology
            </h1>
            <div className="text-sm italic mt-1" style={{ color: '#5a4a3a' }}>
              Identify peripheral smear findings and their clinical associations
            </div>
          </div>
          <div className="text-right">
            <div className="mono text-xs uppercase tracking-widest" style={{ color: '#5a4a3a' }}>Score</div>
            <div className="display text-3xl">
              <span style={{ color: '#2d784e' }}>{score.right}</span>
              <span style={{ color: '#5a4a3a' }}> / </span>
              <span>{total}</span>
            </div>
            {accuracy !== null && (
              <div className="mono text-xs mt-0.5" style={{ color: '#7a6a55' }}>{accuracy}% accuracy</div>
            )}
            <div className="flex gap-3 justify-end mt-1">
              <button
                onClick={restart}
                className="mono text-xs underline"
                style={{ color: '#8b2635', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                restart
              </button>
              <button
                onClick={onGoHome}
                className="mono text-xs underline"
                style={{ color: '#8b2635', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                change topic
              </button>
            </div>
          </div>
        </header>
        <div className="accent-rule mb-6" />

        {/* Card: drawing + question */}
        <div className="case-fade" key={`${idx}-${seed}`}>
          <div className="panel rounded p-6 mb-5 flex flex-col md:flex-row items-center gap-6">

            {/* Drawing */}
            <div
              className="flex-shrink-0 flex items-center justify-center rounded"
              style={{
                width: 220, height: 220,
                background: 'rgba(240,234,220,0.6)',
                border: '1px solid rgba(31,24,18,0.15)',
              }}
            >
              <div style={{ width: 180, height: 180 }}>
                <RBCDrawing type={cell.id} />
              </div>
            </div>

            {/* Question + progress */}
            <div className="flex-1 min-w-0">
              <div className="mono text-xs uppercase tracking-widest mb-1" style={{ color: '#5a4a3a' }}>
                Cell {idx + 1} of {order.length}
              </div>
              <div className="display text-2xl md:text-3xl leading-snug" style={{ color: '#1f1812' }}>
                {question.prompt}
              </div>
              <div
                className="mt-3 w-full rounded-full"
                style={{ height: 4, background: 'rgba(31,24,18,0.12)' }}
              >
                <div
                  className="rounded-full"
                  style={{
                    height: 4,
                    width: `${((idx + 1) / order.length) * 100}%`,
                    background: '#8b2635',
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="grid sm:grid-cols-2 gap-2.5 mb-4">
            {question.options.map((opt, i) => {
              const isCorrect = opt === question.correct;
              const isSelected = selected === opt;
              let border = 'rgba(31,24,18,0.25)';
              let bg = 'transparent';
              let textColor = '#1f1812';
              if (revealed) {
                if (isCorrect) { border = '#2d784e'; bg = 'rgba(45,120,80,0.13)'; textColor = '#1a5533'; }
                else if (isSelected) { border = '#a01b28'; bg = 'rgba(160,27,40,0.12)'; textColor = '#7a0e1a'; }
              }
              return (
                <button
                  key={i}
                  onClick={() => pick(opt)}
                  disabled={revealed}
                  className="opt text-left p-3.5 rounded border-2 transition"
                  style={{ borderColor: border, background: bg, color: textColor, cursor: revealed ? 'default' : 'pointer' }}
                >
                  <div className="display text-base" style={{ fontWeight: 600 }}>{opt}</div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {revealed && (
            <div
              className="panel rounded p-5 border-2 case-fade"
              style={{ borderColor: correct ? '#2d784e' : '#a01b28' }}
            >
              <div className="flex items-start gap-3 flex-wrap mb-3">
                <span className="stamp" style={{ color: correct ? '#2d784e' : '#a01b28' }}>
                  {correct ? 'Correct' : 'Incorrect'}
                </span>
                <div>
                  <span className="display text-xl">{cell.name}</span>
                  {!correct && (
                    <div className="text-sm mt-0.5" style={{ color: '#5a4a3a' }}>
                      Answer: <strong>{question.correct}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <div className="mono uppercase tracking-widest text-xs mb-1" style={{ color: '#8b2635' }}>
                    Key feature
                  </div>
                  <div style={{ color: '#1f1812' }}>{cell.note}</div>
                </div>
                <div>
                  <div className="mono uppercase tracking-widest text-xs mb-1" style={{ color: '#8b2635' }}>
                    Associated conditions
                  </div>
                  <ul className="space-y-0.5">
                    {cell.associations.map((a, i) => (
                      <li key={i} style={{ color: '#1f1812' }}>· {a}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 flex gap-3 items-center flex-wrap">
                <button
                  onClick={next}
                  className="display px-5 py-2 text-base"
                  style={{
                    background: '#1f1812', color: '#f3ece0', borderRadius: '2px',
                    fontWeight: 700, letterSpacing: '0.02em', border: 'none', cursor: 'pointer',
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {!revealed && (
            <div className="flex justify-end">
              <button
                onClick={next}
                className="mono text-xs underline"
                style={{ color: '#7a6a55', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                skip
              </button>
            </div>
          )}
        </div>

        <footer
          className="mt-12 pt-4 mono text-xs flex justify-between"
          style={{ color: '#7a6a55', borderTop: '1px solid rgba(31,24,18,0.3)' }}
        >
          <span>Confidential · Teaching File · For educational use only</span>
          <span>RBC Morphology · {CELLS.length} cells</span>
        </footer>
      </div>
    </div>
  );
}
