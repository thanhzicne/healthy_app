import React, { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '../../context/AppContext';
import { calcWaterGoal, formatDate, getLast7Days, today } from '../../utils/helpers';
import './WaterTracker.css';

const QUICK_AMOUNTS = [100, 200, 300, 500];

function WaterTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="weight-tooltip">
      <div className="weight-tooltip__date">{label}</div>
      <div className="weight-tooltip__value">{payload[0].value} ml</div>
    </div>
  );
}

export default function WaterTracker() {
  const { state, actions } = useApp();
  const [isSaving, setIsSaving] = useState(false);

  const goal = calcWaterGoal(state.profile?.weight || 57);
  const todayEntry = state.water.find(item => item.date === today()) || { amount: 0, logs: [] };
  const cupsGoal = Math.max(1, Math.round(goal / 220));
  const cupsDone = Math.min(cupsGoal, Math.round(todayEntry.amount / 220));
  const percent = Math.min(100, Math.round((todayEntry.amount / goal) * 100));

  const chartData = useMemo(() => (
    getLast7Days().map(date => ({
      date: formatDate(date),
      amount: state.water.find(item => item.date === date)?.amount || 0,
    }))
  ), [state.water]);

  const logs = [...(todayEntry.logs || [])]
    .slice()
    .reverse()
    .slice(0, 4)
    .map(item => ({
      ...item,
      label: new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(item.time)),
    }));

  const totalDays = state.water.filter(item => item.amount > 0).length;
  const weeklyAverage = Math.round(chartData.reduce((sum, item) => sum + item.amount, 0) / chartData.length);
  const streakDays = state.water.slice().reverse().findIndex(item => item.amount === 0);
  const compliance = `${Math.round((todayEntry.amount / goal) * 1000) / 10}%`;

  async function handleQuickAdd(amount) {
    setIsSaving(true);
    try {
      await actions.addWater(amount);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReset() {
    setIsSaving(true);
    try {
      await actions.resetWater();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="water-page">
      <div className="water-shell">
        <header className="water-topbar">
          <h1 className="water-topbar__title">Nuoc uong</h1>
          <div className="water-topbar__icons" aria-hidden="true">
            <span>◔</span>
            <span>⋮</span>
          </div>
        </header>

        <div className="water-grid">
          <div className="water-main">
            <article className="water-card water-progress">
              <div className="water-progress__heading">Luong nuoc hom nay</div>
              <div className="water-progress__body">
                <div className="water-ring">
                  <div className="water-ring__inner">
                    <div className="water-ring__value">{cupsDone}/{cupsGoal}</div>
                    <div className="water-ring__meta">{todayEntry.amount} ml</div>
                  </div>
                </div>

                <div className="water-cups">
                  <div className="water-cups__hero">
                    <span>☕</span> Coc
                  </div>
                  <div className="water-cups__track">
                    <div className="water-cups__fill" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="water-progress__goal">Muc tieu: {goal} ml</div>
                </div>
              </div>
            </article>

            <article className="water-card water-chart">
              <h2 className="water-section-title">▥ Bieu do 7 ngay</h2>
              <div className="water-chart__subtitle">Tuan gan nhat</div>
              <div className="water-chart__frame">
                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={chartData} margin={{ top: 16, left: 0, right: 6, bottom: 4 }}>
                    <CartesianGrid stroke="#dce6af" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#4fa53a', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#4fa53a', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<WaterTooltip />} />
                    <ReferenceLine y={goal} stroke="#ef2f2f" strokeWidth={2} />
                    <ReferenceLine y={Math.round(goal * 0.8)} stroke="#d6c000" strokeWidth={2} />
                    <ReferenceLine y={Math.round(goal * 1.2)} stroke="#5bdb41" strokeWidth={2} />
                    <Bar dataKey="amount" fill="#61cb57" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>

          <div className="water-side">
            <article className="water-quick">
              <h2 className="water-section-title">⚡ Them nuoc nhanh</h2>
              <div className="water-quick__grid">
                {QUICK_AMOUNTS.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    className="water-quick__button"
                    onClick={() => handleQuickAdd(amount)}
                    disabled={isSaving}
                  >
                    💧<br />{amount} ml
                  </button>
                ))}
              </div>
              <div className="water-actions">
                <button type="button" className="water-action water-action--primary" onClick={() => handleQuickAdd(750)} disabled={isSaving}>
                  Them 750 ml
                </button>
                <button type="button" className="water-action water-action--ghost" onClick={handleReset} disabled={isSaving}>
                  Reset ngay
                </button>
              </div>
            </article>

            <article className="water-card water-stats">
              <h2 className="water-section-title">▥ Thong ke chi tiet</h2>
              <div className="water-stats__grid">
                <div className="water-stat">
                  <div className="water-stat__icon">📅</div>
                  <div className="water-stat__label">Hom nay</div>
                  <div className="water-stat__value">{todayEntry.amount}</div>
                  <div className="water-stat__unit">ml</div>
                </div>
                <div className="water-stat">
                  <div className="water-stat__icon">➜</div>
                  <div className="water-stat__label">Trung binh ngay</div>
                  <div className="water-stat__value">{weeklyAverage}</div>
                  <div className="water-stat__unit">ml</div>
                </div>
                <div className="water-stat">
                  <div className="water-stat__icon">🗓</div>
                  <div className="water-stat__label">Ngay theo doi</div>
                  <div className="water-stat__value">{totalDays}</div>
                  <div className="water-stat__unit">ngay</div>
                </div>
                <div className="water-stat">
                  <div className="water-stat__icon">%</div>
                  <div className="water-stat__label">Dat muc tieu</div>
                  <div className="water-stat__value">{compliance}</div>
                  <div className="water-stat__unit">{streakDays < 0 ? 'on dinh' : 'hom nay'}</div>
                </div>
              </div>
            </article>

            <article className="water-card water-logs">
              <h2 className="water-section-title">Danh sach lan uong</h2>
              <div className="water-logs__list">
                {logs.length > 0 ? logs.map(log => (
                  <div className="water-log" key={`${log.time}-${log.amount}`}>
                    <div>{log.amount} ml</div>
                    <span>{log.label}</span>
                  </div>
                )) : <div className="water-log"><div>Chua co du lieu</div><span>Hom nay</span></div>}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
