import React from 'react';

export default function ProgressRing({ value = 0, goal = 100, size = 120, strokeWidth = 8, color = '#00d4ff', label, sublabel }) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(100, Math.round((value / goal) * 100));
  const offset = circ - (pct / 100) * circ;
  const center = size / 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={center} cy={center} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={center} cy={center} r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)',
              filter: `drop-shadow(0 0 6px ${color}60)`,
            }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: size > 100 ? 22 : 16,
            color: '#f0f4ff',
            lineHeight: 1,
          }}>{pct}%</span>
        </div>
      </div>
      {label && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: '#f0f4ff' }}>{label}</div>
          {sublabel && <div style={{ fontSize: 11, color: '#8892aa', marginTop: 2 }}>{sublabel}</div>}
        </div>
      )}
    </div>
  );
}
