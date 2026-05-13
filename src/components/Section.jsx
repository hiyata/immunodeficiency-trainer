export function Section({ title, children }) {
  return (
    <div className="mb-4">
      <div className="mono uppercase tracking-widest text-xs mb-1.5 flex items-center gap-2" style={{color:'#8b2635'}}>
        <span>{title}</span>
        <span style={{flex:1, height:'1px', background:'rgba(139,38,53,0.3)'}}></span>
      </div>
      <div className="panel rounded px-4 py-3 leading-relaxed">{children}</div>
    </div>
  );
}
