import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ProgressRing from '../common/ProgressRing';
import StatCard from '../common/StatCard';
import { today, calcWaterGoal, calcStepGoal, calcBMI, getBMICategory, getLast7Days, formatDate, pct } from '../../utils/helpers';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#161d2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 12px' }}>
        <div style={{ fontSize: 11, color: '#8892aa', marginBottom: 2 }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f0f4ff' }}>{payload[0].value}{unit}</div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const todayStr = today();
  const profile = state.profile;

  const todaySteps = state.steps.find(s => s.date === todayStr)?.count || 0;
  const todayWater = state.water.find(w => w.date === todayStr)?.amount || 0;
  const latestWeight = state.weight.length > 0 ? state.weight[state.weight.length - 1].value : profile?.weight || 0;

  const waterGoal = calcWaterGoal(latestWeight);
  const stepGoal = calcStepGoal();
  const bmi = calcBMI(latestWeight, profile?.height);
  const bmiCat = getBMICategory(bmi);

  const last7 = getLast7Days();

  const stepsChartData = last7.map(d => ({
    date: formatDate(d),
    steps: state.steps.find(s => s.date === d)?.count || 0,
  }));

  const waterChartData = last7.map(d => ({
    date: formatDate(d),
    water: state.water.find(w => w.date === d)?.amount || 0,
  }));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  const completedGoals = [todaySteps >= stepGoal, todayWater >= waterGoal].filter(Boolean).length;

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.greeting}>{greeting}, {profile?.name?.split(' ').pop() || 'bạn'} 👋</div>
          <div style={styles.date}>
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
          </div>
        </div>
        <div style={styles.completionBadge}>
          <span style={styles.completionNum}>{completedGoals}/2</span>
          <span style={styles.completionLabel}>mục tiêu</span>
        </div>
      </div>

      {/* Progress rings */}
      <div style={styles.ringsSection} className="card">
        <div style={styles.ringsSectionHeader}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Tiến độ hôm nay</span>
          <span style={{ fontSize: 12, color: '#8892aa' }}>{new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long' })}</span>
        </div>
        <div style={styles.ringsRow}>
          <ProgressRing value={todaySteps} goal={stepGoal} size={110} color="#00d4ff" label="Bước chân" sublabel={`${todaySteps.toLocaleString()} / ${stepGoal.toLocaleString()}`} />
          <ProgressRing value={todayWater} goal={waterGoal} size={110} color="#00e5a0" label="Nước uống" sublabel={`${todayWater}ml / ${waterGoal}ml`} />
          <ProgressRing value={bmi ? Math.min(bmi, 30) : 0} goal={30} size={110} color="#a855f7" label="BMI" sublabel={bmi ? `${bmi} - ${bmiCat?.label}` : 'Chưa có dữ liệu'} />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-4" style={{ margin: '20px 0' }}>
        <StatCard
          icon="👟" label="Bước chân hôm nay" value={todaySteps.toLocaleString()} unit="bước"
          color="#00d4ff" sub={`${pct(todaySteps, stepGoal)}% mục tiêu`}
          trend={todaySteps > 0 ? 12 : null} onClick={() => navigate('/steps')}
        />
        <StatCard
          icon="💧" label="Nước uống hôm nay" value={todayWater} unit="ml"
          color="#00e5a0" sub={`${pct(todayWater, waterGoal)}% mục tiêu`}
          trend={todayWater > 0 ? 5 : null} onClick={() => navigate('/water')}
        />
        <StatCard
          icon="⚖️" label="Cân nặng hiện tại" value={latestWeight} unit="kg"
          color="#ff7b35" sub={bmi ? `BMI: ${bmi}` : 'Cập nhật cân nặng'}
          onClick={() => navigate('/weight')}
        />
        <StatCard
          icon="📊" label="BMI" value={bmi || '--'}
          color={bmiCat?.color || '#a855f7'}
          sub={bmiCat?.label || 'Chưa có dữ liệu'}
          onClick={() => navigate('/profile')}
        />
      </div>

      {/* Charts row */}
      <div className="grid-2">
        {/* Steps chart */}
        <div className="card">
          <div style={styles.chartHeader}>
            <div>
              <div style={styles.chartTitle}>Bước chân tuần này</div>
              <div style={styles.chartSub}>7 ngày gần nhất</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/steps')}>Chi tiết →</button>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stepsChartData} barSize={14}>
              <XAxis dataKey="date" tick={{ fill: '#8892aa', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip unit=" bước" />} cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
              <Bar dataKey="steps" fill="#00d4ff" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Water chart */}
        <div className="card">
          <div style={styles.chartHeader}>
            <div>
              <div style={styles.chartTitle}>Lượng nước tuần này</div>
              <div style={styles.chartSub}>7 ngày gần nhất</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/water')}>Chi tiết →</button>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={waterChartData} barSize={14}>
              <XAxis dataKey="date" tick={{ fill: '#8892aa', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip unit="ml" />} cursor={{ fill: 'rgba(0,229,160,0.05)' }} />
              <Bar dataKey="water" fill="#00e5a0" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick tips */}
      <div style={styles.tipsSection}>
        <div style={styles.tipCard}>
          <span style={{ fontSize: 24 }}>💡</span>
          <div>
            <div style={styles.tipTitle}>Mẹo sức khỏe</div>
            <div style={styles.tipText}>Uống một ly nước ngay sau khi thức dậy giúp kích hoạt hệ tiêu hóa và tăng cường trao đổi chất.</div>
          </div>
        </div>
        <div style={styles.tipCard}>
          <span style={{ fontSize: 24 }}>🎯</span>
          <div>
            <div style={styles.tipTitle}>Mục tiêu hôm nay</div>
            <div style={styles.tipText}>Bạn cần thêm {Math.max(0, stepGoal - todaySteps).toLocaleString()} bước và {Math.max(0, waterGoal - todayWater)}ml nước để đạt mục tiêu ngày hôm nay.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 28,
  },
  greeting: {
    fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
    color: '#f0f4ff', marginBottom: 4,
  },
  date: { fontSize: 13, color: '#8892aa' },
  completionBadge: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.2)',
    borderRadius: 14, padding: '10px 16px', textAlign: 'center',
  },
  completionNum: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#00e5a0' },
  completionLabel: { fontSize: 10, color: '#8892aa', textTransform: 'uppercase', letterSpacing: '0.5px' },
  ringsSection: { marginBottom: 0 },
  ringsSectionHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24,
  },
  ringsRow: {
    display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16,
  },
  chartHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16,
  },
  chartTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#f0f4ff' },
  chartSub: { fontSize: 11, color: '#8892aa', marginTop: 2 },
  tipsSection: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 },
  tipCard: {
    display: 'flex', gap: 16, padding: 20,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
  },
  tipTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: '#f0f4ff', marginBottom: 6 },
  tipText: { fontSize: 13, color: '#8892aa', lineHeight: 1.6 },
};
