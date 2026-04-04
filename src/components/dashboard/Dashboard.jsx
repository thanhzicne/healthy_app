import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  calcBMI,
  calcStepGoal,
  calcWaterGoal,
  formatDateLong,
  getLast7Days,
  pct,
  today,
} from '../../utils/helpers';
import './Dashboard.css';

const QUICK_ACTIONS = [
  { label: 'Theo doi nuoc', hint: 'Cap nhat luong nuoc trong ngay', badge: 'H2O', path: '/water' },
  { label: 'Cap nhat can nang', hint: 'Luu chi so moi nhat', badge: 'KG', path: '/weight' },
  { label: 'Xem buoc chan', hint: 'Kiem tra muc tieu van dong', badge: 'STEP', path: '/steps' },
  { label: 'Sua ho so', hint: 'Tinh chinh thong tin ca nhan', badge: 'USER', path: '/profile' },
];

function getTrendLabel(value, goal, goodText, improveText) {
  return value >= goal ? goodText : improveText;
}

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const todayStr = today();
  const profile = state.profile || {};

  const todaySteps = state.steps.find((item) => item.date === todayStr)?.count || 0;
  const todayWater = state.water.find((item) => item.date === todayStr)?.amount || 0;
  const latestWeight = state.weight.length > 0 ? state.weight[state.weight.length - 1].value : profile.weight || 65;

  const stepGoal = calcStepGoal();
  const waterGoal = calcWaterGoal(latestWeight);
  const waterCupGoal = Math.max(1, Math.round(waterGoal / 250));
  const waterCups = Math.min(waterCupGoal, Math.max(0, Math.round(todayWater / 250)));
  const stepProgress = pct(todaySteps, stepGoal);
  const waterProgress = pct(todayWater, waterGoal);
  const bmi = calcBMI(latestWeight, profile.height || 165);
  const calories = Math.round(todaySteps * 0.04);
  const distance = (todaySteps * 0.0008).toFixed(2);
  const weekDates = getLast7Days();

  const weeklyOverview = useMemo(
    () =>
      weekDates.map((date) => {
        const steps = state.steps.find((item) => item.date === date)?.count || 0;
        const water = state.water.find((item) => item.date === date)?.amount || 0;
        return {
          date,
          label: formatDateLong(date),
          steps,
          water,
          stepProgress: pct(steps, stepGoal),
          waterProgress: pct(water, waterGoal),
        };
      }),
    [state.steps, state.water, stepGoal, waterGoal, weekDates]
  );

  const activeDays = weeklyOverview.filter((item) => item.steps > 0 || item.water > 0).length;
  const weeklyAverageSteps = Math.round(
    weeklyOverview.reduce((sum, item) => sum + item.steps, 0) / Math.max(1, weeklyOverview.length)
  );
  const weeklyAverageWater = Math.round(
    weeklyOverview.reduce((sum, item) => sum + item.water, 0) / Math.max(1, weeklyOverview.length)
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Chao buoi sang' : hour < 18 ? 'Chao buoi chieu' : 'Chao buoi toi';
  const heroName = profile.name || 'Nguoi dung VitaTrack';

  return (
    <section className="dashboard-page">
      <header className="page-header dashboard-page__header">
        <div>
          <div className="dashboard-page__eyebrow">Tong quan suc khoe</div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Theo doi buoc chan, nuoc uong va can nang trong mot bo cuc de nhin tren may tinh.
          </p>
        </div>
        <button type="button" className="dashboard-profile-button" onClick={() => navigate('/profile')}>
          Ho so
        </button>
      </header>

      <div className="dashboard-hero-card">
        <div className="dashboard-hero-card__content">
          <div className="dashboard-hero-card__copy">
            <span className="dashboard-hero-card__pill">{greeting}</span>
            <h2 className="dashboard-hero-card__title">{heroName}</h2>
            <p className="dashboard-hero-card__text">
              Hom nay ban da hoan thanh {stepProgress}% muc tieu buoc chan va {waterProgress}% muc tieu nuoc uong.
              Hay tiep tuc duy tri nhip theo doi de giu tien do on dinh.
            </p>
          </div>

          <div className="dashboard-hero-card__spotlight">
            <button type="button" className="dashboard-highlight-card" onClick={() => navigate('/steps')}>
              <div className="dashboard-highlight-card__label">Muc tieu van dong hom nay</div>
              <div className="dashboard-highlight-card__value">
                {todaySteps.toLocaleString('vi-VN')}
                <span>/{stepGoal.toLocaleString('vi-VN')} buoc</span>
              </div>
              <div className="dashboard-highlight-card__bar">
                <div className="dashboard-highlight-card__fill" style={{ width: `${stepProgress}%` }} />
              </div>
              <div className="dashboard-highlight-card__hint">
                {getTrendLabel(todaySteps, stepGoal, 'Ban dang dat muc tieu rat tot', 'Can them van dong de cham moc ngay')}
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-metrics-grid">
        <button type="button" className="dashboard-stat-card dashboard-stat-card--cyan" onClick={() => navigate('/steps')}>
          <div className="dashboard-stat-card__top">
            <span className="dashboard-stat-card__tag">Steps</span>
            <span className="dashboard-stat-card__meta">{stepProgress}%</span>
          </div>
          <div className="dashboard-stat-card__value">{todaySteps.toLocaleString('vi-VN')}</div>
          <div className="dashboard-stat-card__label">Buoc hom nay</div>
          <div className="dashboard-stat-card__footer">{distance} km | {calories} kcal</div>
        </button>

        <button type="button" className="dashboard-stat-card dashboard-stat-card--green" onClick={() => navigate('/water')}>
          <div className="dashboard-stat-card__top">
            <span className="dashboard-stat-card__tag">Water</span>
            <span className="dashboard-stat-card__meta">{waterProgress}%</span>
          </div>
          <div className="dashboard-stat-card__value">{todayWater} ml</div>
          <div className="dashboard-stat-card__label">Nuoc uong hom nay</div>
          <div className="dashboard-stat-card__footer">{waterCups}/{waterCupGoal} coc | muc tieu {waterGoal} ml</div>
        </button>

        <button type="button" className="dashboard-stat-card dashboard-stat-card--purple" onClick={() => navigate('/weight')}>
          <div className="dashboard-stat-card__top">
            <span className="dashboard-stat-card__tag">Weight</span>
            <span className="dashboard-stat-card__meta">BMI {bmi || '--'}</span>
          </div>
          <div className="dashboard-stat-card__value">{latestWeight} kg</div>
          <div className="dashboard-stat-card__label">Can nang moi nhat</div>
          <div className="dashboard-stat-card__footer">Chieu cao tham chieu: {profile.height || 165} cm</div>
        </button>

        <article className="dashboard-stat-card dashboard-stat-card--dark">
          <div className="dashboard-stat-card__top">
            <span className="dashboard-stat-card__tag">Routine</span>
            <span className="dashboard-stat-card__meta">{activeDays}/7 ngay</span>
          </div>
          <div className="dashboard-stat-card__value">{weeklyAverageSteps.toLocaleString('vi-VN')}</div>
          <div className="dashboard-stat-card__label">TB buoc / ngay</div>
          <div className="dashboard-stat-card__footer">TB nuoc: {weeklyAverageWater} ml / ngay</div>
        </article>
      </div>

      <div className="dashboard-content-grid">
        <section className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h3 className="dashboard-panel__title">Thao tac nhanh</h3>
              <p className="dashboard-panel__subtitle">Di chuyen nhanh den cac tinh nang duoc dung nhieu nhat.</p>
            </div>
          </div>

          <div className="dashboard-actions-grid">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => navigate(action.path)}
                className="dashboard-action-card"
              >
                <span className="dashboard-action-card__badge">{action.badge}</span>
                <div className="dashboard-action-card__title">{action.label}</div>
                <div className="dashboard-action-card__hint">{action.hint}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h3 className="dashboard-panel__title">Tong ket 7 ngay</h3>
              <p className="dashboard-panel__subtitle">So sanh tien do buoc chan va nuoc uong de nhin nhanh tren desktop.</p>
            </div>
          </div>

          <div className="dashboard-week-list">
            {weeklyOverview.map((item) => (
              <div key={item.date} className="dashboard-week-item">
                <div className="dashboard-week-item__meta">
                  <div className="dashboard-week-item__date">{item.label}</div>
                  <div className="dashboard-week-item__numbers">
                    <span>{item.steps.toLocaleString('vi-VN')} buoc</span>
                    <span>{item.water} ml</span>
                  </div>
                </div>

                <div className="dashboard-week-item__bars">
                  <div className="dashboard-week-bar">
                    <div className="dashboard-week-bar__fill dashboard-week-bar__fill--steps" style={{ width: `${item.stepProgress}%` }} />
                  </div>
                  <div className="dashboard-week-bar">
                    <div className="dashboard-week-bar__fill dashboard-week-bar__fill--water" style={{ width: `${item.waterProgress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
