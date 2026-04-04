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
  { label: 'Them nuoc', hint: 'Cap nhat nuoc uong trong ngay', badge: 'H2O', path: '/water' },
  { label: 'Can nang', hint: 'Theo doi chi so can nang', badge: 'KG', path: '/weight' },
  { label: 'Buoc chan', hint: 'Xem muc tieu van dong', badge: 'STEP', path: '/steps' },
  { label: 'Thong bao', hint: 'Mo ho so va thong tin ca nhan', badge: 'ALERT', path: '/profile' },
];

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
  const bestDay = weeklyOverview.reduce((best, item) => (item.steps > best.steps ? item : best), weeklyOverview[0]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Chao buoi sang' : hour < 18 ? 'Chao buoi chieu' : 'Chao buoi toi';
  const heroName = profile.name || 'Nguoi dung VitaTrack';

  return (
    <section className="dashboard-page">
      <div className="dashboard-desktop-shell">
        <div className="dashboard-desktop-shell__overlay" />

        <div className="dashboard-desktop-grid">
          <div className="dashboard-main-column">
            <header className="dashboard-hero-header">
              <div>
                <h1 className="dashboard-hero-name">{heroName}</h1>
                <p className="dashboard-hero-greeting">{greeting}</p>
              </div>
              <button type="button" className="dashboard-bell-button" onClick={() => navigate('/profile')}>
                ALERT
              </button>
            </header>

            <button type="button" onClick={() => navigate('/steps')} className="dashboard-step-card">
              <div className="dashboard-step-card__label">Buoc chan hom nay</div>
              <div className="dashboard-step-card__value">
                {todaySteps.toLocaleString('vi-VN')} <span>/ {stepGoal.toLocaleString('vi-VN')}</span>
              </div>
            </button>

            <div className="dashboard-info-row">
              <button type="button" onClick={() => navigate('/weight')} className="dashboard-info-card">
                <div className="dashboard-info-card__title">Can nang</div>
                <div className="dashboard-info-card__value">{latestWeight}kg</div>
              </button>

              <button type="button" onClick={() => navigate('/water')} className="dashboard-info-card">
                <div className="dashboard-info-card__title">Nuoc uong</div>
                <div className="dashboard-info-card__value">{waterCups}/{waterCupGoal} coc</div>
              </button>
            </div>

            <section className="dashboard-quick-section">
              <h2 className="dashboard-section-title">Thao tac nhanh</h2>
              <div className="dashboard-quick-grid">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => navigate(action.path)}
                    className="dashboard-quick-card"
                  >
                    <div className="dashboard-quick-card__icon">{action.badge}</div>
                    <div className="dashboard-quick-card__label">{action.label}</div>
                    <div className="dashboard-quick-card__hint">{action.hint}</div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="dashboard-side-column">
            <section className="dashboard-side-card dashboard-side-card--highlight">
              <div className="dashboard-side-card__eyebrow">Tong quan hom nay</div>
              <div className="dashboard-side-card__headline">{stepProgress}% muc tieu buoc chan</div>
              <div className="dashboard-side-card__subline">
                {todaySteps.toLocaleString('vi-VN')} buoc | {distance} km | {calories} kcal
              </div>
              <div className="dashboard-progress-bar">
                <div className="dashboard-progress-bar__fill" style={{ width: `${stepProgress}%` }} />
              </div>
            </section>

            <section className="dashboard-side-card">
              <div className="dashboard-side-card__eyebrow">Suc khoe ca nhan</div>
              <div className="dashboard-kpi-grid">
                <div className="dashboard-kpi">
                  <span className="dashboard-kpi__label">BMI</span>
                  <strong className="dashboard-kpi__value">{bmi || '--'}</strong>
                </div>
                <div className="dashboard-kpi">
                  <span className="dashboard-kpi__label">Theo doi</span>
                  <strong className="dashboard-kpi__value">{activeDays}/7 ngay</strong>
                </div>
                <div className="dashboard-kpi">
                  <span className="dashboard-kpi__label">TB buoc</span>
                  <strong className="dashboard-kpi__value">{weeklyAverageSteps.toLocaleString('vi-VN')}</strong>
                </div>
                <div className="dashboard-kpi">
                  <span className="dashboard-kpi__label">TB nuoc</span>
                  <strong className="dashboard-kpi__value">{weeklyAverageWater} ml</strong>
                </div>
              </div>
            </section>

            <section className="dashboard-side-card">
              <div className="dashboard-side-card__eyebrow">7 ngay gan day</div>
              <div className="dashboard-week-list">
                {weeklyOverview.map((item) => (
                  <div key={item.date} className="dashboard-week-item">
                    <div className="dashboard-week-item__head">
                      <span className="dashboard-week-item__date">{item.label}</span>
                      <span className="dashboard-week-item__steps">{item.steps.toLocaleString('vi-VN')} buoc</span>
                    </div>
                    <div className="dashboard-week-item__bar">
                      <div className="dashboard-week-item__fill" style={{ width: `${item.stepProgress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="dashboard-side-card__footer">
                Tot nhat: {bestDay?.label || '--'} | Nuoc hom nay {todayWater}/{waterGoal} ml
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
