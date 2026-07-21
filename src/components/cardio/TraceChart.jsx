// Lightweight self-drawn SVG line chart (no external chart library) so the
// cardiac sandbox reads as part of the site's hand-set teaching-file look
// rather than a bolted-on dashboard widget.
export function TraceChart({
  series,
  height = 280,
  xDomain,
  yDomain,
  xLabel,
  yLabel,
  xTickFormat = (v) => Math.round(v),
  yTickFormat = (v) => Math.round(v),
  xTicks = 6,
  yTicks = 5,
  refLineY,
}) {
  const W = 640, H = height;
  const margin = { top: 12, right: 16, bottom: 34, left: 46 };
  const innerW = W - margin.left - margin.right;
  const innerH = H - margin.top - margin.bottom;

  const allX = series.flatMap((s) => s.data.map((p) => p.x));
  const allY = series.flatMap((s) => s.data.map((p) => p.y));
  const [xMin, xMax] = xDomain || [Math.min(...allX), Math.max(...allX)];
  const [yMin, yMax] = yDomain || [Math.min(...allY), Math.max(...allY)];

  const sx = (x) => margin.left + ((x - xMin) / (xMax - xMin || 1)) * innerW;
  const sy = (y) => margin.top + innerH - ((y - yMin) / (yMax - yMin || 1)) * innerH;

  const pathFor = (data) => data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x).toFixed(2)} ${sy(p.y).toFixed(2)}`).join(' ');

  const xTickVals = Array.from({ length: xTicks + 1 }, (_, i) => xMin + (i / xTicks) * (xMax - xMin));
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => yMin + (i / yTicks) * (yMax - yMin));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img">
      {yTickVals.map((t, i) => (
        <line key={`gy${i}`} x1={margin.left} x2={W - margin.right} y1={sy(t)} y2={sy(t)} stroke="rgba(31,24,18,0.10)" />
      ))}
      {xTickVals.map((t, i) => (
        <line key={`gx${i}`} x1={sx(t)} x2={sx(t)} y1={margin.top} y2={H - margin.bottom} stroke="rgba(31,24,18,0.06)" />
      ))}
      {refLineY != null && (
        <line x1={margin.left} x2={W - margin.right} y1={sy(refLineY)} y2={sy(refLineY)} stroke="rgba(139,38,53,0.35)" strokeDasharray="2 4" />
      )}

      <line x1={margin.left} x2={margin.left} y1={margin.top} y2={H - margin.bottom} stroke="#1f1812" strokeWidth="1" />
      <line x1={margin.left} x2={W - margin.right} y1={H - margin.bottom} y2={H - margin.bottom} stroke="#1f1812" strokeWidth="1" />

      {yTickVals.map((t, i) => (
        <text key={`yl${i}`} x={margin.left - 6} y={sy(t) + 3} textAnchor="end" fontSize="9" fontFamily="'JetBrains Mono',monospace" fill="#7a6a55">{yTickFormat(t)}</text>
      ))}
      {xTickVals.map((t, i) => (
        <text key={`xl${i}`} x={sx(t)} y={H - margin.bottom + 14} textAnchor="middle" fontSize="9" fontFamily="'JetBrains Mono',monospace" fill="#7a6a55">{xTickFormat(t)}</text>
      ))}

      {xLabel && (
        <text x={(margin.left + W - margin.right) / 2} y={H - 3} textAnchor="middle" fontSize="10" fontFamily="'JetBrains Mono',monospace" fill="#5a4a3a">{xLabel}</text>
      )}
      {yLabel && (
        <text x={12} y={(margin.top + H - margin.bottom) / 2} textAnchor="middle" fontSize="10" fontFamily="'JetBrains Mono',monospace" fill="#5a4a3a" transform={`rotate(-90 12 ${(margin.top + H - margin.bottom) / 2})`}>{yLabel}</text>
      )}

      {series.map((s, i) => (
        <path key={i} d={pathFor(s.data)} fill="none" stroke={s.stroke} strokeWidth={s.strokeWidth || 2} strokeDasharray={s.dash || undefined} strokeLinejoin="round" strokeLinecap="round" />
      ))}
    </svg>
  );
}
