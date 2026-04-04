import React, { useMemo, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '../../context/AppContext';
import { calcStepGoal, formatDate, getLast7Days, pct, today } from '../../utils/helpers';
import './StepsTracker.css';

const GOAL = calcStepGoal();
const PRESETS = [2000, 5000, 8000, 10000];
const HOURLY_ACTIVITY = [2, 4, 5, 7, 6, 8, 9, 7, 6, 8, 5, 7, 8, 10, 7, 6, 8, 9, 6, 5];

function StepsTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="steps-tooltip">
      <div className="steps-tooltip__label">{label}</div>
      <div className="steps-tooltip__value">{payload[0].value.toLocaleString()} buoc</div>
    </div>
  );
}

export default function StepsTrackerModern() {
  const { state, dispatch } = useApp();
  const [inputVal, setInputVal] = useState('');
  const [saved, setSaved] = useState(false);

  const todayStr = today();
  const todayEntry = state.steps.find(item => item.date === todayStr);
  const todaySteps = todayEntry?.count || 0;
  const calories = Math.round(todaySteps * 0.04);
  const distance = (todaySteps * 0.0008).toFixed(2);
  const progress = pct(todaySteps, GOAL);

  const weeklyData = useMemo(
    () =>
      getLast7Days().map(date => ({
        date: formatDate(date),
        steps: state.steps.find(item => item.date === date)?.count || 0,
      })),
    [state.steps]
  );

  const average = Math.round(
    weeklyData.reduce((sum, item) => sum + item.steps, 0) / Math.max(1, weeklyData.length)
  );

  function saveSteps(value) {
    const nextSteps = Number(value);
    if (!Number.isFinite(nextSteps) || nextSteps < 0) return;
    dispatch({ type: 'ADD_STEPS', payload: nextSteps });
    setInputVal('');
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  }

  return (
    <section className="steps-page">
      <div className="steps-shell">
        <header className="steps-topbar">
          <h1 className="steps-topbar__title">Buoc chan</h1>
          <div className="steps-topbar__icons" aria-hidden="true">
            <span>o</span>
            <span>...</span>
          </div>
        </header>

        <div className="steps-main-card">
          <div className="steps-main-card__header">Buoc chan</div>

          <div className="steps-summary">
            <article className="steps-goal-card">
              <div className="steps-goal-card__title">Muc tieu hom nay</div>
              <div className="steps-goal-ring">
                <div className="steps-goal-ring__inner">
                  <div className="steps-goal-ring__value">
                    {todaySteps}/{GOAL}
                  </div>
                  <div className="steps-goal-ring__label">Buoc</div>
                </div>
              </div>
              <div className="steps-progress">
                <div className="steps-progress__fill" style={{ width: `${progress}%` }} />
              </div>
            </article>

            <div className="steps-metrics">
              <article className="steps-metric-card">
                <div className="steps-metric-card__icon">kcal</div>
                <div>
                  <div className="steps-metric-card__label">Calo dot chay</div>
                  <div className="steps-metric-card__value">{calories} Kcal</div>
                </div>
              </article>

              <article className="steps-metric-card">
                <div className="steps-metric-card__icon">km</div>
                <div>
                  <div className="steps-metric-card__label">Quang duong</div>
                  <div className="steps-metric-card__value">{distance} km</div>
                </div>
              </article>
            </div>
          </div>

          <div className="steps-update">
            <div className="steps-update__presets">
              {PRESETS.map(value => (
                <button key={value} type="button" className="steps-preset" onClick={() => saveSteps(value)}>
                  {value.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="steps-update__form">
              <input
                className="steps-input"
                type="number"
                placeholder="Nhap so buoc..."
                value={inputVal}
                onChange={event => setInputVal(event.target.value)}
                onKeyDown={event => event.key === 'Enter' && saveSteps(inputVal)}
              />
              <button type="button" className="steps-save" onClick={() => saveSteps(inputVal)}>
                {saved ? 'Da luu' : 'Luu'}
              </button>
            </div>
          </div>
        </div>

        <div className="steps-panels">
          <article className="steps-panel">
            <div className="steps-panel__heading">[] Hoat dong trong ngay</div>
            <div className="steps-bars">
              {HOURLY_ACTIVITY.map((value, index) => (
                <div key={`${index}-${value}`} className="steps-bar-wrap">
                  <div className="steps-bar" style={{ height: `${40 + value * 10}px` }} />
                </div>
              ))}
            </div>
            <div className="steps-hours">
              <span>0h</span>
              <span>4h</span>
              <span>8h</span>
              <span>12h</span>
              <span>16h</span>
              <span>20h</span>
            </div>
          </article>

          <article className="steps-panel">
            <div className="steps-panel__heading">[] Tong ket 7 ngay qua</div>
            <div className="steps-chart">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyData} margin={{ top: 16, right: 10, left: 0, bottom: 8 }}>
                  <XAxis dataKey="date" tick={{ fill: '#6d8bf7', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<StepsTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="steps"
                    stroke="#45b44f"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#45b44f', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#45b44f' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="steps-panel__footer">Trung binh 7 ngay: {average.toLocaleString()} buoc</div>
          </article>
        </div>
      </div>
    </section>
  );
}
