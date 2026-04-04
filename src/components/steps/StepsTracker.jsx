import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ProgressRing from '../common/ProgressRing';
import { today, getLast7Days, getLast30Days, formatDate, calcStepGoal, pct } from '../../utils/helpers';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#161d2e', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 10, padding: '8px 14px' }}>
        <div style={{ fontSize: 11, color: '#8892aa' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#00d4ff', fontSize: 16 }}>
          {(payload[0].value || 0).toLocaleString()} <span style={{ fontSize: 11, color: '#8892aa' }}>bước</span>
        </div>
      </div>
    );
  }
  return null;
};

const GOAL = calcStepGoal();
const PRESETS = [2000, 5000, 8000, 10000, 12000, 15000];

export default function StepsTracker() {
  const { state, dispatch } = useApp();
  const todayStr = today();
  const [period, setPeriod] = useState('week');
  const [inputVal, setInputVal] = useState('');
  const [saved, setSaved] = useState(false);

  const todayEntry = state.steps.find(s => s.date === todayStr);
  const todaySteps = todayEntry?.count || 0;

  const days = period === 'week' ? getLast7Days() : getLast30Days();

  const chartData = days.map(d => ({
    date: formatDate(d),
    steps: state.steps.find(s => s.date === d)?.count || 0,
    isToday: d === todayStr,
  }));

  const avg = Math.round(chartData.reduce((s, d) => s + d.steps, 0) / chartData.filter(d => d.steps > 0).length) || 0;
  const best = Math.max(...chartData.map(d => d.steps));
  const activeDays = chartData.filter(d => d.steps > 0).length;

  const handleSave = () => {
    if (!inputVal || isNaN(+inputVal)) return;
    dispatch({ type: 'ADD_STEPS', payload: +inputVal });
    setInputVal('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePreset = (v) => {
    dispatch({ type: 'ADD_STEPS', payload: v });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>👟 Bước chân</div>
          <div style={styles.sub}>Theo dõi hoạt động di chuyển hàng ngày</div>
        </div>
        <div className="badge badge-cyan">Mục tiêu: {GOAL.toLocaleString()} bước</div>
      </div>

      {/* Today progress */}
      <div style={styles.heroCard} className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <ProgressRing value={todaySteps} goal={GOAL} size={130} color="#00d4ff" />
            {pct(todaySteps, GOAL) >= 100 && <div style={styles.goalBadge}>🎉</div>}
            {pct(todaySteps, GOAL) >= 100 && <div className="animate-walk" style={styles.walkingIcon}>🚶‍♂️</div>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={styles.heroNum} className={pct(todaySteps, GOAL) >= 100 ? 'animate-bounce' : ''}>{todaySteps.toLocaleString()}</div>
            <div style={styles.heroUnit}>bước hôm nay</div>
            <div style={styles.heroGoal}>/ {GOAL.toLocaleString()} bước mục tiêu</div>
            {pct(todaySteps, GOAL) >= 100 && <div style={styles.congrats}>Chúc mừng! Bạn đã đạt mục tiêu hôm nay! 🎊</div>}
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${pct(todaySteps, GOAL)}%`, background: pct(todaySteps, GOAL) >= 100 ? 'linear-gradient(90deg, #00e5a0, #00d4ff)' : 'linear-gradient(90deg, #00d4ff, #0099cc)' }} />
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
              <div style={styles.miniStat}><span style={styles.miniVal}>{(todaySteps * 0.0008).toFixed(2)}</span><span style={styles.miniLabel}>km</span></div>
              <div style={styles.miniStat}><span style={styles.miniVal}>{Math.round(todaySteps * 0.04)}</span><span style={styles.miniLabel}>kcal</span></div>
              <div style={styles.miniStat}><span style={styles.miniVal}>{Math.round(todaySteps / 100)}</span><span style={styles.miniLabel}>phút</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="card" style={{ margin: '20px 0' }}>
        <div style={styles.sectionTitle}>Cập nhật bước chân hôm nay</div>
        <div style={styles.presets}>
          {PRESETS.map(v => (
            <button key={v} className="btn btn-ghost btn-sm animate-fade-in" onClick={() => handlePreset(v)} style={{ fontSize: 12, transition: 'all 0.2s ease', transform: 'scale(1)' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
              {v.toLocaleString()}
            </button>
          ))}
        </div>
        <div style={styles.inputRow}>
          <input
            type="number"
            className="input-field"
            placeholder="Nhập số bước..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={handleSave} disabled={!inputVal}>
            {saved ? '✓ Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        {[
          { label: 'Trung bình', value: avg.toLocaleString(), unit: 'bước/ngày', color: '#00d4ff' },
          { label: 'Kỷ lục', value: best.toLocaleString(), unit: 'bước tốt nhất', color: '#a855f7' },
          { label: 'Ngày tích cực', value: activeDays, unit: `/ ${days.length} ngày`, color: '#00e5a0' },
        ].map(s => (
          <div key={s.label} className="card" style={{ borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#f0f4ff' }}>
              {s.value} <span style={{ fontSize: 12, color: '#8892aa', fontWeight: 400 }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: 12, color: '#8892aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card">
        <div style={styles.chartHeader}>
          <div style={styles.sectionTitle}>Lịch sử bước chân</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['week', 'month'].map(p => (
              <button key={p} className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPeriod(p)}>
                {p === 'week' ? '7 ngày' : '30 ngày'}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={period === 'week' ? 20 : 8}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#0099cc" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#8892aa', fontSize: 11 }} axisLine={false} tickLine={false} interval={period === 'month' ? 4 : 0} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
            <ReferenceLine y={GOAL} stroke="rgba(0,212,255,0.3)" strokeDasharray="4 4" />
            <Bar dataKey="steps" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <div style={{ width: 24, height: 2, background: 'rgba(0,212,255,0.4)', borderTop: '2px dashed rgba(0,212,255,0.4)' }} />
          <span style={{ fontSize: 11, color: '#8892aa' }}>Đường mục tiêu {GOAL.toLocaleString()} bước</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 },
  title: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: '#f0f4ff', marginBottom: 4 },
  sub: { fontSize: 14, color: '#8892aa' },
  heroCard: { marginBottom: 0 },
  heroNum: { fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, color: '#00d4ff', lineHeight: 1 },
  heroUnit: { fontSize: 14, color: '#8892aa', marginTop: 4 },
  heroGoal: { fontSize: 12, color: '#4a5568', marginBottom: 12 },
  congrats: { fontSize: 14, color: '#00e5a0', fontWeight: 600, marginBottom: 8, animation: 'fadeIn 0.5s ease' },
  progressBar: { height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, transition: 'width 1s ease, background 0.5s ease' },
  miniStat: { display: 'flex', flexDirection: 'column', gap: 2 },
  miniVal: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#f0f4ff' },
  miniLabel: { fontSize: 11, color: '#8892aa' },
  goalBadge: { position: 'absolute', top: -10, right: -10, fontSize: 24, animation: 'bounce 1s infinite' },
  walkingIcon: { position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 32 },
  sectionTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#f0f4ff', marginBottom: 14 },
  presets: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  inputRow: { display: 'flex', gap: 12 },
  chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
};
