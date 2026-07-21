import { useState } from 'react';
import { CardioExplore } from './cardio/CardioExplore.jsx';
import { CardioQuiz } from './cardio/CardioQuiz.jsx';

export function CardioPhysiology({ onGoHome }) {
  const [mode, setMode] = useState('explore');

  return (
    <div className="paper">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <header className="flex items-end justify-between pb-3 mb-2 flex-wrap gap-3" style={{ borderBottom: '2px solid #1f1812' }}>
          <div>
            <div className="text-xs mono uppercase tracking-widest" style={{ color: '#8b2635' }}>
              Wayne State University School of Medicine · Trainer
            </div>
            <h1 className="display text-5xl mt-1" style={{ color: '#1f1812' }}>
              Cardiac <span style={{ color: '#8b2635' }}>·</span> Physiology
            </h1>
            <div className="text-sm italic mt-1" style={{ color: '#5a4a3a' }}>
              Ion-channel action potential and ECG sandbox
            </div>
          </div>
          <button onClick={onGoHome} className="mono text-xs underline" style={{ color: '#8b2635', background: 'none', border: 'none', cursor: 'pointer' }}>
            change topic
          </button>
        </header>
        <div className="accent-rule mb-6"></div>

        <div className="flex mb-6" style={{ border: '2px solid rgba(31,24,18,0.25)', borderRadius: 4, overflow: 'hidden', width: 'fit-content' }}>
          <button
            onClick={() => setMode('explore')}
            className="mono"
            style={{
              padding: '8px 20px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', border: 'none', cursor: 'pointer',
              background: mode === 'explore' ? '#1f1812' : 'transparent', color: mode === 'explore' ? '#f3ece0' : '#1f1812',
            }}
          >
            Explore Mode
          </button>
          <button
            onClick={() => setMode('quiz')}
            className="mono"
            style={{
              padding: '8px 20px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', border: 'none', cursor: 'pointer',
              background: mode === 'quiz' ? '#1f1812' : 'transparent', color: mode === 'quiz' ? '#f3ece0' : '#1f1812',
            }}
          >
            Quiz Mode
          </button>
        </div>

        {mode === 'explore' ? <CardioExplore /> : <CardioQuiz />}

        <footer className="mt-12 pt-4 mono text-xs flex justify-between" style={{ color: '#7a6a55', borderTop: '1px solid rgba(31,24,18,0.3)' }}>
          <span>Confidential · Teaching File · For educational use only</span>
          <span>Cardiac Physiology Sandbox</span>
        </footer>
      </div>
    </div>
  );
}
