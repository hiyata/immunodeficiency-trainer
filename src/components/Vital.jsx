export function Vital({ label, value, flag, pulse }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest" style={{color:'#5a4a3a'}}>
        {label}{pulse && <span className="pulse-dot" style={{color:'#a01b28', marginLeft:4}}>●</span>}
      </div>
      <div style={{color: flag ? '#a01b28' : '#1f1812', fontWeight: flag ? 700 : 500}}>{value}</div>
    </div>
  );
}
