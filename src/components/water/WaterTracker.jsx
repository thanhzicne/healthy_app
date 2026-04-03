import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { calcWaterGoal, formatDate, getLast7Days } from '../../utils/helpers';
import {
  ArrowRightIcon,
  BellIcon,
  CalendarIcon,
  ChartIcon,
  CupIcon,
  DropletIcon,
  MenuDotsIcon,
  SparkIcon,
  StatsIcon,
  TargetIcon,
  WaveIcon,
} from '../common/Icons';

const QUICK_AMOUNTS = [
  { amount: 100, background: 'linear-gradient(180deg, #34b6ed 0%, #2fa8df 100%)' },
  { amount: 200, background: 'linear-gradient(180deg, #66d6df 0%, #5bced7 100%)' },
  { amount: 300, background: 'linear-gradient(180deg, #4a9b9d 0%, #419091 100%)' },
  { amount: 500, background: 'linear-gradient(180deg, #676be0 0%, #5d63d8 100%)' },
];

const DISPLAY_CUP_ML = 220;

function ProgressDonut({ progress, cupsText, amountText }) {
  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, progress) / 100) * circumference;

  return (
    <div className="progress-donut">
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.42)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e9f9ff"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
          style={{ transition: 'stroke-dashoffset 0.25s ease' }}
        />
      </svg>

      <div className="progress-donut-center">
        <div className="progress-donut-value">{cupsText}</div>
        <div className="progress-donut-subvalue">{amountText}</div>
      </div>
    </div>
  );
}

function WaterChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      <div className="chart-tooltip-value">{payload[0].value} ml</div>
    </div>
  );
}

function DetailTile({ icon, label, value, unit, background }) {
  return (
    <article className="detail-tile" style={{ background }}>
      <span className="detail-tile-icon">{icon}</span>
      <div>
        <div className="detail-tile-label">{label}</div>
        <div className="detail-tile-value">{value}</div>
        <div className="detail-tile-unit">{unit}</div>
      </div>
    </article>
  );
}

