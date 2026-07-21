import { useMemo, useRef, useState } from 'react';
import { BASELINE_PARAMS, CELL_TYPES, CHANNEL_LABELS, CHANNEL_ROLES, DRUG_PRESETS } from '../../data/cardio.js';
import {
  generateAP, computeMetrics, describeParamDirections, plainTakeaways,
  parseDrugKey, areSimilarChannels,
} from '../../utils/cardioModel.js';
import { TraceChart } from './TraceChart.jsx';

const selectStyle = {
  width: '100%', border: '2px solid rgba(31,24,18,0.25)', borderRadius: 4, padding: '6px 8px',
  fontFamily: "'Lora',serif", fontSize: 14, background: 'rgba(253,248,238,0.9)', color: '#1f1812',
};
const fieldLabel = { fontFamily: "'JetBrains Mono',monospace", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a4a3a' };

function toggleBtnStyle(active) {
  return {
    flex: 1, padding: '8px 12px', border: '2px solid rgba(31,24,18,0.25)', cursor: 'pointer',
    background: active ? '#1f1812' : 'transparent', color: active ? '#f3ece0' : '#1f1812',
    fontFamily: "'JetBrains Mono',monospace", fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em',
  };
}

export function CardioQuiz() {
  const [cellTypeId, setCellTypeId] = useState('ventricular');
  const [quizKind, setQuizKind] = useState('channel');
  const [difficulty, setDifficulty] = useState('standard');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const lastTargetRef = useRef(null);

  const cell = useMemo(() => CELL_TYPES.find((c) => c.id === cellTypeId) || CELL_TYPES[0], [cellTypeId]);
  const availableChannels = useMemo(() => Object.keys(CHANNEL_LABELS).filter((k) => cell.uses[k]), [cell]);

  const maskParamsByCell = (id, params) => {
    const mask = CELL_TYPES.find((c) => c.id === id)?.uses || {};
    const out = { ...params };
    Object.keys(out).forEach((k) => { if (!mask[k]) out[k] = 0; });
    return out;
  };

  const applyMap = (base, mapObj) => {
    const out = { ...base };
    Object.entries(mapObj || {}).forEach(([k, v]) => { if (k in out) out[k] = Math.round(out[k] * (v / 100)); });
    return out;
  };

  const effDrugKeys = useMemo(() => {
    const all = Object.keys(DRUG_PRESETS).filter((d) => d !== 'None');
    const hasEffect = (drugKey) => {
      const baseParams = maskParamsByCell(cellTypeId, { ...BASELINE_PARAMS });
      const modParams = maskParamsByCell(cellTypeId, applyMap({ ...BASELINE_PARAMS }, DRUG_PRESETS[drugKey]));
      const sameParams = JSON.stringify(baseParams) === JSON.stringify(modParams);
      if (sameParams) return false;
      const baseAP = generateAP(cellTypeId, baseParams);
      const modAP = generateAP(cellTypeId, modParams);
      const baseM = computeMetrics(baseAP); const curM = computeMetrics(modAP);
      const take = plainTakeaways(baseM, curM);
      const changeLines = describeParamDirections(modParams);
      const noShapeChange = take.length === 1 && take[0] === 'Overall shape: about the same';
      const noParamChange = changeLines.length === 1 && changeLines[0] === 'No major changes.';
      return !(noShapeChange && noParamChange);
    };
    return all.filter(hasEffect);
  }, [cellTypeId]);

  const nOptions = difficulty === 'easy' ? 2 : 4;

  function makeChannelQuestion() {
    let targetChannel;
    const eligible = availableChannels.filter((ch) => ch !== lastTargetRef.current);
    targetChannel = eligible.length ? eligible[Math.floor(Math.random() * eligible.length)] : availableChannels[0];
    lastTargetRef.current = targetChannel;

    const isKO = Math.random() < 0.5;
    const modValue = isKO ? 0 : 200;
    const modType = isKO ? 'knockout' : 'increase';

    const modParamsRaw = { ...BASELINE_PARAMS, [targetChannel]: modValue };
    const baselineParams = maskParamsByCell(cellTypeId, { ...BASELINE_PARAMS });
    const modParams = maskParamsByCell(cellTypeId, modParamsRaw);

    let wrong = availableChannels
      .filter((c) => c !== targetChannel && !areSimilarChannels(c, targetChannel))
      .sort(() => Math.random() - 0.5);
    if (wrong.length < (nOptions - 1)) {
      const remain = availableChannels.filter((c) => c !== targetChannel && !wrong.includes(c)).sort(() => Math.random() - 0.5);
      wrong = [...wrong, ...remain];
    }
    wrong = wrong.slice(0, Math.max(1, nOptions - 1));
    const options = [targetChannel, ...wrong].sort(() => Math.random() - 0.5);

    return {
      type: 'channel', targetChannel, modType, modValue, options,
      baseline: generateAP(cellTypeId, baselineParams),
      modified: generateAP(cellTypeId, modParams),
    };
  }

  function generateQuestion() {
    if (quizKind === 'drug') {
      if (!effDrugKeys.length) return makeChannelQuestion();

      const targetKey = effDrugKeys[Math.floor(Math.random() * effDrugKeys.length)];
      const { name: targetName, kind: targetKind } = parseDrugKey(targetKey);

      const baselineParams = maskParamsByCell(cellTypeId, { ...BASELINE_PARAMS });
      const modParamsRaw = applyMap({ ...BASELINE_PARAMS }, DRUG_PRESETS[targetKey]);
      const modParams = maskParamsByCell(cellTypeId, modParamsRaw);

      const wrong = effDrugKeys
        .filter((k) => k !== targetKey)
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.max(1, nOptions - 1))
        .map((k) => ({ key: k, name: parseDrugKey(k).name }));

      const options = [{ key: targetKey, name: targetName }, ...wrong].sort(() => Math.random() - 0.5);

      return {
        type: 'drug', targetKey, targetName, targetKind, modParamsMap: DRUG_PRESETS[targetKey], options,
        baseline: generateAP(cellTypeId, baselineParams),
        modified: generateAP(cellTypeId, modParams),
      };
    }
    return makeChannelQuestion();
  }

  useMemo(() => { if (!currentQuestion) setCurrentQuestion(generateQuestion()); }, [cellTypeId, quizKind, difficulty, currentQuestion, availableChannels]); // eslint-disable-line react-hooks/exhaustive-deps

  const baseM = useMemo(() => currentQuestion ? computeMetrics(currentQuestion.baseline) : null, [currentQuestion]);
  const curM = useMemo(() => currentQuestion ? computeMetrics(currentQuestion.modified) : null, [currentQuestion]);

  const changeLines = useMemo(() => {
    if (!currentQuestion || currentQuestion.type !== 'drug') return [];
    const map = currentQuestion.modParamsMap || {};
    const fullMap = Object.fromEntries(Object.keys(BASELINE_PARAMS).map((k) => [k, Math.round((map[k] ?? 100))]));
    return describeParamDirections(fullMap);
  }, [currentQuestion]);

  function handleAnswer(ans) {
    if (showResult || !currentQuestion) return;
    setSelectedAnswer(ans);
    setShowResult(true);
    setQuestionsAnswered((q) => q + 1);
    const correct = currentQuestion.type === 'drug' ? (ans === currentQuestion.targetKey) : (ans === currentQuestion.targetChannel);
    if (correct) setScore((s) => s + 1);
  }

  function nextQuestion() { setCurrentQuestion(generateQuestion()); setSelectedAnswer(null); setShowResult(false); }
  function resetQuiz() {
    setScore(0); setQuestionsAnswered(0); lastTargetRef.current = null;
    setCurrentQuestion(generateQuestion()); setSelectedAnswer(null); setShowResult(false);
  }

  if (!currentQuestion) return <div className="mono text-sm" style={{ color: '#5a4a3a' }}>Loading…</div>;

  const total = questionsAnswered;
  const correct = showResult && (currentQuestion.type === 'drug' ? selectedAnswer === currentQuestion.targetKey : selectedAnswer === currentQuestion.targetChannel);

  const apSeries = [
    { data: currentQuestion.baseline.data.map((p) => ({ x: p.t, y: p.v })), stroke: 'rgba(31,24,18,0.32)', strokeWidth: 2, dash: '6 4' },
    { data: currentQuestion.modified.data.map((p) => ({ x: p.t, y: p.v })), stroke: '#1f1812', strokeWidth: 2.5 },
  ];

  return (
    <div className="grid md:grid-cols-[340px_1fr] gap-8">
      <section>
        <div className="mono text-xs uppercase tracking-widest mb-2" style={{ color: '#8b2635' }}>Quiz Settings</div>
        <div className="flex flex-col gap-4">
          <div>
            <div style={fieldLabel} className="mb-1">Cell type</div>
            <select style={selectStyle} value={cellTypeId} disabled={showResult}
              onChange={(e) => { setCellTypeId(e.target.value); lastTargetRef.current = null; setCurrentQuestion(null); }}>
              {CELL_TYPES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <div style={fieldLabel} className="mb-1">Quiz type</div>
            <div className="flex" style={{ gap: 0 }}>
              <button style={toggleBtnStyle(quizKind === 'channel')} disabled={showResult}
                onClick={() => { setQuizKind('channel'); setCurrentQuestion(null); }}>Channel</button>
              <button style={toggleBtnStyle(quizKind === 'drug')} disabled={showResult}
                onClick={() => { setQuizKind('drug'); setCurrentQuestion(null); }}>Drug</button>
            </div>
          </div>

          <div>
            <div style={fieldLabel} className="mb-1">Difficulty</div>
            <div className="flex" style={{ gap: 0 }}>
              <button style={toggleBtnStyle(difficulty === 'easy')} disabled={showResult}
                onClick={() => { setDifficulty('easy'); setCurrentQuestion(null); }}>Easy · 2</button>
              <button style={toggleBtnStyle(difficulty === 'standard')} disabled={showResult}
                onClick={() => { setDifficulty('standard'); setCurrentQuestion(null); }}>Standard · 4</button>
            </div>
          </div>

          <div className="accent-rule" style={{ height: 3 }}></div>

          <div className="panel rounded p-3 flex items-center justify-between">
            <span style={fieldLabel}>Score</span>
            <span className="display text-xl">
              <span style={{ color: '#2d784e' }}>{score}</span>
              <span style={{ color: '#5a4a3a' }}> / </span>
              <span>{total}</span>
            </span>
          </div>

          <button onClick={resetQuiz} className="mono text-xs underline self-start" style={{ color: '#8b2635', background: 'none', border: 'none', cursor: 'pointer' }}>
            reset quiz
          </button>

          <div className="accent-rule" style={{ height: 3 }}></div>

          <div>
            {currentQuestion.type === 'drug' ? (
              <div className="display text-lg mb-2" style={{ color: '#1f1812' }}>Which <em>drug</em> was added?</div>
            ) : (
              <div className="display text-lg mb-2 flex items-center gap-2 flex-wrap" style={{ color: '#1f1812' }}>
                Which ion channel/transporter was
                <span className="mono" style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 700,
                  background: currentQuestion.modType === 'knockout' ? 'rgba(160,27,40,0.12)' : 'rgba(45,120,80,0.15)',
                  color: currentQuestion.modType === 'knockout' ? '#a01b28' : '#2d784e',
                }}>{currentQuestion.modType === 'knockout' ? 'KNOCKED OUT' : 'INCREASED'}</span>?
              </div>
            )}

            <div className="grid gap-2.5" style={{ gridTemplateColumns: nOptions > 2 ? 'repeat(2,1fr)' : '1fr' }}>
              {currentQuestion.type === 'drug' ? currentQuestion.options.map((opt) => {
                let cls = 'opt';
                if (showResult) cls += opt.key === currentQuestion.targetKey ? ' opt-correct' : (opt.key === selectedAnswer ? ' opt-wrong' : '');
                return (
                  <button key={opt.key} onClick={() => handleAnswer(opt.key)} disabled={showResult}
                    title={opt.name} className={`${cls} text-left p-3 rounded border-2 transition`}
                    style={{ borderColor: 'rgba(31,24,18,0.25)', cursor: showResult ? 'default' : 'pointer' }}>
                    <div className="display text-sm" style={{ fontWeight: 600 }}>{opt.name}</div>
                  </button>
                );
              }) : currentQuestion.options.map((opt) => {
                let cls = 'opt';
                if (showResult) cls += opt === currentQuestion.targetChannel ? ' opt-correct' : (opt === selectedAnswer ? ' opt-wrong' : '');
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={showResult}
                    title={CHANNEL_LABELS[opt]} className={`${cls} text-left p-3 rounded border-2 transition`}
                    style={{ borderColor: 'rgba(31,24,18,0.25)', cursor: showResult ? 'default' : 'pointer' }}>
                    <div className="display text-sm" style={{ fontWeight: 600 }}>{CHANNEL_LABELS[opt]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {showResult && (
            <>
              <div className="p-3 rounded" style={{ background: correct ? 'rgba(45,120,80,0.13)' : 'rgba(160,27,40,0.12)', fontWeight: 600, color: correct ? '#1a5533' : '#7a0e1a' }}>
                {currentQuestion.type === 'drug'
                  ? (correct
                    ? `Correct! ${currentQuestion.targetName}${currentQuestion.targetKind ? ` — ${currentQuestion.targetKind}` : ''}`
                    : `Incorrect. The answer was: ${currentQuestion.targetName}${currentQuestion.targetKind ? ` — ${currentQuestion.targetKind}` : ''}`)
                  : (correct ? 'Correct!' : `Incorrect. The answer was: ${CHANNEL_LABELS[currentQuestion.targetChannel]}`)}
              </div>

              <details open className="panel rounded p-3">
                <summary className="mono text-xs uppercase tracking-widest" style={{ color: '#8b2635', cursor: 'pointer' }}>Why the trace changed</summary>
                <div className="mt-2 flex flex-col gap-3 text-sm">
                  {baseM && curM && (
                    <div>
                      <div style={fieldLabel} className="mb-1">What changed</div>
                      <ul className="list-none space-y-0.5">
                        {plainTakeaways(baseM, curM).map((t, i) => <li key={i}>· {t}</li>)}
                      </ul>
                    </div>
                  )}
                  {currentQuestion.type === 'drug' && (
                    <div>
                      <div style={fieldLabel} className="mb-1">Main targets</div>
                      <ul className="list-none space-y-0.5">
                        {changeLines.map((l, i) => <li key={i}>· {l}</li>)}
                      </ul>
                    </div>
                  )}
                  {currentQuestion.type === 'channel' && (
                    <div>
                      <div style={fieldLabel} className="mb-1">Targeted mechanism</div>
                      <div>{CHANNEL_ROLES[currentQuestion.targetChannel] || currentQuestion.targetChannel}</div>
                    </div>
                  )}
                </div>
              </details>

              <button onClick={nextQuestion} className="display px-5 py-2 text-base self-start"
                style={{ background: '#1f1812', color: '#f3ece0', borderRadius: 2, fontWeight: 700, letterSpacing: '0.02em', border: 'none', cursor: 'pointer' }}>
                Next question →
              </button>
            </>
          )}
        </div>
      </section>

      <section>
        <div className="panel rounded p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="display text-xl" style={{ color: '#1f1812' }}>Action Potential</div>
            <div className="flex gap-4 mono text-xs" style={{ color: '#5a4a3a' }}>
              <span><span style={{ display: 'inline-block', width: 18, height: 2, background: '#1f1812', verticalAlign: 'middle', marginRight: 4 }}></span>{currentQuestion.type === 'drug' ? 'Drug effect' : 'Channel mod'}</span>
              <span><span style={{ display: 'inline-block', width: 18, height: 0, borderTop: '2px dashed rgba(31,24,18,0.4)', verticalAlign: 'middle', marginRight: 4 }}></span>Baseline</span>
            </div>
          </div>
          <TraceChart series={apSeries} yDomain={[-100, 50]} xLabel="time (ms)" yLabel="mV" refLineY={-85} height={420} />
        </div>
      </section>
    </div>
  );
}
