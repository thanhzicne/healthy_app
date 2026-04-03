import React from 'react';

export default function StatCard({ icon, label, value, unit, sub, color = '#00d4ff', trend, onClick }) {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: `3px solid ${color}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44,
          background: `${color}18`,
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
          border: `1px solid ${color}30`,
        }}>
          {icon}
        </div>
        {trend !== undefined && (
          <div style={{
            fontSize: 11, fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: trend >= 0 ? '#00e5a0' : '#ff4f8b',
            background: trend >= 0 ? 'rgba(0,229,160,0.1)' : 'rgba(255,79,139,0.1)',
            padding: '3px 8px', borderRadius: 20,
          }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 28, fontWeight: 800,
        color: '#f0f4ff',
        lineHeight: 1,
        marginBottom: 4,
        animation: 'countUp 0.6s ease',
      }}>
        {value}
        {unit && <span style={{ fontSize: 14, fontWeight: 500, color: '#8892aa', marginLeft: 4 }}>{unit}</span>}
      </div>

      <div style={{ fontSize: 12, color: '#8892aa', fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: color, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
    </div>
  );
}