export default function WaterTracker() {
  const { state, dispatch } = useApp();

  const latestWeight =
    state.weight.length > 0
      ? state.weight[state.weight.length - 1].value
      : state.profile?.weight || 0;
  const goal = calcWaterGoal(latestWeight);
  const todayKey = new Date().toISOString().split('T')[0];
  const todayEntry = state.water.find((entry) => entry.date === todayKey);
  const todayWater = todayEntry?.amount || 0;
  const progress = goal ? (todayWater / goal) * 100 : 0;
  const goalCups = Math.max(1, Math.ceil(goal / DISPLAY_CUP_ML));
  const consumedCups = Math.min(goalCups, Math.floor(todayWater / DISPLAY_CUP_ML));
  const trackedDays = state.water.filter((entry) => entry.amount > 0).length;
  const totalWater = state.water.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const averagePerDay = trackedDays ? Math.round(totalWater / trackedDays) : 0;
  const completion = goal ? ((todayWater / goal) * 100).toFixed(1) : '0.0';

  const chartData = getLast7Days().map((date) => {
    const entry = state.water.find((item) => item.date === date);
    return {
      date: formatDate(date),
      amount: entry?.amount || 0,
    };
  });

  const chartCeiling = Math.max(2600, goal + 450);
  const referenceGoal = Math.min(chartCeiling - 260, goal);
  const referenceHigh = Math.min(chartCeiling - 80, goal + 250);
  const referenceImprove = Math.max(800, Math.round(goal * 0.7));
  const reachedGoal = progress >= 100;

  const handleAdd = (amount) => {
    dispatch({ type: 'ADD_WATER', payload: amount });
  };

  return (
    <section className="water-screen">
      <header className="water-toolbar">
        <div className="water-toolbar-title">Nước uống</div>
        <div className="water-toolbar-actions">
          <button className="toolbar-icon-button" type="button" aria-label="Thông báo">
            <BellIcon size={18} />
          </button>
          <button className="toolbar-icon-button" type="button" aria-label="Tùy chọn">
            <MenuDotsIcon size={18} />
          </button>
        </div>
      </header>

      <div className="water-layout">
        <div className="water-column">
          <section className="water-hero-card">
            <div className="water-hero-title">Lượng nước hôm nay</div>

            <div className="water-hero-body">
              <ProgressDonut
                progress={progress}
                cupsText={`${consumedCups}/${goalCups}`}
                amountText={`${todayWater} ml`}
              />

              <div className="water-cup-panel">
                <div className="water-cup-row">
                  <CupIcon size={34} />
                  <span className="water-cup-label">Cốc</span>
                </div>
                <div className="water-progress-track">
                  <span className="water-progress-fill" style={{ width: `${Math.min(100, progress)}%` }} />
                </div>
              </div>
            </div>

            <div className="water-goal-note">Mục tiêu: {goal} ml</div>
          </section>

          <section className="section-card chart-card">
            <div className="section-header">
              <span className="section-icon-badge">
                <ChartIcon size={13} />
              </span>
              <div>
                <div className="section-title">Biểu đồ 7 ngày</div>
                <div className="section-subtitle">Tuần gần nhất</div>
              </div>
            </div>

            <div className="chart-shell">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 12, right: 28, left: -18, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#d4e2b6" strokeDasharray="0" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#5f9b32', fontSize: 11, fontWeight: 700 }}
                  />
                  <YAxis
                    domain={[0, chartCeiling]}
                    ticks={[0, 500, 1000, 1500, 2000, 2200, 2500]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#62a235', fontSize: 9 }}
                    width={32}
                  />
                  <Tooltip content={<WaterChartTooltip />} cursor={false} />
                  <ReferenceLine
                    y={referenceHigh}
                    stroke="#ff6161"
                    strokeWidth={2}
                    label={{ value: 'Vượt mức', fill: '#ff6161', fontSize: 10, position: 'right' }}
                  />
                  <ReferenceLine
                    y={referenceGoal}
                    stroke="#55b36a"
                    strokeWidth={2}
                    label={{ value: 'Mục tiêu', fill: '#55b36a', fontSize: 10, position: 'right' }}
                  />
                  <ReferenceLine
                    y={referenceImprove}
                    stroke="#d8cc31"
                    strokeWidth={2}
                    label={{ value: 'Cần cải thiện', fill: '#b8ab1e', fontSize: 10, position: 'right' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#4e9825"
                    strokeWidth={2}
                    dot={{ r: 3.5, fill: '#4e9825', strokeWidth: 0 }}
                    activeDot={{ r: 4.5, fill: '#4e9825', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="water-column">
          <section className="quick-add-panel">
            <div className="section-header">
              <span className="section-icon-badge section-icon-badge--plain">
                <SparkIcon size={13} />
              </span>
              <div className="section-title">Thêm nước nhanh</div>
            </div>

            <div className="quick-add-grid">
              {QUICK_AMOUNTS.map((item) => (
                <button
                  key={item.amount}
                  className="quick-add-button"
                  type="button"
                  style={{ background: item.background }}
                  onClick={() => handleAdd(item.amount)}
                >
                  <span className="quick-add-icon">
                    <DropletIcon size={20} />
                  </span>
                  <span className="quick-add-value">{item.amount} ml</span>
                </button>
              ))}
            </div>
          </section>

          <section className="section-card detail-card">
            <div className="section-header">
              <span className="section-icon-badge">
                <StatsIcon size={13} />
              </span>
              <div className="section-title">Thống kê chi tiết</div>
            </div>

            <div className="detail-chip-row">
              <div className="detail-chip">
                <CalendarIcon size={14} />
                <span>Hôm nay</span>
              </div>

              <div className={`detail-chip ${reachedGoal ? 'detail-chip--success' : 'detail-chip--warning'}`}>
                <TargetIcon size={14} />
                <span>{reachedGoal ? 'Đạt mục tiêu' : 'Chưa đạt'}</span>
              </div>
            </div>

            <div className="detail-grid">
              <DetailTile
                icon={<WaveIcon size={18} />}
                label="Tổng lượng nước"
                value={todayWater}
                unit="ml"
                background="linear-gradient(180deg, #74c7f4 0%, #69bdef 100%)"
              />
              <DetailTile
                icon={<ArrowRightIcon size={18} />}
                label="Trung bình ngày"
                value={averagePerDay}
                unit="ml"
                background="linear-gradient(180deg, #66d6df 0%, #59cfd9 100%)"
              />
              <DetailTile
                icon={<CalendarIcon size={18} />}
                label="Ngày theo dõi"
                value={trackedDays}
                unit="ngày"
                background="linear-gradient(180deg, #88d1d5 0%, #7ac3c7 100%)"
              />
              <DetailTile
                icon={<TargetIcon size={18} />}
                label="Tỷ lệ đạt"
                value={completion}
                unit="%"
                background="linear-gradient(180deg, #bf72e2 0%, #b564de 100%)"
              />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
