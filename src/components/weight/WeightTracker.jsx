import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '../../context/AppContext';
import { getLast30Days, formatDate, calcBMI } from '../../utils/helpers';
import './WeightTracker.css';

const BMI_ZONES = [
  { label: 'Thiếu cân', color: '#6fc2ff', min: -Infinity, max: 18.5 },
  { label: 'Bình thường', color: '#58cf63', min: 18.5, max: 23 },
  { label: 'Thừa cân', color: '#5f78ff', min: 23, max: 27.5 },
  { label: 'Béo phì', color: '#ff6633', min: 27.5, max: Infinity },
];

function getBmiCategory(bmiValue) {
  if (!bmiValue) return null;
  const numeric = Number.parseFloat(bmiValue);
  return BMI_ZONES.find(zone => numeric >= zone.min && numeric < zone.max) || null;
}

function getDisplayTime() {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function WeightTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="weight-tooltip">
      <div className="weight-tooltip__date">{payload[0].payload.dateLabel}</div>
      <div className="weight-tooltip__value">{payload[0].value} kg</div>
    </div>
  );
}

export default function WeightTracker() {
  const { state, dispatch } = useApp();
  const profile = state.profile;
  const [inputVal, setInputVal] = useState('');
  const [saved, setSaved] = useState(false);

  const latestWeight = state.weight.length > 0 ? Number(state.weight[state.weight.length - 1].value) : Number(profile?.weight || 0);
  const bmi = calcBMI(latestWeight || null, profile?.height);
  const bmiCat = getBmiCategory(bmi);
  const idealWeightMax = profile?.height ? Number((((profile.height / 100) ** 2) * 22.9).toFixed(1)) : null;
  const targetWeight = latestWeight && idealWeightMax ? Math.min(latestWeight, idealWeightMax) : latestWeight || null;
  const weightToLose = latestWeight && targetWeight ? Math.max(0, +(latestWeight - targetWeight).toFixed(1)) : 0;
  const displayTime = getDisplayTime();

  const chartData = useMemo(() => {
    const days = getLast30Days();
    const weightMap = new Map(state.weight.map(item => [item.date, Number(item.value)]));
    const fallbackWeight = latestWeight || null;
    let previousWeight = fallbackWeight;

    return days.map((day, index) => {
      const currentWeight = weightMap.has(day) ? weightMap.get(day) : previousWeight;
      previousWeight = currentWeight ?? previousWeight;

      return {
        day: index + 1,
        dateLabel: formatDate(day),
        weight: currentWeight ?? fallbackWeight,
      };
    });
  }, [latestWeight, state.weight]);

  const yDomain = useMemo(() => {
    const weights = chartData.map(item => item.weight).filter(value => typeof value === 'number' && !Number.isNaN(value));
    if (!weights.length) return [40, 80];

    const min = Math.floor(Math.min(...weights) - 1);
    const max = Math.ceil(Math.max(...weights) + 1);
    return [min, max];
  }, [chartData]);

  const handleSave = () => {
    const nextWeight = Number.parseFloat(inputVal);
    if (!nextWeight || Number.isNaN(nextWeight) || nextWeight <= 0) return;

    dispatch({ type: 'ADD_WEIGHT', payload: nextWeight });
    setInputVal('');
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="weight-page">
      <div className="weight-shell">
        <header className="weight-topbar">
          <h1 className="weight-topbar__title">Cân nặng</h1>
          <div className="weight-topbar__actions">
            <button type="button" className="weight-icon-btn" aria-label="Thông báo">◔</button>
            <button type="button" className="weight-icon-btn" aria-label="Tùy chọn">⋮</button>
          </div>
        </header>

        <div className="weight-summary">
          <article className="weight-card weight-card--current">
            <div className="weight-card__label">Cân nặng hiện tại</div>
            <div className="weight-card__value">{latestWeight ? latestWeight.toFixed(1) : '--'}</div>
            <div className="weight-card__unit">kg</div>
          </article>

          <article className="weight-bmi">
            <div className="weight-bmi__header">
              <div>
                <div className="weight-bmi__label">Chỉ số BMI</div>
                <div className="weight-bmi__value">{bmi || '--'}</div>
              </div>
              <div className="weight-bmi__badge">{bmiCat?.label || 'Chưa rõ'}</div>
            </div>
            <div className="weight-bmi__bar">
              <div
                className="weight-bmi__bar-fill"
                style={{ width: `${Math.min(Math.max((Number.parseFloat(bmi || 0) / 35) * 100, 10), 100)}%` }}
              />
            </div>
            <div className="weight-bmi__zones">
              {BMI_ZONES.map(zone => (
                <span
                  key={zone.label}
                  className={zone.label === bmiCat?.label ? 'is-active' : ''}
                  style={{ color: zone.color }}
                >
                  {zone.label}
                </span>
              ))}
            </div>
          </article>
        </div>

        <div className="weight-meta-grid">
          <article className="weight-mini-card weight-mini-card--goal">
            <div className="weight-mini-card__icon">⚑</div>
            <div className="weight-mini-card__label">Mục tiêu</div>
            <div className="weight-mini-card__value">{targetWeight ? `${targetWeight.toFixed(1)} kg` : '--'}</div>
          </article>

          <article className="weight-mini-card weight-mini-card--loss">
            <div className="weight-mini-card__icon">📉</div>
            <div className="weight-mini-card__label">Cần giảm</div>
            <div className="weight-mini-card__value">{`${weightToLose.toFixed(1)} kg`}</div>
          </article>

          <article className="weight-action-card">
            <div className="weight-action-card__title">
              <span className="weight-action-card__plus">⊕</span>
              <span>Cập nhật cân nặng</span>
            </div>
            <div className="weight-action-card__form">
              <input
                type="number"
                step="0.1"
                value={inputVal}
                onChange={event => setInputVal(event.target.value)}
                onKeyDown={event => event.key === 'Enter' && handleSave()}
                placeholder="Nhập kg"
                className="weight-action-card__input"
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={!inputVal}
                className="weight-action-card__button"
              >
                {saved ? 'Đã lưu' : 'Lưu'}
              </button>
            </div>
          </article>
        </div>

        <article className="weight-chart-card">
          <div className="weight-chart-card__title">Biểu đồ trong ngày</div>
          <div className="weight-chart">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffb96a" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#ffb96a" stopOpacity={0.12} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#b8b8b8" strokeOpacity={0.7} vertical horizontal />
                <XAxis dataKey="day" tick={false} axisLine={false} tickLine={false} />
                <YAxis
                  domain={yDomain}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6583d8' }}
                  tickFormatter={value => `${value} kg`}
                  width={42}
                />
                <Tooltip content={<WeightTooltip />} />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#ef8f35"
                  strokeWidth={2}
                  fill="url(#weightAreaFill)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#ef8f35', stroke: '#fff', strokeWidth: 1.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="weight-chart-card__time">
            <span>{displayTime}</span>
            <span>{displayTime}</span>
          </div>
        </article>
      </div>
    </section>
  );
}
